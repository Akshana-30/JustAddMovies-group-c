// src/app/admin-dashboard/(admin)/admin/genres/AdminGenresTable.tsx
"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { createGenre, updateGenre, deleteGenre } from "@/app/admin-dashboard/_actions/genre-actions";

interface Genre { id: string; name: string; description: string | null; _count: { movies: number } }

export function AdminGenresTable({ genres }: { genres: Genre[] }) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Genre | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const S: React.CSSProperties = { width:"100%", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:"4px", color:"var(--text)", fontSize:"13px", padding:"7px 10px", outline:"none" };
  const L: React.CSSProperties = { display:"block", fontSize:"11px", textTransform:"uppercase" as const, letterSpacing:"0.06em", color:"var(--text-muted)", marginBottom:"4px" };

  function openAdd() { setEditing(null); setName(""); setDescription(""); setError(""); setShowForm(true); }
  function openEdit(g: Genre) { setEditing(g); setName(g.name); setDescription(g.description ?? ""); setError(""); setShowForm(true); }

  function handleSubmit() {
    if (!name.trim()) { setError("Name is required"); return; }
    startTransition(async () => {
      const result = editing
        ? await updateGenre(editing.id, { name, description })
        : await createGenre({ name, description });
      if (!result.success) { setError(result.error ?? "Error"); return; }
      setShowForm(false);
      window.location.reload();
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete genre "${name}"?`)) return;
    startTransition(async () => { await deleteGenre(id); window.location.reload(); });
  }

  return (
    <>
      <div className="mb-4">
        <button onClick={openAdd} className="jam-btn-gold" style={{ display:"inline-flex", alignItems:"center", gap:"6px" }}>
          <Plus size={14} /> Add Genre
        </button>
      </div>

      {/* ── Table width ───────────────────────────────────────────── */}
      {/* Outer div caps at 600 px — identical to the maxWidth wrapper */}
      {/* on the People tables so both pages render at the same width. */}
      <div style={{ maxWidth:"600px" }}>
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor:"var(--border)" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", background:"var(--surface)" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid var(--border)" }}>
              {["Name","Movies",""].map((h) => (
                <th key={h} style={{ textAlign:"left", padding:"10px 14px", fontSize:"11px", letterSpacing:"0.1em", color:"var(--text-dim)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {genres.map((g) => (
              <tr key={g.id} style={{ borderBottom:"1px solid var(--border)" }}>
                <td style={{ padding:"10px 14px", fontSize:"13px", fontWeight:500, color:"var(--text)" }}>{g.name}</td>
                <td style={{ padding:"10px 14px", fontSize:"13px", color:"var(--gold)", textAlign:"center" }}>{g._count.movies}</td>
                <td style={{ padding:"10px 14px", textAlign:"right" }}>
                  <div style={{ display:"flex", gap:"6px", justifyContent:"flex-end" }}>
                    <button onClick={() => openEdit(g)} style={{ padding:"4px 10px", borderRadius:"4px", border:"1px solid var(--border-strong)", background:"transparent", color:"var(--text-muted)", cursor:"pointer", fontSize:"12px", display:"flex", alignItems:"center", gap:"4px" }}>
                      <Pencil size={11}/> Edit
                    </button>
                    <button onClick={() => handleDelete(g.id, g.name)} style={{ padding:"4px 10px", borderRadius:"4px", border:"1px solid rgba(248,113,113,0.3)", background:"transparent", color:"#f87171", cursor:"pointer", fontSize:"12px", display:"flex", alignItems:"center", gap:"4px" }}>
                      <Trash2 size={11}/> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {showForm && (
        <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.7)", padding:"1rem" }}>
          <div style={{ background:"var(--surface)", border:"1px solid var(--border-strong)", borderRadius:"12px", width:"100%", maxWidth:"420px", padding:"24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"18px" }}>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1.2rem", letterSpacing:"0.08em", color:"var(--gold)" }}>
                {editing ? "EDIT GENRE" : "ADD GENRE"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} style={{ background:"transparent", border:"none", color:"var(--text-muted)", cursor:"pointer" }}>{<X size={18}/>}</button>
            </div>
            {error && <div style={{ background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.3)", borderRadius:"6px", padding:"8px 12px", marginBottom:"14px", fontSize:"13px", color:"#f87171" }}>{error}</div>}
            <div style={{ display:"grid", gap:"12px" }}>
              <div><label style={L}>Name *</label><input style={S} value={name} onChange={(e) => setName(e.target.value)} placeholder="Drama" /></div>
              <div><label style={L}>Description</label><textarea style={{ ...S, resize:"vertical" as const, minHeight:"70px" }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description…" /></div>
            </div>
            <div style={{ display:"flex", gap:"10px", marginTop:"18px", justifyContent:"flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding:"7px 18px", borderRadius:"6px", border:"1px solid var(--border-strong)", background:"transparent", color:"var(--text-muted)", cursor:"pointer", fontSize:"13px" }}>Cancel</button>
              <button onClick={handleSubmit} disabled={isPending} style={{ padding:"7px 18px", borderRadius:"6px", border:"none", background:"var(--gold)", color:"var(--black)", cursor:"pointer", fontSize:"13px", fontWeight:500, display:"flex", alignItems:"center", gap:"6px", opacity: isPending ? 0.6 : 1 }}>
                {isPending ? <><Loader2 size={13} className="animate-spin"/>Saving…</> : editing ? "Save" : "Add Genre"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
