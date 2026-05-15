// src/app/admin-dashboard/(admin)/admin/people/AdminPeopleTable.tsx
"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { createDirector, deleteDirector, createActor, deleteActor } from "@/app/admin-dashboard/_actions/people-actions";

interface Person { id: string; name: string; _count: { movies: number } }

// ── PersonTable ────────────────────────────────────────────────────
// Reusable for both Directors and Actors. The `type` prop determines
// which URL query param is used when linking the movie count to the
// filtered admin movies page.
function PersonTable({
  title, type, people, onCreate, onDelete, isPending,
}: {
  title: string;
  type: "director" | "actor";
  people: Person[];
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}) {
  const [newName, setNewName] = useState("");

  return (
    // ── Width constraint ───────────────────────────────────────────
    // maxWidth keeps the table at roughly half the page width so it
    // doesn't stretch uncomfortably across a wide viewport.
    <div style={{ maxWidth: "600px" }}>
      <div className="rounded-xl border overflow-hidden mb-6" style={{ borderColor:"var(--border)", background:"var(--surface)" }}>
        <div style={{ padding:"14px 16px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <h2 className="font-display text-lg tracking-wide" style={{ color:"var(--gold)" }}>{title.toUpperCase()}</h2>
          <div style={{ display:"flex", gap:"8px" }}>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && newName.trim()) { onCreate(newName.trim()); setNewName(""); } }}
              placeholder={`Add ${title.toLowerCase().replace("s","")} name…`}
              style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:"4px", color:"var(--text)", fontSize:"13px", padding:"6px 10px", outline:"none", width:"180px" }}
            />
            <button
              onClick={() => { if (newName.trim()) { onCreate(newName.trim()); setNewName(""); } }}
              disabled={isPending || !newName.trim()}
              className="jam-btn-gold"
              style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"6px 12px", opacity: isPending || !newName.trim() ? 0.5 : 1 }}
            >
              <Plus size={13}/> Add
            </button>
          </div>
        </div>

        {/* ── Fixed column widths ───────────────────────────────── */}
        {/* tableLayout fixed + explicit col widths keep the Movies  */}
        {/* column at the same position in both Directors and Actors  */}
        {/* regardless of how long the names in the first column are. */}
        <table style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed" }}>
          <colgroup>
            <col style={{ width:"280px" }} />  {/* Name — fixed so Movies never drifts */}
            <col style={{ width:"100px" }} />  {/* Movies count */}
            <col />                             {/* Remove button — takes remaining space */}
          </colgroup>
          <thead>
            <tr>
              {["Name","Movies",""].map((h) => (
                <th key={h} style={{ textAlign:"left", padding:"8px 14px", fontSize:"11px", letterSpacing:"0.1em", color:"var(--text-dim)", borderBottom:"1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.id} style={{ borderBottom:"1px solid var(--border)" }}>
                <td style={{ padding:"10px 14px", fontSize:"13px", color:"var(--text)" }}>{p.name}</td>

                {/* ── Movie count link ───────────────────────────── */}
                {/* Clicking the count navigates to the admin movies  */}
                {/* page pre-filtered to show only this person's films */}
                <td style={{ padding:"10px 14px", fontSize:"13px" }}>
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
              <tr><td colSpan={3} style={{ padding:"20px 14px", textAlign:"center", color:"var(--text-dim)", fontSize:"13px" }}>No {title.toLowerCase()} yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminPeopleTable({ directors, actors }: { directors: Person[]; actors: Person[] }) {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<"directors" | "actors">("directors");

  const makeDirector = (name: string) => startTransition(async () => { await createDirector(name); window.location.reload(); });
  const removeDirector = (id: string) => startTransition(async () => { await deleteDirector(id); window.location.reload(); });
  const makeActor = (name: string) => startTransition(async () => { await createActor(name); window.location.reload(); });
  const removeActor = (id: string) => startTransition(async () => { await deleteActor(id); window.location.reload(); });

  return (
    <>
      {/* ── Tab switcher ──────────────────────────────────────────── */}
      <div style={{ display:"flex", gap:"8px", marginBottom:"20px" }}>
        {(["directors", "actors"] as const).map((t) => {
          const active = tab === t;
          const count  = t === "directors" ? directors.length : actors.length;
          return (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding:"8px 20px", borderRadius:"8px", fontSize:"13px", fontWeight: active ? 600 : 400, cursor:"pointer", border:`1px solid ${active ? "var(--gold)" : "var(--border)"}`, background: active ? "rgba(232,160,48,0.12)" : "var(--surface)", color: active ? "var(--gold)" : "var(--text-muted)", transition:"all 0.15s", display:"flex", alignItems:"center", gap:"6px" }}>
              {t === "directors" ? "🎬" : "🎭"} {t.charAt(0).toUpperCase() + t.slice(1)}
              <span style={{ fontSize:"11px", padding:"1px 6px", borderRadius:"20px", background: active ? "rgba(232,160,48,0.2)" : "var(--surface2)", color: active ? "var(--gold)" : "var(--text-dim)" }}>{count}</span>
            </button>
          );
        })}
      </div>

      {tab === "directors" && (
        <PersonTable title="Directors" type="director" people={directors} onCreate={makeDirector} onDelete={removeDirector} isPending={isPending} />
      )}
      {tab === "actors" && (
        <PersonTable title="Actors" type="actor" people={actors} onCreate={makeActor} onDelete={removeActor} isPending={isPending} />
      )}
    </>
  );
}
