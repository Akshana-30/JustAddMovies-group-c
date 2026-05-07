"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = React.ComponentProps<typeof Button>

export default function Checkout({disabled}: Props) {
  const router = useRouter();
    const [isPending, startTransition] = useTransition();
  
 
  function handleClick() {
    router.push("/cart/checkout");
  }

  return (
    <Button
      disabled={disabled || isPending}
      variant="outline"
      className="cursor-pointer"
      onClick={() =>
              startTransition(() =>
                handleClick(),
              )
            }
    >
      Checkout
    </Button>
  );
}
