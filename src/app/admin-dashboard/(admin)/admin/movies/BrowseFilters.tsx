// src/app/movies/BrowseFilters.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface Genre    { id: string; name: string }
interface Director { id: string; name: string }
interface Actor    { id: string; name: string }

interface Props {
  genres:     Genre[];
  directors:  Director[];
  actors:     Actor[];
  maxPrice:   number;
  maxRuntime: number;
}

const RATINGS = [
  { value: "",    label: "Any rating" },
  { value: "9",   label: "★ 9.0+" },
  { value: "8.5", label: "★ 8.5+" },
  { value: "8",   label: "★ 8.0+" },
  { value: "7.5", label: "★ 7.5+" },
  { value: "7",   label: "★ 7.0+" },
  { value: "6",   label: "★ 6.0+" },
];

export function BrowseFilters({ genres, directors, actors, maxPrice, maxRuntime }: Props) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const get = (key: string) => searchParams.get(key) ?? "";

  const update = useCallback((updates: Record<string, string>) => {
    const p = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val) p.set(key, val); else p.delete(key);
    }
    p.delete("page");
    router.push(`${pathname}?${p.toString()}`);
  }, [router, pathname, searchParams]);

  const IS: React.CSSProperties = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "4px", color: "var(--text)", fontSize: "13px",
    padding: "7px 10px", outline: "none", transition: "border-color 0.15s",
  };

  const hasFilters = ["q","genreId","directorId","actorId","ratingMin","yearMin","yearMax","runtimeMax","priceMax"]
    .some((k) => searchParams.has(k));

  interface ChipProps {
    key: string;
    label: string | undefined;
  }

  return (
    <div style={{ marginBottom: "24px" }}>

      {/* Main row */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", alignItems:"center", marginBottom:"6px" }}>
        {/* Search */}
        <div style={{ position:"relative", flex:"1", minWidth:"180px" }}>
          <Search size={13} style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)", pointerEvents:"none" }}/>
          <input type="text" placeholder="Search title…"
            defaultValue={get("q")}
            onChange={(e) => update({ q: e.target.value })}
            style={{ ...IS, width:"100%", paddingLeft:"30px" }} />
        </div>

        {/* Genre */}
        <select title="All genres" value={get("genreId")} onChange={(e) => update({ genreId: e.target.value })}
          style={{ ...IS, minWidth:"130px" }}>
          <option value="">All Genres</option>
          {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>

        {/* Rating
        <select title="rating" value={get("ratingMin")} onChange={(e) => update({ ratingMin: e.target.value })}
          style={{ ...IS, minWidth:"130px" }}>
          {RATINGS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select> */}

        {/* Sort */}
        <select title="sort" value={get("sort") || "title"} onChange={(e) => update({ sort: e.target.value })}
          style={{ ...IS, minWidth:"160px" }}>
          <option value="title">Sort: A–Z</option>
          <option value="year-desc">Newest First</option>
          <option value="year-asc">Oldest First</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="runtime-asc">Shortest First</option>
          <option value="runtime-desc">Longest First</option>
        </select>

        {/* Advanced toggle */}
        <button onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            display:"flex", alignItems:"center", gap:"6px",
            padding:"7px 14px", borderRadius:"4px", cursor:"pointer",
            background: showAdvanced ? "rgba(232,160,48,0.1)" : "transparent",
            border:`1px solid ${showAdvanced ? "var(--gold)" : "var(--border-strong)"}`,
            color: showAdvanced ? "var(--gold)" : "var(--text-muted)",
            fontSize:"13px", transition:"all 0.15s",
          }}>
          <SlidersHorizontal size={13}/> More {showAdvanced ? "▲" : "▼"}
        </button>

        {hasFilters && (
          <button onClick={() => router.push(pathname)}
            style={{ display:"flex", alignItems:"center", gap:"4px", padding:"7px 12px", borderRadius:"4px", cursor:"pointer", background:"transparent", border:"1px solid rgba(248,113,113,0.3)", color:"#f87171", fontSize:"13px" }}>
            <X size={12}/> Clear
          </button>
        )}
      </div>

      {/* Advanced panel */}
      {showAdvanced && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:"12px", padding:"16px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"8px", marginTop:"4px" }}>
          <div>
            <label style={{ display:"block", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--text-muted)", marginBottom:"5px" }}>Director</label>
            <select title="director" value={get("directorId")} onChange={(e) => update({ directorId: e.target.value })} style={{ ...IS, width:"100%" }}>
              <option value="">Any Director</option>
              {directors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display:"block", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--text-muted)", marginBottom:"5px" }}>Actor</label>
            <select title="actor" value={get("actorId")} onChange={(e) => update({ actorId: e.target.value })} style={{ ...IS, width:"100%" }}>
              <option value="">Any Actor</option>
              {actors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display:"block", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--text-muted)", marginBottom:"5px" }}>
              Year: {get("yearMin") || "Any"} – {get("yearMax") || "Any"}
            </label>
            <div style={{ display:"flex", gap:"6px" }}>
              <input type="number" placeholder="From" defaultValue={get("yearMin")} min={1900} max={2025}
                onBlur={(e) => update({ yearMin: e.target.value })} style={{ ...IS, flex:1 }} />
              <input type="number" placeholder="To"   defaultValue={get("yearMax")} min={1900} max={2025}
                onBlur={(e) => update({ yearMax: e.target.value })} style={{ ...IS, flex:1 }} />
            </div>
          </div>
          <div>
            <label style={{ display:"block", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--text-muted)", marginBottom:"5px" }}>
              Max runtime: {get("runtimeMax") ? `${get("runtimeMax")} min` : "Any"}
            </label>
            <input title="m-runtime" type="range" min={30} max={maxRuntime} step={10}
              value={get("runtimeMax") || maxRuntime}
              onChange={(e) => update({ runtimeMax: e.target.value === String(maxRuntime) ? "" : e.target.value })}
              style={{ width:"100%", accentColor:"var(--gold)" }} />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:"var(--text-dim)" }}>
              <span>30m</span><span>{maxRuntime}m</span>
            </div>
          </div>
          <div>
            <label style={{ display:"block", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--text-muted)", marginBottom:"5px" }}>
              Max price: {get("priceMax") ? `${get("priceMax")} kr` : "Any"}
            </label>
            <input title="m-price" type="range" min={0} max={maxPrice} step={5}
              value={get("priceMax") || maxPrice}
              onChange={(e) => update({ priceMax: e.target.value === String(maxPrice) ? "" : e.target.value })}
              style={{ width:"100%", accentColor:"var(--gold)" }} />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:"var(--text-dim)" }}>
              <span>0 kr</span><span>{maxPrice} kr</span>
            </div>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {hasFilters && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"8px" }}>
          {[
            get("q")          && { key:"q",          label:`"${get("q")}"` },
            get("genreId")    && { key:"genreId",     label:genres.find(g=>g.id===get("genreId"))?.name },
            get("directorId") && { key:"directorId",  label:directors.find(d=>d.id===get("directorId"))?.name },
            get("actorId")    && { key:"actorId",     label:actors.find(a=>a.id===get("actorId"))?.name },
            get("ratingMin")  && { key:"ratingMin",   label:`★ ${get("ratingMin")}+` },
            get("yearMin")    && { key:"yearMin",      label:`From ${get("yearMin")}` },
            get("yearMax")    && { key:"yearMax",      label:`To ${get("yearMax")}` },
            get("runtimeMax") && { key:"runtimeMax",   label:`≤${get("runtimeMax")} min` },
            get("priceMax")   && { key:"priceMax",     label:`≤${get("priceMax")} kr` },
          ].filter((chip): chip is ChipProps => Boolean(chip)).map(chip => (
            <button key={chip.key} onClick={() => update({ [chip.key]: "" })}
              style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 10px", borderRadius:"20px", fontSize:"11px", border:"1px solid rgba(232,160,48,0.4)", background:"rgba(232,160,48,0.08)", color:"var(--gold)", cursor:"pointer" }}>
              {chip.label} <X size={10}/>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
