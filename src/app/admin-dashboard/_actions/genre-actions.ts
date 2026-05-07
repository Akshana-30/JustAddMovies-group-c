// src/app/admin-dashboard/_actions/genre-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { actionError, actionSuccess } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (session?.user as any)?.role === "ADMIN" ? session : null;
}

export async function getGenres() {
  return prisma.genre.findMany({ orderBy: { name: "asc" } });
}

export async function createGenre(data: { name: string; description?: string }) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  try {
    const genre = await prisma.genre.create({ data: { name: data.name, description: data.description || null } });
    revalidatePath("/admin-dashboard/admin/genres");
    return actionSuccess({ id: genre.id });
  } catch { return actionError("Genre name already exists"); }
}

export async function updateGenre(id: string, data: { name: string; description?: string }) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  try {
    await prisma.genre.update({ where: { id }, data: { name: data.name, description: data.description || null } });
    revalidatePath("/admin-dashboard/admin/genres");
    return actionSuccess({ ok: true });
  } catch { return actionError("Failed to update genre"); }
}

export async function deleteGenre(id: string) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  try {
    await prisma.genre.delete({ where: { id } });
    revalidatePath("/admin-dashboard/admin/genres");
    return actionSuccess({ ok: true });
  } catch { return actionError("Cannot delete — genre is used by movies"); }
}
