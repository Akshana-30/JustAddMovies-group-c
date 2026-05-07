"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";


type Props = React.ComponentProps<typeof Card> & {
  imageUrl: string;
  id:string
  title: string;
  genres: { name: string }[];
  description: string;
  className?: string;
};

export default function MovieCard({ imageUrl, title, genres, description, id, className, ...props }: Props) {
  const [hovered, setHovered] = useState(false);
  const [click, setClick] = useState(false)

  const shortDesc = description.split(" ").slice(0, 15).join(" ") + "..";

  return (
    <Link href={`/movies/${id}`}><Card
      className={cn(
        "border-amber-300 border relative overflow-hidden w-50 h-70 transition-transform duration-300 hover:scale-125",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <Image
        src={imageUrl}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt={title}
        className={cn("object-cover")}
      />

      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end p-3  transition-opacity duration-300 bg-linear-to-t from-black via-black/50 to-transparent",
          hovered ? "opacity-100" : "opacity-0"
        )}
      >
        <h2 className={cn("text-white font-bold text-sm mb-1")}></h2>

        <div className={cn("flex flex-wrap gap-1 mb-2")}>
          {genres.map((g) => (
            <span
              key={g.name}
              className={cn("text-xs text-card-background/10 ")}
            >
              {g.name + ' |'}
            </span>
          ))}
        </div>

        <p className={cn("text-white/80 text-[10px] leading-snug")}>{shortDesc}</p>
      </div>
    </Card></Link>
    
  );
}