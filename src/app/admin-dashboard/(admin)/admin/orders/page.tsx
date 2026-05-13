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
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide" style={{ color: "var(--text)" }}>
            Manage <span style={{ color: "var(--gold)" }}>Orders</span>
          </h1>
          <p className="mt-1 font-serif italic" style={{ color: "var(--text-muted)" }}>
            {data.length} orders in database
          </p>
        </div>
      </div>
      <OrderTable data={data} />
    </div>
  );
}
