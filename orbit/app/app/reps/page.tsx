"use client";

import Link from "next/link";
import { useState } from "react";
import { newId, useAppData } from "@/lib/storage";
import type { RepType } from "@/lib/types";

const repTypes: { value: RepType; label: string }[] = [
  { value: "left-apartment", label: "Left the apartment intentionally" },
  { value: "attended-event", label: "Attended an event" },
  { value: "stayed-45-min", label: "Stayed at least 45 minutes" },
  { value: "introduced-self", label: "Introduced myself to someone" },
  { value: "asked-follow-up-question", label: "Asked a follow-up question" },
  { value: "exchanged-contact", label: "Exchanged contact info" },
  { value: "sent-follow-up", label: "Sent a follow-up" },
  { value: "invited-someone", label: "Invited someone to something" },
  { value: "attended-faith-community", label: "Attended faith/community gathering" },
  { value: "volunteered", label: "Volunteered" },
  { value: "joined-recurring-group", label: "Joined a recurring group" },
  { value: "solo-public-activity", label: "Solo-but-public activity" },
  { value: "returned-to-recurring", label: "Returned to a recurring event" },
  { value: "talked-to-organizer", label: "Talked to an organizer" },
  { value: "added-person", label: "Added a person to my orbit" },
  { value: "completed-weekly-review", label: "Completed weekly review" },
];

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function weekStartIso() {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return iso(d);
}

export default function RepsPage() {
  const { data, loaded, update } = useAppData();
  const [logged, setLogged] = useState<string | null>(null);

  if (!loaded) return <p className="text-fog-400">Loading…</p>;

  const reps = data?.reps ?? [];
  const ws = weekStartIso();
  const weekReps = reps.filter((r) => r.date >= ws);
  const today = iso(new Date());

  // Streak: consecutive days ending today (or yesterday) with ≥1 rep
  const repDays = new Set(reps.map((r) => r.date));
  let streak = 0;
  const cursor = new Date();
  if (!repDays.has(iso(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (repDays.has(iso(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Repeat exposure: returns to recurring settings
  const repeatExposure =
    reps.filter((r) => r.type === "returned-to-recurring").length +
    (data?.events ?? []).filter((e) => e.timesAttended > 1).length;

  const weeklyTarget = 5;
  const behind = weekReps.length < 2 && new Date().getDay() >= 4; // Thu+ with <2 reps

  const countsByType = new Map<RepType, number>();
  for (const r of weekReps) {
    countsByType.set(r.type, (countsByType.get(r.type) ?? 0) + 1);
  }

  async function logRep(type: RepType) {
    await update((d) => ({
      ...d,
      reps: [...d.reps, { id: newId("rep"), type, date: today }],
    }));
    setLogged(repTypes.find((r) => r.value === type)?.label ?? "Rep");
    setTimeout(() => setLogged(null), 2000);
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Social reps</h1>
      <p className="mt-1 text-sm text-fog-400">
        Training log. Reps beat vibes — log what you actually did.
      </p>

      {/* Week summary */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="card text-center">
          <p className="text-2xl font-semibold text-moss-300">
            {weekReps.length}
            <span className="text-sm text-fog-500">/{weeklyTarget}</span>
          </p>
          <p className="mt-1 text-xs uppercase tracking-wide text-fog-500">
            This week
          </p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-semibold text-fog-50">{streak}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-fog-500">
            Day streak
          </p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-semibold text-fog-50">{repeatExposure}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-fog-500">
            Repeat exposures
          </p>
        </div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded bg-ink-800">
        <div
          className="h-full bg-moss-600"
          style={{
            width: `${Math.min(100, (weekReps.length / weeklyTarget) * 100)}%`,
          }}
        />
      </div>

      {behind && (
        <div className="card mt-4 border-clay-500/40">
          <p className="text-sm text-fog-200">
            Light week so far. No spiral needed — one rep today restarts
            nothing, it just continues.
          </p>
          <Link href="/app/tonight" className="btn-secondary mt-3">
            Get a plan for tonight
          </Link>
        </div>
      )}

      {logged && (
        <p role="status" className="mt-3 text-sm text-moss-300">
          Logged: {logged}
        </p>
      )}

      {/* Quick complete */}
      <div className="card mt-4">
        <h2 className="font-medium">Log a rep</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {repTypes.map((r) => {
            const count = countsByType.get(r.value) ?? 0;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => logRep(r.value)}
                className="flex min-h-tap items-center justify-between rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-left text-sm text-fog-200 hover:bg-ink-700"
              >
                <span>{r.label}</span>
                {count > 0 && (
                  <span className="ml-2 shrink-0 rounded bg-moss-700/40 px-1.5 py-0.5 text-xs text-moss-300">
                    ×{count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* This week's log */}
      {weekReps.length > 0 && (
        <div className="card mt-4">
          <h2 className="font-medium">This week&rsquo;s log</h2>
          <ul className="mt-2 divide-y divide-ink-800 text-sm">
            {[...weekReps]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((r) => (
                <li key={r.id} className="flex justify-between py-2">
                  <span className="text-fog-200">
                    {repTypes.find((t) => t.value === r.type)?.label ?? r.type}
                  </span>
                  <span className="text-fog-500">{r.date.slice(5)}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </section>
  );
}
