"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownUp } from "lucide-react";

export default function FilterButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSort = searchParams.get("sort");

  const sortOptions = [
    "New to old",
    "Old to new",
    'Popularity',
    "Price-high to low",
    "Price-low to high",
    "A-Ö",
    "Ö-A",
  ];

  const handleFilter = (option: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", option);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  return (
    <div className="flex justify-between w-full">
      <div className="max-md:hidden flex items-center gap-2 flex-wrap justify-center">
        {sortOptions.map((option) => (
          <Button
            key={option}
            variant="ghost"
            size="sm"
            onClick={() => handleFilter(option)}
            style={{
              background: currentSort === option ? "var(--gold)" : undefined,
              color: currentSort === option ? "#1a1a1a" : undefined,
            }}
          >
            {option}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-muted-foreground hover:text-red-400"
        >
          ✕ Reset
        </Button>
      </div>

      <div className="md:hidden flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="destructive" size='sm' className="border-2 border-(--gold)/50 text-(--gold)/80 bg-background!"> <ArrowDownUp />Sort by</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 bg-background" align="start">
              <DropdownMenuGroup >
                {sortOptions.map((menu) => (
                <DropdownMenuItem key={menu} onClick={() => handleFilter(menu)}>
                  {menu}
                </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={handleReset}
      className="text-muted-foreground hover:text-red-400 md:hidden "
    >
      ✕ Reset
    </Button>
    </div>
  );
}
