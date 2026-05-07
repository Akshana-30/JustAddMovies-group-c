// src/app/admin-dashboard/(dashboard)/dashboard/account/page.tsx
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AccountEditForm } from "./AccountEditForm";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");

  // Fetch full user including custom fields
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true, phone: true, shippingAddress: true },
  });
  if (!user) redirect("/auth/sign-in");

  const role = user.role ?? "CUSTOMER";

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl tracking-wide" style={{ color: "var(--text)" }}>
          My <span style={{ color: "var(--gold)" }}>Account</span>
        </h1>
        <p className="mt-1 font-serif italic" style={{ color: "var(--text-muted)" }}>
          Your account details
        </p>
      </div>

      {/* Avatar + name */}
      <div className="rounded-xl border p-6 mb-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-4 mb-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 text-2xl font-bold"
            style={{ background: "var(--surface3)", borderColor: "var(--border-strong)", color: "var(--gold)" }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-xl tracking-wide" style={{ color: "var(--text)" }}>{user.name}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {role === "ADMIN" ? "Administrator" : "Customer"} · Member since {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        <div className="border-t pt-5" style={{ borderColor: "var(--border)" }}>
          <div className="grid gap-3">
            {[
              { label: "Email",            value: user.email },
              { label: "Phone",            value: user.phone ?? "Not set" },
              { label: "Shipping Address", value: user.shippingAddress ?? "Not set" },
            ].map((f) => (
              <div key={f.label} className="flex gap-3">
                <span className="w-36 shrink-0 text-xs uppercase tracking-wide mt-0.5" style={{ color: "var(--text-dim)" }}>
                  {f.label}
                </span>
                <span className="text-sm" style={{ color: "var(--text)" }}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <AccountEditForm
        userId={user.id}
        initialPhone={user.phone ?? ""}
        initialAddress={user.shippingAddress ?? ""}
        initialName={user.name}
      />
    </div>
  );
}
