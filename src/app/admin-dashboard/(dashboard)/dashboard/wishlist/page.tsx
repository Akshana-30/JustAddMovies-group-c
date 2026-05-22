import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WishlistButton } from "@/components/body/wishlist-button";
import { ShareButton } from "@/components/body/share-button";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "My Wishlist" };

export default async function WishlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");

  const items = await prisma.wishlistItem.findMany({
    where:   { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { movie: { select: { id: true, title: true, price: true, imageUrl: true, stock: true } } },
  });

  return (
    <div className="p-3 sm:p-8">
      <h1 className="font-display mb-1 text-3xl tracking-wide" style={{ color: "var(--text)" }}>
        My <span style={{ color: "var(--gold)" }}>Wishlist</span>
      </h1>
      <p className="mb-6 font-serif italic" style={{ color: "var(--text-muted)" }}>
        {items.length} saved {items.length === 1 ? "film" : "films"}
      </p>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ fontSize: "3rem" }}>🎬</p>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--text-muted)", marginTop: "12px" }}>
            Your wishlist is empty. Browse movies and click &#34;Add to Wishlist&#34; to save films here.
          </p>
           <Button asChild className="mt-5">
            <Link href="/movies">Browse Movies</Link>
          </Button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {items.map((item) => {
            const movie   = item.movie;
            const inStock = movie.stock > 0;
            return (
              // Card is always flex-row so the poster can stretch the full height on the left
              <div key={item.id}
                className="flex flex-row"
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "10px", overflow: "hidden",
                }}>

                {/* Poster — no padding, stretches full card height automatically */}
                <div style={{ position: "relative", width: "54px", flexShrink: 0, background: "var(--surface3)" }}>
                  {movie.imageUrl
                    ? <Image src={movie.imageUrl} alt={movie.title} fill style={{ objectFit: "cover" }} />
                    : <div style={{ display:"flex", height:"100%", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>🎬</div>
                  }
                </div>

                {/* Content — padding lives here, not on the outer card */}
                <div className="flex-1 min-w-0" style={{ padding: "10px 10px" }}>

                  {/* ── Mobile layout ── */}
                  <div className="sm:hidden flex flex-col" style={{ gap: "7px" }}>
                    {/* Title — slightly larger on mobile */}
                    <Link href={`/movies/${movie.id}`}
                      style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", textDecoration: "none", lineHeight: 1.3 }}>
                      {movie.title}
                    </Link>

                    {/* 3-col grid — info row + button row share identical column widths */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "5px 6px" }}>
                      {/* Row 1: price | stock | View — centred over their button */}
                      <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", textAlign: "center" }}>
                        {formatPrice(movie.price)}
                      </span>
                      <span style={{ fontSize: "11px", color: inStock ? "#4ade80" : "#f87171", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", textAlign: "center" }}>
                        {inStock ? `${movie.stock} in stock` : "Out of stock"}
                      </span>
                      <Link href={`/movies/${movie.id}`}
                        style={{ fontSize: "11px", color: "var(--gold)", textDecoration: "underline", textUnderlineOffset: "3px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        View
                      </Link>

                      {/* Row 2: Wishlist | Share | Buy Now */}
                      <WishlistButton movieId={movie.id} className="w-full" />
                      <ShareButton   movieId={movie.id} className="w-full" />
                      {inStock ? (
                        <Link href={`/movies/${movie.id}`} className="jam-btn-gold"
                          style={{ fontSize: "12px", padding: "6px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          Buy Now
                        </Link>
                      ) : <div />}
                    </div>
                  </div>

                  {/* ── Desktop layout ── */}
                  <div className="hidden sm:flex sm:items-center" style={{ gap: "12px" }}>
                    <div className="flex-1 min-w-0">
                      <Link href={`/movies/${movie.id}`}
                        style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", textDecoration: "none" }}>
                        {movie.title}
                      </Link>
                      <div style={{ display: "flex", gap: "12px", marginTop: "4px", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--gold)" }}>
                          {formatPrice(movie.price)}
                        </span>
                        <span style={{ fontSize: "11px", color: inStock ? "#4ade80" : "#f87171" }}>
                          {inStock ? `${movie.stock} in stock` : "Out of stock"}
                        </span>
                      </div>
                    </div>
                    <TooltipProvider>
                      <div className="flex gap-2 items-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span suppressHydrationWarning><WishlistButton movieId={movie.id} /></span>
                          </TooltipTrigger>
                          <TooltipContent>Remove from wishlist</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span suppressHydrationWarning><ShareButton movieId={movie.id}/></span>
                          </TooltipTrigger>
                          <TooltipContent>Share</TooltipContent>
                        </Tooltip>
                        {inStock && (
                          <Link href={`/movies/${movie.id}`} className="jam-btn-gold"
                            style={{ fontSize: "12px", padding: "6px 14px" }}>
                            Buy Now
                          </Link>
                        )}
                        <Link href={`/movies/${movie.id}`}
                          style={{ fontSize: "12px", color: "var(--gold)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                          View
                        </Link>
                      </div>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
