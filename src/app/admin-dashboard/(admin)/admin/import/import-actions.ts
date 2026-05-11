// src/app/admin-dashboard/(admin)/admin/import/import-actions.ts
"use server";

import prisma from "@/lib/prisma";
import {
  searchTmdb, searchByPerson, discoverTmdb,
  getTmdbMovie, tmdbToMovie,
} from "@/lib/tmdb";
import { actionError, actionSuccess } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.role === "ADMIN" ? session : null;
}

// ── Search by title ───────────────────────────────────────────────
export async function searchMovies(query: string) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  if (!query.trim())         return actionError("Enter a search term");
  try {
    const results = await searchTmdb(query);
    return actionSuccess(results.slice(0, 20));
  } catch (err: unknown) { 
      if(err instanceof(Error)) {
        return actionError(err.message); 
      }

      else {
        return actionError(`Unknown err: ${err}`);
      }
    }
}

// ── Search by actor name ──────────────────────────────────────────
export async function searchByActor(name: string) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  if (!name.trim())          return actionError("Enter an actor name");
  try {
		const results = await searchByPerson(name, 'actor');
		return actionSuccess(results);
	} catch (err: unknown) {
		if (err instanceof Error) {
			return actionError(err.message);
		} else {
			return actionError(`Unknown err: ${err}`);
		}
	}
}

// ── Search by director name ───────────────────────────────────────
export async function searchByDirector(name: string) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  if (!name.trim())          return actionError("Enter a director name");
  try {
		const results = await searchByPerson(name, 'director');
		return actionSuccess(results);
	} catch (err: unknown) {
		if (err instanceof Error) {
			return actionError(err.message);
		} else {
			return actionError(`Unknown err: ${err}`);
		}
	}
}

// ── Discover with filters ─────────────────────────────────────────
export async function discoverMovies(filters: {
  yearFrom?:  number;
  yearTo?:    number;
  ratingMin?: number;
  genreName?: string;
  sortBy?:    string;
}) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  try {
		const results = await discoverTmdb(filters);
		return actionSuccess(results.slice(0, 20));
	} catch (err: unknown) {
		if (err instanceof Error) {
			return actionError(err.message);
		} else {
			return actionError(`Unknown err: ${err}`);
		}
	}
}

// ── Preview a single movie ────────────────────────────────────────
export async function previewTmdbMovie(tmdbId: number) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  try {
		const movie = await getTmdbMovie(tmdbId);
		return actionSuccess(tmdbToMovie(movie));
	} catch (err: unknown) {
		if (err instanceof Error) {
			return actionError(err.message);
		} else {
			return actionError(`Unknown err: ${err}`);
		}
	}
}

// ── Import a single movie ─────────────────────────────────────────
export async function importFromTmdb(tmdbId: number, priceOre: number, force = false) {
  if (!await requireAdmin()) return actionError("Unauthorized");

  try {
    const tmdb  = await getTmdbMovie(tmdbId);
    const movie = tmdbToMovie(tmdb, priceOre);

    if (!force) {
      const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;
      const duplicate = await prisma.movie.findFirst({
        where: {
          title: { equals: movie.title, mode: "insensitive" },
          ...(releaseYear ? {
            releaseDate: {
              gte: new Date(`${releaseYear - 1}-07-01`),
              lte: new Date(`${releaseYear + 1}-06-30`),
            },
          } : {}),
        },
        select: { title: true, releaseDate: true, runtime: true },
      });
      if (duplicate) {
        const yr = duplicate.releaseDate ? new Date(duplicate.releaseDate).getFullYear() : "?";
        return { success: false as const, isDuplicate: true,
          error: `Already in catalogue: "${duplicate.title}" (${yr}, ${duplicate.runtime} min)` };
      }
    }

    const [genreRecords, directorRecords, actorRecords] = await Promise.all([
      Promise.all(movie.genres.map((name) =>
        prisma.genre.upsert({ where: { name }, update: {}, create: { name } })
      )),
      Promise.all(movie.directors.map((name) =>
        prisma.director.upsert({ where: { name }, update: {}, create: { name } })
      )),
      Promise.all(movie.actors.map((name) =>
        prisma.actor.upsert({ where: { name }, update: {}, create: { name } })
      )),
    ]);

    const created = await prisma.movie.create({
      data: {
        title:       movie.title,
        description: movie.description,
        price:       movie.price,
        stock:       movie.stock,
        runtime:     movie.runtime,
        releaseDate: movie.releaseDate,
        imageUrl:    movie.imageUrl,
        genres:    { connect: genreRecords.map((g) => ({ id: g.id })) },
        directors: { connect: directorRecords.map((d) => ({ id: d.id })) },
        actors:    { connect: actorRecords.map((a) => ({ id: a.id })) },
      },
    });

    revalidatePath("/admin-dashboard/admin/movies");
    revalidatePath("/movies");
    revalidatePath("/");
    return actionSuccess({ id: created.id, title: created.title });
  } catch (err: unknown) { 
      if(err instanceof(Error)) {
        console.error("Import error:", err);
        return actionError(err.message ?? "Import failed");
      }

      else {
        return actionError(`Unknown err: ${err}`);
      }
    } 
}

// ── Bulk import selected movies ───────────────────────────────────
export async function bulkImportFromTmdb(
  tmdbIds: number[],
  priceOre: number
) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  if (tmdbIds.length === 0)  return actionError("No movies selected");

  const results: { tmdbId: number; title: string; ok: boolean; error?: string }[] = [];

  for (const tmdbId of tmdbIds) {
    const result = await importFromTmdb(tmdbId, priceOre);
    if (result?.success) {
      results.push({ tmdbId, title: result?.data.title, ok: true });
    } else {
      results.push({ tmdbId, title: `ID ${tmdbId}`, ok: false, error: result?.error });
    }
    await new Promise((r) => setTimeout(r, 300)); // rate limit safety
  }

  return actionSuccess(results);
}
