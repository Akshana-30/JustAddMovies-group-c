// src/app/admin-dashboard/(admin)/admin/page.tsx
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { AdminCharts } from "./AdminCharts";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  // ── Core counts ──────────────────────────────────────────────
  const [
    movieCount,
    customerCount,
    orderCount,
    pendingCount,
    revenueAgg,
    recentOrders,
    orderItems,
    allOrders,
  ] = await Promise.all([
    prisma.movie.count(),
    prisma.user.count({ where: { role: { not: "ADMIN" } } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { orderDate: "desc" },
      include: {
        user:       { select: { name: true, email: true } },
        order_items: { select: { quantity: true, priceAtPurchase: true } },
      },
    }),
    // For top movies chart
    prisma.orderItem.groupBy({
      by: ["movieId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 8,
    }),
    // For revenue-over-time chart
    prisma.order.findMany({
      select: { totalAmount: true, orderDate: true },
      orderBy: { orderDate: "asc" },
    }),
  ]);

  const totalRevenue  = revenueAgg._sum.totalAmount ?? 0;
  const avgOrderValue = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;

  // ── Top movies enriched ───────────────────────────────────────
  const movieIds    = orderItems.map((i) => i.movieId);
  const topMovies   = await prisma.movie.findMany({
    where: { id: { in: movieIds } },
    select: { id: true, title: true, price: true },
  });
  const topMoviesData = orderItems.map((item) => {
    const movie = topMovies.find((m) => m.id === item.movieId);
    return {
      title:    movie?.title ?? "Unknown",
      quantity: item._sum.quantity ?? 0,
      revenue:  (item._sum.quantity ?? 0) * (movie?.price ?? 0),
    };
  });

  // ── Revenue by month (last 6 months) ─────────────────────────
  const now       = new Date();
  const months: { label: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d     = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("en-SE", { month: "short", year: "2-digit" });
    const revenue = allOrders
      .filter((o) => {
        const od = new Date(o.orderDate);
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth();
      })
      .reduce((s, o) => s + o.totalAmount, 0);
      
    months.push({ label, revenue });
  }

  // ── Average price of sold movies ─────────────────────────────
  const soldItems = await prisma.orderItem.aggregate({
    _avg: { priceAtPurchase: true },
    _sum: { quantity: true },
  });
  const avgSalePrice = Math.round(soldItems._avg.priceAtPurchase ?? 0);
  const totalSold    = soldItems._sum.quantity ?? 0;

  const stats = [
    { label: "Total Revenue",       value: `${formatPrice(totalRevenue)}`, emoji: "💰", color: "var(--gold)",   href: "/admin-dashboard/admin/orders" },
    { label: "Customers",           value: customerCount,                                 emoji: "👥", color: "#60a5fa",       href: "/admin-dashboard/admin/customers" },
    { label: "Total Orders",        value: orderCount,                                    emoji: "📦", color: "#4ade80",       href: "/admin-dashboard/admin/orders" },
    { label: "Pending (Invoice)",   value: pendingCount,                                  emoji: "⏳", color: "#fbbf24",       href: "/admin-dashboard/admin/orders" },
    { label: "Movies in Catalogue", value: movieCount,                                    emoji: "🎬", color: "var(--gold)",   href: "/admin-dashboard/admin/movies" },
    { label: "Movies Sold",         value: totalSold,                                     emoji: "🎟",  color: "#a78bfa",       href: "/admin-dashboard/admin/orders" },
    { label: "Avg Order Value",     value: `${formatPrice(avgOrderValue)}`,                        emoji: "📊", color: "#34d399",       href: "#" },
    { label: "Avg Sale Price",      value: `${formatPrice(avgSalePrice)}`,                         emoji: "🏷",  color: "#f472b6",       href: "#" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl tracking-wide" style={{ color: "var(--text)" }}>
          Admin <span style={{ color: "var(--gold)" }}>Overview</span>
        </h1>
        <p className="mt-1 font-serif italic" style={{ color: "var(--text-muted)" }}>
          The Reel Movies — statistics & management
        </p>
      </div>

      {/* ── Stats grid ─────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "32px" }}>
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            style={{
              display: "block", textDecoration: "none",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "12px", padding: "20px",
              transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
            }}
            className="jam-card"
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{s.emoji}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", letterSpacing: "0.04em", color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
              {s.label}
            </div>
          </Link>
        ))}
      </div>

      {/* ── Charts (client component) ──────────────────────────── */}
      <AdminCharts
        topMovies={topMoviesData}
        revenueByMonth={months}
        avgOrderValue={avgOrderValue / 100}
        avgSalePrice={avgSalePrice / 100}
        totalRevenue={totalRevenue / 100}
        orderCount={orderCount}
        customerCount={customerCount}
      />

      {/* ── Recent orders table ─────────────────────────────────── */}
      <div style={{ marginTop: "32px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", letterSpacing: "0.1em", color: "var(--gold)" }}>
            RECENT ORDERS
          </h2>
          <Link href="/admin-dashboard/admin/orders"
            style={{ fontSize: "12px", color: "var(--text-dim)", textDecoration: "none", transition: "color 0.15s" }}
            className="back-link">
            View all →
          </Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Customer", "Items", "Total", "Date", "Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: "11px", letterSpacing: "0.1em", color: "var(--text-dim)", borderBottom: "1px solid var(--border)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)" }}>{order.user.name}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "1px" }}>{order.user.email}</p>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-muted)" }}>
                    {order.order_items.reduce((s, i) => s + i.quantity, 0)}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 500, color: "var(--gold)" }}>
                    {order.order_items.reduce((s, i) => s + i.priceAtPurchase * i.quantity / 100, 0).toLocaleString("sv-SE")} kr
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--text-dim)" }}>
                    {formatDate(order.orderDate)}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: "11px", padding: "3px 9px", borderRadius: "20px",
                      background: order.order_items.length > 0
                        ? (order.order_items.reduce((s,i) => s + i.priceAtPurchase * i.quantity, 0) > 0 ? "rgba(34,197,94,0.15)" : "rgba(232,160,48,0.15)")
                        : "rgba(232,160,48,0.15)",
                      color: "#4ade80",
                    }}>
                      PAID
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--text-dim)", fontStyle: "italic" }}>
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
