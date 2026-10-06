// One-time setup for the two public demo accounts (admin + customer) that
// recruiters can log into instantly from the sign-in page.
//
// Run with: pnpm dlx tsx prisma/seed.ts
// Safe to re-run — skips any account that already exists.

import "dotenv/config";
import { auth } from "../src/lib/auth";
import prisma from "../src/lib/prisma";
import {
    DEMO_ADMIN_EMAIL,
    DEMO_ADMIN_PASSWORD,
    DEMO_USER_EMAIL,
    DEMO_USER_PASSWORD,
} from "../src/lib/demo-accounts";

async function ensureDemoUser(email: string, password: string, name: string, role: "ADMIN" | "USER") {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log(`[seed] ${email} already exists, skipping`);
        return;
    }

    // better-auth's admin plugin types `role` as its own lowercase enum, but
    // the rest of this app's admin checks compare against the uppercase
    // "ADMIN" string stored directly in the User row — so create with the
    // default role, then set the app's own role string via Prisma directly.
    await auth.api.createUser({
        body: { email, password, name },
    });

    await prisma.user.update({ where: { email }, data: { role, emailVerified: true } });
    console.log(`[seed] created ${role} demo account: ${email}`);
}

async function main() {
    await ensureDemoUser(DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD, "Demo Admin", "ADMIN");
    await ensureDemoUser(DEMO_USER_EMAIL, DEMO_USER_PASSWORD, "Demo Customer", "USER");
}

main()
    .catch((err) => {
        console.error("[seed] failed:", err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
