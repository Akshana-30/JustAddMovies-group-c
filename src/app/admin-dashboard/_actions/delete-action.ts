"use server";

import prisma from "@/lib/prisma";

export async function deleteMovie(id: string) {
  await prisma.movie.delete({
    where: { id },
  });
}
