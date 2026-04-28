"use client";
import { deleteMovie } from "@/app/admin-dashboard/_actions/delete-action";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type Props = React.ComponentProps<typeof Button> & { movieId: string };

export default function DeleteMovieButton({
  movieId,
  children,
  disabled,
  ...props
}: Props) {
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    async function handleClick(){
        const shouldDelete = confirm("Are you sure you want to delete this movie?");
        if(!shouldDelete){
            return;
        }
        setLoading(true)
        await deleteMovie(movieId)
        setLoading(false)
        // toast.success("Deleted book from library.", { position: "bottom-right" }); not implemented yet
        router.push(`/admin-dashboard`)
    }
    return(
        <Button
        className="cursor-pointer"
        variant="destructive"
        onClick={handleClick}
        disabled={loading || disabled}
        {...props}
        >{children || "Delete"}</Button>
    )
}
