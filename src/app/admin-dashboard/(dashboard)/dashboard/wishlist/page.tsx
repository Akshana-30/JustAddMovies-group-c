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
    <div className="p-8">
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
              <div key={item.id} style={{
                display: "flex", alignItems: "center", gap: "16px",
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "10px", padding: "14px 16px",
              }}>
                {/* Poster */}
                <div style={{ position: "relative", width: "44px", height: "60px", borderRadius: "4px", overflow: "hidden", background: "var(--surface3)", flexShrink: 0 }}>
                  {movie.imageUrl
                    ? <Image src={movie.imageUrl} alt={movie.title} fill style={{ objectFit: "cover" }} />
                    : <div style={{ display:"flex", height:"100%", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>🎬</div>
                  }
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <Link href={`/movies/${movie.id}`}
                    style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)", textDecoration: "none" }}>
                    {movie.title}
                  </Link>
                  <div style={{ display: "flex", gap: "12px", marginTop: "4px", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--gold)" }}>
                      {formatPrice(movie.price)}
                    </span>
                    <span style={{
                      fontSize: "11px",
                      color: inStock ? "#4ade80" : "#f87171",
                    }}>
                      {inStock ? `${movie.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {/* Heart + Share stacked vertically */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span><WishlistButton movieId={movie.id} /></span>
                        </TooltipTrigger>
                        <TooltipContent>Remove from wishlist</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span><ShareButton movieId={movie.id}/></span>
                        </TooltipTrigger>
                        <TooltipContent>Share</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Buy Now + View stacked vertically */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {inStock && (
                      <Link href={`/movies/${movie.id}`} className="jam-btn-gold"
                        style={{ fontSize: "12px", padding: "6px 14px", textAlign: "center" }}>
                        Buy Now
                      </Link>
                    )}
                    <Link href={`/movies/${movie.id}`} className="jam-btn-outline"
                      style={{ fontSize: "12px", padding: "6px 14px", textAlign: "center" }}>
                      View
                    </Link>
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
