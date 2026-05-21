import FilterButton from "@/components/body/filter-button";
import MovieCard from "@/components/body/movie-card";
import { GenreCard } from "@/components/body/genre-card";
import prisma from "@/lib/prisma";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
            : sort === "Ö-A"
              ? { title: "desc" as const }
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
                {
                  actors: {
                    some: { name: { contains: title, mode: "insensitive" } },
                  },
                },
                {
                  directors: {
                    some: { name: { contains: title, mode: "insensitive" } },
                  },
                },
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
    <SidebarProvider className=" bg-background!">
      <div
        className="flex flex-col w-full h-full"
      >
        <div className="flex flex-1 pl-5 overflow-hidden ">

          {/* Left column: filter bar + movies */}
          <div className="flex flex-col flex-1 overflow-hidden">

            {/* Filter bar */}
            <div className="relative flex items-center  py-3 px-8 shrink-0 bg-background/80 backdrop-blur-sm border-b border-border/30">
              <div className="absolute md:left-1/2 md:-translate-x-1/2">
                <FilterButton />
              </div>
              <div className="ml-auto">
                <SidebarTrigger className="border-(--gold)/50 hover:border-(--gold) border-2 text-(--gold)/80 hover:text-(--gold) hover:bg-(--gold)/15" />
              </div>
            </div>

            {/* Movie grid */}
            <div className="flex-1 overflow-y-auto py-6 pr-2">
              <div className="grid max-[425]:grid-cols-1! max-[630]:grid-cols-2! max-[765]:grid-cols-3! max-[940px]:grid-cols-2 max-[1150px]:grid-cols-3 max-[1500px]:grid-cols-4  max-[1800px]:grid-cols-5 min-[1800px]:grid-cols-6 gap-8 items-start">
                {movies.map((movie) => (
                  <div className="pb-5 h-full" key={movie.id}>
                    <MovieCard
                      imageUrl={movie.imageUrl}
                      id={movie.id}
                      genres={movie.genres}
                      title={movie.title}
                      price={movie.price}
                      stock={movie.stock}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <Sidebar
            side="right"
            variant="sidebar"
            collapsible="offcanvas"
            className="pt-25 rounded-tl-2xl!"
          >
            <SidebarHeader className="h-14 justify-center border-b border-border px-4 bg-background">
              <p className="text-md font-semibold tracking-widest text-(--gold) ">
                GENRES
              </p>
            </SidebarHeader>
            <SidebarContent className="bg-background">
              <ScrollArea className="h-full">
                <SidebarMenu className="flex flex-row! flex-wrap gap-2 p-2">
                  {genres.map((genre) => (
                    <SidebarMenuItem key={genre.id}>
                      <GenreCard id={genre.id} name={genre.name} />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </ScrollArea>
            </SidebarContent>
          </Sidebar>

        </div>
      </div>
    </SidebarProvider>
  );
}