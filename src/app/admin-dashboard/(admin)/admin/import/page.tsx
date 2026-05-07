// src/app/admin-dashboard/(admin)/admin/import/page.tsx
import type { Metadata } from "next";
import { TmdbImportClient } from "./TmdbImportClient";

export const metadata: Metadata = { title: "Import from TMDB" };

export default function TmdbImportPage() {
  const hasKey = !!process.env.TMDB_API_KEY;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl tracking-wide" style={{ color: "var(--text)" }}>
          Import from <span style={{ color: "var(--gold)" }}>TMDB</span>
        </h1>
        <p className="mt-1 font-serif italic" style={{ color: "var(--text-muted)" }}>
          Search The Movie Database and import movies with full metadata
        </p>
      </div>

      {!hasKey ? (
        <div style={{
          background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)",
          borderRadius: "10px", padding: "20px 24px",
        }}>
          <p style={{ color: "#f87171", fontWeight: 500, marginBottom: "8px" }}>
            ⚠ TMDB_API_KEY not configured
          </p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Add your TMDB API key to <code style={{ color: "var(--gold)" }}>.env</code>:
          </p>
          <pre style={{
            marginTop: "10px", padding: "12px 16px",
            background: "var(--surface2)", borderRadius: "6px",
            fontSize: "13px", color: "var(--gold)",
          }}>
            TMDB_API_KEY=&quot;your_api_key_here&quot;
          </pre>
          <p style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "10px" }}>
            Get a free API key at{" "}
            <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer"
              style={{ color: "var(--gold)" }}>
              themoviedb.org/settings/api
            </a>
          </p>
        </div>
      ) : (
        <TmdbImportClient />
      )}
    </div>
  );
}
