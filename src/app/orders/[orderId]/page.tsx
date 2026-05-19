import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function OrderPage(props: PageProps<"/orders/[orderId]">) {
  const params = await props.params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const isAdmin = session?.user.role === "ADMIN";
  if (!isAdmin) {
    redirect("/");
  }

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      orderItem: { include: { movies: true } },
      user: true,
    },
  });

  if (!order) {
    return notFound();
  }
  return (
    <div className="flex-row max-w-3xl mx-auto border border-(--gold)/30 bg-sidebar-accent/30 rounded-2xl p-4 mt-10">
      <div className="mb-10">
        <div className="flex items-center border-b border-(--gold)/30 mb-1">
          <p
            className="font-display text-3xl tracking-wide"
            style={{ color: "var(--text)" }}
          >
            Order:
          </p>
          <p className="block truncate max-w-20 md:max-w-full ml-2">
            {order.id}
          </p>
        </div>
        <div className="flex items-center text-sm border-b border-(--gold)/30 mb-1">
          <p style={{ color: "var(--text)" }}>Order date:</p>
          <p className="block truncate max-w-20 md:max-w-full ml-2">
            {new Intl.DateTimeFormat("sv-SE").format(order.orderDate)}
          </p>
        </div>
        <div className="flex items-center text-sm border-b border-(--gold)/30 mb-1">
          <p style={{ color: "var(--text)" }}>User ID:</p>
          <p className="block truncate max-w-20 md:max-w-full ml-2">
            {order.user.id}
          </p>
        </div>
        <div className="flex items-center text-sm border-b border-(--gold)/30 mb-1">
          <p style={{ color: "var(--text)" }}>User:</p>
          <p className="block truncate max-w-20 md:max-w-full ml-2">
            {order.user.name}
          </p>
        </div>
        <div className="flex items-center text-sm border-b border-(--gold)/30 mb-1">
          <p style={{ color: "var(--text)" }}>Email:</p>
          <p className="block truncate max-w-20 md:max-w-full ml-2">
            {order.user.email}
          </p>
        </div>
        <div className="flex items-center text-sm border-b border-(--gold)/30 mb-1">
          <p style={{ color: "var(--text)" }}>Total order cost:</p>
          <p className="block truncate max-w-20 md:max-w-full ml-2">
            {formatPrice(order.totalAmount)}
          </p>
        </div>
        <div className="flex items-center text-sm border-b border-(--gold)/30 mb-1">
          <p style={{ color: "var(--text)" }}>Status:</p>
          <span
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "20px",
              background:
                order.status === "PAID"
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(232,160,48,0.15)",
              color: order.status === "PAID" ? "#4ade80" : "var(--gold)",
            }}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="border border-(--gold)/30 rounded-2xl p-2">
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead>Movie Title</TableHead>
              <TableHead>Item Price</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Movie ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.orderItem.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.movies.title}</TableCell>
                <TableCell>{formatPrice(item.priceAtPurchase)}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right text-blue-400">
                  <Link href={`/movies/${item.movies.id}`}>
                    {item.movies.id}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
      </div>
      <div className="pt-4 space-x-2">
        <Button size="xs" asChild>
          <Link href={`/admin-dashboard/admin/orders`}>Back to orders</Link>
        </Button>
        <Button variant="outline" size="xs" asChild>
          <Link href={`/orders/${order.id}/edit/`}>Edit</Link>
        </Button>
      </div>
    </div>
  );
}
