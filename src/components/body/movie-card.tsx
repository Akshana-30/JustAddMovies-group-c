"use client";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../add-to-cart-button";
import { WishlistButton } from "./wishlist-button";
import { ShareButton } from "./share-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = React.ComponentProps<typeof Card> & {
  imageUrl: string;
  id: string;
  title: string;
  genres: { name: string }[];
  className?: string;
  price: number;
  stock: number;
};

export default function MovieCard({
  imageUrl,
  title,
  genres,
  price,
  id,
  stock,
  ...props
}: Props) {
  return (
    <Link href={`/movies/${id}`}>
      <Card className="bg-background h-full border-amber-300/50 border" size="default" {...props}>
        <CardHeader className="">
          <Image
            src={imageUrl}
            width={190}
            height={190}
            alt={title}
            className="m-auto"
          />
        </CardHeader>
        <CardFooter className="h-full">
          <div className="pl-2 flex flex-col h-full w-full">
            <h2 className={cn("text-card-foreground font-bold text-lg mb-1")}>{title}</h2>
            <div className={cn("flex flex-wrap gap-1 mb-2")}>
              {genres.map((g) => (
                <div key={g.name} className={cn("text-xs text-card-background/10")}>
                  {g.name + " |"}
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <p className="text-card-foreground text-[20px] leading-snug">
                {formatPrice(price)}
              </p>
              <p className="mb-3">In stock: {stock}</p>
              <TooltipProvider>
                <div className="flex items-center gap-4">
                  <AddToCartButton productId={id} productTitle={title} />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span><WishlistButton movieId={id} /></span>
                    </TooltipTrigger>
                    <TooltipContent>Add to wishlist</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span><ShareButton movieId={id}/></span>
                    </TooltipTrigger>
                    <TooltipContent>Share</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </CardFooter>

      </Card>
    </Link>
  );
}
