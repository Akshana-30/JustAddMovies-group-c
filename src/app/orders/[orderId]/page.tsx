import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
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

export default async function OrderPage(props: PageProps<"/orders/[orderId]">) {
  const params = await props.params;

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
  });

  if (!order) {
    return notFound();
  }
  return (
    <div className="flex-row max-w-3xl mx-auto border rounded-2xl p-4 bg-secondary">
      <h1 className="text-4xl font-bold m-4">{`ID: ${order.id}`}</h1>
      <Table>
        <TableCaption>{`ID: ${order.id}`}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
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
            </TableCell>
            <TableCell>{order.orderDate.toDateString()}</TableCell>
            <TableCell className="text-blue-400">
              <Link href={`/orders/${order.id}/details`}>Order details</Link>
            </TableCell>
            <TableCell>{order.userId}</TableCell>
            <TableCell className="text-right">
              {formatPrice(order.totalAmount)}
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </div>
  );
}
