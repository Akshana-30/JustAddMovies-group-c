"use server";

import prisma from "@/lib/prisma";

export async function deleteMovie(id: string) {
  await prisma.movie.update({ where: { id }, data: { deletedAt: new Date() } });
}

export async function restoreMovie(id: string){
  await prisma.movie.update({ where: { id }, data: { deletedAt: null } });
}
