import { cookies } from "next/headers";
import { Cart } from "./cart-types";

export const cartCookie = "cart";

export async function getCart(): Promise<Cart> {
  const store = await cookies();
  const raw = store.get(cartCookie)?.value;

  if (!raw) {
    return [];
  } else {
    try {
      return JSON.parse(raw) as Cart;
    } catch {
      return [];
    }
  }
}
