"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAppData } from "@/lib/storage";
import { getAI } from "@/lib/ai";
import EventForm from "@/components/EventForm";
import type { EventStatus, OrbitEvent } from "@/lib/types";

type Mode = "list" | "add" | "paste";
type StatusFilter = "all" | EventStatus;
type SortKey = "date" | "score";

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "interested", label: "Interested" },
  { value: "planned", label: "Planned" },
  { value: "attended", label: "Attended" },
  { value: "skipped", label: "Skipped" },
];

export default function EventsPage() {
  const { data, loaded, update } = useAppData();
  const [mode, setMode] = useState<Mode>("list");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [hoodFilter, setHoodFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [pasteText, setPasteText] = useState("");
  const [parsedDraft, setParsedDraft] = useState<Partial<OrbitEvent> | null>(
    null
  );

  const ai = getAI();
  const events = useMemo(() => data?.events ?? [], [data]);
  const profile = data?.profile ?? null;

  const types = Array.from(new Set(events.map((e) => e.eventType))).sort();
  const hoods = Array.from(
    new Set(events.map((e) => e.neighborhood).filter(Boolean))
  ).sort() as string[];

  const scores = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of events) m.set(e.id, ai.scoreEvent(e, profile).total);
    return m;
  }, [events, profile, ai]);

  const visible = events
    .filter((e) => statusFilter === "all" || e.status === statusFilter)
    .filter((e) => typeFilter === "all" || e.eventType === typeFilter)
    .filter((e) => hoodFilter === "all" || e.neighborhood === hoodFilter)
    .sort((a, b) =>
      sortKey === "date"
        ? a.date.localeCompare(b.date)
        : (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0)
    );

  async function saveEvent(event: OrbitEvent) {
    await update((d) => ({ ...d, events: [...d.events, event] }));
    setMode("list");
    setParsedDraft(null);
    setPasteText("");
  }

  function runParser() {
    if (!pasteText.trim()) return;
    const p = ai.parseEventFromText(pasteText);
    setParsedDraft({
      title: p.title,
      date: p.date,
      startTime: p.startTime,
      location: p.location,
      cost: p.cost ?? 0,
      eventType: p.eventType,
      vibeTags: p.vibeTags,
      socialDifficulty: p.socialDifficulty,
      conversationPotential: p.conversationPotential,
      repeatPotential: p.repeatPotential,
      notes: `Arrival: ${p.arrivalStrategy}\nRep: ${p.microChallenge}`,
    });
  }

  if (!loaded) return <p className="text-fog-400">Loading…</p>;

  if (mode === "add" || parsedDraft) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">
          {parsedDraft ? "Review parsed event" : "Add event"}
        </h1>
        {parsedDraft && (
          <p className="mt-1 text-sm text-fog-400">
            Parsed from your pasted text — fix anything it got wrong.
          </p>
        )}
        <div className="card mt-4">
          <EventForm
            initial={parsedDraft ?? undefined}
            onSave={saveEvent}
            onCancel={() => {
              setMode("list");
              setParsedDraft(null);
            }}
            saveLabel="Add event"
          />
        </div>
      </section>
    );
  }

  if (mode === "paste") {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Paste an event</h1>
        <p className="mt-1 text-sm text-fog-400">
          Paste the text of a listing — a flyer, an email, a description — and
          Orbit will structure it.
        </p>
        <div className="card mt-4">
          <label htmlFor="paste" className="label">
            Event text
          </label>
          <textarea
            id="paste"
            className="input min-h-36"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={"Brooklyn Board Game Night\nThursday 7:30pm at Sip & Play, free entry"}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={runParser}
              className="btn-primary"
              disabled={!pasteText.trim()}
            >
              Parse it
            </button>
            <button
              type="button"
              onClick={() => setMode("list")}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("paste")}
            className="btn-secondary"
          >
            Paste
          </button>
          <button
            type="button"
            onClick={() => setMode("add")}
            className="btn-primary"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={`min-h-tap rounded-lg border px-3 text-sm ${
              statusFilter === f.value
                ? "border-moss-500 bg-moss-700/30 text-fog-50"
                : "border-ink-600 bg-ink-800 text-fog-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {types.length > 1 && (
          <select
            aria-label="Filter by type"
            className="input w-auto"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t.replaceAll("-", " ")}
              </option>
            ))}
          </select>
        )}
        {hoods.length > 1 && (
          <select
            aria-label="Filter by neighborhood"
            className="input w-auto"
            value={hoodFilter}
            onChange={(e) => setHoodFilter(e.target.value)}
          >
            <option value="all">All neighborhoods</option>
            {hoods.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        )}
        <select
          aria-label="Sort"
          className="input w-auto"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="date">By date</option>
          <option value="score">By score</option>
        </select>
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="card mt-4">
          <p className="text-sm text-fog-400">
            {events.length === 0
              ? "No events yet. Add your first one — recurring events score highest."
              : "Nothing matches these filters."}
          </p>
          {events.length === 0 && (
            <button
              type="button"
              onClick={() => setMode("add")}
              className="btn-primary mt-4"
            >
              Add your first event
            </button>
          )}
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {visible.map((e) => (
            <li key={e.id}>
              <Link href={`/app/events/${e.id}`} className="card block">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {e.title}
                      {e.isRecurring && (
                        <span className="ml-2 rounded bg-moss-700/40 px-1.5 py-0.5 text-xs text-moss-300">
                          recurring
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-sm text-fog-500">
                      {new Date(e.date + "T12:00:00").toLocaleDateString(
                        "en-US",
                        { weekday: "short", month: "short", day: "numeric" }
                      )}
                      {e.startTime ? ` · ${e.startTime}` : ""}
                      {e.neighborhood ? ` · ${e.neighborhood}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-moss-300">
                      {scores.get(e.id)}
                    </span>
                    <span className="block text-xs text-fog-500">
                      {e.status}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
