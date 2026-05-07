// src/app/admin-dashboard/_actions/movie-actions.ts
// Replaces/extends existing movie-actions.ts
// Adds createMovie, updateMovie, deleteMovie
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { actionError, actionSuccess } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

// ── Auth guard ───────────────────────────────────────
async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  if ((session.user as any).role !== "ADMIN") return null;
  return session;
}

// ── Movie input schema ───────────────────────────────
const movieSchema = z.object({
  title:       z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price:       z.number().int().positive("Price must be positive"),
  stock:       z.number().int().min(0, "Stock cannot be negative"),
  runtime:     z.number().int().positive("Runtime must be positive"),
  releaseDate: z.string().min(1, "Release date is required"),
  imageUrl:    z.string().optional(),
  genreIds:    z.array(z.string()).optional(),
});

// ── Create ───────────────────────────────────────────
export async function createMovie(input: unknown) {
  if (!await requireAdmin()) return actionError("Unauthorized");

  const parsed = movieSchema.safeParse(input);
  if (!parsed.success) return actionError(parsed.error.issues[0].message);

  const { genreIds, releaseDate, imageUrl, ...data } = parsed.data;
  try {
    const movie = await prisma.movie.create({
      data: {
        ...data,
        imageUrl:    imageUrl ?? "",
        releaseDate: new Date(releaseDate),
        genres: genreIds?.length
          ? { connect: genreIds.map((id) => ({ id })) }
          : undefined,
      },
    });
    revalidatePath("/admin-dashboard/admin/movies");
    revalidatePath("/movies");
    revalidatePath("/");
    return actionSuccess({ id: movie.id });
  } catch (err) {
    console.error(err);
    return actionError("Failed to create movie");
  }
}

// ── Update ───────────────────────────────────────────
export async function updateMovie(id: string, input: unknown) {
  if (!await requireAdmin()) return actionError("Unauthorized");

  const parsed = movieSchema.safeParse(input);
  if (!parsed.success) return actionError(parsed.error.issues[0].message);

  const { genreIds, releaseDate, imageUrl, ...data } = parsed.data;
  try {
    // Get current genres to diff
    const current = await prisma.movie.findUnique({ where: { id }, include: { genres: true } });
    const currentIds = current?.genres.map((g) => g.id) ?? [];
    const newIds     = genreIds ?? [];
    const toConnect  = newIds.filter((gid) => !currentIds.includes(gid));
    const toDisconnect = currentIds.filter((gid) => !newIds.includes(gid));

    await prisma.movie.update({
      where: { id },
      data: {
        ...data,
        imageUrl:    imageUrl ?? "",
        releaseDate: new Date(releaseDate),
        genres: {
          connect:    toConnect.map((gid) => ({ id: gid })),
          disconnect: toDisconnect.map((gid) => ({ id: gid })),
        },
      },
    });
    revalidatePath("/admin-dashboard/admin/movies");
    revalidatePath(`/movies/${id}`);
    revalidatePath("/movies");
    revalidatePath("/");
    return actionSuccess({ id });
  } catch (err) {
    console.error(err);
    return actionError("Failed to update movie");
  }
}

// ── Soft Delete ──────────────────────────────────────
export async function deleteMovie(id: string) {
  if (!await requireAdmin()) return actionError("Unauthorized");

  try {
    await prisma.movie.update({ where: { id }, data: { deletedAt: new Date() } });
    revalidatePath("/admin-dashboard/admin/movies");
    revalidatePath("/movies");
    revalidatePath("/");
    return actionSuccess({ ok: true });
  } catch (err) {
    console.error(err);
    return actionError("Failed to delete movie");
  }
}

// ── Restore ──────────────────────────────────────────
export async function restoreMovie(id: string) {
  if (!await requireAdmin()) return actionError("Unauthorized");

  try {
    await prisma.movie.update({ where: { id }, data: { deletedAt: null } });
    revalidatePath("/admin-dashboard/admin/movies");
    revalidatePath("/movies");
    return actionSuccess({ ok: true });
  } catch (err) {
    console.error(err);
    return actionError("Failed to restore movie");
  }
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
  const notDeleted = { deletedAt: null };
  const [popular, recent, oldest, cheapest] = await Promise.all([
    prisma.movie.findMany({ where: notDeleted, take:5, orderBy:{ orderItem:{ _count:"desc" } }, include:{ genres:true, directors:true, actors:true } }),
    prisma.movie.findMany({ where: notDeleted, take:5, orderBy:{ releaseDate:"desc" },           include:{ genres:true, directors:true, actors:true } }),
    prisma.movie.findMany({ where: notDeleted, take:5, orderBy:{ releaseDate:"asc" },            include:{ genres:true, directors:true, actors:true } }),
    prisma.movie.findMany({ where: notDeleted, take:5, orderBy:{ price:"asc" },                  include:{ genres:true, directors:true, actors:true } }),
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
    deletedAt: null,
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
