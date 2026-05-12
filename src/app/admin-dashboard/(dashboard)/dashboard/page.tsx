// src/app/admin-dashboard/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "Pending",    color: "#f59e0b" },
  PROCESSING: { label: "Processing", color: "#a78bfa" },
  PAID:       { label: "Paid",       color: "#4ade80" },
  SHIPPED:    { label: "Shipped",    color: "#60a5fa" },
  DELIVERED:  { label: "Delivered",  color: "#34d399" },
  CANCELED:   { label: "Cancelled",  color: "#f87171" },
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?callbackUrl=/admin-dashboard/dashboard");

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
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {formatDate(order.orderDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}40` }}>
                      {s.label}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.orderItem.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <Package size={13} className="shrink-0 text-muted-foreground" />
                      <Link href={`/movies/${item.movies.id}`}
                        className="flex-1 truncate text-sm text-muted-foreground hover:text-primary">
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
