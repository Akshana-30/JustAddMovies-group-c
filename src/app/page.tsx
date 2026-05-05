import MovBanner from "@/components/body/banner-card";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MovieCard from "@/components/body/movie-card";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function LandingPage() {
  const latestMovie = await prisma.movie.findMany({
    take: 10,
    orderBy: { releaseDate: "desc" },
    include: { genres: { select: { name: true } } },
  });

  const mostPurchased = await prisma.movie.findMany({
    take: 10,
    orderBy: {
      orderItem: {
        _count: "desc",
      },
    },
    select: {
      id: true,
      title: true,
      genres: true,
      actors: true,
      directors: true,
      description: true,
      imageUrl: true,
    },
  });

  const oldMovies = await prisma.movie.findMany({
    take: 10,
    orderBy: { releaseDate: "asc" },
    include: { genres: { select: { name: true } } },
  });

  const cheapestMovies = await prisma.movie.findMany({
    take: 10,
    orderBy: { price: "asc" },
    include: { genres: { select: { name: true } } },
  });
  const genres = await prisma.genre.findMany({
    select: { id: true, name: true },
  });

  if (!latestMovie) {
    notFound();
  }

  return (
    <div className="pt-2 overflow-hidden">
      <div className="flex flex-row gap-10 p-4 sticky top-0 z-0">
        <div className="">
          {/* banner carousel */}
          <Carousel className="w-304 max-w-7xl  border-amber-300/50 border rounded-2xl ">
            <CarouselContent>
              {latestMovie.map((latest) => (
                <CarouselItem key={latest.id}>
                  <MovBanner
                    imageUrl={latest.imageUrl}
                    className=" relative p-0"
                  >
                    <div className=" p-0 bg-linear-to-r from-black via-black/10 to-transparent min-h-200 rounded-3xl">
                      <div className=" pt-100 p-10 flex text-left flex-col w-100" >
                        <h1 className="text-4xl font-bold z-10">
                          {latest.title}
                        </h1><br />
                        <p>{latest.description.split(" ").slice(0, 15).join(" ") + ".."}</p>
                      </div>
                    </div>
                  </MovBanner>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              variant="outline"
              size="icon-lg"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
            />
            <CarouselNext
              size="icon-lg"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
            />
          </Carousel>
        </div>
        <div className=" m-auto w-full ">
          <Card className=" border-amber-300/50 border m-auto max-h-150 h-150 flex flex-wrap w-full bg-blue-600/10">
            {genres.map((genre) => (
              <Button variant="ghost" className="w-20" key={genre.id}>
                {genre.name}
              </Button>
            ))}
          </Card>
        </div>
      </div>

      {/* top ten newest */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="max-w-full px-15 "
      >
        <h1 className="px-5 pt-2 text-2xl">New Releases </h1>
        <CarouselContent className="h-90">
          {latestMovie.map((movies) => (
            <CarouselItem
              key={movies.id}
              className="my-auto basis-3/5 lg:basis-1/6 "
            >
              <div className="p-0">
                <div key={movies.id} className="flex justify-evenly gap-0">
                  <MovieCard
                    imageUrl={movies.imageUrl}
                    description={movies.description}
                    genres={movies.genres}
                    title={movies.title}
                    id={movies.id}
                  ></MovieCard>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="outline"
          size="icon-lg"
          className="absolute left-4 top-1/2 z-10"
        />
        <CarouselNext
          size="icon-lg"
          className="absolute right-5
           top-1/2 "
        />
      </Carousel>

      {/* most bought */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="max-w-full px-15"
      >
        <h1 className="px-5 pt-2 text-2xl">Crowd favorites </h1>
        <CarouselContent className="h-90">
          {mostPurchased.map((movies) => (
            <CarouselItem
              key={movies.id}
              className="my-auto basis-1/2 lg:basis-1/5 "
            >
              <div className="p-0">
                <div key={movies.id} className="flex justify-evenly gap-0">
                  <MovieCard
                    imageUrl={movies.imageUrl}
                    description={movies.description}
                    genres={movies.genres}
                    title={movies.title}
                    id={movies.id}
                  ></MovieCard>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="outline"
          size="icon-lg"
          className="absolute left-4 top-1/2 z-10"
        />
        <CarouselNext
          size="icon-lg"
          className="absolute right-5
           top-1/2 "
        />
      </Carousel>

      {/* old movies */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="max-w-full px-15"
      >
        <h1 className="px-5 pt-2 text-2xl">TImeless Classics </h1>
        <CarouselContent className="h-90">
          {oldMovies.map((movies) => (
            <CarouselItem
              key={movies.id}
              className="my-auto basis-1/2 lg:basis-1/6 "
            >
              <div className="p-0">
                <div key={movies.id} className="flex justify-evenly gap-0">
                  <MovieCard
                    imageUrl={movies.imageUrl}
                    description={movies.description}
                    genres={movies.genres}
                    title={movies.title}
                    id={movies.id}
                  ></MovieCard>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="outline"
          size="icon-lg"
          className="absolute left-4 top-1/2 z-10"
        />
        <CarouselNext
          size="icon-lg"
          className="absolute right-5
           top-1/2 "
        />
      </Carousel>

      {/* lowest price */}

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="max-w-full px-15"
      >
        <h1 className="px-5 pt-2 text-2xl">Happy Wallet</h1>
        <CarouselContent className="h-90">
          {cheapestMovies.map((movies) => (
            <CarouselItem
              key={movies.id}
              className="my-auto basis-1/2 lg:basis-1/5 "
            >
              <div className="p-0">
                <div key={movies.id} className="flex justify-evenly gap-0">
                  <MovieCard
                    imageUrl={movies.imageUrl}
                    description={movies.description}
                    genres={movies.genres}
                    title={movies.title}
                    id={movies.id}
                  ></MovieCard>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="outline"
          size="icon-lg"
          className="absolute left-4 top-1/2 z-10"
        />
        <CarouselNext
          size="icon-lg"
          className="absolute right-5
           top-1/2 "
        />
      </Carousel>
    </div>
  );
}

export default LandingPage;
