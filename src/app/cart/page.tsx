import { getCart } from "@/lib/cart";
import { getCartProducts } from "@/lib/cart-types";
import CartItemControls from "./_components/cart-item-buttons";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BackToStore from "./_components/back-to-store-btn";
import { formatPrice } from "@/lib/format";
import Checkout from "./_components/check-out-button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function CartPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }

  const cart = await getCart();
  const products = await getCartProducts(cart);
  const total = products.reduce((sum, p) => {
    return sum + p.price * p.quantity;
  }, 0);

  if (products.length === 0) {
    return (
      <div className="flex-row max-w-6xl mx-auto border rounded-2xl p-4 bg-secondary">
        <h1 className="font-bold text-2xl">Your cart is empty</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody></TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total price: {total} SEK</TableCell>
              <TableCell>
                <BackToStore />
              </TableCell>
              <TableCell>
                <Checkout disabled={true} />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }

  return (
    <div className=" flex-row max-w-5xl mx-auto border border-(--gold)/40! rounded-2xl p-5 bg-sidebar-accent/60 ">
      <h1 className="font-bold text-2xl">Cart</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="flex flex-row">
                <Link href={`/movies/${product.id}`}><Image src={product.imageUrl} height={60} width={60} alt={product.title}/> </Link> 
                <Link className='my-auto' href={`/movies/${product.id}`}>&emsp; {product.title}</Link>
              </TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell className="border-(--gold)/40">
                <CartItemControls id={product.id} quantity={product.quantity} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow >
            <TableCell>Total price: {formatPrice(total)}</TableCell>
            <TableCell className="text-right">
              <BackToStore />
            </TableCell>
            <TableCell></TableCell>
            <TableCell className="text-right ">
              <Checkout />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
