"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type Props = {
  id: string;
  name: string;
};


export function GenreCard({ id, name }: Props) {
  const router = useRouter();

  // Display name mapping
  const displayName = name === "Science Fiction" ? "Sci-Fi" : name;

  return (
    <Button
         data-tooltip-target = 'Select genre'
          className="cursor-pointer bg-accent/70! hover:bg-(--gold)/15! border-(--gold) dark:hover:border-(--gold) dark:border-(--gold)/50 border-2 text-(--gold) dark:text-(--gold)/80 hover:text-(--gold)"
          key={id}
          onClick={() => router.push(`/movies?genre=${name}`)}
        >
     {displayName}
    </Button>
  );
}
