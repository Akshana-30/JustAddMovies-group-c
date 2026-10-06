"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.role === "ADMIN" ? session : null;
}

//Soft delete, adds a date to deletedAt

export async function deleteMovie(id: string) {
  if (!await requireAdmin()) throw new Error("Unauthorized");
  await prisma.movie.update({ where: { id }, data: { deletedAt: new Date() } });
}

//Removes soft delete, sets deletedAt to null

export async function restoreMovie(id: string){
  if (!await requireAdmin()) throw new Error("Unauthorized");
  await prisma.movie.update({ where: { id }, data: { deletedAt: null } });
}
