// src/app/admin-dashboard/(admin)/admin/import/TmdbImportClient.tsx
"use client";

import { useState, useTransition } from "react";
import {
  Search, Download, Loader2, Check, X, Star,
  Film, User, Video, Sliders, Eye,
} from "lucide-react";
import {
  searchMovies, searchByActor, searchByDirector,
  discoverMovies, bulkImportFromTmdb, importFromTmdb,
  previewTmdbMovie,
} from "./import-actions";

interface SearchResult {
  id:           number;
  title:        string;
  release_date: string;
  poster_path:  string | null;
  overview:     string;
  vote_average: number;
  vote_count:   number;
}

interface Preview {
  title:       string;
  description: string;
  price:       number;
  stock:       number;
  runtime:     number;
  releaseDate: Date | string;
  imageUrl:    string;
  genres:      string[];
  directors:   string[];
  actors:      string[];
}

type Tab = "title" | "actor" | "director" | "discover";

const POSTER_SM = (p: string | null) => p ? `https://image.tmdb.org/t/p/w92${p}`  : null;
const POSTER_LG = (p: string | null) => p ? `https://image.tmdb.org/t/p/w185${p}` : null;

const TMDB_GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime",
  "Documentary", "Drama", "Family", "Fantasy", "History",
  "Horror", "Music", "Mystery", "Romance", "Science Fiction",
  "Thriller", "War", "Western",
];

const RATINGS = [
  { value: "",    label: "Any rating" },
  { value: "9",   label: "★ 9.0+" },
  { value: "8.5", label: "★ 8.5+" },
  { value: "8",   label: "★ 8.0+" },
  { value: "7.5", label: "★ 7.5+" },
  { value: "7",   label: "★ 7.0+" },
  { value: "6",   label: "★ 6.0+" },
];

const SORT_OPTIONS = [
  { value: "popularity.desc",   label: "Most Popular"    },
  { value: "vote_average.desc", label: "Highest Rated"   },
  { value: "release_date.desc", label: "Newest First"    },
  { value: "release_date.asc",  label: "Oldest First"    },
  { value: "revenue.desc",      label: "Highest Revenue" },
];

