// src/app/admin-dashboard/(admin)/admin/movies/page.tsx
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { AdminMoviesTable } from "./AdminMoviesTable";

export const metadata: Metadata = { title: "Manage Movies" };

export default async function AdminMoviesPage() {
  const [movies, genres] = await Promise.all([
    prisma.movie.findMany({
      where: { deletedAt: {equals: null }},
      orderBy: { title: "asc" },
      include: { genres: true, directors: true },
    }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
    
  ]);
  
  const archived = await prisma.movie.findMany({
    where: { 
      deletedAt: { not: null }
    },
    orderBy: { title: "asc" },
      include: { genres: true, directors: true },
  })
  

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide" style={{ color: "var(--text)" }}>
            Manage <span style={{ color: "var(--gold)" }}>Movies</span>
          </h1>
          <p className="mt-1 font-serif italic" style={{ color: "var(--text-muted)" }}>
            {movies.length} movies in catalogue · {archived.length} archived
          </p>
        </div>
      </div>
      <AdminMoviesTable movies={movies} archived={archived} genres={genres} />
    </div>
  );
}
