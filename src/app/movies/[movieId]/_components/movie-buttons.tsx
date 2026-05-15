"use client";

// ── MovieButtons ───────────────────────────────────────────────────
// Kept in a separate "use client" file and loaded with ssr:false in
// the parent server component so these components are NEVER rendered
// on the server. Radix UI Tooltip internals use useId() and
// data-state which produce different values on server vs client,
// causing a hydration mismatch that makes the buttons intermittently
// disappear. With ssr:false there is nothing to hydrate — the client
// renders fresh every time, no mismatch possible.
import AddToCartButton from "@/components/add-to-cart-button";
import { WishlistButton } from "@/components/body/wishlist-button";
import { ShareButton } from "@/components/body/share-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MovieButtons({
  movieId,
  movieTitle,
}: {
  movieId: string;
  movieTitle: string;
}) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">

        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <AddToCartButton productId={movieId} productTitle={movieTitle} />
            </span>
          </TooltipTrigger>
          <TooltipContent>Add to cart</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <WishlistButton movieId={movieId} />
            </span>
          </TooltipTrigger>
          <TooltipContent>Add to wishlist</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <ShareButton />
            </span>
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>

      </div>
    </TooltipProvider>
  );
}
