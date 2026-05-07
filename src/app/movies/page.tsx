import MovieCard from "@/components/body/movie-card-with-hover";
import prisma from "@/lib/prisma";

export default async function MoviesPage() {
  const movies = await prisma.movie.findMany({
    include: { genres: { select: { name: true, id: true } } },
  });
  return (
    <div className="grid grid-cols-6 pt-20 p-20 gap-4">
      {movies.map((movie) => (
        <div className="pb-10" key={movie.id}>
          <MovieCard
            imageUrl={movie.imageUrl}
            description={movie.description}
            genres={movie.genres}
            title={movie.title}
            id={movie.id}
          ></MovieCard>
        </div>
      ))}
    </div>
  );
}
