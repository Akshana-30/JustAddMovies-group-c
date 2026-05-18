import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditMovieForm from "./_components/edit-movie-form";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function EditMoviePage(
  props: PageProps<"/movies/[movieId]/edit">,
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const isAdmin = session?.user.role === "ADMIN";
    if(!isAdmin){
      redirect("/")
    }

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
      <div className="mb-6">
          <h1 className="font-display text-3xl tracking-wide text-center" style={{ color: "var(--text)" }}>
            Edit <span style={{ color: "var(--gold)" }}>Movie</span>
          </h1>
          <p className="mt-1 font-serif italic text-center" style={{ color: "var(--text-muted)" }}>
            Edit and update movie changes
          </p>
      </div>
      <EditMovieForm movie={editMovie} />
    </div>
  );
}
