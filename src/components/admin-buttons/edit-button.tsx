"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type Props = React.ComponentProps<typeof Button> & { movieId: string };

export default function EditMovieButton({
  movieId,
  children,
  disabled,
  ...props
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  function handleClick() {
    setLoading(true);
    router.push(`/movies/${movieId}/edit`);
    setLoading(false);
  }
  return (
    <Button
      className="cursor-pointer"
      variant="ghost"
      onClick={handleClick}
      disabled={loading || disabled}
      {...props}
    >
      {children || "Edit"}
    </Button>
  );
}
