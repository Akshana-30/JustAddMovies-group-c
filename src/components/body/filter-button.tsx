"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function FilterButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSort = searchParams.get("sort");

  const sortOptions = [
    "Date",
    "Price-high to low",
    "Price-low to high",
    "A-Ö",
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
    <div className="flex items-center gap-2 flex-wrap justify-center">
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
  );
}
