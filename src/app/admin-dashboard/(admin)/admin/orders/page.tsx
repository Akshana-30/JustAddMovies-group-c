// src/app/admin-dashboard/(admin)/admin/orders/page.tsx
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = { title: "All Orders" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { orderDate: "desc" },
    include: {
      user:       { select: { name: true, email: true } },
      orderItem: { include: { movie: { select: { title: true } } } },
    },
  });

  const revenue = orders.reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="p-8">
      <h1 className="font-display mb-1 text-3xl tracking-wide" style={{ color: "var(--text)" }}>
        All <span style={{ color: "var(--gold)" }}>Orders</span>
      </h1>
      <p className="mb-6 font-serif italic" style={{ color: "var(--text-muted)" }}>
        {orders.length} orders · {revenue.toLocaleString("sv-SE")} kr total revenue
      </p>

      <div className="overflow-x-auto rounded-xl border" style={{ borderColor:"var(--border)" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", background:"var(--surface)" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid var(--border)" }}>
              {["Customer","Items","Total","Date","Status"].map((h) => (
                <th key={h} style={{ textAlign:"left", padding:"10px 14px", fontSize:"11px", letterSpacing:"0.1em", color:"var(--text-dim)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom:"1px solid var(--border)" }}>
                <td style={{ padding:"12px 14px" }}>
                  <p style={{ fontSize:"13px", fontWeight:500, color:"var(--text)" }}>{order.user.name}</p>
                  <p style={{ fontSize:"11px", color:"var(--text-dim)", marginTop:"2px" }}>{order.user.email}</p>
                </td>
                <td style={{ padding:"12px 14px" }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
                    {order.orderItem.slice(0, 2).map((item) => (
                      <span key={item.id} style={{ fontSize:"12px", color:"var(--text-muted)" }}>
                        {item.movie.title} ×{item.quantity}
                      </span>
                    ))}
                    {order.orderItem.length > 2 && (
                      <span style={{ fontSize:"11px", color:"var(--text-dim)" }}>+{order.orderItem.length - 2} more</span>
                    )}
                  </div>
                </td>
                <td style={{ padding:"12px 14px", fontSize:"13px", fontWeight:500, color:"var(--gold)" }}>
                  {order.totalAmount.toLocaleString("sv-SE")} kr
                </td>
                <td style={{ padding:"12px 14px", fontSize:"12px", color:"var(--text-dim)" }}>
                  {formatDate(order.orderDate)}
                </td>
                <td style={{ padding:"12px 14px" }}>
                  <span style={{
                    fontSize:"11px", padding:"2px 8px", borderRadius:"20px",
                    background: order.status === "PAID" ? "rgba(34,197,94,0.15)" : "rgba(232,160,48,0.15)",
                    color: order.status === "PAID" ? "#4ade80" : "var(--gold)",
                  }}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding:"40px", textAlign:"center", color:"var(--text-dim)" }}>
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
