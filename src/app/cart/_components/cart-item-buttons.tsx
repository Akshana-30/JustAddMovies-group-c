/* eslint-disable react/jsx-no-undef */
"use client";

import { useTransition } from "react";
import { removeFromCart, updateQuantity } from "@/lib/cart-actions";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function CartItemControls({
  id,
  quantity,
}: {
  id: string;
  quantity: number;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mt-1.5 flex items-center">
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
        variant="destructive"
        size="icon-xs"
        className="lg:cursor-pointer lg:mx-2 items-center lg:hidden"
        onClick={() => startTransition(() => removeFromCart(id))}
        disabled={isPending}
      >
        <Trash />
      </Button>

      <Button
        variant="outline"
        size="xs"
        className="cursor-pointer mx-2 items-center max-lg:hidden"
        onClick={() => startTransition(() => removeFromCart(id))}
        disabled={isPending}
      >
        Remove
      </Button>

    </div>
  );
}
