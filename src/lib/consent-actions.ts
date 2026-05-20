"use server";

// Separate "use server" file so only async functions are exported,
// satisfying Next.js's constraint on server action files.
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { CONSENT_COOKIE, CONSENT_OPTIONS } from "./consent";

export async function saveConsent(choice: "accepted" | "essential_only") {
  const store = await cookies();
  store.set(CONSENT_COOKIE, choice, CONSENT_OPTIONS);
  revalidatePath("/");
}
