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
    router.push(`/movies?title=${(query)}`);
  }

  return (
    <form onSubmit={handleSearch}>
      <InputGroup className="bg-secondary text-black rounded-2xl">
        <InputGroupInput
          placeholder=" Find by title or actor"
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
