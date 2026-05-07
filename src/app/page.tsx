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
import MovieCard from "@/components/body/movie-card-with-hover";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { EmailApprovedToast } from "@/components/auth/email-approved-toast";
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
    <div className="pt-2 overflow-hidden p-8">
      <div className=" flex justify-between gap-4 w-full max-md:flex-col ">
        <div className="lg:w-[85%] max-lg: w-full">
          <Carousel className="w-full border-amber-300/50 border rounded-2xl">
            <CarouselContent>
              {latestMovie.map((latest) => (
                <CarouselItem key={latest.id}>
                  <MovBanner
                    imageUrl={latest.imageUrl}
                    className="relative p-0"
                  >
                    <div className="bg-linear-to-r from-white via-white/10 to-transparent dark:bg-linear-to-r dark:from-black dark:via-black/10 darkto-transparent rounded-3xl h-150">
                      <div className="pt-100 p-10 flex text-left flex-col max-w-150">
                        <h1 className="text-4xl text-foreground font-bold z-10">
                          {latest.title}
                        </h1>
                        <br />
                        <p>
                          {latest.description
                            .split(" ")
                            .slice(0, 15)
                            .join(" ") + ".."}
                        </p>
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

        <div className="lg:w-[40%] max-lg: w-full ">
          <Card className="border-amber-300/50 border flex-row! flex-wrap content-start gap-2 p-2 overflow-y-auto bg-background/10 h-150 max-md:h-25">
            {genres.map((genre) => (
              <Button
                className="w-fit bg-amber-300/60 hover:bg-amber-300/70"
                key={genre.id}
              >
                {genre.name}
              </Button>
            ))}
          </Card>
        </div>
      </div>
      <Suspense>
        <EmailApprovedToast />
      </Suspense>


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
