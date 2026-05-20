import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

// ── Status badge colours ───────────────────────────────────────────
// Darker 600-level hex values are used intentionally so the badge
// background has enough contrast for white text in both light and
// dark mode. The earlier pastel variants (#4ade80, #f59e0b etc.) were
// near-invisible on the light beige background.
const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "Pending",    color: "#d97706" },
  PROCESSING: { label: "Processing", color: "#7c3aed" },
  PAID:       { label: "Paid",       color: "#16a34a" },
  SHIPPED:    { label: "Shipped",    color: "#2563eb" },
  DELIVERED:  { label: "Delivered",  color: "#059669" },
  CANCELED:   { label: "Cancelled",  color: "#dc2626" },
};

export default async function DashboardPage() {
  // ── Session guard ────────────────────────────────────────────────
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?callbackUrl=/admin-dashboard/dashboard");

  // ── Fetch orders ─────────────────────────────────────────────────
  // Filtered by the logged-in user's ID so customers only ever see
  // their own orders. Ordered by date descending (newest first).
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { orderDate: "desc" },
    include: {
      orderItem: {
        include: { movies: true },
      },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {session.user.name}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/movies">+ Browse Movies</Link>
        </Button>
      </div>

      {/* ── Empty state ─────────────────────────────────────────── */}
      {orders.length === 0 ? (
        <div className="rounded-xl border bg-card py-20 text-center">
          <ShoppingBag size={40} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-semibold">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse our catalogue and purchase your first film.
          </p>
          <Button asChild className="mt-5">
            <Link href="/movies">Browse Movies</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING;
            return (
              <div key={order.id} className="rounded-xl border bg-card p-5">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-2">

                  {/* ── Order meta ──────────────────────────────── */}
                  {/* Full cuid(2) ID displayed to match the admin   */}
                  {/* panel and avoid confusion between the two views */}
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      Order:<span className="block truncate max-w-20 md:max-w-full">{order.id}</span>
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {formatDate(order.orderDate)}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{order.shippingStreet}</p>
                    <p className="font-mono text-xs text-muted-foreground">{order.shippingZip}</p>
                    <p className="font-mono text-xs text-muted-foreground">{order.shippingCity}</p>
                    <p className="font-mono text-xs text-muted-foreground">{order.shippingCountry}</p>
                    </div>

                  <div className="flex items-center gap-3">
                    {/* ── Status badge ────────────────────────────── */}
                    {/* Solid background + white text so the badge is  */}
                    {/* readable in both light and dark mode.           */}
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ background: s.color, color: "#fff" }}>
                      {s.label}
                    </span>

                    {/* ── Order total ─────────────────────────────── */}
                    {/* text-foreground (not text-primary) is used so  */}
                    {/* the amount is black in light mode and white in  */}
                    {/* dark mode rather than the gold brand colour     */}
                    {/* which has low contrast on a beige background.  */}
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* ── Line items ──────────────────────────────────── */}
                <div className="space-y-2">
                  {order.orderItem.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <Package size={13} className="shrink-0 text-muted-foreground" />
                      {/* text-foreground keeps the title readable in light mode */}
                      <Link href={`/movies/${item.movies.id}`}
                        className="flex-1 truncate text-sm text-foreground hover:text-primary">
                        {item.movies.title}
                      </Link>
                      <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                      <span className="text-xs font-medium">
                        {formatPrice(Number(item.priceAtPurchase) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
