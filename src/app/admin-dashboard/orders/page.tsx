import { ordersSchema } from "@/lib/schemasDELETE";
import OrderTable from "./_components/order-table";
import prisma from "@/lib/prisma";

export default async function Page() {
  const data = await prisma.order.findMany({
    include: {
      orderItem: {
        include: {
          movies: true,
        },
      },
    },
  });
 

  return (
    <div>
      <OrderTable data={data} />
    </div>
  );
}
