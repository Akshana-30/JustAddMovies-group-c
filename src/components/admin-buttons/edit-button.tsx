"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type Props = React.ComponentProps<typeof Button> & { movieId: string };

export default function EditMovieButton({
  movieId,
  disabled,
  ...props
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    router.push(`/movies/${movieId}/edit`);
  }
  return (
    <Button
      className="cursor-pointer"
      variant="ghost"
      onClick={() => startTransition(() => handleClick())}
      disabled={isPending || disabled}
      {...props}
    >
      {isPending ? "Edit.." : "Edit"}
    </Button>
  );
}
