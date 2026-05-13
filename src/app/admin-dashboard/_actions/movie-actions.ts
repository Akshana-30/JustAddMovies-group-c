// src/app/admin-dashboard/_actions/movie-actions.ts
// Replaces/extends existing movie-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { actionError, actionSuccess } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// ── Auth guard ───────────────────────────────────────
async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  if (session?.user?.role !== "ADMIN") return null;
  return session;
}


// ── Bulk price update ────────────────────────────────
export async function bulkUpdatePrice(ids: string[], price: number) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  if (!ids.length)           return actionError("No movies selected");
  if (!Number.isInteger(price) || price <= 0) return actionError("Price must be a positive whole number");

  try {
    await prisma.movie.updateMany({ where: { id: { in: ids } }, data: { price } });
    revalidatePath("/admin-dashboard/admin/movies");
    revalidatePath("/movies");
    return actionSuccess({ updated: ids.length });
  } catch (err) {
    console.error(err);
    return actionError("Failed to update prices");
  }
}

// ── Read helpers ─────────────────────────────────────
export async function getTopMovies() {
  const [popular, recent, oldest, cheapest] = await Promise.all([
    prisma.movie.findMany({ take:5, orderBy:{ orderItem:{ _count:"desc" } }, include:{ genres:true, directors:true, actors:true } }),
    prisma.movie.findMany({ take:5, orderBy:{ releaseDate:"desc" },            include:{ genres:true, directors:true, actors:true } }),
    prisma.movie.findMany({ take:5, orderBy:{ releaseDate:"asc" },             include:{ genres:true, directors:true, actors:true } }),
    prisma.movie.findMany({ take:5, orderBy:{ price:"asc" },                   include:{ genres:true, directors:true, actors:true } }),
  ]);
  return { popular, recent, oldest, cheapest };
}

export async function getMovies(rawFilter?: Record<string, string>) {
  const q          = rawFilter?.q ?? "";
  const genreId    = rawFilter?.genreId ?? "";
  const directorId = rawFilter?.directorId ?? "";
  const sort       = rawFilter?.sort ?? "title";
  const page       = Math.max(1, Number(rawFilter?.page ?? 1));
  const limit      = 20;

  const where = {
    ...(q        && { title:     { contains: q, mode: "insensitive" as const } }),
    ...(genreId  && { genres:    { some: { id: genreId } } }),
    ...(directorId && { directors: { some: { id: directorId } } }),
  };

  const orderBy =
    sort === "price-asc"  ? { price: "asc"  as const } :
    sort === "price-desc" ? { price: "desc" as const } :
    sort === "year-desc"  ? { releaseDate: "desc" as const } :
    sort === "year-asc"   ? { releaseDate: "asc"  as const } :
                            { title: "asc" as const };

  const [movies, total] = await Promise.all([
    prisma.movie.findMany({ where, orderBy, skip:(page-1)*limit, take:limit, include:{ genres:true, directors:true, actors:true } }),
    prisma.movie.count({ where }),
  ]);
  return { movies, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function getMovieById(id: string) {
  return prisma.movie.findUnique({
    where: { id },
    include: { genres:true, directors:true, actors:true, orderItem:{ select:{ quantity:true } } },
  });
}
