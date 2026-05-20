import FilterButton from "@/components/body/filter-button";
import MovieCard from "@/components/body/movie-card";
import { GenreCard } from "@/components/body/genre-card";
import { MoviePagination } from "@/components/body/movie-pagination";
import prisma from "@/lib/prisma";

const PAGE_SIZE = 15; // 3 rows × 5 columns

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { title, genre, sort, page: pageParam } = await searchParams;

  const currentPage = Math.max(1, parseInt(String(pageParam ?? "1"), 10) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const orderBy =
    sort === "Price-high to low"
      ? { price: "desc" as const }
      : sort === "Price-low to high"
        ? { price: "asc" as const }
        : sort === "Date"
          ? { releaseDate: "desc" as const }
          : sort === "A-Ö"
            ? { title: "asc" as const }
            : sort === "Ö-A"
              ? { title: "desc" as const }
              : undefined;

  // Build the shared `where` clause once so it's used for both count + findMany
  const where =
    typeof genre === "string"
      ? { genres: { some: { name: genre } } }
      : typeof title === "string"
        ? {
            deletedAt: { equals: null },
            OR: [
              { title: { contains: title, mode: "insensitive" as const } },
              { actors: { some: { name: { contains: title, mode: "insensitive" as const } } } },
            ],
          }
        : { deletedAt: { equals: null } };

  const [movies, totalCount, genres] = await Promise.all([
    prisma.movie.findMany({
      where,
      include: { genres: { select: { name: true, id: true } } },
      orderBy,
      skip,
      take: PAGE_SIZE,
    }),
    prisma.movie.count({ where }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    // calc(100vh - 6rem) = viewport minus navbar height (~96px)
    <div className="flex flex-col" style={{ height: "calc(100vh - 6rem)" }}>
      {/* Sort bar — never scrolls, always visible at top */}
      <div className="flex justify-center py-3 px-8 shrink-0 bg-background/80 backdrop-blur-sm border-b border-border/30">
        <FilterButton />
      </div>

      {/* Content row — fills remaining height, inner scroll only */}
      <div className="flex gap-6 flex-1 overflow-hidden px-8 py-6">
        {/* Movie grid + pagination — scrolls independently */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-start">
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

          {/* Pagination — below the grid, inside the scroll area */}
          <MoviePagination currentPage={currentPage} totalPages={totalPages} />
        </div>

        {/* Genre sidebar — never scrolls */}
        <div className="w-[clamp(3rem,25vw,20rem)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
            {genres.map((g) => (
              <GenreCard
                key={g.id}
                id={g.id}
                name={g.name}
                active={genre === g.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
