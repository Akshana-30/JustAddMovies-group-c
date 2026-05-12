export function formatPrice(price: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
  }).format(price / 100);
}

/**
 * Convert a price entered in kronor (e.g. 89) to öre for database storage (e.g. 8900).
 * Use this in admin forms before saving a price to the DB.
 */
export function toOre(kr: number): number {
  return Math.round(kr * 100);
}

/**
 * Convert a stored öre value (e.g. 8900) back to kronor (e.g. 89).
 * Use this in admin forms to pre-fill a price input field when editing a movie.
 */
export function fromOre(ore: number): number {
  return ore / 100;
}
