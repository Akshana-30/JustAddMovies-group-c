"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterMenu = [
    "Date",
    "Price-high to low",
    "Price-low to high",
    "A-Ö",
  ];
  const handleFilter = (menu: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", menu);
    router.push(`/movies?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">Sort by</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-background/80" align="start">
        {filterMenu.map((menu) => (
          <DropdownMenuGroup key={menu}>
            <DropdownMenuItem onClick={() => handleFilter(menu)}>
              {menu}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

