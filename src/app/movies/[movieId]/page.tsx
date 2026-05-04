import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import MovBanner from "@/components/body/banner-card";

async function MovieDetailsPage(props: PageProps<"/movies/[movieId]">) {
  const params = await props.params;

  const movie = await prisma.movie.findUnique({
    where: { id: params.movieId },
    include: { genres: { select: { name: true, description: true } } },
  });

  if (!movie) {
    notFound();
  }

  return (
    <div className="pt-4">
      <MovBanner imageUrl={movie.imageUrl} className="">
        <div className="lg:flex flex-column  xl:flex justify-evenly gap-2">
          <div className="max-w-2xl p-5 ">
            <Image
              src={movie.imageUrl}
              height={300}
              width={300}
              alt="movie image"
              className="mx-auto"
            />
          </div>
          <div className="max-w-2xl ">
            <h1 className=" text-4xl font-bold py-5 ">{movie.title}</h1>
            <div className="flex justify-start gap-5 text-secondary-foreground/50">
              <p>{movie.releaseDate.toString().slice(11, 15)}</p>
              <p>|</p>
              <p>{movie.runtime} mins</p>
            </div>

            <div className="flex gap-2 flex-wrap pt-5">
              {movie.genres.map((genre) => (
                <div
                  key={genre.name}
                  className="bg-amber-500/20 text-amber-200 text-sm px-3 py-1 rounded-full border border-amber-500/30"
                >
                  {genre.name}
                </div>
              ))}
            </div>
            <h4 className="text-xl">Synopsis:</h4>
            <p className="text-foreground  font-medium pt-10">
              
              {movie.description}
            </p>

            <p className="pt-10 whitespace-pre-line text-xl">{`${movie.price} SEK`}</p>

            <div className="flex justify-start gap-5">
              <p className="pt-10 whitespace-pre-line text-xl">quantity</p>
              <p className="pt-10 whitespace-pre-line text-xl">cart</p>
            </div>
          </div>
        </div>
      </MovBanner>
    </div>
  );
}

export default MovieDetailsPage;
