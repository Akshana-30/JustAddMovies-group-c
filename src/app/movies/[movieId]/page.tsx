import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import MovBanner from "@/components/body/banner-card";
import AddToCartButton from "@/components/add-to-cart-button";
import { formatPrice } from "@/lib/format";
import { WishlistButton } from "@/components/body/wishlist-button";
import { ShareButton } from "@/components/body/share-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

async function MovieDetailsPage(props: PageProps<"/movies/[movieId]">) {
  const params = await props.params;

  const movie = await prisma.movie.findUnique({
    where: { id: params.movieId },
    include: {
      genres: { select: { name: true, description: true } },
      directors: { select: { name: true } },
      actors: { select: { name: true } },
    },
  });

  if (!movie) {
    notFound();
  }

  return (
    <div className="pt-4">
      <MovBanner
        imageUrl={movie.imageUrl}
        className="text-white dark:bg-black/50 bg-blend-multiply"
      >
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
            <div className="flex justify-start gap-5 text-white/70">
              <p>{movie.releaseDate.toString().slice(11, 15)}</p>
              <p>|</p>
              <p>{movie.runtime} mins</p>
            </div>
            <h4 className="text-xl pt-5">Synopsis:</h4>
            <p className="  font-medium pt-5">{movie.description}</p> <br />
            <div className="text-white/80">
              Actors : {movie.actors.map((actor) => actor.name).join(", ")}
            </div>
            <div className="text-white/80">
              Directors : {movie.directors.map((director) => director.name).join(", ")}
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
              <br />
            </div>
            <p className="pt-10 whitespace-pre-line text-xl mb-2">
              {formatPrice(movie.price)}
            </p>
            <br />

            <TooltipProvider>
              <div className="flex items-center gap-4">

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span><AddToCartButton productId={movie.id} productTitle={movie.title} /></span>
                  </TooltipTrigger>
                  <TooltipContent>Add to cart</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span><WishlistButton movieId={movie.id} /></span>
                  </TooltipTrigger>
                  <TooltipContent>Add to wishlist</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span><ShareButton /></span>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>

              </div>
            </TooltipProvider>
          </div>
        </div>
      </MovBanner>
    </div>
  );
}

export default MovieDetailsPage;
