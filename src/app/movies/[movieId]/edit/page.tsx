import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditMovieForm from "./_components/edit-movie-form";

export default async function EditMoviePage(
  props: PageProps<"/movies/[movieId]/edit">,
) {
  const params = await props.params;
  const movie = await prisma.movie.findUnique({
    where: { id: params.movieId },
    include: {
      genres: { select: { name: true } },
    },
  });

  if (!movie) {
    return notFound();
  }
  const testMovie = {
    ...movie,
    genres: movie.genres.map((g) => g.name),
  };
  return (
    <div>
      <h1 className="text-4xl font-bold m-4">Edit movie</h1>
      <EditMovieForm movie={testMovie} />
    </div>
  );
}
