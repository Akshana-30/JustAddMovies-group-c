import OrderTable from "./_components/order-table";
import prisma from "@/lib/prisma";
import { ordersSchema } from "@/lib/schemas";

export default async function Page() {
  const data = await prisma.order.findMany({
    include: {
      orderItem: {
        include: {
          movies: true,
        },
      },
    },
  })
  const orders = ordersSchema.parse(data);

  return (
    <div>
      <OrderTable data={orders} />
    </div>
  );
}
