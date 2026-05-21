// src/app/admin-dashboard/(admin)/admin/people/AdminPeopleTable.tsx
"use client";

import { useState, useTransition } from "react";
import { Trash2, Search } from "lucide-react";
import Link from "next/link";
import { deleteDirector, deleteActor } from "@/app/admin-dashboard/_actions/people-actions";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 20;

interface Person { id: string; name: string; _count: { movies: number } }

// ── PersonTable ────────────────────────────────────────────────────
// Reusable for both Directors and Actors. The `type` prop determines
// which URL query param is used when linking the movie count to the
// filtered admin movies page.
function PersonTable({
  title, type, people, onDelete, isPending,
}: {
  title: string;
  type: "director" | "actor";
  people: Person[];
  onDelete: (id: string) => void;
  isPending: boolean;
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);


  const filtered = search.trim()
    ? people.filter(p => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    : people;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function getPageItems(): (number | "ellipsis")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const items: (number | "ellipsis")[] = [];
    const around = new Set(
      [1, totalPages, currentPage - 1, currentPage, currentPage + 1].filter(n => n >= 1 && n <= totalPages)
    );
    let prev = 0;
    for (const n of [...around].sort((a, b) => a - b)) {
      if (n - prev > 1) items.push("ellipsis");
      items.push(n);
      prev = n;
    }
    return items;
  }

  return (
    // ── Width constraint ───────────────────────────────────────────
    // maxWidth keeps the table at roughly half the page width so it
    // doesn't stretch uncomfortably across a wide viewport.
    <div style={{ maxWidth: "600px" }}>
      <div className="rounded-xl border overflow-hidden mb-6">
        <div className="border border-(--gold)/40 bg-sidebar-accent/40! dark:bg-sidebar-accent/30!" style={{ padding:"14px 16px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px" }}>
          <h2 className="font-display text-lg tracking-wide" style={{ color:"var(--gold)" }}>{title.toUpperCase()}</h2>
          <div style={{ position:"relative", flex:1, maxWidth:"280px" }}>
            <Search size={13} style={{ position:"absolute", left:"9px", top:"50%", transform:"translateY(-50%)", color:"var(--text-muted)", pointerEvents:"none" }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder={`Search ${title.toLowerCase()}…`}
              style={{ width:"100%", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:"6px", color:"var(--text)", fontSize:"13px", padding:"6px 10px 6px 28px", outline:"none" }}
            />
          </div>
          {search && (
            <span style={{ fontSize:"12px", color:"var(--text-dim)", whiteSpace:"nowrap" }}>
              {filtered.length} of {people.length}
            </span>
          )}
        </div>

        {/* ── Fixed column widths ───────────────────────────────── */}
        {/* tableLayout fixed + explicit col widths keep the Movies  */}
        {/* column at the same position in both Directors and Actors  */}
        {/* regardless of how long the names in the first column are. */}
        <table className=" border-(--gold)/40 border-b border-r border-l  bg-sidebar-accent/40! dark:bg-sidebar-accent/30! " style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed" }}>
          <colgroup>
            {/* Name — pinned so the Movies column never drifts */}
            <col style={{ width:"280px" }} />
            {/* Movies count */}
            <col style={{ width:"100px" }} />
            {/* Remove button — takes the remaining space */}
            <col />
          </colgroup>
          <thead>
            <tr>
              {["Name","Movies",""].map((h) => (
                <th className="border-b border-(--gold)/60 text-(--gold)/70" key={h} style={{ textAlign: h === "Movies" ? "center" : "left", padding:"8px 14px", fontSize:"11px", letterSpacing:"0.1em", borderBottom:"1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id} style={{ borderBottom:"1px solid var(--border)" }}>
                <td style={{ padding:"10px 14px", fontSize:"13px", color:"var(--text)" }}>{p.name}</td>

                {/* ── Movie count link ───────────────────────────── */}
                {/* Clicking the count navigates to the admin movies  */}
                {/* page pre-filtered to show only this person's films */}
                <td style={{ padding:"10px 14px", fontSize:"13px", textAlign:"center" }}>
                  {p._count.movies > 0 ? (
                    <Link
                      href={`/admin-dashboard/admin/movies?${type}=${p.id}`}
                      style={{ color:"var(--gold)", fontWeight:500, textDecoration:"underline", textUnderlineOffset:"3px" }}
                    >
                      {p._count.movies}
                    </Link>
                  ) : (
                    <span style={{ color:"var(--text-dim)" }}>0</span>
                  )}
                </td>

                <td style={{ padding:"10px 14px", textAlign:"right" }}>
                  <button onClick={() => { if(confirm(`Remove ${p.name}?`)) onDelete(p.id); }}
                    style={{ padding:"4px 10px", borderRadius:"4px", border:"1px solid rgba(248,113,113,0.3)", background:"transparent", color:"#f87171", cursor:"pointer", fontSize:"12px", display:"inline-flex", alignItems:"center", gap:"4px" }}>
                    <Trash2 size={11}/> Remove
                  </button>
                </td>
              </tr>
            ))}
            {people.length === 0 && (
              <tr><td  className="border-t border-(--gold)/60" colSpan={3} style={{ padding:"20px 14px", textAlign:"center", color:"var(--text-dim)", fontSize:"13px" }}>No {title.toLowerCase()} yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

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

              {getPageItems().map((item, i) =>
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
              )}

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
    </div>
  );
}

export function AdminPeopleTable({ directors, actors }: { directors: Person[]; actors: Person[] }) {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<"directors" | "actors">("directors");
  const [tabKey, setTabKey] = useState(0); // forces PersonTable remount on tab switch, resetting search

const removeDirector = (id: string) => startTransition(async () => { await deleteDirector(id); window.location.reload(); });
 const removeActor = (id: string) => startTransition(async () => { await deleteActor(id); window.location.reload(); });

  return (
    <>
      {/* ── Tab switcher ──────────────────────────────────────────── */}
      <div style={{ display:"flex", gap:"8px", marginBottom:"20px" }}>
        {(["directors", "actors"] as const).map((t) => {
          const active = tab === t;
          const count  = t === "directors" ? directors.length : actors.length;
          return (
            <button key={t} onClick={() => { setTab(t); setTabKey(k => k + 1); }}
              style={{ padding:"8px 20px", borderRadius:"8px", fontSize:"13px", fontWeight: active ? 600 : 400, cursor:"pointer", border:`1px solid ${active ? "var(--gold)" : "var(--border)"}`, background: active ? "rgba(232,160,48,0.12)" : "var(--surface)", color: active ? "var(--gold)" : "var(--text-muted)", transition:"all 0.15s", display:"flex", alignItems:"center", gap:"6px" }}>
              {t === "directors" ? "🎬" : "🎭"} {t.charAt(0).toUpperCase() + t.slice(1)}
              <span style={{ fontSize:"11px", padding:"1px 6px", borderRadius:"20px", background: active ? "rgba(232,160,48,0.2)" : "var(--surface2)", color: active ? "var(--gold)" : "var(--text-dim)" }}>{count}</span>
            </button>
          );
        })}
      </div>

      {tab === "directors" && (
        <PersonTable key={`directors-${tabKey}`} title="Directors" type="director" people={directors} onDelete={removeDirector} isPending={isPending} />
      )}
      {tab === "actors" && (
        <PersonTable key={`actors-${tabKey}`} title="Actors" type="actor" people={actors} onDelete={removeActor} isPending={isPending} />
      )}
    </>
  );
}
