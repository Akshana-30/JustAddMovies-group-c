import prisma from "@/lib/prisma";

export const getOrders = async () => {
  return prisma.order.findMany({
    include: {
      orderItem: {
        include: {
          movies: true,
        },
      },
    },
  });
};