// Hard row caps for the public recruiter demo, so a stranger poking at
// write paths can't grow the Neon database (or the bill) without limit.
// All tunable via env vars without touching call sites.

function num(env: string | undefined, fallback: number) {
  const n = Number(env);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const CAPS = {
  users: num(process.env.CAP_MAX_USERS, 40),
  movies: num(process.env.CAP_MAX_MOVIES, 250),
  genres: num(process.env.CAP_MAX_GENRES, 60),
  directors: num(process.env.CAP_MAX_PEOPLE, 300),
  actors: num(process.env.CAP_MAX_PEOPLE, 300),
  orders: num(process.env.CAP_MAX_ORDERS, 150),
  contactMessages: num(process.env.CAP_MAX_CONTACT_MESSAGES, 100),
  wishlistPerUser: num(process.env.CAP_MAX_WISHLIST_PER_USER, 50),
  stockAlertsPerUser: num(process.env.CAP_MAX_STOCK_ALERTS_PER_USER, 50),
};

/** Returns a friendly error string if `count()` is already at/over `max`, else null. */
export async function capError(count: () => Promise<number>, max: number, label: string) {
  if ((await count()) >= max) {
    return `Demo capacity reached: maximum ${max} ${label} for this public demo.`;
  }
  return null;
}
