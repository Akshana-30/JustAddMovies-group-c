"use client";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Props } from "recharts/types/shape/Dot";

export function GenreCard({ id, name, ...props}:Props) {
  const router = useRouter();

  return (
      
        <Button
          className="w-fit bg-primary hover:bg-primary/70 dark:bg-(--gold) dark:hover:bg-(--gold)/85"
          key={id}
          onClick={() => router.push(`/movies?genre=${name}`)}
        >
          {name}
        </Button>
      
   
  );
}