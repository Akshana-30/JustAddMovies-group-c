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
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export default async function OrderDetailsPage(
  props: PageProps<"/orders/[orderId]/details">,
) {
  const params = await props.params;

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },

    include: { orderItem: { include: { movies: true } } },
  });

  if (!order) {
    return notFound();
  }
  return (
    <div className="flex-row max-w-3xl mx-auto border rounded-2xl p-4 bg-secondary">
      <Table>
        <TableCaption>
          <Button variant="outline" size="xs" asChild>
            <Link href={`/orders/${order.id}`}>Back to order</Link>
          </Button>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Item ID</TableHead>
            <TableHead>Movie Title</TableHead>
            <TableHead>Item Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Movie ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.orderItem.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.movies.map((movie) => movie.title)}</TableCell>
              <TableCell>{formatPrice(Number(item.priceAtPurchase))}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell className="text-right text-blue-400">
                <Link href={`/movies/${item.movies.map((movie) => movie.id)}`}>
                  {item.movies.map((movie) => movie.id)}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </div>
  );
}
