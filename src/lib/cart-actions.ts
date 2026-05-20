"use server";

import { cartCookie, cartCookieOptions, getCart, setCart } from "./cart";
import { CartItem } from "./cart-types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// ── Add ───────────────────────────────────────────────────────────
// If the movie is already in the cart its quantity is incremented;
// otherwise a new item is appended.
export async function addToCart(item: CartItem) {
  const cart = await getCart();
  const existing = cart.find((i) => i.id === item.id);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  await setCart(cart);
  revalidatePath("/");
  revalidatePath("/cart");
}

// ── Remove ────────────────────────────────────────────────────────
export async function removeFromCart(id: string) {
  const cart = await getCart();
  await setCart(cart.filter((item) => item.id !== id));
  revalidatePath("/cart");
}

// ── Update quantity ───────────────────────────────────────────────
// Automatically removes the item when quantity drops to zero or below
// so ghost items never linger in the cookie.
export async function updateQuantity(id: string, quantity: number) {
  const cart = await getCart();

  if (quantity <= 0) {
    await setCart(cart.filter((item) => item.id !== id));
  } else {
    const item = cart.find((i) => i.id === id);
    if (item) item.quantity = quantity;
    await setCart(cart);
  }

  revalidatePath("/cart");
}

// ── Clear ─────────────────────────────────────────────────────────
// Used by handleCheckout after a successful order. Deletes the cookie
// entirely (rather than setting it to "[]") to keep things clean.
export async function clearCart() {
  const store = await cookies();
  store.delete({ name: cartCookie, path: cartCookieOptions.path });
  revalidatePath("/cart");
  revalidatePath("/");
}

// ── Count ─────────────────────────────────────────────────────────
// Total number of individual items across all lines.
export async function getCartCount() {
  const cart = await getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
