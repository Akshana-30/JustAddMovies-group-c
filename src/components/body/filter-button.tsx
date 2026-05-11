'use client'
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function FilterButton() {
    const router = useRouter();

    const filterMenu = ['Most popular','Date','Price-high to low', 'Price-low to high','A-Ö']
    
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">Sort by</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-background/80" align="start">
      {filterMenu.map((menu)=> (
        <DropdownMenuGroup key={menu} onClick={() => router.push(`/movies?sort=${menu}`)}>
          <DropdownMenuItem>{menu}</DropdownMenuItem>
        </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
