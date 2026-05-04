import type { Order } from './schemas';

export type RowData = {
  orderId: string;
  status: Order["status"];
  orderDate: Date;
  totalAmount: number;
  movieTitle: string;
  quantity: number;
  priceAtPurchase: number;
};

export const flattenOrders = (orders: Order[]): RowData[] => {
  return orders.flatMap(order =>
    order.orderItem.flatMap(item =>
      item.movies.map(movie => ({
        orderId: order.id,
        status: order.status,
        orderDate: order.orderDate,
        totalAmount: order.totalAmount,
        movieTitle: movie.title,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        userId: order.userId
      }))
    )
  );
};