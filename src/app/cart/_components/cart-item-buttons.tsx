"use client";

import { useTransition } from "react";
import { removeFromCart, updateQuantity } from "@/lib/cart-actions";
import { Button } from "@/components/ui/button";

export default function CartItemControls({
  id,
  quantity,
}: {
  id: string;
  quantity: number;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mt-1.5">
      <Button
        variant="outline"
        size="xs"
        className="cursor-pointer"
        onClick={() => startTransition(() => updateQuantity(id, quantity - 1))}
        disabled={isPending}
      >
        -
      </Button>

      <span className="p-2">{quantity}</span>

      <Button
        variant="outline"
        size="xs"
        className="cursor-pointer"
        onClick={() => startTransition(() => updateQuantity(id, quantity + 1))}
        disabled={isPending}
      >
        +
      </Button>

      <Button
        variant="outline"
        size="xs"
        className="cursor-pointer mx-2"
        onClick={() => startTransition(() => removeFromCart(id))}
        disabled={isPending}
      >
        Remove
      </Button>
    </div>
  );
}
