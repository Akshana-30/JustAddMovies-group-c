import { z } from 'zod';

export const movieSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export const orderItemSchema = z.object({
  id: z.string(),
  quantity: z.coerce.number(),
  priceAtPurchase: z.coerce.number(),
  movies: z.array(movieSchema),
});

export const orderSchema = z.object({
  id: z.string(),
  totalAmount: z.coerce.number(),
  status: z.enum(["PENDING", "PROCESSING", "SUCCESS", "CANCELED"]),
  orderDate: z.coerce.date(), // ✅ fixes string → Date
  userId: z.string(),
  orderItem: z.array(orderItemSchema),
});

export const ordersSchema = z.array(orderSchema);

// 👉 inferred type (no duplication)
export type Order = z.infer<typeof orderSchema>;