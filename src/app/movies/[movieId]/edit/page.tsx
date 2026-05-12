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
      directors: { select: { name: true } },
      actors: { select: { name: true } },
    },
  });

  if (!movie) {
    return notFound();
  }
  const editMovie = {
    ...movie,
    genres: movie.genres.map((g) => g.name),
    directors: movie.directors.map((d) => d.name),
    actors: movie.actors.map((a) => a.name),
  };
  return (
    <div>
      <EditMovieForm movie={editMovie} />
    </div>
  );
}
