"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const router = useRouter();

  function handleClick() {
    router.push("/");
  }
  return (
    <Button
      variant="outline"
      className="cursor-pointer"
      onClick={() => handleClick()}
    >
      Checkout
    </Button>
  );
}
