// src/app/admin-dashboard/_actions/people-actions.ts
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

export async function createDirector(name: string) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  try {
    const d = await prisma.director.create({ data: { name } });
    revalidatePath("/admin-dashboard/admin/people");
    return actionSuccess({ id: d.id });
  } catch { return actionError("Director already exists"); }
}

export async function deleteDirector(id: string) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  try {
    await prisma.director.update({ where: { id }, data: { movies: { set: [] } } });
    await prisma.director.delete({ where: { id } });
    revalidatePath("/admin-dashboard/admin/people");
    return actionSuccess({ ok: true });
  } catch { return actionError("Failed to delete director"); }
}

export async function createActor(name: string) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  try {
    const a = await prisma.actor.create({ data: { name } });
    revalidatePath("/admin-dashboard/admin/people");
    return actionSuccess({ id: a.id });
  } catch { return actionError("Actor already exists"); }
}

export async function deleteActor(id: string) {
  if (!await requireAdmin()) return actionError("Unauthorized");
  try {
    await prisma.actor.update({ where: { id }, data: { movies: { set: [] } } });
    await prisma.actor.delete({ where: { id } });
    revalidatePath("/admin-dashboard/admin/people");
    return actionSuccess({ ok: true });
  } catch { return actionError("Failed to delete actor"); }
}
