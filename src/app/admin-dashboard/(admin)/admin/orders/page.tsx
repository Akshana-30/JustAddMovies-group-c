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
      user: { select: { name: true, email: true } },
    },
    orderBy: { orderDate: "desc" },
  });

  return (
    <div>
      <OrderTable data={data} />
    </div>
  );
}
