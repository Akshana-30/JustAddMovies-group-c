
import FilterButton from "@/components/body/filter-button";
import MovieCard from "@/components/body/movie-card";
import prisma from "@/lib/prisma";


export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { title } = await searchParams;
  const { genre } = await searchParams;
  const {filter} = await searchParams;
  const movies =
    typeof genre === "string"
      ? await prisma.movie.findMany({
          where: {
            genres: {
              some: { name: genre },
            },
          },
          include: { genres: { select: { name: true, id: true } } },
        })
      : typeof title === "string"
      ? await prisma.movie.findMany({
          where: {
            OR: [
              { title: { contains: title, mode: "insensitive" } },
              {
                actors: {
                  some: { name: { contains: title, mode: "insensitive" } },
                },
              },
            ],
          },
          include: { genres: { select: { name: true, id: true } } },
        })
      : typeof filter === "string" 
      ?await prisma.movie.findMany({
          include: { genres: { select: { name: true, id: true } } },
        })
        :await prisma.movie.findMany({
          include: { genres: { select: { name: true, id: true } } },
        })
  return (
    <div className=" max-w-[90%] p-8 rounded-4xl m-auto bg-secondary-foreground/10">
      
      <div className="flex justify-end pb-15"><FilterButton></FilterButton></div>
      <div className="grid grid-cols-5 gap-8 ">
      
        {movies.map((movie) => (
          <div className="pb-10" key={movie.id}>
            <MovieCard
              imageUrl={movie.imageUrl}
              genres={movie.genres}
              title={movie.title}
              id={movie.id}
              price={movie.price}
              stock={movie.stock}
            ></MovieCard>
          </div>
        ))}
      </div>
    </div>
  );
}
