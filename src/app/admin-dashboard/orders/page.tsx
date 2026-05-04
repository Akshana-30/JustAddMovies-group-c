import OrderTable from "./_components/order-table";

import { getOrders } from '@/lib/orders';
import { ordersSchema } from '@/lib/schemas';

export default async function Page() {
  

  const data = await getOrders();
  const orders = ordersSchema.parse(data);

  return (
    <div>
        <OrderTable data={orders} />
    </div>
  )
}
