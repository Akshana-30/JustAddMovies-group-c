import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditOrderForm from "./_components/edit-order-form";

export default async function EditOrderPage(
  props: PageProps<"/orders/[orderId]/edit">,
) {
  const params = await props.params;
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { order_items: { include: { movies: { select: {title: true}} } }, user: {select: { name : true}} },
  });
  if (!order) {
    return notFound();
  }

  return (
    <div>
        
        <EditOrderForm data={{ ...order, orderItem: order.order_items }}></EditOrderForm>
    </div>
  )
}
