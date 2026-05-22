"use server";

import prisma from "@/lib/prisma";

//Soft delete, adds a date to deletedAt

export async function deleteMovie(id: string) {
  await prisma.movie.update({ where: { id }, data: { deletedAt: new Date() } });
}

//Removes soft delete, sets deletedAt to null

export async function restoreMovie(id: string){
  await prisma.movie.update({ where: { id }, data: { deletedAt: null } });
}
