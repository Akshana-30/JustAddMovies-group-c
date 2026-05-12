"use server";

import prisma from "@/lib/prisma";
import { formSchema } from "../_components/edit-order-form";
import z from "zod";

type FormValues = z.infer<typeof formSchema>;

export async function updateOrder(data: FormValues) {
  await prisma.order.update({
    where: { id: data.id },
    data: {
      status: data.status,
      totalAmount: data.totalAmount,
      orderDate: new Date(data.orderDate),
      order_items: {
        deleteMany: {},
        createMany: {
          data: data.orderItem.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
            movieId: item.movieId,
          })),
        },
      },
    },
  });
}
