
import MovieCard from "@/components/body/movie-card";
import prisma from "@/lib/prisma";

export default async function MoviesPage() {
  const movies = await prisma.movie.findMany({
    include: { genres: { select: { name: true, id: true } } },
  });
  return (
    <div >
      <div className=" max-w-[90%] rounded-4xl m-auto grid grid-cols-5  pt-20 p-20 gap-4 bg-secondary-foreground/10">
       
        {movies.map((movie) => (
          <div className="pb-10" key={movie.id}>
            <MovieCard
              imageUrl={movie.imageUrl}
              genres={movie.genres}
              title={movie.title}
              id={movie.id}
              price={movie.price}
              stock = {movie.stock}
            ></MovieCard>
          </div>
        ))}
      </div>
    </div>
  );
}
