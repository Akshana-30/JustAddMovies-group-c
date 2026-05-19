"use server";
import { auth } from "@/lib/auth";
import { cartCookie, getCart } from "@/lib/cart";
import { getCartProducts } from "@/lib/cart-types";
import { formSchema } from "@/lib/payment-schema";
import prisma from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/send-order-confirmation";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import z from "zod";

type PaymentValues = z.infer<typeof formSchema>;

async function clearCart() {
  const store = await cookies();
  store.delete(cartCookie);
  revalidatePath("/cart");
}

export default async function handleCheckout(values: PaymentValues) {
  const data = formSchema.parse(values);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Not authenticated");

  const cart = await getCart();
  const products = await getCartProducts(cart);

  const total = products.reduce(
    (sum, p) => sum + Number(p.price) * p.quantity,
    0,
  );

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        orderDate: new Date(),
        status: "PAID",
        totalAmount: total,
        shippingStreet: data.streetAddress,
        shippingZip: data.zip,
        shippingCity: data.city,
        shippingCountry: data.country,

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
      shippingAddress: {
        street: data.streetAddress,
        city: data.city,
        zip: data.zip,
        country: data.country,
      },
    });
  } catch (err) {
    console.error("Order confirmation email failed:", err);
  }
}
