"use server";
import { auth } from "@/lib/auth";
import { cartCookie, getCart } from "@/lib/cart";
import { getCartProducts } from "@/lib/cart-types";
import prisma from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/send-order-confirmation";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";

async function clearCart() {
  const store = await cookies();
  store.delete(cartCookie);
  revalidatePath("/cart");
}

export default async function handleCheckout(shippingAddress: {
  street: string;
  city: string;
  zip: string;
}) {
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
    ...products.map((p) =>
      prisma.movie.update({
        where: { id: p.id },
        data: { stock: { decrement: p.quantity } },
      }),
    ),
  ]);

  await clearCart();

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
