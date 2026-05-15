"use client";

// ── MovieButtonsLoader ─────────────────────────────────────────────
// This thin client wrapper exists solely so that `ssr: false` can be
// used with next/dynamic — that option is only allowed inside Client
// Components. The server page imports this file, not MovieButtons
// directly, keeping the Radix Tooltip components out of SSR entirely.
import dynamic from "next/dynamic";

const MovieButtons = dynamic(
  () => import("./movie-buttons").then((m) => m.MovieButtons),
  { ssr: false }
);

export function MovieButtonsLoader({
  movieId,
  movieTitle,
}: {
  movieId: string;
  movieTitle: string;
}) {
  return <MovieButtons movieId={movieId} movieTitle={movieTitle} />;
}
