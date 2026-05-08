// src/app/admin-dashboard/(admin)/admin/customers/page.tsx
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true,
      // phone: true, shippingAddress: true,
      role: true, createdAt: true,
      _count: { select: { orders: true } },
      orders: {
        orderBy: { orderDate: "desc" },
        take: 3,
        select: {
          id: true, totalAmount: true,
          status: true, orderDate: true,
          orderItem: { select: { quantity: true } },
        },
      },
    },
  });

  const customers = users.filter((u) => u.role !== "ADMIN");
  const admins    = users.filter((u) => u.role === "ADMIN");

  function StatusBadge({ status }: { status: string }) {
    const isPaid = status === "PAID";
    return (
      <span style={{
        fontSize: "10px", padding: "2px 7px", borderRadius: "20px",
        background: isPaid ? "rgba(34,197,94,0.15)" : "rgba(232,160,48,0.15)",
        color:      isPaid ? "#4ade80" : "var(--gold)",
      }}>
        {status}
      </span>
    );
  }

  function UserSection({ title, people, count }: { title: string; people: typeof users; count: number }) {
    return (
      <div className="mb-10">
        <h2 className="font-display text-xl tracking-wide mb-4" style={{ color: "var(--gold)" }}>
          {title.toUpperCase()} ({count})
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {people.map((user) => (
            <div key={user.id} className="rounded-xl border p-5"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* User info */}
                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "50%",
                    background: "var(--surface3)", border: "2px solid var(--border-strong)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--gold)", flexShrink: 0,
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>{user.name}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{user.email}</p>
                    {/* {user.phone && (
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>📞 {user.phone}</p>
                    )}
                    {user.shippingAddress && (
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>📦 {user.shippingAddress}</p>
                    )} */}
                    <p style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "4px" }}>
                      Member since {formatDate(user.createdAt)} · {user._count.orders} order{user._count.orders !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Recent orders */}
                {user.orders.length > 0 && (
                  <div style={{ minWidth: "200px" }}>
                    <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: "6px" }}>
                      Recent Orders
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {user.orders.map((order) => (
                        <div key={order.id} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px" }}>
                          <span style={{ color: "var(--text-dim)", fontFamily: "monospace", fontSize: "10px" }}>
                            #{order.id.slice(-6).toUpperCase()}
                          </span>
                          <StatusBadge status={order.status} />
                          <span style={{ color: "var(--gold)", fontWeight: 500 }}>
                            {order.totalAmount.toLocaleString("sv-SE")} kr
                          </span>
                          <span style={{ color: "var(--text-dim)" }}>
                            {formatDate(order.orderDate)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {people.length === 0 && (
            <p style={{ color: "var(--text-dim)", fontStyle: "italic" }}>No {title.toLowerCase()} yet</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="font-display mb-1 text-3xl tracking-wide" style={{ color: "var(--text)" }}>
        <span style={{ color: "var(--gold)" }}>Customers</span>
      </h1>
      <p className="mb-8 font-serif italic" style={{ color: "var(--text-muted)" }}>
        {customers.length} customers · {admins.length} admin{admins.length !== 1 ? "s" : ""}
      </p>

      <UserSection title="Customers" people={customers} count={customers.length} />
      <UserSection title="Admins"    people={admins}    count={admins.length} />
    </div>
  );
}
