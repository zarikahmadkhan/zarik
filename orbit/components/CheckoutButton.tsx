"use client";

import { useState } from "react";

// Live checkout when NEXT_PUBLIC_STRIPE_ENABLED=true; honest disabled
// state otherwise. No fake buy buttons.
export default function CheckoutButton({ tier }: { tier: "pro" | "premium" }) {
  const enabled = process.env.NEXT_PUBLIC_STRIPE_ENABLED === "true";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) {
    return (
      <button
        type="button"
        disabled
        className="btn-secondary mt-4 cursor-not-allowed opacity-60"
        title="Payments aren't enabled on this deployment yet"
      >
        Coming soon — v0.1 is free
      </button>
    );
  }

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Checkout failed.");
      }
      window.location.href = json.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed.");
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={checkout}
        disabled={busy}
        className="btn-primary mt-4 disabled:opacity-50"
      >
        {busy ? "Opening checkout…" : `Get ${tier === "pro" ? "Pro" : "Premium"}`}
      </button>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
