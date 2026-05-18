"use client";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  name: string;
  active?: boolean;
}

export function GenreCard({ id, name, active }: Props) {
  const router = useRouter();

  // Display name mapping
  const displayName = name === "Science Fiction" ? "Sci-Fi" : name;

  return (
    <button
      key={id}
      onClick={() => router.push(active ? "/movies" : `/movies?genre=${name}`)}
      style={{
        background: active ? "var(--gold-light, #f5a623)" : "var(--gold, #e8a030)",
        color: "var(--genre-text, #000000)",
        border: "none",
        borderRadius: "10px",
        padding: "0 8px",
        width: "100%",
        height: "36px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        textAlign: "center",
        boxShadow: active ? "0 0 0 2px #fff inset" : "none",
        transition: "opacity 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
    >
      {displayName}
    </button>
  );
}
