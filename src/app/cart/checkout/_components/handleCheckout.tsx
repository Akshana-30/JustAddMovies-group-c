"use server";
import { auth } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { clearCart } from "@/lib/cart-actions";
import { getCartProducts } from "@/lib/cart-types";
import { formSchema } from "@/lib/payment-schema";
import prisma from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/send-order-confirmation";
import { headers } from "next/headers";
import z from "zod";

type PaymentValues = z.infer<typeof formSchema>;

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

  // Only runs after the transaction succeeds, so the cart is never
  // cleared if the order failed to save.
  await clearCart();

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
