"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import handleCheckout from "./handleCheckout";
import { useTransition } from "react";


type Props = React.ComponentProps<typeof Button>

export default function CheckoutButton({disabled}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

 
  async function handleClick() {
    await handleCheckout()
   
    router.push("/");
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
