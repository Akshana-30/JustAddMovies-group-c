// src/app/admin-dashboard/(admin)/admin/movies/AdminMoviesTable.tsx
"use client";

import { useState, useTransition, useMemo } from "react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Pencil, Trash2, Plus, Loader2, X, Tag, Search, RotateCcw } from "lucide-react";
import {
  createMovie,
  updateMovie,
  deleteMovie,
  restoreMovie,
  bulkUpdatePrice,
} from "@/app/admin-dashboard/_actions/movie-actions";

interface Genre  { id: string; name: string }
interface Movie  {
  id: string; title: string; price: number; stock: number;
  runtime: number; releaseDate: Date | string;
  imageUrl: string | null; description: string;
  genres: Genre[]; directors: { id: string; name: string }[];
}

interface Props { movies: Movie[]; archived: Movie[]; genres: Genre[] }

const EMPTY = {
  title: "", description: "", price: "", stock: "",
  runtime: "", releaseDate: "", imageUrl: "", genreIds: [] as string[],
};

export function AdminMoviesTable({ movies, archived, genres }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Movie | null>(null);
  const [form, setForm]         = useState(EMPTY);
  const [error, setError]       = useState("");

  // Active vs archived tab
  const [tab, setTab] = useState<"active" | "archived">("active");

  // Search/filter state
  const [search,      setSearch]      = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  const source = tab === "active" ? movies : archived;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return source.filter((m) => {
      if (genreFilter && !m.genres.some((g) => g.id === genreFilter)) return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.genres.some((g) => g.name.toLowerCase().includes(q)) ||
        String(new Date(m.releaseDate).getFullYear()).includes(q)
      );
    });
  }, [source, search, genreFilter]);

  // Genres that appear in at least one movie in the current tab (for filter buttons)
  const activeGenres = useMemo(() => {
    const ids = new Set(source.flatMap((m) => m.genres.map((g) => g.id)));
    return genres.filter((g) => ids.has(g.id));
  }, [source, genres]);

  // Selection state
  const [selected,    setSelected]    = useState<Set<string>>(new Set());
  const [bulkPrice,   setBulkPrice]   = useState("");
  const [bulkError,   setBulkError]   = useState("");
  const [bulkSuccess, setBulkSuccess] = useState("");

  const allIds = visible.map((m) => m.id);
  const allChecked = allIds.length > 0 && allIds.every((id) => selected.has(id));

  function toggleAll() {
    if (allChecked) setSelected(new Set());
    else            setSelected(new Set(allIds));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function openAdd() {
    setEditing(null); setForm(EMPTY); setError(""); setShowForm(true);
  }

  function openEdit(movie: Movie) {
    setEditing(movie);
    setForm({
      title:       movie.title,
      description: movie.description,
      price:       String(movie.price),
      stock:       String(movie.stock),
      runtime:     String(movie.runtime),
      releaseDate: new Date(movie.releaseDate).toISOString().slice(0, 10),
      imageUrl:    movie.imageUrl ?? "",
      genreIds:    movie.genres.map((g) => g.id),
    });
    setError(""); setShowForm(true);
  }

  function handleGenreToggle(id: string) {
    setForm((f) => ({
      ...f,
      genreIds: f.genreIds.includes(id)
        ? f.genreIds.filter((g) => g !== id)
        : [...f.genreIds, id],
    }));
  }

  function handleSubmit() {
    setError("");
    const data = {
      title: form.title, description: form.description,
      price: Math.round(Number(form.price)), stock: Number(form.stock),
      runtime: Number(form.runtime), releaseDate: form.releaseDate,
      imageUrl: form.imageUrl, genreIds: form.genreIds,
    };
    startTransition(async () => {
      const result = editing
        ? await updateMovie(editing.id, data)
        : await createMovie(data);
      if (!(result as any).success) { setError((result as any).error ?? "Something went wrong"); return; }
      setShowForm(false);
      window.location.reload();
    });
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Archive "${title}"?\n\nThe movie will be hidden from the catalogue but kept in the database so existing orders remain intact.`)) return;
    startTransition(async () => {
      await deleteMovie(id);
      window.location.reload();
    });
  }

  function handleRestore(id: string, title: string) {
    if (!confirm(`Restore "${title}" to the catalogue?`)) return;
    startTransition(async () => {
      await restoreMovie(id);
      window.location.reload();
    });
  }

  function handleBulkPrice() {
    setBulkError(""); setBulkSuccess("");
    const priceSek = Number(bulkPrice);
    if (!priceSek || priceSek <= 0) { setBulkError("Enter a positive number"); return; }
    const priceOre = Math.round(priceSek * 100);
    if (!confirm(`Set price to ${priceSek} kr for ${selected.size} movie(s)?`)) return;
    startTransition(async () => {
      const result = await bulkUpdatePrice(Array.from(selected), priceOre);
      if (!(result as any).success) { setBulkError((result as any).error ?? "Failed"); return; }
      setBulkSuccess(`Updated ${selected.size} movie(s) to ${priceSek} kr`);
      setBulkPrice("");
      setSelected(new Set());
      setTimeout(() => { setBulkSuccess(""); window.location.reload(); }, 1200);
    });
  }

  const IS: React.CSSProperties = {
    width: "100%", background: "var(--surface2)",
    border: "1px solid var(--border)", borderRadius: "4px",
    color: "var(--text)", fontSize: "13px", padding: "7px 10px", outline: "none",
  };
  const LS: React.CSSProperties = {
    display: "block", fontSize: "11px", textTransform: "uppercase",
    letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "4px",
  };

  return (
    <>
      {/* Active / Archived tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {(["active", "archived"] as const).map((t) => {
          const isActive = tab === t;
          const count    = t === "active" ? movies.length : archived.length;
          return (
            <button key={t} onClick={() => { setTab(t); setSearch(""); setGenreFilter(""); setSelected(new Set()); }}
              style={{ padding: "7px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: isActive ? 600 : 400, cursor: "pointer", border: `1px solid ${isActive ? (t === "archived" ? "rgba(248,113,113,0.5)" : "var(--gold)") : "var(--border)"}`, background: isActive ? (t === "archived" ? "rgba(248,113,113,0.08)" : "rgba(232,160,48,0.12)") : "var(--surface)", color: isActive ? (t === "archived" ? "#f87171" : "var(--gold)") : "var(--text-muted)", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "6px" }}>
              {t === "active" ? "🎬" : "🗄"} {t.charAt(0).toUpperCase() + t.slice(1)}
              <span style={{ fontSize: "11px", padding: "1px 6px", borderRadius: "20px", background: isActive ? (t === "archived" ? "rgba(248,113,113,0.15)" : "rgba(232,160,48,0.2)") : "var(--surface2)", color: isActive ? (t === "archived" ? "#f87171" : "var(--gold)") : "var(--text-dim)" }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Top bar */}
      <div className="mb-4" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Row 1: Add button + search */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
          {tab === "active" && (
            <button onClick={openAdd} className="jam-btn-gold" style={{ display: "inline-flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
              <Plus size={14} /> Add Movie
            </button>
          )}
          <div style={{ position: "relative", flex: 1, minWidth: "200px", maxWidth: "360px" }}>
            <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or year…"
              style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text)", fontSize: "13px", padding: "7px 10px 7px 30px", outline: "none" }}
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: "2px" }}>Genre:</span>
            <button
              onClick={() => setGenreFilter("")}
              style={{ padding: "3px 12px", borderRadius: "20px", fontSize: "12px", cursor: "pointer", border: `1px solid ${!genreFilter ? "var(--gold)" : "var(--border)"}`, background: !genreFilter ? "rgba(232,160,48,0.15)" : "transparent", color: !genreFilter ? "var(--gold)" : "var(--text-muted)", transition: "all 0.15s" }}
            >
              All
            </button>
            {activeGenres.map((g) => {
              const active = genreFilter === g.id;
              return (
                <button key={g.id}
                  onClick={() => setGenreFilter(active ? "" : g.id)}
                  style={{ padding: "3px 12px", borderRadius: "20px", fontSize: "12px", cursor: "pointer", border: `1px solid ${active ? "var(--gold)" : "rgba(232,160,48,0.25)"}`, background: active ? "rgba(232,160,48,0.15)" : "transparent", color: active ? "var(--gold)" : "var(--text-muted)", transition: "all 0.15s" }}
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
        <div style={{ marginBottom: "12px", padding: "12px 16px", borderRadius: "8px", background: "rgba(232,160,48,0.08)", border: "1px solid rgba(232,160,48,0.25)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "13px", color: "var(--gold)", fontWeight: 500 }}>
            <Tag size={13} style={{ display: "inline", marginRight: "5px" }} />
            {selected.size} selected
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
            <label style={{ fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              Set price (kr)
            </label>
            <input
              type="number" min="1" step="1"
              value={bulkPrice}
              onChange={(e) => setBulkPrice(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBulkPrice()}
              placeholder="e.g. 149"
              style={{ width: "90px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text)", fontSize: "13px", padding: "6px 8px", outline: "none" }}
            />
            <button
              onClick={handleBulkPrice}
              disabled={isPending || !bulkPrice}
              style={{ padding: "6px 16px", borderRadius: "5px", border: "none", background: "var(--gold)", color: "var(--black)", fontSize: "13px", fontWeight: 500, cursor: "pointer", opacity: isPending || !bulkPrice ? 0.5 : 1, display: "flex", alignItems: "center", gap: "5px" }}
            >
              {isPending ? <Loader2 size={13} className="animate-spin" /> : null}
              Update Price
            </button>
            <button
              onClick={() => setSelected(new Set())}
              style={{ padding: "6px 10px", borderRadius: "5px", border: "1px solid var(--border-strong)", background: "transparent", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer" }}
            >
              Clear
            </button>
          </div>

          {bulkError   && <p style={{ width: "100%", fontSize: "12px", color: "#f87171", margin: 0 }}>{bulkError}</p>}
          {bulkSuccess && <p style={{ width: "100%", fontSize: "12px", color: "#4ade80", margin: 0 }}>{bulkSuccess}</p>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface)" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid var(--border)` }}>
              {/* Select-all checkbox */}
              <th style={{ padding: "10px 12px", width: "36px" }}>
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  style={{ width: "14px", height: "14px", accentColor: "var(--gold)", cursor: "pointer" }}
                />
              </th>
              {["Poster", "Title", "Price", "Stock", "Genres", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", letterSpacing: "0.1em", color: "var(--text-dim)", fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr><td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "var(--text-dim)", fontSize: "13px", fontStyle: "italic" }}>No movies match "{search}"</td></tr>
            )}
            {visible.map((movie) => {
              const isChecked = selected.has(movie.id);
              return (
                <tr key={movie.id} style={{ borderBottom: `1px solid var(--border)`, background: isChecked ? "rgba(232,160,48,0.04)" : undefined }}>
                  <td style={{ padding: "10px 12px" }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOne(movie.id)}
                      style={{ width: "14px", height: "14px", accentColor: "var(--gold)", cursor: "pointer" }}
                    />
                  </td>
                  <td style={{ padding: "10px 12px", width: "52px" }}>
                    <div style={{ position: "relative", width: "36px", height: "50px", borderRadius: "3px", overflow: "hidden", background: "var(--surface3)" }}>
                      {movie.imageUrl && (
                        <Image src={movie.imageUrl} alt={movie.title} fill style={{ objectFit: "cover" }} />
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)" }}>{movie.title}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "2px" }}>
                      {new Date(movie.releaseDate).toISOString().slice(0, 10)} · {movie.runtime} min
                    </p>
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: "13px", color: "var(--gold)", fontWeight: 500 }}>
                    {formatPrice(movie.price)}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: "13px", color: movie.stock < 10 ? "#f87171" : "var(--text-muted)" }}>
                    {movie.stock}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {movie.genres.map((g) => (
                        <span key={g.id} style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "20px", border: "1px solid rgba(232,160,48,0.3)", color: "var(--gold)" }}>
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                      {tab === "active" ? (
                        <>
                          <button onClick={() => openEdit(movie)}
                            style={{ padding: "5px 10px", borderRadius: "4px", border: "1px solid var(--border-strong)", background: "transparent", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                            <Pencil size={12} /> Edit
                          </button>
                          <button onClick={() => handleDelete(movie.id, movie.title)}
                            style={{ padding: "5px 10px", borderRadius: "4px", border: "1px solid rgba(248,113,113,0.3)", background: "transparent", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                            <Trash2 size={12} /> Archive
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleRestore(movie.id, movie.title)}
                          style={{ padding: "5px 10px", borderRadius: "4px", border: "1px solid rgba(74,222,128,0.3)", background: "transparent", color: "#4ade80", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}>
                          <RotateCcw size={12} /> Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", padding: "1rem" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: "12px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", padding: "24px" }}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", letterSpacing: "0.08em", color: "var(--gold)" }}>
                {editing ? "EDIT MOVIE" : "ADD MOVIE"}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {error && (
              <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "#f87171" }}>
                {error}
              </div>
            )}

            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <label style={LS}>Title *</label>
                <input style={IS} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="The Shawshank Redemption" />
              </div>
              <div>
                <label style={LS}>Description *</label>
                <textarea style={{ ...IS, resize: "vertical", minHeight: "80px" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A brief description of the film…" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={LS}>Price (kr) *</label>
                  <input style={IS} type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="99" />
                </div>
                <div>
                  <label style={LS}>Stock *</label>
                  <input style={IS} type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="100" />
                </div>
                <div>
                  <label style={LS}>Runtime (min) *</label>
                  <input style={IS} type="number" min="0" value={form.runtime} onChange={(e) => setForm({ ...form, runtime: e.target.value })} placeholder="120" />
                </div>
              </div>
              <div>
                <label style={LS}>Release Date *</label>
                <input style={IS} type="text" value={form.releaseDate} onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" />
              </div>
              <div>
                <label style={LS}>Poster Image URL</label>
                <input style={IS} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" />
              </div>
              <div>
                <label style={LS}>Genres</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                  {genres.map((g) => {
                    const selected = form.genreIds.includes(g.id);
                    return (
                      <button key={g.id} type="button" onClick={() => handleGenreToggle(g.id)}
                        style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", cursor: "pointer", border: `1px solid ${selected ? "var(--gold)" : "var(--border)"}`, background: selected ? "rgba(232,160,48,0.15)" : "transparent", color: selected ? "var(--gold)" : "var(--text-muted)", transition: "all 0.15s" }}>
                        {g.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)}
                style={{ padding: "8px 20px", borderRadius: "6px", border: "1px solid var(--border-strong)", background: "transparent", color: "var(--text-muted)", cursor: "pointer", fontSize: "13px" }}>
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={isPending}
                style={{ padding: "8px 20px", borderRadius: "6px", border: "none", background: "var(--gold)", color: "var(--black)", cursor: "pointer", fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", gap: "6px", opacity: isPending ? 0.6 : 1 }}>
                {isPending ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : editing ? "Save Changes" : "Add Movie"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
