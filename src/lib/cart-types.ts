import { z } from "zod";
import prisma from "./prisma";

export const movieItem = z.object({
  id: z.string(),
  title: z.string(),
  quantity: z.coerce.number(),
});

export type CartItem = z.infer<typeof movieItem>;

export type Cart = CartItem[];

export async function getCartProducts(cart: Cart) {
  const productIds = cart.map((item) => item.id);
  const products = await prisma.movie.findMany({
    where: { id: { in: productIds } },
  });
  return products.map((product) => {
    const item = cart.find((i) => i.id === product.id);
    return { ...product, quantity: item?.quantity ?? 0 };
  });
}
