// src/app/admin-dashboard/(dashboard)/dashboard/account/AccountEditForm.tsx
"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, Lock } from "lucide-react";
import { updateProfile } from "./account-actions";
import { authClient } from "@/lib/auth-client";

interface Props {
  userId: string;
  initialName: string;
  initialPhone: string;
  initialAddress: string;
}

function parseAddress(raw: string) {
  if (!raw.trim()) return { street: "", postalCode: "", city: "", country: "Sweden" };

  // Try comma-separated: "Street, PostalCode City, Country"
  const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 3) {
    const country    = parts[parts.length - 1];
    const postalCity = parts[parts.length - 2];
    const street     = parts.slice(0, parts.length - 2).join(", ");
    const m = postalCity.match(/^(\d{3}\s?\d{2})\s+(.+)$/);
    return { street, postalCode: m ? m[1] : "", city: m ? m[2] : postalCity, country };
  }

  // Fallback: newline-separated (old free-form format)
  const lines = raw.split(/\n/).map((s) => s.trim()).filter(Boolean);
  const street = lines[0] ?? "";
  const postalCity = lines[1] ?? "";
  const m = postalCity.match(/^(\d{3}\s?\d{2})\s+(.+)$/);
  return {
    street,
    postalCode: m ? m[1] : "",
    city:       m ? m[2] : postalCity,
    country:    lines[2] ?? "Sweden",
  };
}

export function AccountEditForm({ userId, initialName, initialPhone, initialAddress }: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const parsed = parseAddress(initialAddress);
  const [name,       setName]       = useState(initialName);
  const [phone,      setPhone]      = useState(initialPhone);
  const [street,     setStreet]     = useState(parsed.street);
  const [postalCode, setPostalCode] = useState(parsed.postalCode);
  const [city,       setCity]       = useState(parsed.city);
  const [country,    setCountry]    = useState(parsed.country);

  // Change password
  const [pwExpanded,   setPwExpanded]   = useState(false);
  const [currentPw,    setCurrentPw]    = useState("");
  const [newPw,        setNewPw]        = useState("");
  const [confirmPw,    setConfirmPw]    = useState("");
  const [pwLoading,    setPwLoading]    = useState(false);
  const [pwSaved,      setPwSaved]      = useState(false);
  const [pwError,      setPwError]      = useState("");

  async function handleChangePassword() {
    setPwError(""); setPwSaved(false);
    if (newPw.length < 8)          { setPwError("Password must be at least 8 characters"); return; }
    if (!/[A-Z]/.test(newPw))      { setPwError("Must contain at least one uppercase letter"); return; }
    if (!/[0-9]/.test(newPw))      { setPwError("Must contain at least one number"); return; }
    if (newPw !== confirmPw)        { setPwError("Passwords do not match"); return; }
    setPwLoading(true);
    const { error } = await authClient.changePassword({
      currentPassword: currentPw,
      newPassword: newPw,
      revokeOtherSessions: false,
    });
    setPwLoading(false);
    if (error) { setPwError(error.message ?? "Failed to change password"); return; }
    setPwSaved(true);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => { setPwSaved(false); setPwExpanded(false); }, 3000);
  }

  function handleSave() {
    setError(""); setSaved(false);
    const shippingAddress = street.trim()
      ? `${street.trim()}, ${postalCode.trim()} ${city.trim()}, ${country.trim() || "Sweden"}`
      : "";
    startTransition(async () => {
      const result = await updateProfile(userId, { name, phone, shippingAddress });
      if ((result as any).success) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else setError((result as any).error ?? "Failed to save");
    });
  }

  const IS: React.CSSProperties = {
    width: "100%", background: "var(--surface2)",
    border: "1px solid var(--border)", borderRadius: "4px",
    color: "var(--text)", fontSize: "13px",
    padding: "8px 10px", outline: "none",
    transition: "border-color 0.15s",
  };
  const LS: React.CSSProperties = {
    display: "block", fontSize: "11px", textTransform: "uppercase",
    letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "5px",
  };

  return (
    <div className="rounded-xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <h2 className="font-display text-lg tracking-wide mb-5" style={{ color: "var(--gold)" }}>
        EDIT PROFILE
      </h2>

      {error && (
        <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "8px 12px", marginBottom: "14px", fontSize: "13px", color: "#f87171" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: "14px" }}>
        <div>
          <label style={LS}>Display Name</label>
          <input style={IS} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label style={LS}>Phone Number</label>
          <input style={IS} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+46 70 123 45 67" type="tel" />
        </div>

        {/* Default Shipping Address — structured fields */}
        <div>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gold)", marginBottom: "10px", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>
            Default Shipping Address
          </p>
          <div style={{ display: "grid", gap: "10px" }}>
            <div>
              <label style={LS}>Street Address</label>
              <input style={IS} value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Kungsgatan 12" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={LS}>Postal Code</label>
                <input style={IS} value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="123 45" maxLength={6} />
              </div>
              <div>
                <label style={LS}>City</label>
                <input style={IS} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Stockholm" />
              </div>
            </div>
            <div>
              <label style={LS}>Country</label>
              <input style={IS} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Sweden" />
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "6px" }}>
            This will pre-fill the delivery address at checkout.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "18px" }}>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="jam-btn-gold"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", opacity: isPending ? 0.6 : 1 }}
        >
          {isPending
            ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
            : saved
            ? <><Check size={14} /> Saved!</>
            : "Save Changes"
          }
        </button>
        {saved && <span style={{ fontSize: "13px", color: "#4ade80" }}>Profile updated</span>}
      </div>

      {/* ── Change Password ───────────────────────────────────────── */}
      <div style={{ marginTop: "28px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
        <button
          type="button"
          onClick={() => { setPwExpanded(!pwExpanded); setPwError(""); }}
          style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: pwExpanded ? "var(--gold)" : "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <Lock size={14} />
          {pwExpanded ? "Cancel" : "Change password"}
        </button>

        {pwExpanded && (
          <div style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
            {pwError && (
              <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "8px 12px", fontSize: "13px", color: "#f87171" }}>
                {pwError}
              </div>
            )}
            {pwSaved && (
              <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "6px", padding: "8px 12px", fontSize: "13px", color: "#4ade80", display: "flex", alignItems: "center", gap: "6px" }}>
                <Check size={13} /> Password updated
              </div>
            )}
            <div>
              <label style={LS}>Current password</label>
              <input style={IS} type="password" autoComplete="current-password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" />
            </div>
            <div>
              <label style={LS}>New password</label>
              <input style={IS} type="password" autoComplete="new-password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="••••••••" />
              <p style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "4px" }}>
                Min 8 characters, one uppercase letter, one number.
              </p>
            </div>
            <div>
              <label style={LS}>Confirm new password</label>
              <input style={IS} type="password" autoComplete="new-password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="••••••••" />
            </div>
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={pwLoading}
              className="jam-btn-gold"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", opacity: pwLoading ? 0.6 : 1 }}
            >
              {pwLoading ? <><Loader2 size={14} className="animate-spin" /> Updating…</> : "Update password"}
            </button>
          </div>
        )}
      </div>

      <p style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "14px" }}>
        To change your email, please contact support.
      </p>
    </div>
  );
}
