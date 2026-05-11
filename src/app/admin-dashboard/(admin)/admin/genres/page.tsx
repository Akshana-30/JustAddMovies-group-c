// src/app/admin-dashboard/(admin)/admin/genres/page.tsx
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { AdminGenresTable } from "./AdminGenresTable";

export const metadata: Metadata = { title: "Manage Genres" };

export default async function AdminGenresPage() {
  const genres = await prisma.genre.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { movies: true } } },
  });
  return (
    <div className="p-8">
      <h1 className="font-display mb-1 text-3xl tracking-wide" style={{ color: "var(--text)" }}>
        Manage <span style={{ color: "var(--gold)" }}>Genres</span>
      </h1>
      <p className="mb-6 font-serif italic" style={{ color: "var(--text-muted)" }}>
        {genres.length} genres
      </p>
      <AdminGenresTable genres={genres} />
    </div>
  );
}
