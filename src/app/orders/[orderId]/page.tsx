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

export default async function OrderPage(props: PageProps<"/orders/[orderId]">) {
  const params = await props.params;

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
  });

  if (!order) {
    return notFound();
  }
  return (
    <div className="flex-row max-w-3xl mx-auto border rounded-2xl p-4">
      <h1 className="text-4xl font-bold m-4">{`ID: ${order.id}`}</h1>
      <Table>
        <TableCaption>Order details</TableCaption>
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
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.orderDate.toDateString()}</TableCell>
            <TableCell className="text-blue-400">
              <Link href={`/orders/${order.id}/details`}>Order details</Link>
            </TableCell>
            <TableCell>{order.userId}</TableCell>
            <TableCell className="text-right">{order.totalAmount} SEK</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </div>
  );
}
