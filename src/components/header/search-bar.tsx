"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { SearchIcon } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/movies?search=${(query)}`);
  }

  return (
    <form onSubmit={handleSearch}>
      <InputGroup className="bg-secondary/70 dark:text-white text-black rounded-2xl">
        <InputGroupInput
          placeholder="Title, actor or director"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <InputGroupAddon>
          <button type="submit">
            <SearchIcon />
          </button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
