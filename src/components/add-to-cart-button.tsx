"use client";

import { addToCart } from "@/lib/cart-actions";
import { Button } from "./ui/button";
import { useTransition } from "react";

type Props = {
  productId: string;
  productTitle: string;
};

export default function AddToCartButton({ productId, productTitle }: Props) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="default"
      className="cursor-pointer "
      onClick={() =>
        startTransition(() =>
          addToCart({ id: productId, quantity: 1, title: productTitle }),
        )
      }
      disabled={isPending}
    >
      {isPending ? "Adding.." : "Add to cart"}
    </Button>
  );
}
