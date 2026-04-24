"use server";

import z from "zod";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

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

type AddMovieValues = z.infer<typeof addMovieSchema>

export async function addMovie(values: AddMovieValues){
    const data = addMovieSchema.parse(values)

    const newMovie = await prisma.movie.create({
        data: {
            title: data.title,
            description: data.description,
            price: data.price,
            releaseDate: new Date(data.releaseDate),
            imageUrl: data.imageUrl,
            stock: data.stock,
            runtime: data.runtime,
                
        },
        
        
    })
    return redirect(`/movies/${newMovie.id}`)
}