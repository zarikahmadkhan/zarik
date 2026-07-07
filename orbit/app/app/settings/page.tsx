"use client";

import { useEffect, useRef, useState } from "react";
import {
  useAppData,
  exportAppData,
  validateImport,
  resetToSeed,
} from "@/lib/storage";

export default function SettingsPage() {
  const { data, loaded, replace, update } = useAppData();
  const [status, setStatus] = useState<string | null>(null);

  // Checkout success redirect lands here with ?checkout=success&tier=...
  // Client-trusted entitlement until accounts exist (see STRIPE.md).
  useEffect(() => {
    if (!loaded) return;
    const params = new URLSearchParams(window.location.search);
    const tier = params.get("tier");
    if (
      params.get("checkout") === "success" &&
      (tier === "pro" || tier === "premium")
    ) {
      update((d) => ({ ...d, tier }));
      window.history.replaceState({}, "", "/app/settings");
      setStatus(`Welcome to ${tier === "pro" ? "Pro" : "Premium"} — everything is unlocked.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function say(msg: string) {
    setError(null);
    setStatus(msg);
  }

  function fail(msg: string) {
    setStatus(null);
    setError(msg);
  }

  function handleExport() {
    if (!data) {
      fail("Nothing to export yet.");
      return;
    }
    const blob = new Blob([exportAppData(data)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orbit-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    say("Exported. Check your downloads.");
  }

  async function handleImportFile(file: File) {
    try {
      const text = await file.text();
      const imported = validateImport(text);
      await replace(imported);
      say("Import complete. Your data has been replaced with the file.");
    } catch (e) {
      fail(e instanceof Error ? e.message : "Import failed.");
    }
  }

  async function handleReset() {
    const seeded = await resetToSeed();
    await replace(seeded);
    say("Reset to sample data.");
  }

  async function handleDeleteAll() {
    await replace(null);
    setConfirmDelete(false);
    say("All local data deleted.");
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="card mt-4">
        <h2 className="font-medium">Plan</h2>
        <p className="mt-1 text-sm text-fog-400">
          You&rsquo;re on{" "}
          <span className="capitalize text-fog-50">{data?.tier ?? "free"}</span>
          {(data?.tier ?? "free") === "free" &&
            " — the free tier covers the core loop."}
        </p>
      </div>

      <div className="card mt-4">
        <h2 className="font-medium">Your data</h2>
        <p className="mt-1 text-sm text-fog-400">
          {loaded
            ? data
              ? `${data.events.length} events · ${data.people.length} people · ${data.reps.length} reps stored in this browser.`
              : "No data stored yet. Load the demo or complete onboarding."
            : "Loading…"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={handleExport} className="btn-secondary">
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="btn-secondary"
          >
            Import JSON
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            aria-label="Import Orbit JSON export"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportFile(f);
              e.target.value = "";
            }}
          />
          <button type="button" onClick={handleReset} className="btn-secondary">
            Reset to sample data
          </button>
        </div>
      </div>

      <div className="card mt-4 border-danger/40">
        <h2 className="font-medium">Delete everything</h2>
        <p className="mt-1 text-sm text-fog-400">
          Removes all Orbit data from this browser. There is no undo — export
          first if you want a copy.
        </p>
        {confirmDelete ? (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleDeleteAll}
              className="btn bg-danger text-fog-50 hover:opacity-90"
            >
              Yes, delete all data
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="btn-secondary mt-4"
          >
            Delete all local data
          </button>
        )}
      </div>

      {(status || error) && (
        <p
          role="status"
          className={`mt-4 text-sm ${error ? "text-danger" : "text-moss-300"}`}
        >
          {error ?? status}
        </p>
      )}

      <div className="card mt-4">
        <h2 className="font-medium">Privacy</h2>
        <p className="mt-1 text-sm leading-relaxed text-fog-400">
          Orbit is private by default. In demo mode, everything you enter —
          events, people, notes, reflections — is stored only in this browser
          on this device. Nothing is sent to a server, nothing is shared, and
          there are no accounts, feeds, or public profiles. Orbit never reads
          your messages, never sends messages for you, and never imports your
          contacts. If you clear your browser storage, your data is gone, so
          use Export if you want a backup.
        </p>
      </div>
    </section>
  );
}
