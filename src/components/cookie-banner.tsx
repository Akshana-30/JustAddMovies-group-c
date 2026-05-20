"use client";

import { useState, useTransition } from "react";
import { saveConsent } from "@/lib/consent-actions";
import Link from "next/link";
import Image from "next/image";

export function CookieBanner() {
  const [visible, setVisible] = useState(true);
  const [isPending, startTransition] = useTransition();

  function handleChoice(choice: "accepted" | "essential_only") {
    startTransition(async () => {
      await saveConsent(choice);
      setVisible(false);
    });
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "var(--surface, hsl(var(--card)))",
        borderTop: "1px solid var(--border, hsl(var(--border)))",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Icon + text */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: 1, minWidth: "280px" }}>
          <Image
            src="/icons8-cookie-100.png"
            alt="Cookie"
            width={32}
            height={32}
            style={{ flexShrink: 0 }}
          />
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text, inherit)", marginBottom: "4px" }}>
              We use cookies
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted, hsl(var(--muted-foreground)))", lineHeight: 1.5 }}>
              This site uses <strong style={{ color: "var(--gold, #e8a030)" }}>essential cookies only</strong> — for
              your shopping cart and session. No tracking or analytics cookies are used.{" "}
              <Link
                href="/about#cookies"
                style={{ color: "var(--gold, #e8a030)", textDecoration: "underline" }}
              >
                Learn more
              </Link>
            </p>
          </div>
        </div>

        {/* Button */}
        <div style={{ flexShrink: 0 }}>
          <button
            onClick={() => handleChoice("essential_only")}
            disabled={isPending}
            style={{
              padding: "8px 24px",
              borderRadius: "6px",
              border: "none",
              background: "var(--gold, #e8a030)",
              color: "#1a1a1a",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              opacity: isPending ? 0.6 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {isPending ? "…" : "Understood"}
          </button>
        </div>
      </div>
    </div>
  );
}
