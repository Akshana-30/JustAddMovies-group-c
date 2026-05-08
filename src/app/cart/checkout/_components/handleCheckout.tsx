"use server";
import { auth } from "@/lib/auth";
import { cartCookie, getCart } from "@/lib/cart";
import { getCartProducts } from "@/lib/cart-types";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";

async function clearCart() {
  const store = await cookies();

  store.delete(cartCookie);

  revalidatePath("/cart");
}

export default async function handleCheckout() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const cart = await getCart();
  const products = await getCartProducts(cart);
  const total = products.reduce((sum, p) => {
    return sum + p.price * p.quantity;
  }, 0);

  const createOrder = await prisma.order.create({
    data: {
      orderDate: new Date(),
      status: "PAID",
      totalAmount: total,
      user: {
        connect: {
          id: session?.user.id,
        },
      },
      orderItem: {
        create: products.map((p) => ({
          priceAtPurchase: p.price,
          quantity: p.quantity,
          movies: {
            connect: {
              id: p.id,
            },
          },
        })),
      },
    },
  });

  await clearCart();
}
