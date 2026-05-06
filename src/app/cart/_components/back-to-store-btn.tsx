"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BackToStore() {
  const router = useRouter();

  function handleClick() {
    router.push("/store");
  }
  return (
    <Button
      variant="outline"
      className="cursor-pointer"
      onClick={() => handleClick()}
    >
      Continue shopping
    </Button>
  );
}
