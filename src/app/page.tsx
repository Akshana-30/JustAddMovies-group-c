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

import { Suspense } from "react";
import { EmailApprovedToast } from "@/components/auth/email-approved-toast";

import MovieCardWithHover from "@/components/body/movie-card-with-hover";
import { GenreCard } from "@/components/body/genre-card";
import { Card } from "@/components/ui/card";

async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const latestMovie = await prisma.movie.findMany({
    take: 10,
    orderBy: { releaseDate: "desc" },
    include: {
      genres: { select: { name: true } },
      actors: { select: { name: true } },
      directors: { select: { name: true } },
    },
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
      <div className=" flex justify-between gap-4 w-full max-md:flex-col pb-5">
        <div className="lg:w-[85%] max-lg: w-full">
          <Carousel className="w-full border-amber-300/50 border rounded-2xl">
            <CarouselContent>
              {latestMovie.map((latest) => (
                <CarouselItem key={latest.id}>
                  <MovBanner
                    imageUrl={latest.imageUrl}
                    className="relative p-0"
                  >
                    <div className=" bg-linear-to-r from-black via-black/10 to-transparent rounded-3xl h-150">
                      <div className="pt-100 p-10 flex text-left flex-col max-w-150">
                        <h1 className="text-4xl text-white font-bold z-10">
                          {latest.title}
                        </h1>
                        <br />
                        <p className="text-white/70">
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
          
            <Card  className="border-amber-300/50 border flex-row! flex-wrap content-start gap-2 p-2 overflow-y-auto bg-primary/20 h-150 max-md:h-25">
{genres.map((genre)=>( 
 <GenreCard key= {genre.id} name = {genre.name}></GenreCard>
 ))}
 </Card>

        </div>
        
      </div>
      <Suspense>
        <EmailApprovedToast />
      </Suspense>

      {/* top ten newest */}
      <div className="max-w-[98%] rounded-4xl m-auto  p-5 gap-4 bg-secondary-foreground/7">

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="max-w-full px-15"
        >
          <h1 className="px-5 pt-2 text-2xl">New Releases </h1>
          <CarouselContent className="h-90 ">
            {latestMovie.map((movies) => (
              <CarouselItem
                key={movies.id}
                className="my-auto basis-3/5 lg:basis-1/5 "
              >
                <div className="p-0">
                  <div key={movies.id} className="flex justify-evenly gap-0">
                    <MovieCardWithHover
                      imageUrl={movies.imageUrl}
                      description={movies.description}
                      genres={movies.genres}
                      title={movies.title}
                      id={movies.id}
                    ></MovieCardWithHover>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            size="icon-lg"
            className="absolute left-4 top-55 z-10"
          />
          <CarouselNext
            size="icon-lg"
            className="absolute right-5
           top-55 "
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
                    <MovieCardWithHover
                      imageUrl={movies.imageUrl}
                      description={movies.description}
                      genres={movies.genres}
                      title={movies.title}
                      id={movies.id}
                    ></MovieCardWithHover>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            size="icon-lg"
            className="absolute left-4 top-55  z-10"
          />
          <CarouselNext
            size="icon-lg"
            className="absolute right-5
           top-55  "
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
                className="my-auto basis-1/2 lg:basis-1/5 "
              >
                <div className="p-0">
                  <div key={movies.id} className="flex justify-evenly gap-0">
                    <MovieCardWithHover
                      imageUrl={movies.imageUrl}
                      description={movies.description}
                      genres={movies.genres}
                      title={movies.title}
                      id={movies.id}
                    ></MovieCardWithHover>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            size="icon-lg"
            className="absolute left-4 top-55 z-10"
          />
          <CarouselNext
            size="icon-lg"
            className="absolute right-5
           top-55  "
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
                    <MovieCardWithHover
                      imageUrl={movies.imageUrl}
                      description={movies.description}
                      genres={movies.genres}
                      title={movies.title}
                      id={movies.id}
                    ></MovieCardWithHover>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            size="icon-lg"
            className="absolute left-4 top-55  z-10"
          />
          <CarouselNext
            size="icon-lg"
            className="absolute right-5
           top-55 "
          />
        </Carousel>
      </div>
    </div>
  );
}

export default LandingPage;
