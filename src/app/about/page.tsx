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
                    { name: "Per",     role: "Developer", emoji: "👨‍💻" },
                    { name: "Akshana", role: "Developer", emoji: "👩‍💻" },
                    { name: "Tobias",  role: "Developer",  emoji: "🧑‍💻" },
                    { name: "Peter",   role: "Developer",    emoji: "👨‍🎨" },
                ].map((member, i) => (
                    <div key={i} className="team-card" style={{ background: "var(--surface2)", borderColor: "var(--border-strong)" }}>
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

      {/* Cookie Policy */}
      <div className="about-block" id="cookies">
        <h2>Cookie Policy</h2>
        <p className="mb-4">
          Just Add Movies uses cookies to make the site work and, with your permission, to help us
          understand how people use it. Below is a full list of every cookie we set.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--gold)" }}>Cookie</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--gold)" }}>Type</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--gold)" }}>Duration</th>
                <th className="text-left py-2 font-semibold" style={{ color: "var(--gold)" }}>Purpose</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--text-muted)" }}>
              {[
                { name: "cart",             type: "Essential",  duration: "7 days",  purpose: "Stores your shopping cart items so they persist across page loads and sessions." },
                { name: "cookie_consent",   type: "Essential",  duration: "1 year",  purpose: "Remembers your cookie preference so we do not ask again on every visit." },
                { name: "better-auth.*",    type: "Essential",  duration: "Session", purpose: "Session and authentication tokens required to keep you signed in." },
              ].map((row) => (
                <tr key={row.name} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="py-2 pr-4 font-mono text-xs" style={{ color: "var(--text)" }}>{row.name}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "rgba(232,160,48,0.15)", color: "var(--gold)" }}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">{row.duration}</td>
                  <td className="py-2 leading-relaxed">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
          <strong style={{ color: "var(--text)" }}>Essential cookies</strong> are set under the legitimate-interest
          basis of GDPR Article 6(1)(b) (necessary for the performance of a contract) and cannot be disabled without
          breaking core site functionality. You can clear all cookies at any time through your browser settings.
        </p>
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
              style={{ background: "var(--surface2)", borderColor: "var(--border-strong)" }}
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

