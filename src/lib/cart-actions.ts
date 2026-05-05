"use server";

import { cookies } from "next/headers";
import { cartCookie, getCart } from "./cart";
import { CartItem } from "./cart-types";
import { revalidatePath } from "next/cache";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
};

export async function addToCart(item: CartItem) {
  const cart = await getCart();
  const existing = cart.find((i) => i.id === item.id);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  const store = await cookies();
  store.set(cartCookie, JSON.stringify(cart), cookieOptions);
  revalidatePath("/");
  revalidatePath("/cart");
}

export async function removeFromCart(id: string) {
  const cart = await getCart();
  const updated = cart.filter((item) => item.id !== id);

  const store = await cookies();
  store.set(cartCookie, JSON.stringify(updated));

  revalidatePath("/cart");
}

export async function updateQuantity(id: string, quantity: number) {
  const cart = await getCart();

  const item = cart.find((i) => i.id === id);
  if (item) {
    item.quantity = quantity;
  }

  const store = await cookies();
  store.set(cartCookie, JSON.stringify(cart));

  revalidatePath("/cart");
}

export async function getCartCount(){
    const cart = await getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0)
}
