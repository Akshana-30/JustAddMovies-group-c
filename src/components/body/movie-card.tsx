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
      <Card
        className="bg-background h-full flex "
        size="default"
        {...props}
      >
        <CardHeader className=" ">
          <div className="relative m-auto ">
            <Image
              src={imageUrl}
              width={180}
              height={180}
              alt={title}
              className="m-auto w-full h-auto max-w-45 min-w-20"
            />
            <div className="absolute top-2 right-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="[800]:hidden">
                      <WishlistButton movieId={id} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Add to wishlist</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardFooter className=" h-full ">
          <div className="flex flex-col h-full">
            <h2 className={cn("text-card-foreground font-bold text-lg mb-1")}>
              {title}
            </h2>
            <div className={cn("flex flex-wrap gap-1 mb-2")}>
              {genres.map((g) => (
                <div
                  key={g.name}
                  className={cn("text-xs text-card-background/10")}
                >
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
                      <span className="max-[1800px]:hidden">
                        <WishlistButton movieId={id} />
                      </span>
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
