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

async function LandingPage() {
  const latestMovie = await prisma.movie.findMany({
    take: 10,
    orderBy: { releaseDate: "desc" },
    include: { genres: { select: { name: true } } },
  });

  if (!latestMovie) {
    notFound();
  }

  return (
    <div className="pt-2 overflow-hidden">
      <Carousel className="pb- m-auto">
        <CarouselContent>
          {latestMovie.map((latest) => (
            <CarouselItem key={latest.id}>
              <MovBanner imageUrl={latest.imageUrl} className="shadow-2xl">
                <h1 className=" text-4xl font-bold p-5 min-h-200">
                  {latest.title}
                  
                </h1>
              </MovBanner>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant="outline" className="absolute left-4 top-1/2 -translate-y-1/2 z-10"/>
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10"/>
      </Carousel>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="max-w-full   "
      >
         <h1>Latest movies</h1>
        <CarouselContent className="h-100">
          
          {latestMovie.map((movies) => (
            <CarouselItem key={movies.id} className="my-auto basis-1/2 lg:basis-1/6">
              <div className="p-0">
                <div key={movies.id} className="flex justify-evenly gap-0">
                  <MovieCard imageUrl={movies.imageUrl}>
                    <Image
                      src={movies.imageUrl}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt="image"
                      className="mx-auto"
                    />
                  </MovieCard>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant="outline" className="absolute left-4 top-1/2 -translate-y-1/2 z-10"/>
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10"/>
      </Carousel>
    </div>
  );
}

export default LandingPage;
