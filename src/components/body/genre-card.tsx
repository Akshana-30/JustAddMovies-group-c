"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Props } from "recharts/types/shape/Dot";

export function GenreCard({ id, name, ...props}:Props) {
  const router = useRouter();

  return (
      
        <Button
          className="cursor-pointer dark:text-inherit text-black"
          key={id}
          onClick={() => router.push(`/movies?genre=${name}`)}
        >
          {name}
        </Button>
      
   
  );
}