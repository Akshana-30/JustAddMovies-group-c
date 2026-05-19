import { getCart } from "@/lib/cart";
import { getCartProducts } from "@/lib/cart-types";
import PaymentForm from "./_components/payment-form";
import { formatPrice } from "@/lib/format";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export default async function CheckOutPage() {
  const cart = await getCart();
  const products = await getCartProducts(cart);
  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  // Pre-fill checkout with the user's saved default address
  const session = await auth.api.getSession({ headers: await headers() });
  const userWithAddress = session
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { address: { take: 1 } },
      })
    : null;
  const defaultAddress = userWithAddress?.address[0] ?? null;

  return (
    <div className="flex flex-col max-lg:items-center lg:justify-center lg:flex-row mt-10 px-4">
      <div className="bg-sidebar-accent/40 dark:bg-sidebar-accent/40 w-full max-w-md p-5 border-l border-t max-lg:border-r lg:border-b border-(--gold)/30 max-lg:rounded-t-2xl lg:rounded-l-2xl">
        <div>
          {products.map((p) => (
            <div key={p.id} className="border-b border-(--gold)/40 p-4">
              <div className="flex justify-between">
                <span>{p.title} x {p.quantity}</span> :
                <span className="font-bold text-(--gold)">{formatPrice(p.price)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="border-b border-r border-l border-(--gold)/40 p-4 font-bold text-right text-(--gold) rounded-md">
          Total Order Cost: {formatPrice(total)}
        </div>
      </div>
      <div className="w-full max-w-md">
        <PaymentForm defaultAddress={defaultAddress} />
      </div>
    </div>
  );
}
