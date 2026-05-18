import FilterButton from "@/components/body/filter-button";
import MovieCard from "@/components/body/movie-card";
import { GenreCard } from "@/components/body/genre-card";
import prisma from "@/lib/prisma";

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { title, genre, sort } = await searchParams;

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

  const [movies, genres] = await Promise.all([
    typeof genre === "string"
      ? prisma.movie.findMany({
          where: { genres: { some: { name: genre } } },
          include: { genres: { select: { name: true, id: true } } },
          orderBy,
        })
      : typeof title === "string"
        ? prisma.movie.findMany({
            where: {
              deletedAt: { equals: null },
              OR: [
                { title: { contains: title, mode: "insensitive" } },
                { actors: { some: { name: { contains: title, mode: "insensitive" } } } },
              ],
            },
            include: { genres: { select: { name: true, id: true } } },
            orderBy,
          })
        : prisma.movie.findMany({
            where: { deletedAt: { equals: null } },
            include: { genres: { select: { name: true, id: true } } },
            orderBy,
          }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    // calc(100vh - 6rem) = viewport minus navbar height (~96px)
    <div className="flex flex-col" style={{ height: "calc(100vh - 6rem)" }}>

      {/* Sort bar — never scrolls, always visible at top */}
      <div className="flex justify-center py-3 px-8 shrink-0 bg-background/80 backdrop-blur-sm border-b border-border/30">
        <FilterButton />
      </div>

      {/* Content row — fills remaining height, inner scroll only */}
      <div className="flex gap-6 flex-1 overflow-hidden px-8 py-6">

        {/* Movie grid — scrolls independently */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1 items-start">
            {movies.map((movie) => (
              <div className="pb-5 h-full" key={movie.id}>
                <MovieCard
                  imageUrl={movie.imageUrl}
                  genres={movie.genres}
                  title={movie.title}
                  id={movie.id}
                  price={movie.price}
                  stock={movie.stock}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Genre sidebar — never scrolls */}
        <div className="w-56 shrink-0">
          <div className="grid grid-cols-2 gap-2 w-full">
            {genres.map((g) => (
              <GenreCard key={g.id} id={g.id} name={g.name} active={genre === g.name} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
