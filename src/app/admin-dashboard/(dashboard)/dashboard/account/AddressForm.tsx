"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { saveDefaultAddress, type AddressData } from "./_actions/address-actions";

interface Props {
  defaultAddress: (AddressData & { id: string }) | null;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--surface2)",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  color: "var(--text)",
  fontSize: "13px",
  padding: "8px 12px",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--text-muted)",
  marginBottom: "4px",
};

export function AddressForm({ defaultAddress }: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [street,  setStreet]  = useState(defaultAddress?.street  ?? "");
  const [city,    setCity]    = useState(defaultAddress?.city    ?? "");
  const [state,   setState]   = useState(defaultAddress?.state   ?? "");
  const [zipCode, setZipCode] = useState(defaultAddress?.zipCode ?? "");
  const [country, setCountry] = useState(defaultAddress?.country ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);

    if (!street.trim() || !city.trim() || !zipCode.trim() || !country.trim()) {
      setError("Street, city, zip code and country are required.");
      return;
    }

    startTransition(async () => {
      const result = await saveDefaultAddress({ street, city, state, zipCode, country });
      if (result.success) {
        setSaved(true);
      } else {
        setError(result.error ?? "Failed to save address.");
      }
    });
  }

  return (
    <div className="rounded-xl border p-6 mb-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-lg tracking-wide" style={{ color: "var(--gold)" }}>
            DEFAULT SHIPPING ADDRESS
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Pre-filled at checkout — you can always edit it there
          </p>
        </div>
        {defaultAddress && (
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(232,160,48,0.15)", color: "var(--gold)" }}>
            Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">

          {/* Street */}
          <div>
            <label style={labelStyle}>Street Address *</label>
            <input
              style={inputStyle}
              value={street}
              onChange={e => setStreet(e.target.value)}
              placeholder="123 Main Street"
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>City *</label>
              <input
                style={inputStyle}
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Stockholm"
              />
            </div>
            <div>
              <label style={labelStyle}>State / Region</label>
              <input
                style={inputStyle}
                value={state}
                onChange={e => setState(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Zip + Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Zip / Postal Code *</label>
              <input
                style={inputStyle}
                value={zipCode}
                onChange={e => setZipCode(e.target.value)}
                placeholder="11120"
              />
            </div>
            <div>
              <label style={labelStyle}>Country *</label>
              <input
                style={inputStyle}
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="Sweden"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>
          )}
          {saved && (
            <p className="text-xs" style={{ color: "#4ade80" }}>Address saved successfully!</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: "8px 20px",
                borderRadius: "6px",
                border: "none",
                background: "var(--gold)",
                color: "#1a1a1a",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                opacity: isPending ? 0.6 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {isPending ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Address"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
