import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a SEK price as Swedish kronor: 89 → "89 kr" */
export function formatPrice(price: number | string) {
  return `${Number(price).toLocaleString("sv-SE")} kr`;
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function actionError(message: string) {
  return { success: false as const, error: message };
}

export function actionSuccess<T>(data: T) {
  return { success: true as const, data };
}
