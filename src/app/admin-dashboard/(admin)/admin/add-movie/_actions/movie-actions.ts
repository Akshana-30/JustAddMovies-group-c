"use server";

import z from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CAPS, capError } from "@/lib/caps";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.role === "ADMIN" ? session : null;
}

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
  genres: z.array(z.string()),
  directors: z.array(z.string()),
  actors: z.array(z.string()),
});

type AddMovieValues = z.infer<typeof addMovieSchema>;

//adds movie with parsed data to database

export async function addMovie(values: AddMovieValues) {
  if (!await requireAdmin()) return { error: "Unauthorized", movieId: null };

  const data = addMovieSchema.parse(values);

  const movieCap = await capError(() => prisma.movie.count(), CAPS.movies, "movies");
  if (movieCap) return { error: movieCap, movieId: null };

  const genreCap = await capError(() => prisma.genre.count(), CAPS.genres, "genres");
  if (genreCap) return { error: genreCap, movieId: null };

  const directorCap = await capError(() => prisma.director.count(), CAPS.directors, "directors");
  if (directorCap) return { error: directorCap, movieId: null };

  const actorCap = await capError(() => prisma.actor.count(), CAPS.actors, "actors");
  if (actorCap) return { error: actorCap, movieId: null };

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
          connectOrCreate: data.genres.map((genre) => ({
            where: { name: genre },
            create: { name: genre },
          })),
        },
        directors: {
          connectOrCreate: data.directors.map((director) => ({
            where: { name: director },
            create: { name: director },
          })),
        },
        actors: {
          connectOrCreate: data.actors.map((actor) => ({
            where: { name: actor },
            create: { name: actor },
          })),
        },
      },
    });
    return { error: null, movieId: newMovie.id };
  } catch {
    return { error: "Uknown error occurred", movieId: null };
  }
}
