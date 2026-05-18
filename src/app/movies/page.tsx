import FilterButton from "@/components/body/filter-button";
import MovieCard from "@/components/body/movie-card";
import prisma from "@/lib/prisma";
import { GenreCard } from "@/components/body/genre-card";

// inside the page function, before the return:
const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { title, genre, sort } = await searchParams;

  console.log("sort:", sort);

  const orderBy =
    sort === "Price-high to low"
      ? { price: "desc" as const }
      : sort === "Price-low to high"
        ? { price: "asc" as const }
        : sort === "Date"
          ? { releaseDate: "desc" as const }
          : sort === "A-Ö"
            ? { title: "asc" as const }
            : undefined;

  const movies =
    typeof genre === "string"
      ? await prisma.movie.findMany({
          where: {
            genres: {
              some: { name: genre },
            },
          },
          include: { genres: { select: { name: true, id: true } } },
          orderBy,
        })
      : typeof title === "string"
        ? await prisma.movie.findMany({
            where: {
              deletedAt: { equals: null },
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
            orderBy,
          })
        : await prisma.movie.findMany({
            where: { deletedAt: { equals: null } },
            include: { genres: { select: { name: true, id: true } } },
            orderBy,
          });
  return (
    <div className=" max-w-[90%] p-8 rounded-4xl m-auto bg-secondary-foreground/10">
        <div className="flex flex-col items-center gap-3 pb-6">
            <div className="flex items-center gap-2 flex-wrap justify-center">
                {genres.map((g) => (
                    <GenreCard key={g.id} id={g.id} name={g.name} />
                ))}
            </div>
            <FilterButton />
        </div>
      <div className="grid grid-cols-5 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {movies.map((movie) => (
          <div className="pb-5" key={movie.id}>
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
