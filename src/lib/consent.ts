// Shared consent constants and types — no "use server" directive so
// constants and types can be imported by both server and client code.
import { cookies } from "next/headers";

export const CONSENT_COOKIE = "cookie_consent";

export type ConsentValue = "accepted" | "essential_only" | null;

export const CONSENT_OPTIONS = {
  httpOnly: false,          // must be readable client-side so analytics libs can check it
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 year
  secure: process.env.NODE_ENV === "production",
};

// ── Read (server-side) ────────────────────────────────────────────
// Called from layout.tsx to decide whether to render the banner.
export async function getConsentStatus(): Promise<ConsentValue> {
  const store = await cookies();
  const value = store.get(CONSENT_COOKIE)?.value;
  if (value === "accepted" || value === "essential_only") return value;
  return null;
}
