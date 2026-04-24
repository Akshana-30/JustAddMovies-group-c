"use server";

import z from "zod";
import prisma from "@/lib/prisma";

const addMovieSchema = z.object({
  title: z.string().min(1).max(128),
  description: z.string().min(1).max(500),
  price: z.coerce
    .number<number>()
    .int("Price must be an integer")
    .positive("Must be positive"),
  releaseDate: z.iso.date(),
  imageUrl: z.string(),
  stock: z.coerce
    .number<number>()
    .int("Stock must be an integer")
    .positive("Must be positive"),
  runtime: z.coerce
    .number<number>()
    .int("Runtime must be an integer")
    .positive("Must be positive"),
  genres: z.string().min(3).max(20),
});

type AddMovieValues = z.infer<typeof addMovieSchema>;

export async function addMovie(values: AddMovieValues) {
  const data = addMovieSchema.parse(values);
  try {
    const newMovie = await prisma.movie.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        releaseDate: new Date(data.releaseDate),
        imageUrl: data.imageUrl,
        stock: data.stock,
        runtime: data.runtime,
        genres: {
          connectOrCreate: {
            where: { name: data.genres },
            create: { name: data.genres },
          },
        },
      },
    });
    return { error: null, movieId: newMovie.id };
  } catch {
    return { error: "Uknown error occurred", movieId: null };
  }
}
