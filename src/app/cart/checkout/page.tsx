import { getCart } from "@/lib/cart";
import { getCartProducts } from "@/lib/cart-types";
import PaymentForm from "./_components/payment-form";
import { formatPrice } from "@/lib/format";
export default async function CheckOutPage() {
  const cart = await getCart();
  const products = await getCartProducts(cart);
  const total = products.reduce((sum, p) => {
    return sum + p.price * p.quantity;
  }, 0);

  return (

    <div className="flex justify-center mt-10 px-4">
      <div className="bg-sidebar-accent dark:bg-sidebar-accent/60 w-full max-w-md p-5 border-l border-t border-b border-(--gold)/30 rounded-l-2xl">
        <div>{products.map((p) => (
            <div key={p.id} className="border-b border-(--gold)/40 p-4">
                <div className="flex justify-between"><span >{p.title} x {p.quantity}</span> : <span className="font-bold text-yellow-500">{formatPrice(p.price)}</span></div>
            </div>
        ))}</div> 
        <div className="border-b border-r border-l border-(--gold)/40 p-4 font-bold text-right text-(--gold) rounded-md">Total Order Cost: {formatPrice(total)}</div>
      </div>
      <div className="w-full max-w-md">
      <PaymentForm/>
      </div>
    </div>
  );
}
