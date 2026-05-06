"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = React.ComponentProps<typeof Button>

export default function Checkout({disabled}: Props) {
  const router = useRouter();
  
 
  function handleClick() {
    router.push("/cart/checkout");
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
