import prisma from "@/lib/prisma";

export const users = await prisma.user.findMany({
	orderBy: { createdAt: 'desc' },
	select: {
		id: true,
		name: true,
		email: true,
		// phone: true, shippingAddress: true,
		role: true,
		createdAt: true,
		_count: { select: { orders: true } },
		orders: {
			orderBy: { orderDate: 'desc' },
			take: 3,
			select: {
				id: true,
				totalAmount: true,
				status: true,
				orderDate: true,
				orderItem: { select: { quantity: true } },
			},
		},
	},
});
