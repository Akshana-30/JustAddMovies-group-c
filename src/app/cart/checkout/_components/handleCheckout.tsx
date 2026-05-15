"use server";
// ── Imports ───────────────────────────────────────────────────────
// auth and headers are read together so the session is always fresh
// and never served from a stale cache.
import { auth } from "@/lib/auth";
import { cartCookie, getCart } from "@/lib/cart";
import { getCartProducts } from "@/lib/cart-types";
import prisma from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/send-order-confirmation";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";

// ── Cart cleanup ───────────────────────────────────────────────────
// Kept as a private helper so the main function stays readable.
// revalidatePath ensures the cart icon in the navbar updates immediately
// after the cookie is removed.
async function clearCart() {
  const store = await cookies();
  store.delete(cartCookie);
  revalidatePath("/cart");
}

// ── Main server action ─────────────────────────────────────────────
// Receives the shipping address captured in the payment form and uses
// it both when creating the order and in the confirmation email.
// The function is intentionally a default export so the client can
// import it directly without a named import on every call site.
export default async function handleCheckout(shippingAddress: {
  street: string;
  city: string;
  zip: string;
}) {
  // ── Session guard ────────────────────────────────────────────────
  // Throwing here causes the client-side try/catch in payment-form
  // to display an error toast instead of silently failing.
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Not authenticated");

  // ── Cart → products ──────────────────────────────────────────────
  // getCartProducts enriches the raw cookie cart with full movie data
  // (title, price, stock) fetched from the database.
  const cart = await getCart();
  const products = await getCartProducts(cart);

  // ── Total ────────────────────────────────────────────────────────
  // Prices are stored in öre (e.g. 8900 = 89 kr), so Number() is used
  // to convert from Prisma's Decimal type before multiplying.
  const total = products.reduce(
    (sum, p) => sum + Number(p.price) * p.quantity,
    0,
  );

  // ── Atomic transaction ───────────────────────────────────────────
  // Order creation and stock decrement are wrapped in a single
  // $transaction so that if either operation fails, neither is
  // committed — preventing overselling or orphaned orders.
  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        orderDate: new Date(),
        status: "PAID",
        totalAmount: total,
        user: {
          connect: { id: session.user.id },
        },
        orderItem: {
          create: products.map((p) => ({
            priceAtPurchase: p.price,
            quantity: p.quantity,
            movies: {
              connect: { id: p.id },
            },
          })),
        },
      },
    }),
    // Decrement stock for each purchased movie by the ordered quantity.
    ...products.map((p) =>
      prisma.movie.update({
        where: { id: p.id },
        data: { stock: { decrement: p.quantity } },
      }),
    ),
  ]);

  // ── Clear cart ───────────────────────────────────────────────────
  // Only runs after the transaction succeeds, so the cart is never
  // cleared if the order failed to save.
  await clearCart();

  // ── Confirmation email ───────────────────────────────────────────
  // Wrapped in try/catch so a mail server outage never rolls back an
  // already-completed order. Failures are logged server-side only.
  try {
    await sendOrderConfirmation({
      userName: session.user.name ?? "Customer",
      userEmail: session.user.email,
      orderId: order.id,
      items: products.map((p) => ({
        title: p.title,
        quantity: p.quantity,
        price: Number(p.price),
      })),
      total,
      shippingAddress,
    });
  } catch (err) {
    console.error("Order confirmation email failed:", err);
  }
}
