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
      <div className="h-screen px-4 py-8 flex flex-col">
        <div className="max-w-5xl mx-auto border border-(--gold)/40! rounded-2xl p-5 bg-sidebar-accent/40 w-full">
          <h1 className="font-bold text-2xl mb-4">Your cart is empty</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden lg:table-cell">Qty</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center hidden lg:table-cell">
                  Total Price
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody />
            <TableFooter>
              <TableRow>
                <TableCell>Total price: {formatPrice(total)}</TableCell>
                <TableCell className="hidden lg:table-cell" />
                <TableCell className="text-right">
                  <BackToStore />
                </TableCell>
                <TableCell className="text-right hidden lg:table-cell">
                  <Checkout disabled={true} />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-auto px-4 py-8">
      <div className="max-w-5xl w-full mx-auto border border-(--gold)/40! rounded-2xl p-5 bg-sidebar-accent/40">
        <h1 className="font-bold text-2xl mb-4">Cart</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center hidden lg:table-cell">
                Qty
              </TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center hidden lg:table-cell">
                Total Price
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="flex flex-row items-center gap-4">
                  <div className="flex flex-col">
                    <div className= "flex flex-row gap-4" >
                      <Link href={`/movies/${product.id}`} className="shrink-0">
                        <Image
                          src={product.imageUrl}
                          height={70}
                          width={70}
                          alt={product.title}
                          className="rounded"
                        />
                      </Link>
                      <Link href={`/movies/${product.id}`}>
                        <p className=" text-wrap">{product.title}</p>
                      </Link>
                    </div>

                    <div className="lg:hidden">
                      <CartItemControls
                        id={product.id}
                        quantity={product.quantity}
                      />
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-center hidden lg:table-cell">
                  <CartItemControls
                    id={product.id}
                    quantity={product.quantity}
                  />
                </TableCell>

                <TableCell className="text-center">
                  <p className=" max-sm:hidden">{formatPrice(product.price)}</p>
                  <p className="pt-10 lg:hidden text-muted-foreground text-sm mt-1">
                    Total: {formatPrice(product.price * product.quantity)}
                  </p>
                </TableCell>

                <TableCell className="text-center hidden lg:table-cell">
                  {formatPrice(product.price * product.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            {/* Desktop footer: 4 cells matching 4 columns */}
            <TableRow className="hidden lg:table-row">
              <TableCell className="font-semibold">
                Total price: {formatPrice(total)}
              </TableCell>
              <TableCell />
              <TableCell className="text-right">
                <BackToStore />
              </TableCell>
              <TableCell className="text-right">
                <Checkout />
              </TableCell>
            </TableRow>

            {/* Mobile footer: single row spanning all columns */}
            <TableRow className="lg:hidden">
              <TableCell colSpan={3}>
                <div className="flex flex-col gap-3">
                  <span className="font-semibold">
                    Total price: {formatPrice(total)}
                  </span>
                  <div className="flex">
                    <BackToStore />
                    <Checkout />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