export function TmdbImportClient() {
  const [isPending, startTransition] = useTransition();

  // Search state
  const [tab,        setTab]        = useState<Tab>("title");
  const [results,    setResults]    = useState<SearchResult[]>([]);
  const [selected,   setSelected]   = useState<Set<number>>(new Set());
  const [imported,   setImported]   = useState<Set<number>>(new Set());
  const [price,      setPrice]      = useState(89);
  const [message,    setMessage]    = useState<{ ok: boolean; text: string } | null>(null);
  const [error,      setError]      = useState("");
  const [bulkLog,    setBulkLog]    = useState<{ title: string; ok: boolean; error?: string }[]>([]);

  // Preview state
  const [preview,        setPreview]        = useState<{ tmdbId: number; data: Preview } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState<number | null>(null);

  // Duplicate warning state: tmdbId → warning message
  const [dupWarning, setDupWarning] = useState<Map<number, string>>(new Map());

  // Tab inputs
  const [titleQ,    setTitleQ]    = useState("");
  const [actorQ,    setActorQ]    = useState("");
  const [directorQ, setDirectorQ] = useState("");
  const [yearFrom,   setYearFrom]   = useState("");
  const [yearTo,     setYearTo]     = useState("");
  const [ratingMin,  setRatingMin]  = useState(0);
  const [genreName,  setGenreName]  = useState("");
  const [sortBy,     setSortBy]     = useState("popularity.desc");

  function resetFeedback() { setError(""); setMessage(null); setBulkLog([]); setDupWarning(new Map()); }

  type SearchProps = {
    success: boolean;
    data?: SearchResult[];
    error?: string;
  }

  async function runSearch(fn: () => Promise<SearchProps>) {
    resetFeedback(); setResults([]); setSelected(new Set()); setPreview(null);
    startTransition(async () => {
      const result = await fn();
      if (result?.success) {
        const data = result?.data as SearchResult[];
        setResults(data);
        if (data.length === 0) setError("No results found");
      } else {
        setError(result?.error ?? "Unknown error");
      }
    });
  }

  function handleSearch() {
    if (tab === "title")    runSearch(() => searchMovies(titleQ));
    if (tab === "actor")    runSearch(() => searchByActor(actorQ));
    if (tab === "director") runSearch(() => searchByDirector(directorQ));
    if (tab === "discover") runSearch(() => discoverMovies({
      yearFrom:  yearFrom   ? Number(yearFrom)  : undefined,
      yearTo:    yearTo     ? Number(yearTo)    : undefined,
      ratingMin: ratingMin  > 0 ? ratingMin     : undefined,
      genreName: genreName  || undefined,
      sortBy,
    }));
  }

  function handlePreview(tmdbId: number) {
    resetFeedback();
    setLoadingPreview(tmdbId);
    startTransition(async () => {
      const result = await previewTmdbMovie(tmdbId);
      setLoadingPreview(null);
      if (result?.success) {
        setPreview({ tmdbId, data: result?.data });
      } else {
        setError(result?.error);
      }
    });
  }

  function toggleSelect(id: number) {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function selectAll()  { setSelected(new Set(results.filter((r) => !imported.has(r.id)).map((r) => r.id))); }
  function selectNone() { setSelected(new Set()); }

  function handleSingleImport(tmdbId: number, e?: React.MouseEvent, force = false) {
    e?.stopPropagation();
    if (!force) resetFeedback();
    startTransition(async () => {
      const result = await importFromTmdb(tmdbId, price * 100, force);
      if (result?.success) {
        setImported((prev) => new Set([...prev, tmdbId]));
        setDupWarning((prev) => { const m = new Map(prev); m.delete(tmdbId); return m; });
        setMessage({ ok: true, text: `✓ "${result?.data.title}" imported!` });
        if (preview?.tmdbId === tmdbId) setPreview(null);
      } else if ("isDuplicate" in result && result.isDuplicate) {
        setDupWarning((prev) => new Map(prev).set(tmdbId, result?.error));
      } else {
        setMessage({ ok: false, text: result?.error });
      }
    });
  }

  function handleBulkImport() {
    const ids = [...selected].filter((id) => !imported.has(id));
    if (ids.length === 0) return;
    resetFeedback(); setPreview(null);
    startTransition(async () => {
      const result = await bulkImportFromTmdb(ids, price * 100);
      if (result?.success) {
        const log = result?.data as { tmdbId: number; title: string; ok: boolean; error?: string }[];
        setBulkLog(log);
        setImported((prev) => new Set([...prev, ...log.filter((l) => l.ok).map((l) => l.tmdbId)]));
        setSelected(new Set());
        setMessage({ ok: true, text: `Imported ${log.filter((l) => l.ok).length} of ${log.length} movies` });
      } else {
        setError(result?.error);
      }
    });
  }

  // ── Shared styles ──────────────────────────────────────────────
  const IS: React.CSSProperties = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "4px", color: "var(--text)", fontSize: "13px",
    padding: "7px 10px", outline: "none", width: "100%",
  };

  const tabItems: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: "title",    icon: <Film size={13}/>,    label: "By Title"    },
    { id: "actor",    icon: <User size={13}/>,    label: "By Actor"    },
    { id: "director", icon: <Video size={13}/>,   label: "By Director" },
    { id: "discover", icon: <Sliders size={13}/>, label: "Discover"    },
  ];

  return (
      <div>
        {/* ── Tabs + price ──────────────────────────────────────── */}
        <div style={{ display:"flex", gap:"6px", marginBottom:"16px", flexWrap:"wrap", alignItems:"center" }}>
          {tabItems.map((t) => {
            const active = tab === t.id;
            return (
                <button type="button" key={t.id} onClick={() => { setTab(t.id); setResults([]); setPreview(null); setError(""); }}
                        style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"7px 16px", borderRadius:"6px", fontSize:"13px", cursor:"pointer", fontWeight: active ? 500 : 400, background: active ? "var(--gold)" : "var(--surface)", border:`1px solid ${active ? "var(--gold)" : "var(--border)"}`, color: active ? "var(--black)" : "var(--text-muted)", transition:"all 0.15s", boxShadow: active ? "0 0 12px rgba(232,160,48,0.35)" : "none" }}>
                  {t.icon} {t.label}
                </button>
            );
          })}
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"8px" }}>
            <label htmlFor="price" style={{ fontSize:"12px", color:"var(--text-muted)", whiteSpace:"nowrap" }}>Price (kr)</label>
            <input 
                  id="price"
                  type="number" value={price} min={1} max={999}
                   onChange={(e) => setPrice(Number(e.target.value))}
                   style={{ ...IS, width:"72px" }} />
          </div>
        </div>

        {/* ── Search inputs ─────────────────────────────────────── */}
        <div style={{ marginBottom:"14px" }}>
          {tab === "title" && (
              <div style={{ display:"flex", gap:"8px" }}>
                <div style={{ position:"relative", flex:1 }}>
                  <Search size={13} style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)", pointerEvents:"none" }}/>
                  <input style={{ ...IS, paddingLeft:"30px" }} value={titleQ} onChange={(e) => setTitleQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="e.g. Inception, The Godfather…" />
                </div>
                <SearchBtn onClick={handleSearch} pending={isPending} />
              </div>
          )}
          {tab === "actor" && (
              <div style={{ display:"flex", gap:"8px" }}>
                <input style={{ ...IS, flex:1 }} value={actorQ} onChange={(e) => setActorQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="e.g. Leonardo DiCaprio, Meryl Streep…" />
                <SearchBtn onClick={handleSearch} pending={isPending} />
              </div>
          )}
          {tab === "director" && (
              <div style={{ display:"flex", gap:"8px" }}>
                <input style={{ ...IS, flex:1 }} value={directorQ} onChange={(e) => setDirectorQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="e.g. Christopher Nolan, Hayao Miyazaki…" />
                <SearchBtn onClick={handleSearch} pending={isPending} />
              </div>
          )}
          {tab === "discover" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px", alignItems:"end" }}>
                <div>
                  <label style={{ display:"block", fontSize:"11px", color:"var(--text-muted)", marginBottom:"4px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Year from</label>
                  <input style={IS} type="number" min={1900} max={2025} value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} placeholder="1990" />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:"11px", color:"var(--text-muted)", marginBottom:"4px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Year to</label>
                  <input style={IS} type="number" min={1900} max={2025} value={yearTo} onChange={(e) => setYearTo(e.target.value)} placeholder="2024" />
                </div>
                <div>
                  <label htmlFor="genre" style={{ display:"block", fontSize:"11px", color:"var(--text-muted)", marginBottom:"4px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Genre</label>
                  <select id="genre" style={IS} value={genreName} onChange={(e) => setGenreName(e.target.value)}>
                    <option value="">Any genre</option>
                    {TMDB_GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="min-rating" style={{ display:"block", fontSize:"11px", color:"var(--text-muted)", marginBottom:"4px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Min rating ★</label>
                  <select id="min-rating" style={IS} value={ratingMin} onChange={(e) => setRatingMin(Number(e.target.value))}>
                    {RATINGS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="sort-by" style={{ display:"block", fontSize:"11px", color:"var(--text-muted)", marginBottom:"4px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Sort by</label>
                  <select id="sort-by" style={IS} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <SearchBtn onClick={handleSearch} pending={isPending} />
              </div>
          )}
        </div>

        {/* ── Feedback ──────────────────────────────────────────── */}
        {message && (
            <div style={{ padding:"10px 14px", borderRadius:"8px", marginBottom:"12px", fontSize:"13px", display:"flex", alignItems:"center", gap:"8px", background: message.ok ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", border:`1px solid ${message.ok ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`, color: message.ok ? "var(--success)" : "#f87171" }}>
              {message.ok ? <Check size={14}/> : <X size={14}/>} {message.text}
            </div>
        )}
        {error && (
            <div style={{ padding:"10px 14px", borderRadius:"8px", marginBottom:"12px", fontSize:"13px", background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.3)", color:"#f87171" }}>{error}</div>
        )}

        {/* ── Bulk log ──────────────────────────────────────────── */}
        {bulkLog.length > 0 && (
            <div style={{ marginBottom:"16px", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:"8px", padding:"14px 16px" }}>
              <div style={{ fontSize:"12px", fontWeight:500, color:"var(--text-muted)", marginBottom:"8px", textTransform:"uppercase", letterSpacing:"0.08em" }}>Import Results</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"4px", maxHeight:"180px", overflowY:"auto" }}>
                {bulkLog.map((entry, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"12px" }}>
                      {entry.ok ? <Check size={12} style={{ color:"var(--success)", flexShrink:0 }}/> : <X size={12} style={{ color:"#f87171", flexShrink:0 }}/>}
                      <span style={{ color: entry.ok ? "var(--text)" : "#f87171" }}>{entry.title}</span>
                      {entry.error && <span style={{ color:"var(--text-dim)", fontSize:"11px" }}>— {entry.error}</span>}
                    </div>
                ))}
              </div>
            </div>
        )}

        {/* ── Preview panel ─────────────────────────────────────── */}
        {preview && (
            <div style={{ marginBottom:"20px", background:"var(--surface2)", border:"1px solid var(--border-strong)", borderRadius:"12px", overflow:"hidden" }}>
              <div style={{ padding:"12px 18px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <h3 style={{ fontFamily:"var(--font-display)", fontSize:"1rem", letterSpacing:"0.08em", color:"var(--gold)" }}>
                  PREVIEW: {preview.data.title}
                </h3>
                <button type="button" onClick={() => setPreview(null)} style={{ background:"transparent", border:"none", color:"var(--text-muted)", cursor:"pointer" }}>
                  {<X size={16}/>}
                </button>
              </div>
              <div style={{ padding:"16px 18px", display:"flex", gap:"16px" }}>
                {preview.data.imageUrl && (
                    <img src={preview.data.imageUrl} alt={preview.data.title}
                         style={{ width:"90px", height:"135px", objectFit:"cover", borderRadius:"6px", flexShrink:0 }} />
                )}
                <div style={{ flex:1, display:"grid", gap:"8px" }}>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"12px", fontSize:"12px", color:"var(--text-muted)" }}>
                    <span>📅 {new Date(preview.data.releaseDate).getFullYear()}</span>
                    <span>⏱ {preview.data.runtime} min</span>
                    <span>💰 {price} kr</span>
                    <span>📦 {preview.data.stock} stock</span>
                  </div>
                  {preview.data.genres.length > 0 && (
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                        {preview.data.genres.map((g) => (
                            <span key={g} style={{ fontSize:"11px", padding:"2px 8px", borderRadius:"20px", border:"1px solid rgba(232,160,48,0.3)", color:"var(--gold)" }}>{g}</span>
                        ))}
                      </div>
                  )}
                  {preview.data.directors.length > 0 && (
                      <p style={{ fontSize:"12px", color:"var(--text-muted)" }}>
                        🎬 <strong style={{ color:"var(--text)" }}>Dir:</strong> {preview.data.directors.join(", ")}
                      </p>
                  )}
                  {preview.data.actors.length > 0 && (
                      <p style={{ fontSize:"12px", color:"var(--text-muted)" }}>
                        🎭 <strong style={{ color:"var(--text)" }}>Cast:</strong> {preview.data.actors.join(", ")}
                      </p>
                  )}
                  <p style={{ fontSize:"12px", color:"var(--text-muted)", lineHeight:1.5 }}>
                    {preview.data.description.slice(0, 220)}{preview.data.description.length > 220 ? "…" : ""}
                  </p>
                  <div>
                    <button
                        onClick={() => handleSingleImport(preview.tmdbId)}
                        disabled={isPending || imported.has(preview.tmdbId)}
                        className="btn-primary"
                        style={{ display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"13px", opacity: isPending || imported.has(preview.tmdbId) ? 0.6 : 1 }}
                    >
                      {imported.has(preview.tmdbId)
                          ? <><Check size={13}/> Already Imported</>
                          : isPending
                              ? <><Loader2 size={13} className="animate-spin"/> Importing…</>
                              : <><Download size={13}/> Import this Movie</>
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* ── Results ───────────────────────────────────────────── */}
        {results.length > 0 && (
            <div>
              {/* Toolbar */}
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px", flexWrap:"wrap" }}>
            <span style={{ fontSize:"12px", color:"var(--text-dim)" }}>
              {results.length} results · {selected.size} selected
            </span>
                <button onClick={selectAll}  style={{ fontSize:"12px", color:"var(--gold)",       background:"transparent", border:"none", cursor:"pointer" }}>Select all</button>
                <button onClick={selectNone} style={{ fontSize:"12px", color:"var(--text-muted)", background:"transparent", border:"none", cursor:"pointer" }}>Clear</button>
                {selected.size > 0 && (
                    <button onClick={handleBulkImport} disabled={isPending} className="btn-primary"
                            style={{ marginLeft:"auto", display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"13px", opacity: isPending ? 0.6 : 1 }}>
                      {isPending
                          ? <><Loader2 size={13} className="animate-spin"/> Importing {selected.size}…</>
                          : <><Download size={13}/> Import {selected.size} Selected</>
                      }
                    </button>
                )}
              </div>

              {/* Rows */}
              <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                {results.map((movie) => {
                  const isSelected = selected.has(movie.id);
                  const isImported = imported.has(movie.id);
                  const isLoadingThis = loadingPreview === movie.id;
                  const poster = POSTER_SM(movie.poster_path);

                  return (
                    <div key={movie.id}>
                      <div
                           onClick={() => !isImported && toggleSelect(movie.id)}
                           style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 14px", background: isSelected ? "rgba(232,160,48,0.08)" : "var(--surface)", border:`1px solid ${isSelected ? "var(--gold)" : isImported ? "rgba(74,222,128,0.3)" : "var(--border)"}`, borderRadius:"8px", cursor: isImported ? "default" : "pointer", transition:"all 0.15s", opacity: isImported ? 0.7 : 1 }}
                      >
                        {/* Checkbox */}
                        <div style={{ width:"18px", height:"18px", borderRadius:"4px", flexShrink:0, border:`2px solid ${isSelected ? "var(--gold)" : "var(--border-strong)"}`, background: isSelected ? "var(--gold)" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
                          {isSelected && <Check size={11} style={{ color:"var(--black)" }}/>}
                          {isImported && !isSelected && <Check size={11} style={{ color:"var(--success)" }}/>}
                        </div>

                        {/* Poster */}
                        <div style={{ width:"32px", height:"46px", borderRadius:"3px", overflow:"hidden", background:"var(--surface3)", flexShrink:0 }}>
                          {poster
                              ? <img src={poster} alt={movie.title} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                              : <div style={{ display:"flex", height:"100%", alignItems:"center", justifyContent:"center", fontSize:"12px" }}>🎬</div>
                          }
                        </div>

                        {/* Info */}
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontSize:"13px", fontWeight:500, color:"var(--text)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                            {movie.title}
                            {isImported && <span style={{ marginLeft:"8px", fontSize:"11px", color:"var(--success)" }}>✓ In catalogue</span>}
                          </p>
                          <div style={{ display:"flex", gap:"10px", marginTop:"2px" }}>
                            {movie.release_date && <span style={{ fontSize:"11px", color:"var(--text-dim)" }}>{movie.release_date.slice(0,4)}</span>}
                            {movie.vote_average > 0 && (
                                <span style={{ fontSize:"11px", color:"var(--gold)", display:"flex", alignItems:"center", gap:"3px" }}>
                          <Star size={10} fill="currentColor"/> {movie.vote_average.toFixed(1)}
                                  <span style={{ color:"var(--text-dim)", fontSize:"10px" }}>({movie.vote_count?.toLocaleString()})</span>
                        </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
                          {/* Preview */}
                          <button
                              onClick={(e) => { e.stopPropagation(); handlePreview(movie.id); }}
                              disabled={isPending}
                              style={{ padding:"5px 10px", borderRadius:"4px", fontSize:"12px", background:"transparent", border:"1px solid var(--border-strong)", color:"var(--text-muted)", cursor:"pointer", display:"flex", alignItems:"center", gap:"4px", transition:"all 0.15s" }}
                              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color="var(--gold)"; el.style.borderColor="var(--gold)"; }}
                              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color="var(--text-muted)"; el.style.borderColor="var(--border-strong)"; }}
                          >
                            {isLoadingThis ? <Loader2 size={11} className="animate-spin"/> : <Eye size={11}/>}
                            Preview
                          </button>

                          {/* Import */}
                          {!isImported && (
                              <button
                                  onClick={(e) => { e.stopPropagation(); handleSingleImport(movie.id, e); }}
                                  disabled={isPending}
                                  className="btn-primary"
                                  style={{ padding:"5px 10px", fontSize:"12px", display:"flex", alignItems:"center", gap:"4px", opacity: isPending ? 0.6 : 1 }}
                              >
                                <Download size={11}/> Import
                              </button>
                          )}
                        </div>
                      </div>

                      {/* Duplicate warning */}
                      {dupWarning.has(movie.id) && (
                        <div style={{ marginTop:"4px", padding:"8px 14px", borderRadius:"6px", background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.3)", display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
                          <span style={{ fontSize:"12px", color:"#fbbf24", flex:1 }}>⚠ {dupWarning.get(movie.id)}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSingleImport(movie.id, e, true); }}
                            disabled={isPending}
                            style={{ padding:"4px 12px", borderRadius:"4px", border:"1px solid rgba(251,191,36,0.5)", background:"transparent", color:"#fbbf24", fontSize:"12px", cursor:"pointer", whiteSpace:"nowrap", opacity: isPending ? 0.6 : 1 }}
                          >
                            Import anyway
                          </button>
                          <button
                            type="button" onClick={(e) => { e.stopPropagation(); setDupWarning((prev) => { const m = new Map(prev); m.delete(movie.id); return m; }); }}
                            style={{ padding:"4px 8px", borderRadius:"4px", border:"none", background:"transparent", color:"var(--text-dim)", fontSize:"12px", cursor:"pointer" }}
                          >
                            {<X size={12}/>}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
        )}

        {/* ── Empty state ───────────────────────────────────────── */}
        {results.length === 0 && !error && (
            <div style={{ padding:"48px 0", textAlign:"center" }}>
              <p style={{ fontSize:"3rem", marginBottom:"12px" }}>🎬</p>
              <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", color:"var(--text-muted)" }}>
                {tab === "title"    && "Search for any movie title to import from TMDB"}
                {tab === "actor"    && "Enter an actor name to find all their movies"}
                {tab === "director" && "Enter a director name to find all their films"}
                {tab === "discover" && "Set filters and discover movies to import"}
              </p>
            </div>
        )}
      </div>
  );
}

function SearchBtn({ onClick, pending }: { onClick: () => void; pending: boolean }) {
  return (
      <button onClick={onClick} disabled={pending} className="btn-primary"
              style={{ display:"inline-flex", alignItems:"center", gap:"6px", whiteSpace:"nowrap", opacity: pending ? 0.6 : 1, flexShrink:0 }}>
        {pending ? <Loader2 size={14} className="animate-spin"/> : <Search size={14}/>}
        Search
      </button>
  );
}