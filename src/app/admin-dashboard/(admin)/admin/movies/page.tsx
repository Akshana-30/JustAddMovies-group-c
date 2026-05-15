// src/app/admin-dashboard/(admin)/admin/movies/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { AdminMoviesTable } from "./AdminMoviesTable";

export const metadata: Metadata = { title: "Manage Movies" };

// ── Person-filter support ──────────────────────────────────────────
// When navigating here from the Manage People page (clicking a
// director's or actor's movie count), the URL carries a `director`
// or `actor` query param containing the person's database ID.
// We narrow the Prisma where-clause to only their films and show a
// dismissable banner so the admin always knows a filter is active.
export default async function AdminMoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ director?: string; actor?: string }>;
}) {
  const { director: directorId, actor: actorId } = await searchParams;

  // ── Build person filter ────────────────────────────────────────
  // Only one of these will be set at a time (links from People page
  // pass exactly one param). Both are ignored when absent so the
  // default "all movies" view is unchanged.
  const personWhere = directorId
    ? { directors: { some: { id: directorId } } }
    : actorId
    ? { actors: { some: { id: actorId } } }
    : {};

  // ── Resolve person name for the filter banner ──────────────────
  // Fetched in parallel with the main queries to avoid a waterfall.
  const [movies, genres, archived, filterPerson] = await Promise.all([
    prisma.movie.findMany({
      where: { deletedAt: { equals: null }, ...personWhere },
      orderBy: { title: "asc" },
      include: { genres: true, directors: true },
    }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
    prisma.movie.findMany({
      where: { deletedAt: { not: null }, ...personWhere },
      orderBy: { title: "asc" },
      include: { genres: true, directors: true },
    }),
    // Look up the name of whoever we're filtering by so the banner
    // can read "Showing movies for: Steven Spielberg" rather than
    // a raw database ID.
    directorId
      ? prisma.director.findUnique({ where: { id: directorId }, select: { name: true } })
      : actorId
      ? prisma.actor.findUnique({ where: { id: actorId }, select: { name: true } })
      : Promise.resolve(null),
  ]);

  const isFiltered = Boolean(directorId || actorId);
  const filterLabel = filterPerson?.name ?? "Unknown";
  const filterKind  = directorId ? "Director" : "Actor";

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

      {/* ── Active-filter banner ──────────────────────────────────── */}
      {/* Only shown when a director or actor filter is in effect.    */}
      {/* The × link clears the filter by navigating back to the      */}
      {/* unfiltered movies page.                                      */}
      {isFiltered && (
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          background: "rgba(232,160,48,0.1)", border: "1px solid rgba(232,160,48,0.35)",
          borderRadius: "8px", padding: "10px 16px", marginBottom: "20px",
          fontSize: "13px", color: "var(--text)",
        }}>
          <span style={{ color: "var(--gold)", fontWeight: 600 }}>
            {filterKind}:
          </span>
          <span>{filterLabel}</span>
          <span style={{ color: "var(--text-dim)" }}>— showing {movies.length} film{movies.length !== 1 ? "s" : ""}</span>
          <Link
            href="/admin-dashboard/admin/movies"
            style={{
              marginLeft: "auto", color: "var(--text-muted)", fontSize: "12px",
              textDecoration: "none", border: "1px solid var(--border)",
              borderRadius: "4px", padding: "2px 8px",
            }}
          >
            ✕ Clear filter
          </Link>
        </div>
      )}

      <AdminMoviesTable movies={movies} archived={archived} genres={genres} />
    </div>
  );
}
