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
import BannerCarousel from "@/components/body/banner-carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowBigRight } from "lucide-react";

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
    description: true,
    imageUrl: true,
    genres: { select: { name: true } },
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
https://github.com/gr-26-18/JustAddMovies-group-c/pull/72/conflict?name=src%252Fapp%252Fpage.tsx&ancestor_oid=03615b2dacd14f762a8e8fcda30cb9bccba1952b&base_oid=c788658e8d8a07f68a5b2c9ba08970a9c9ed8bff&head_oid=1933f454572b29c9acb31ea1520f663350e116f9
  if (!latestMovie) {
    notFound();
  }

  return (
    <div className="pt-2 overflow-hidden p-4 sm:p-6 md:p-8">
      <div className="flex justify-between gap-4 w-full flex-col lg:flex-row pb-5">
        {/* Banner Carousel */}
        <div className="w-full lg:w-[85%]">
    <div className="pt-2 p-8">
      <div className=" flex justify-between gap-4 w-full max-md:flex-col pb-5">
        <div className="lg:w-[85%] max-lg: w-full">
          <BannerCarousel>
            {latestMovie.map((latest) => (
              <CarouselItem key={latest.id}>
                <MovBanner imageUrl={latest.imageUrl} className="relative p-0">
                  <div className="bg-linear-to-r from-black via-black/10 to-transparent rounded-3xl h-150">
                    <div className="pt-82 lg:pt-94 p-4 sm:p-6 md:p-10 flex text-left flex-col max-w-xs sm:max-w-sm md:max-w-150">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold z-10">
                        {latest.title}
                      </h1>
                      <br />
                      <p className="text-white/70 text-sm sm:text-base hidden sm:block">
                        {latest.description.split(" ").slice(0, 15).join(" ") +
                          ".."}
                      </p>
                      <br />
                      <Button asChild className="cursor-pointer w-20">
                        <Link href={`/movies/${latest.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </MovBanner>
              </CarouselItem>
            ))}
          </BannerCarousel>
        </div>

        {/* Genre Card Panel */}
        <div className="w-full lg:w-[40%]">
          <Card className="border-amber-300/50 border flex-row! flex-wrap content-start gap-2 p-2 overflow-y-auto bg-primary/20 h-24 sm:h-32 md:h-40 lg:h-150">
            {genres.map((genre) => (
              <GenreCard key={genre.id} name={genre.name}></GenreCard>
            ))}
        <div className="lg:w-[40%] max-lg:w-full sticky top-4 self-start">
          <Card className="border-amber-300/50 border p-2 overflow-y-auto bg-primary/20 h-150 max-md:h-25">
            <div className="grid grid-cols-2 gap-2 w-full">
              {genres.map((genre) => (
                <GenreCard key={genre.id} id={genre.id} name={genre.name} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Suspense>
        <EmailApprovedToast />
      </Suspense>

      {/* Carousels Section */}
      <div className="max-w-[98%] rounded-4xl m-auto p-3 sm:p-5 gap-4 bg-secondary-foreground/7">
        {/* New Releases */}
      {/* top ten newest */}
      <div className="max-w-[98%] rounded-4xl m-auto p-5 gap-4 bg-secondary-foreground/7 overflow-hidden">
        <Carousel
          opts={{ align: "start", loop: true }}
          className="max-w-full px-8 sm:px-12 md:px-15"
        >
          <h1 className="px-5 pt-2 text-xl sm:text-2xl">
            New Releases
            <Button
              variant="ghost"
              className="hover:bg-blue-200/10!"
              size="icon-lg"
            >
               <ArrowBigRight />
            </Button>
          </h1>
          <CarouselContent className="h-70 sm:h-80 md:h-90">
            {latestMovie.map((movies) => (
              <CarouselItem
                key={movies.id}
                className="my-auto basis-full sm:basis-1/2 lg:basis-1/4 xl:basis-1/5"
              >
                <div className="p-0">
                  <div className="flex justify-evenly gap-0">
                    <MovieCardWithHover
                      imageUrl={movies.imageUrl}
                      description={movies.description}
                      genres={movies.genres}
                      title={movies.title}
                      id={movies.id}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            size="icon-lg"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10"
          />
          <CarouselNext
            size="icon-lg"
            className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2"
          />
        </Carousel>

        {/* Crowd Favorites */}
        <Carousel
          opts={{ align: "start", loop: true }}
          className="max-w-full px-8 sm:px-12 md:px-15"
        >
          <h1 className="px-5 pt-2 text-xl sm:text-2xl">Crowd Favorites</h1>
          <CarouselContent className="h-70 sm:h-80 md:h-90">
            {mostPurchased.map((movies) => (
              <CarouselItem
                key={movies.id}
                className="my-auto basis-full sm:basis-1/2 lg:basis-1/4 xl:basis-1/5"
              >
                <div className="p-0">
                  <div className="flex justify-evenly gap-0">
                    <MovieCardWithHover
                      imageUrl={movies.imageUrl}
                      description={movies.description}
                      genres={movies.genres}
                      title={movies.title}
                      id={movies.id}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            size="icon-lg"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10"
          />
          <CarouselNext
            size="icon-lg"
            className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2"
          />
        </Carousel>

        {/* Timeless Classics */}
        <Carousel
          opts={{ align: "start", loop: true }}
          className="max-w-full px-8 sm:px-12 md:px-15"
        >
          <h1 className="px-5 pt-2 text-xl sm:text-2xl">Timeless Classics</h1>
          <CarouselContent className="h-70 sm:h-80 md:h-90">
            {oldMovies.map((movies) => (
              <CarouselItem
                key={movies.id}
                className="my-auto basis-full sm:basis-1/2 lg:basis-1/4 xl:basis-1/5"
              >
                <div className="p-0">
                  <div className="flex justify-evenly gap-0">
                    <MovieCardWithHover
                      imageUrl={movies.imageUrl}
                      description={movies.description}
                      genres={movies.genres}
                      title={movies.title}
                      id={movies.id}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            size="icon-lg"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10"
          />
          <CarouselNext
            size="icon-lg"
            className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2"
          />
        </Carousel>

        {/* Happy Wallet */}
        <Carousel
          opts={{ align: "start", loop: true }}
          className="max-w-full px-8 sm:px-12 md:px-15"
        >
          <h1 className="px-5 pt-2 text-xl sm:text-2xl">Happy Wallet</h1>
          <CarouselContent className="h-70 sm:h-80 md:h-90">
            {cheapestMovies.map((movies) => (
              <CarouselItem
                key={movies.id}
                className="my-auto basis-full sm:basis-1/2 lg:basis-1/4 xl:basis-1/5"
              >
                <div className="p-0">
                  <div className="flex justify-evenly gap-0">
                    <MovieCardWithHover
                      imageUrl={movies.imageUrl}
                      description={movies.description}
                      genres={movies.genres}
                      title={movies.title}
                      id={movies.id}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            size="icon-lg"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10"
          />
          <CarouselNext
            size="icon-lg"
            className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2"
          />
        </Carousel>
      </div>
    </div>
  );
}

export default LandingPage;
