import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import EditOrderForm from "./_components/edit-order-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function EditOrderPage(
  props: PageProps<"/orders/[orderId]/edit">,
) {
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
    include: { orderItem: { include: { movies: { select: {title: true}} } }, user: {select: { name : true}} },
  });
  if (!order) {
    return notFound();
  }

  return (
    <div>
      <div className="mb-6">
          <h1
            className="font-display text-3xl tracking-wide text-center"
            style={{ color: "var(--text)" }}
          >
            Edit <span style={{ color: "var(--gold)" }}>Order</span>
          </h1>
      </div>
        <EditOrderForm data={order}></EditOrderForm>
    </div>
  )
}
