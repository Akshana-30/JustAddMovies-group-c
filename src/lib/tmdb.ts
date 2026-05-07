// src/lib/tmdb.ts
const BASE = "https://api.themoviedb.org/3";
const IMG  = "https://image.tmdb.org/t/p/w500";
const KEY  = () => process.env.TMDB_API_KEY ?? "";

export interface TmdbMovie {
  id:           number;
  title:        string;
  overview:     string;
  release_date: string;
  runtime:      number | null;
  poster_path:  string | null;
  vote_average: number;
  vote_count:   number;
  genres:       { id: number; name: string }[];
  credits?: {
    cast: { id: number; name: string; character: string; order: number }[];
    crew: { id: number; name: string; job: string; department: string }[];
  };
}

export interface TmdbSearchResult {
  id:           number;
  title:        string;
  release_date: string;
  poster_path:  string | null;
  overview:     string;
  vote_average: number;
  vote_count:   number;
}

interface TmdbPerson { id: number; name: string; known_for_department: string }

async function tmdbFetch(path: string) {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${BASE}${path}${sep}api_key=${KEY()}&language=en-US`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  return res.json();
}

// ── Search by title ───────────────────────────────────────────────
export async function searchTmdb(query: string, page = 1): Promise<TmdbSearchResult[]> {
  const data = await tmdbFetch(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  return data.results ?? [];
}

// ── Search person (actor or director) then get their movies ───────
export async function searchByPerson(
  name: string,
  role: "actor" | "director"
): Promise<TmdbSearchResult[]> {
  // Find person
  const people = await tmdbFetch(`/search/person?query=${encodeURIComponent(name)}`);
  const match: TmdbPerson = people.results?.find(
    (p: TmdbPerson) =>
      p.known_for_department === (role === "director" ? "Directing" : "Acting")
  ) ?? people.results?.[0];
  if (!match) return [];

  // Get their movie credits
  const credits = await tmdbFetch(`/person/${match.id}/movie_credits`);
  const movies: TmdbSearchResult[] = role === "director"
    ? (credits.crew ?? [])
        .filter((c: any) => c.job === "Director")
        .map((c: any) => ({ ...c, vote_count: c.vote_count ?? 0 }))
    : (credits.cast ?? [])
        .map((c: any) => ({ ...c, vote_count: c.vote_count ?? 0 }));

  return movies
    .filter((m) => m.title && m.release_date)
    .sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))
    .slice(0, 30);
}

// ── Discover with filters ─────────────────────────────────────────
export async function discoverTmdb(filters: {
  yearFrom?:    number;
  yearTo?:      number;
  ratingMin?:   number;
  genreName?:   string;
  sortBy?:      string;
  page?:        number;
}): Promise<TmdbSearchResult[]> {
  const params = new URLSearchParams();
  if (filters.yearFrom)  params.set("primary_release_date.gte", `${filters.yearFrom}-01-01`);
  if (filters.yearTo)    params.set("primary_release_date.lte", `${filters.yearTo}-12-31`);
  if (filters.ratingMin) params.set("vote_average.gte", String(filters.ratingMin));
  params.set("vote_count.gte", "50"); // ignore obscure films
  params.set("sort_by", filters.sortBy ?? "popularity.desc");
  params.set("page",    String(filters.page ?? 1));

  // Genre filter — needs genre ID
  if (filters.genreName) {
    const genres = await tmdbFetch("/genre/movie/list");
    const genre = (genres.genres ?? []).find(
      (g: any) => g.name.toLowerCase() === filters.genreName!.toLowerCase()
    );
    if (genre) params.set("with_genres", String(genre.id));
  }

  const data = await tmdbFetch(`/discover/movie?${params.toString()}`);
  return (data.results ?? []).map((m: any) => ({ ...m, vote_count: m.vote_count ?? 0 }));
}

// ── Get full movie details ────────────────────────────────────────
export async function getTmdbMovie(tmdbId: number): Promise<TmdbMovie> {
  return tmdbFetch(`/movie/${tmdbId}?append_to_response=credits`);
}

// ── Helpers ───────────────────────────────────────────────────────
export const posterUrl = (path: string | null) => (path ? `${IMG}${path}` : "");

export const getDirectors = (m: TmdbMovie) =>
  (m.credits?.crew ?? []).filter((c) => c.job === "Director").map((c) => c.name);

export const getActors = (m: TmdbMovie, limit = 6) =>
  (m.credits?.cast ?? [])
    .sort((a, b) => a.order - b.order)
    .slice(0, limit)
    .map((c) => c.name);

export function tmdbToMovie(movie: TmdbMovie, priceOre = 8900) {
  return {
    title:       movie.title,
    description: movie.overview,
    price:       priceOre,
    stock:       100,
    runtime:     movie.runtime ?? 90,
    releaseDate: movie.release_date ? new Date(movie.release_date) : new Date(),
    imageUrl:    posterUrl(movie.poster_path),
    genres:      movie.genres.map((g) => g.name),
    directors:   getDirectors(movie),
    actors:      getActors(movie),
    rating:      movie.vote_average,
  };
}
