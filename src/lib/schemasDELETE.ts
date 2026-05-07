import { z } from "zod";

export const movieSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  releaseDate: z.coerce.date(),
  imageUrl: z.string(),
  stock: z.coerce.number(),
  deletedAt: z.coerce.date(),
  runtime: z.coerce.number(),
});

export const orderItemSchema = z.object({
  id: z.string(),
  quantity: z.coerce.number(),
  priceAtPurchase: z.coerce.number(),
  movieId: z.string(),
  orderId: z.string(),
  movies: z.array(movieSchema),
});

export const orderSchema = z.object({
  id: z.string(),
  totalAmount: z.coerce.number(),
  status: z.string(),
  orderDate: z.coerce.date(),
  userId: z.string(),
  orderItem: z.array(orderItemSchema),
});

export const ordersSchema = z.array(orderSchema);

export type Order = z.infer<typeof orderSchema>;

