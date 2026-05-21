// src/app/admin-dashboard/(admin)/admin/movies/AdminMoviesTable.tsx
"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import {
  Loader2,
  Tag,
  Search,
} from "lucide-react";
import {
  bulkUpdatePrice,
} from "@/app/admin-dashboard/_actions/movie-actions";
import EditMovieButton from "@/components/admin-buttons/edit-button";
import DeleteMovieButton, {
  RestoreMovieButton,
} from "@/components/admin-buttons/delete-button";
import { useRouter } from "next/navigation";

interface Genre {
  id: string;
  name: string;
}
interface Movie {
  id: string;
  title: string;
  price: number;
  stock: number;
  runtime: number;
  releaseDate: Date | string;
  imageUrl: string | null;
  description: string;
  genres: Genre[];
  directors: { id: string; name: string }[];
}

interface Props {
  movies: Movie[];
  archived: Movie[];
  genres: Genre[];
}


const PAGE_SIZE = 20;

export function AdminMoviesTable({ movies, archived, genres }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  // Active vs archived tab
  const [tab, setTab] = useState<"active" | "archived">("active");

  // Search/filter state
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Sort state
  const [sortCol, setSortCol] = useState<"title" | "price" | "stock">("title");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function handleSort(col: "title" | "price" | "stock") {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  // Reset to page 1 whenever filters or tab change
  useEffect(() => { setCurrentPage(1); }, [search, genreFilter, sortCol, sortDir, tab]);

  const source = tab === "active" ? movies : archived;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = source.filter((m) => {
      if (genreFilter && !m.genres.some((g) => g.id === genreFilter))
        return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.genres.some((g) => g.name.toLowerCase().includes(q)) ||
        String(new Date(m.releaseDate).getFullYear()).includes(q)
      );
    });
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortCol === "title") cmp = a.title.localeCompare(b.title);
      else if (sortCol === "price") cmp = a.price - b.price;
      else if (sortCol === "stock") cmp = a.stock - b.stock;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [source, search, genreFilter, sortCol, sortDir]);

  const totalPages = Math.ceil(visible.length / PAGE_SIZE);
  const paginated = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Genres that appear in at least one movie in the current tab (for filter buttons)
  const activeGenres = useMemo(() => {
    const ids = new Set(source.flatMap((m) => m.genres.map((g) => g.id)));
    return genres.filter((g) => ids.has(g.id));
  }, [source, genres]);

  // Selection state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkError, setBulkError] = useState("");
  const [bulkSuccess, setBulkSuccess] = useState("");

  const allIds = paginated.map((m) => m.id);
  const allChecked =
    allIds.length > 0 && allIds.every((id) => selected.has(id));

  function toggleAll() {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(allIds));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  }

  function handleBulkPrice() {
    setBulkError("");
    setBulkSuccess("");
    const priceSek = Number(bulkPrice);
    if (!priceSek || priceSek <= 0) {
      setBulkError("Enter a positive number");
      return;
    }
    const priceOre = Math.round(priceSek * 100);
    if (!confirm(`Set price to ${priceSek} kr for ${selected.size} movie(s)?`))
      return;
    startTransition(async () => {
      const result = await bulkUpdatePrice(Array.from(selected), priceOre);
      if (!result.success) {
        setBulkError(result.error ?? "Failed");
        return;
      }
      setBulkSuccess(`Updated ${selected.size} movie(s) to ${priceSek} kr`);
      setBulkPrice("");
      setSelected(new Set());
      setTimeout(() => {
        setBulkSuccess("");
        window.location.reload();
        router.refresh();
      }, 1200);
    });
  }

  return (
    <>
      {/* Active / Archived tabs */}
      <div  style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {(["active", "archived"] as const).map((t) => {
          const isActive = tab === t;
          const count = t === "active" ? movies.length : archived.length;
          return (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setSearch("");
                setGenreFilter("");
                setSelected(new Set());
              }}
              style={{
                padding: "7px 18px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                border: `1px solid ${isActive ? (t === "archived" ? "rgba(248,113,113,0.5)" : "var(--gold)") : "var(--border)"}`,
                background: isActive
                  ? t === "archived"
                    ? "rgba(248,113,113,0.08)"
                    : "rgba(232,160,48,0.12)"
                  : "var(--surface)",
                color: isActive
                  ? t === "archived"
                    ? "#f87171"
                    : "var(--gold)"
                  : "var(--text-muted)",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {t === "active" ? "🎬" : "🗄"}{" "}
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span
                style={{
                  fontSize: "11px",
                  padding: "1px 6px",
                  borderRadius: "20px",
                  background: isActive
                    ? t === "archived"
                      ? "rgba(248,113,113,0.15)"
                      : "rgba(232,160,48,0.2)"
                    : "var(--surface2)",
                  color: isActive
                    ? t === "archived"
                      ? "#f87171"
                      : "var(--gold)"
                    : "var(--text-dim)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Top bar */}
      <div
        className="mb-4"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {/* Row 1: search */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: "200px",
              maxWidth: "360px",
            }}
          >
            <Search
              size={13}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or year…"
              style={{
                width: "100%",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color: "var(--text)",
                fontSize: "13px",
                padding: "7px 10px 7px 30px",
                outline: "none",
              }}
            />
          </div>
          {(search || genreFilter) && (
            <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
              {visible.length} of {movies.length}
            </span>
          )}
        </div>

        {/* Row 2: Genre filter buttons */}
        {activeGenres.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-dim)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginRight: "2px",
              }}
            >
              Genre:
            </span>
            <button
              onClick={() => setGenreFilter("")}
              style={{
                padding: "3px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                cursor: "pointer",
                border: `1px solid ${!genreFilter ? "var(--gold)" : "var(--border)"}`,
                background: !genreFilter
                  ? "rgba(232,160,48,0.15)"
                  : "transparent",
                color: !genreFilter ? "var(--gold)" : "var(--text-muted)",
                transition: "all 0.15s",
              }}
            >
              All
            </button>
            {activeGenres.map((g) => {
              const active = genreFilter === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setGenreFilter(active ? "" : g.id)}
                  style={{
                    padding: "3px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    cursor: "pointer",
                    border: `1px solid ${active ? "var(--gold)" : "rgba(232,160,48,0.25)"}`,
                    background: active
                      ? "rgba(232,160,48,0.15)"
                      : "transparent",
                    color: active ? "var(--gold)" : "var(--text-muted)",
                    transition: "all 0.15s",
                  }}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bulk toolbar — visible when ≥1 row selected on active tab */}
      {selected.size > 0 && tab === "active" && (
        <div
          style={{
            marginBottom: "12px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "rgba(232,160,48,0.08)",
            border: "1px solid rgba(232,160,48,0.25)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{ fontSize: "13px", color: "var(--gold)", fontWeight: 500 }}
          >
            <Tag size={13} style={{ display: "inline", marginRight: "5px" }} />
            {selected.size} selected
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "auto",
            }}
          >
            <label
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
              }}
            >
              Set price (kr)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={bulkPrice}
              onChange={(e) => setBulkPrice(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBulkPrice()}
              placeholder="e.g. 149"
              style={{
                width: "90px",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                color: "var(--text)",
                fontSize: "13px",
                padding: "6px 8px",
                outline: "none",
              }}
            />
            <button
              onClick={handleBulkPrice}
              disabled={isPending || !bulkPrice}
              style={{
                padding: "6px 16px",
                borderRadius: "5px",
                border: "none",
                background: "var(--gold)",
                color: "var(--black)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                opacity: isPending || !bulkPrice ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              {isPending ? (
                <Loader2 size={13} className="animate-spin" />
              ) : null}
              Update Price
            </button>
            <button
              onClick={() => setSelected(new Set())}
              style={{
                padding: "6px 10px",
                borderRadius: "5px",
                border: "1px solid var(--border-strong)",
                background: "transparent",
                color: "var(--text-muted)",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>

          {bulkError && (
            <p
              style={{
                width: "100%",
                fontSize: "12px",
                color: "#f87171",
                margin: 0,
              }}
            >
              {bulkError}
            </p>
          )}
          {bulkSuccess && (
            <p
              style={{
                width: "100%",
                fontSize: "12px",
                color: "#4ade80",
                margin: 0,
              }}
            >
              {bulkSuccess}
            </p>
          )}
        </div>
      )}

      {/* Table */}
      <div
        className="overflow-x-auto rounded-xl border"
        style={{ borderColor: "var(--border)" }}
      >
        <table
        className="bg-sidebar-accent/40!"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "var(--surface)",
          }}
        >
          <thead>
            <tr className='border border-(--gold)/40' style={{ borderBottom: `1px solid var(--border)` }}>
              {/* Select-all checkbox */}
              <th className='border border-(--gold)/40' style={{ padding: "10px 12px", width: "36px" }}>
                <input
                  title="checkbox"
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  style={{
                    width: "14px",
                    height: "14px",
                    accentColor: "var(--gold)",
                    cursor: "pointer",
                  }}
                />
              </th>
              {(
                ["Poster", "Title", "Price", "Stock", "Genres", ""] as const
              ).map((h) => {
                const col =
                  h === "Title"
                    ? "title"
                    : h === "Price"
                      ? "price"
                      : h === "Stock"
                        ? "stock"
                        : null;
                const active = col && sortCol === col;
                return (
                  <th
                  className='border-b border-(--gold)/40'
                    key={h}
                    onClick={col ? () => handleSort(col) : undefined}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                      fontWeight: 500,
                      color: active ? "var(--gold)" : "var(--text-dim)",
                      cursor: col ? "pointer" : "default",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                    {active
                      ? sortDir === "asc"
                        ? " ▲"
                        : " ▼"
                      : col
                        ? " ↕"
                        : ""}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    color: "var(--text-dim)",
                    fontSize: "13px",
                    fontStyle: "italic",
                  }}
                >
                  No movies match &quot;{search}&quot;
                </td>
              </tr>
            )}
            {paginated.map((movie) => {
              const isChecked = selected.has(movie.id);
              return (
                <tr
                  key={movie.id}
                  style={{
                    borderBottom: `1px solid var(--border)`,
                    background: isChecked ? "rgba(232,160,48,0.04)" : undefined,
                  }}
                >
                  <td className='border border-(--gold)/40' style={{ padding: "10px 12px" }}>
                    <input
                      title="checkbox"
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOne(movie.id)}
                      style={{
                        width: "14px",
                        height: "14px",
                        accentColor: "var(--gold)",
                        cursor: "pointer",
                      }}
                    />
                  </td>
                  <td className='border-b border-(--gold)/40' style={{ padding: "10px 12px", width: "52px" }}>
                    <div
                      style={{
                        position: "relative",
                        width: "36px",
                        height: "50px",
                        borderRadius: "3px",
                        overflow: "hidden",
                        background: "var(--surface3)",
                      }}
                    >
                      {movie.imageUrl && (
                        <Image
                          src={movie.imageUrl}
                          alt={movie.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </div>
                  </td>
                  <td className='border-b border-(--gold)/40' style={{ padding: "10px 12px" }}>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--text)",
                      }}
                    >
                      {movie.title}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--text-dim)",
                        marginTop: "2px",
                      }}
                    >
                      {new Date(movie.releaseDate).toISOString().slice(0, 10)} ·{" "}
                      {movie.runtime} min
                    </p>
                  </td>
                  <td className='border-b border-(--gold)/40'
                    style={{
                      padding: "10px 12px",
                      fontSize: "13px",
                      color: "var(--gold)",
                      fontWeight: 500,
                    }}
                  >
                    {formatPrice(movie.price)}
                  </td>
                  <td className='border-b border-(--gold)/40'
                    style={{
                      padding: "10px 12px",
                      fontSize: "13px",
                      color: movie.stock < 10 ? "#f87171" : "var(--text-muted)",
                    }}
                  >
                    {movie.stock}
                  </td>
                  <td className='border-b border-(--gold)/40' style={{ padding: "10px 12px" }}>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}
                    >
                      {movie.genres.map((g) => (
                        <span
                          key={g.id}
                          style={{
                            fontSize: "10px",
                            padding: "2px 7px",
                            borderRadius: "20px",
                            border: "1px solid rgba(232,160,48,0.3)",
                            color: "var(--gold)",
                          }}
                        >
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className='border-b border-r border-(--gold)/40' style={{ padding: "10px 12px", textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        justifyContent: "flex-end",
                      }}
                    >
                      {tab === "active" ? (
                        <>
                          <EditMovieButton movieId={movie.id} />
                          <DeleteMovieButton movieId={movie.id} onSuccess={() => router.refresh()}/>
                        </>
                      ) : (
                        <RestoreMovieButton movieId={movie.id} onSuccess={() => router.refresh()}/>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 mb-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(p => p - 1); }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
                />
              </PaginationItem>

              {(() => {
                const items: (number | "ellipsis")[] = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) items.push(i);
                } else {
                  const around = new Set(
                    [1, totalPages, currentPage - 1, currentPage, currentPage + 1]
                      .filter(n => n >= 1 && n <= totalPages)
                  );
                  let prev = 0;
                  for (const n of [...around].sort((a, b) => a - b)) {
                    if (n - prev > 1) items.push("ellipsis");
                    items.push(n);
                    prev = n;
                  }
                }
                return items.map((item, i) =>
                  item === "ellipsis" ? (
                    <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); setCurrentPage(item); }}
                        isActive={item === currentPage}
                        className="cursor-pointer"
                        style={item === currentPage ? { borderColor: "var(--gold)", color: "var(--gold)" } : undefined}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                );
              })()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(p => p + 1); }}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
