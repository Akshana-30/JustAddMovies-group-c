"use server";

import prisma from "@/lib/prisma";
import z from "zod";

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

export async function editMovie(id: string, input: FormValues) {
  const data = formSchema.parse(input);
  const existing = await prisma.movie.findUnique({
    where: { id: id },
    include: { genres: true },
  });
  const existingGenres = existing?.genres.map((g) => g.name);
  const newGenres = data.genres;
  const genresToRemove = existingGenres?.filter((g) => !newGenres.includes(g));

  const editedMovie = await prisma.movie.update({
    where: { id },
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
        disconnect: genresToRemove?.map((genre) => ({
          name: genre,
        })),
      },
      directors: {
        deleteMany: {},
        connectOrCreate: data.directors.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
      actors: {
        deleteMany: {},
        connectOrCreate: data.actors.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });
  return editedMovie.id;
}
