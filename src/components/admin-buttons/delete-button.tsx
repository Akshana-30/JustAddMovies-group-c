"use client";
import {
  deleteMovie,
  restoreMovie,
} from "@/app/admin-dashboard/_actions/delete-action";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";

type Props = React.ComponentProps<typeof Button> & { movieId: string } & {
  onSuccess?: () => void;
};

export default function DeleteMovieButton({
  movieId,
  onSuccess,
  ...props
}: Props) {
  const [isPending, startTransition] = useTransition();

  async function handleClick() {
    const shouldDelete = confirm(
      "Are you sure you want to archive this movie?",
    );
    if (!shouldDelete) {
      return;
    }
    await deleteMovie(movieId);
    onSuccess?.();
    toast.success("Archived movie.", { position: "bottom-right" });
  }
  return (
    <Button
      className="cursor-pointer"
      variant="destructive"
      onClick={() => startTransition(() => handleClick())}
      disabled={isPending}
      {...props}
    >
      {isPending ? "Adding to archive.." : "Move to archive"}
    </Button>
  );
}

export function RestoreMovieButton({ movieId, onSuccess, ...props }: Props) {
  const [isPending, startTransition] = useTransition();
  async function handleClick() {
    await restoreMovie(movieId);
    onSuccess?.();
    toast.success("Movie restored.", { position: "bottom-right" });
  }
  return (
    <Button
      className="cursor-pointer"
      variant="destructive"
      onClick={() => startTransition(() => handleClick())}
      disabled={isPending}
      {...props}
    >
      {isPending ? "Restoring movie.." : "Restore"}
    </Button>
  );
}
