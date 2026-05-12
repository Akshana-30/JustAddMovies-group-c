// src/app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

const STACK = [
  { icon: "⚡", name: "Next.js 16",       desc: "App Router, Server Actions, async params, Turbopack" },
  { icon: "🐘", name: "PostgreSQL",        desc: "Relational database running in Docker" },
  { icon: "🔷", name: "Prisma ORM",        desc: "Type-safe queries, migrations, generated client" },
  { icon: "🔐", name: "Better Auth",       desc: "Email/password auth, sessions, role support" },
  { icon: "🎨", name: "Tailwind CSS v4",   desc: "Utility-first styling with @theme design tokens" },
  { icon: "🧩", name: "ShadCN / Radix UI", desc: "Accessible, composable UI primitives" },
  { icon: "✅", name: "Zod",               desc: "Runtime schema validation on all server actions" },
  { icon: "📋", name: "TanStack Form",   desc: "Performant form state with Zod resolver" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl tracking-wide" style={{ color: "var(--text)" }}>
          Just Add <span style={{ color: "var(--gold)" }}>Movies</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic" style={{ color: "var(--text-muted)" }}>
          We believe great cinema should be owned, not rented.
          Built by film lovers, for film lovers.
        </p>
      </div>

      {/* Mission */}
      <div className="about-block">
        <h2>Our Mission</h2>
        <p>
          Just Add Movies is a curated digital storefront for film enthusiasts who want to
          own — not rent — their favourite cinema. We source titles spanning every era and
          genre, from silent-era masterpieces to this seasons awards contenders, and make
          them available at honest prices. Every purchase is tied permanently to your account.
        </p>
      </div>

      {/* Team */}
        <div className="about-block">
            <h2>The Team</h2>

            <p className="mb-6">
                A group of four developers from GR18-Lexicon who share a deep love for cinema and clean code.
            </p>

            <div className="team-grid">
                {[
                    { name: "Per",     role: "Database/Backend", emoji: "👨‍💻" },
                    { name: "Akshana", role: "Frontend/UI/UX", emoji: "👩‍💻" },
                    { name: "Tobias",  role: "Backend/Database",  emoji: "🧑‍💻" },
                    { name: "Peter",   role: "UI/UX",    emoji: "👨‍🎨" },
                ].map((member, i) => (
                    <div key={i} className="team-card">
                        <div className="team-avatar">{member.emoji}</div>

                        <div className="team-name">
                            {member.name}
                        </div>

                        <div className="team-role">
                            {member.role}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      <hr className="divider" />

      {/* Tech Stack */}
      <div className="about-block">
        <h2>Tech Stack</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {STACK.map((s) => (
            <div
              key={s.name}
              className="flex items-start gap-3 rounded-xl border p-4"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <span className="mt-0.5 text-xl">{s.icon}</span>
              <div>
                <p className="font-medium" style={{ color: "var(--text)" }}>{s.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

