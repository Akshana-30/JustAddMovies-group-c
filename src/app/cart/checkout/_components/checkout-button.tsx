"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import handleCheckout from "./handleCheckout";


type Props = React.ComponentProps<typeof Button>

export default function CheckoutButton({disabled}: Props) {
  const router = useRouter();

 
  async function handleClick() {
    await handleCheckout()
   
    router.push("/");
  }

  return (
    <Button
      disabled={disabled}
      variant="outline"
      className="cursor-pointer"
      onClick={() => handleClick()}
    >
      Checkout
    </Button>
  );
}
