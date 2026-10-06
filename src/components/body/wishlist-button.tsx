"use client";

import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState, useTransition } from "react";
import { addToWishlist, isInWishlist, removeFromWishlist } from "@/app/admin-dashboard/_actions/wishlist-actions";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type ButtonProps = React.ComponentProps<typeof Button> & {
    movieId: string;
};

export function WishlistButton({
    movieId,
    ...props
}: ButtonProps) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isPending, startTransition] = useTransition();

    const { data: session } = authClient.useSession();
    const userId = session?.user.id;
    const isAdmin = session?.user.role === "ADMIN" ? true : false;

    useEffect(() => {
      if(!userId) return;
      
      async function getWished() {
        const item = await isInWishlist(movieId);

        setIsEnabled(item);
      }

      getWished();
    }, [userId, movieId]);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const nextState = !isEnabled;
        setIsEnabled(nextState);

        startTransition(async () => {
            if (nextState) {
                const result = await addToWishlist(movieId);
                if (!result.success) {
                    setIsEnabled(false);
                    toast.error(result.error, { position: "top-center" });
                }
            } else {
                await removeFromWishlist(movieId);
            }
        });
    }

    return (
        <Button
            disabled={isPending || !session || isAdmin}
            onClick={handleToggle}
            suppressHydrationWarning
            {...props}
        >
            <Heart className={isEnabled ? "dark:fill-primary fill-popover" : "fill-none"} />
        </Button>
    )
}