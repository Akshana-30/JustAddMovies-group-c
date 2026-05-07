"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function BackToStore() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    router.push("/store");
  }
  return (
    <Button
      variant="outline"
      disabled={isPending}
      className="cursor-pointer"
            onClick={() =>
              startTransition(() =>
                handleClick(),
              )
            }
    >
      Continue shopping
    </Button>
  );
}
