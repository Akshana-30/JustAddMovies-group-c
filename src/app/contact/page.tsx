// src/app/contact/page.tsx
import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-14">
      <div className="mb-10">
        <h1 className="font-display text-4xl tracking-wide" style={{ color: "var(--text)" }}>
          Get in <span style={{ color: "var(--gold)" }}>Touch</span>
        </h1>
        <p className="mt-2 font-serif italic" style={{ color: "var(--text-muted)" }}>
          Questions about an order, a missing title, or just want to talk films?
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_280px]">
        <ContactForm />

        <aside className="space-y-4">
          {[
            { icon: <Mail size={15} />,  title: "Email",          lines: ["hello@justaddmovies.se", "support@justaddmovies.se"] },
            { icon: <MapPin size={15} />, title: "Address",        lines: ["Filmgatan 42", "58227 Linköping, Sweden"] },
            { icon: <Clock size={15} />, title: "Support Hours",   lines: ["Mon–Fri  09:00–17:00", "Sat–Sun  Closed"] },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border p-4"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="mb-2 flex items-center gap-2 font-display text-sm tracking-widest"
                style={{ color: "var(--gold)" }}>
                {item.icon}
                {item.title.toUpperCase()}
              </div>
              {item.lines.map((line) => (
                <p key={line} className="text-sm" style={{ color: "var(--text-muted)" }}>{line}</p>
              ))}
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
