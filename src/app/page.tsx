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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BannerCarousel from "@/components/body/banner-carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowBigRight } from "lucide-react";
import { ActorCard } from "@/components/body/actor-buttons";

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
  const actors = await prisma.actor.findMany({
    take: 10,
    orderBy: { movies: { _count: "desc" } },
    select: { name: true, id: true },
  });

  https: if (!latestMovie) {
    notFound();
  }

  return (
    <div className="pt-2 overflow-hidden p-4 sm:p-6 md:p-8">
      <div className="flex justify-between gap-4 w-full flex-col xl:flex-row pb-5">
        {/* Banner Carousel */}
        <div className="w-full xl:w-[85%]">
          <BannerCarousel>
            {latestMovie.map((latest) => (
              <CarouselItem key={latest.id}>
                <MovBanner imageUrl={latest.imageUrl} className="relative p-0">
                  <div className="bg-linear-to-r from-black via-black/10 to-transparent rounded-3xl h-150">
                    <div className="pt-96 md:pt-90 lg:pt-94 p-4 sm:p-6 md:p-10 flex text-left flex-col max-w-xs sm:max-w-sm md:max-w-150">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold z-10">
                        {latest.title}
                      </h1>
                      <br />
                      <p className="text-white/70 text-sm sm:text-base hidden sm:block">
                        {latest.description.split(" ").slice(0, 15).join(" ") +
                          "..."}
                      </p>
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
        <div className="max-md:hidden w-full xl:w-[40%] sticky top-4 self-start">
          <Card className="mr-1.5 border-amber-300/50 hover:border-(--gold)/70 border bg-sidebar-accent/50! overflow-y-auto h-50 xl:h-150 ">
            <div className="flex flex-row xl:flex-col! ">
              <div>
                <CardHeader className="text-(--gold) pb-0! border-b border-(--gold)/30 dark:text-(--gold)/80 text-lg font-semibold font-lg">
                  {" "}
                  GENRES{" "}
                </CardHeader>
                <CardContent className="flex flex-row! pt-1 pb-5 flex-wrap content-start gap-2 overflow-y-auto">
                  {genres.map((genre) => (
                    <GenreCard key={genre.id} id={genre.id} name={genre.name} />
                  ))}
                </CardContent>
              </div>
              <div>
                <CardHeader className=" rounded-t-none! pb-0! border-b border-(--gold)/30 text-(--gold) dark:text-(--gold)/80 text-lg font-semibold font-lg">
                  POPULAR ACTORS{" "}
                </CardHeader>
                <CardContent className="flex flex-row! pt-1 flex-wrap content-start gap-2 overflow-y-auto">
                  {actors.map((actor) => (
                    <ActorCard key={actor.id} id={actor.id} name={actor.name} />
                  ))}
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Suspense>
        <EmailApprovedToast />
      </Suspense>

      {/* Carousels Section */}
      <div className="max-w-[98%] rounded-4xl m-auto py-5 gap-4 bg-secondary-foreground/7 overflow-hidden">
        {/* New Releases */}
        {/* top ten newest */}
        <Carousel
          opts={{ align: "start", loop: true }}
          className="max-w-full px-8 sm:px-12 md:px-15"
        >
          <Link href="http://localhost:3000/movies?sort=New+to+old">
            <h1 className="px-5 pt-2 text-xl sm:text-2xl">
              New Releases
              <Button
                variant="ghost"
                className="hover:bg-blue-200/10! cursor-pointer"
                size="icon-lg"
              >
                <ArrowBigRight />
              </Button>
            </h1>
          </Link>
          <CarouselContent className="  pt-10 sm:pt-4 pb-10 sm:pb-4 h-[clamp(12rem,20vw,40rem)]! -ml-2 md:-ml-4">
            {latestMovie.map((movies) => (
              <CarouselItem
                key={movies.id}
                className=" box-border my-auto basis-1/6 max-[550px]:basis-1/5 max-[450px]:basis-1/3 md:basis-1/7 pl-3 md:pl-4 xl:pl-10"
              >
                <div className="">
                  <MovieCardWithHover
                    imageUrl={movies.imageUrl}
                    description={movies.description}
                    genres={movies.genres}
                    title={movies.title}
                    id={movies.id}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            size="icon-lg"
            className="absolute left-0 top-[calc(((clamp(12rem,20vw,40rem)/2)+2.5rem))] max:md:top-[calc(((clamp(12rem,20vw,40rem)/2)+ 3rem))] -translate-y-1/2 z-10"
          />
          <CarouselNext
            size="icon-lg"
            className="absolute right-0 top-[calc(((clamp(12rem,20vw,40rem)/2)+2.5rem))] -translate-y-1/2"
          />
        </Carousel>

        {/* Crowd Favorites */}
        <Carousel
          opts={{ align: "start", loop: true }}
          className="max-w-full px-8 sm:px-12 md:px-15"
        >
          <Link href="http://localhost:3000/movies?sort=Popularity">
            <h1 className="px-5 pt-2 text-xl sm:text-2xl">
              Crowd Favorites
              <Button
                variant="ghost"
                className="hover:bg-blue-200/10! cursor-pointer"
                size="icon-lg"
              >
                <ArrowBigRight />
              </Button>
            </h1>
          </Link>

          <CarouselContent className="  pt-10 sm:pt-4 pb-10 sm:pb-4 h-[clamp(12rem,20vw,40rem)]! -ml-2 md:-ml-4">
            {mostPurchased.map((movies) => (
              <CarouselItem
                key={movies.id}
                className=" box-border my-auto basis-1/6 max-[550px]:basis-1/5 max-[450px]:basis-1/3 md:basis-1/7 pl-3 md:pl-4 xl:pl-10"
              >
                <div className="">
                  <MovieCardWithHover
                    imageUrl={movies.imageUrl}
                    description={movies.description}
                    genres={movies.genres}
                    title={movies.title}
                    id={movies.id}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            size="icon-lg"
            className="absolute left-0 top-[calc(((clamp(12rem,20vw,40rem)/2)+2.5rem))] max:md:top-[calc(((clamp(12rem,20vw,40rem)/2)+ 3rem))] -translate-y-1/2 z-10"
          />
          <CarouselNext
            size="icon-lg"
            className="absolute right-0 top-[calc(((clamp(12rem,20vw,40rem)/2)+2.5rem))] -translate-y-1/2"
          />
        </Carousel>

        <Carousel
          opts={{ align: "start", loop: true }}
          className="max-w-full px-8 sm:px-12 md:px-15"
        >
          <Link href="http://localhost:3000/movies?sort=Old+to+new">
            <h1 className="px-5 pt-2 text-xl sm:text-2xl">
              Timeless Classics
              <Button
                variant="ghost"
                className="hover:bg-blue-200/10! cursor-pointer"
                size="icon-lg"
              >
                <ArrowBigRight />
              </Button>
            </h1>
          </Link>

          <CarouselContent className="  pt-10 sm:pt-4 pb-10 sm:pb-4 h-[clamp(12rem,20vw,40rem)]! -ml-2 md:-ml-4">
            {oldMovies.map((movies) => (
              <CarouselItem
                key={movies.id}
                className=" box-border my-auto basis-1/6 max-[550px]:basis-1/5 max-[450px]:basis-1/3 md:basis-1/7 pl-3 md:pl-4 xl:pl-10"
              >
                <div className="">
                  <MovieCardWithHover
                    imageUrl={movies.imageUrl}
                    description={movies.description}
                    genres={movies.genres}
                    title={movies.title}
                    id={movies.id}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            size="icon-lg"
            className="absolute left-0 top-[calc(((clamp(12rem,20vw,40rem)/2)+2.5rem))] max:md:top-[calc(((clamp(12rem,20vw,40rem)/2)+ 3rem))] -translate-y-1/2 z-10"
          />
          <CarouselNext
            size="icon-lg"
            className="absolute right-0 top-[calc(((clamp(12rem,20vw,40rem)/2)+2.5rem))] -translate-y-1/2"
          />
        </Carousel>

        {/* Happy Wallet */}
        <Carousel
          opts={{ align: "start", loop: true }}
          className="max-w-full px-8 sm:px-12 md:px-15"
        >
          <Link href="http://localhost:3000/movies?sort=Price-low+to+high">
            <h1 className="px-5 pt-2 text-xl sm:text-2xl">
              Happy Wallet
              <Button
                variant="ghost"
                className="hover:bg-blue-200/10! cursor-pointer"
                size="icon-lg"
              >
                <ArrowBigRight />
              </Button>
            </h1>
          </Link>

          <CarouselContent className="pt-10 sm:pt-4 pb-10 sm:pb-4 h-[clamp(12rem,20vw,40rem)]! -ml-2 md:-ml-4">
            {cheapestMovies.map((movies) => (
              <CarouselItem
                key={movies.id}
                className=" box-border my-auto basis-1/6 max-[550px]:basis-1/5 max-[450px]:basis-1/3 md:basis-1/7 pl-3 md:pl-4 xl:pl-10"
              >
                <div className="">
                  <MovieCardWithHover
                    imageUrl={movies.imageUrl}
                    description={movies.description}
                    genres={movies.genres}
                    title={movies.title}
                    id={movies.id}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline"
            size="icon-lg"
            className="absolute left-0 top-[calc(((clamp(12rem,20vw,40rem)/2)+2.5rem))] max:md:top-[calc(((clamp(12rem,20vw,40rem)/2)+ 3rem))] -translate-y-1/2 z-10"
          />
          <CarouselNext
            size="icon-lg"
            className="absolute right-0 top-[calc(((clamp(12rem,20vw,40rem)/2)+2.5rem))] -translate-y-1/2"
          />
        </Carousel>
      </div>
    </div>
  );
}

export default LandingPage;
