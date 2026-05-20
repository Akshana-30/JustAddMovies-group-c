import { cookies } from "next/headers";
import { Cart, movieItem } from "./cart-types";

export const cartCookie = "cart";

// ── Cookie options ────────────────────────────────────────────────
// Applied consistently to every set/delete so the cookie never loses
// its security attributes after an update or remove operation.
export const cartCookieOptions = {
  httpOnly: true,                                // not readable by JS in the browser
  sameSite: "lax" as const,                     // CSRF protection, allows top-level nav
  path: "/",                                     // available on every route
  maxAge: 60 * 60 * 24 * 7,                     // persist for 7 days
  secure: process.env.NODE_ENV === "production", // HTTPS-only in production
};

// ── Read ─────────────────────────────────────────────────────────
// Validates the cookie value against the Zod schema so that a
// corrupted or tampered cookie always falls back to an empty cart
// instead of causing a runtime error downstream.
export async function getCart(): Promise<Cart> {
  const store = await cookies();
  const raw = store.get(cartCookie)?.value;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    const result = movieItem.array().safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

// ── Write ─────────────────────────────────────────────────────────
// Central helper used by all cart actions so options are never
// inconsistent. Logs a warning if the payload approaches the
// ~4 KB browser cookie limit.
export async function setCart(cart: Cart): Promise<void> {
  const payload = JSON.stringify(cart);

  if (payload.length > 3500) {
    console.warn(
      `[cart] Cookie payload is ${payload.length} bytes — approaching the 4 KB browser limit.`
    );
  }

  const store = await cookies();
  store.set(cartCookie, payload, cartCookieOptions);
}
