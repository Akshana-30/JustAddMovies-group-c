// Public, one-click demo accounts for recruiters. These credentials are
// intentionally shown in the UI (sign-in page), so there is nothing
// sensitive about them living here or in NEXT_PUBLIC_* env vars.

export const DEMO_ADMIN_EMAIL = process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "demo.admin@justaddmovies.app";
export const DEMO_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "DemoAdmin123!";

export const DEMO_USER_EMAIL = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL ?? "demo.customer@justaddmovies.app";
export const DEMO_USER_PASSWORD = process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD ?? "DemoCustomer123!";

export const DEMO_EMAILS = [DEMO_ADMIN_EMAIL, DEMO_USER_EMAIL];
