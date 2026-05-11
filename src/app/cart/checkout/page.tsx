import { getCart } from "@/lib/cart";
import { getCartProducts } from "@/lib/cart-types";
import PaymentForm from "./_components/payment-form";
import z from "zod";
import { formatPrice } from "@/lib/format";

const cart = await getCart();
const products = await getCartProducts(cart);
export const total = products.reduce((sum, p) => {
  return sum + p.price * p.quantity;
}, 0);

type Products = z.infer<typeof products>;
export type Props = {
    
    products: Products[]
}


export default async function CheckOutPage() {
  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-md p-5 border rounded-2xl bg-secondary">
        <div>{products.map((p) => (
            <div key={p.id} className="border p-4">
                <div><span className="">{p.title} x {p.quantity}</span> : <span className="text-right text-yellow-400">{formatPrice(p.price)}</span></div>
            </div>
        ))}</div>
        <div className="border p-4 font-bold text-right  text-yellow-400 ">Total Order Cost: {formatPrice(total)}</div>
      </div>
      <PaymentForm/>
    </div>
  );
}
