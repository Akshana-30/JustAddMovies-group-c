"use client";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import * as React from "react";

type Props = React.ComponentProps<typeof Carousel> & {
  children: React.ReactNode;
};

export default function BannerCarousel({ children }: Props) {

  const plugin = React.useRef(
    Autoplay({ delay: 4500, stopOnInteraction: true,  })
  )

  return (
    <Carousel
      plugins={[Autoplay({delay:4500, stopOnInteraction:true })]}
      opts={{ loop: true, dragThreshold: 15 }}
      className="w-full border-amber-300/50 border rounded-2xl"
      onMouseEnter={()=> plugin.current.stop()}
      onMouseLeave={()=>plugin.current.reset()}
    >
      <CarouselContent>
        {children}
      </CarouselContent>
      <CarouselPrevious
        variant="outline"
        size="icon-lg"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
      />
      <CarouselNext
        size="icon-lg"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
      />
    </Carousel>
  );
}
