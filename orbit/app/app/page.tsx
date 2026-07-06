"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { newId, useAppData } from "@/lib/storage";
import { getAI } from "@/lib/ai";
import type { RepType } from "@/lib/types";

const quickReps: { value: RepType; label: string }[] = [
  { value: "left-apartment", label: "Left the apartment" },
  { value: "solo-public-activity", label: "Solo-but-public activity" },
  { value: "introduced-self", label: "Introduced myself" },
  { value: "sent-follow-up", label: "Sent a follow-up" },
  { value: "returned-to-recurring", label: "Returned to a recurring event" },
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function weekStartIso() {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d.toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const { data, loaded, update } = useAppData();
  const [repOpen, setRepOpen] = useState(false);
  const [repLogged, setRepLogged] = useState<string | null>(null);

  const ai = getAI();
  const mirror = useMemo(
    () => (data ? ai.generateAvoidanceMirror(data) : null),
    [data, ai]
  );

  if (!loaded) return <p className="text-fog-400">Loading…</p>;

  if (!data || (!data.profile && data.events.length === 0)) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="card mt-4">
          <p className="text-sm text-fog-400">
            Nothing here yet. Two minutes of setup gets you a real 7-day plan —
            or load the demo to look around first.
          </p>
          <div className="mt-4 flex gap-2">
            <Link href="/app/onboarding" className="btn-primary">
              Start onboarding
            </Link>
            <Link href="/demo" className="btn-secondary">
              Load demo data
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const today = todayIso();
  const ws = weekStartIso();

  const currentPlan = [...data.plans]
    .filter((p) => p.kind === "seven-day")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const soloTonight = [...data.plans]
    .filter((p) => p.kind === "solo-night")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .flatMap((p) => p.items)
    .find((i) => i.day === today);
  const todayItem = soloTonight ?? currentPlan?.items.find((i) => i.day === today);

  const upcoming = data.events
    .filter((e) => e.status === "planned" || e.status === "interested")
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const tonightEvent = upcoming.find((e) => e.date === today);
  const followUpsOwed = data.people.filter(
    (p) => p.status === "needs-follow-up"
  );
  const weekReps = data.reps.filter((r) => r.date >= ws);

  const programDay = data.program
    ? Math.min(
        30,
        Math.floor(
          (Date.now() - new Date(data.program.startedAt).getTime()) / 86400000
        ) + 1
      )
    : null;
  const programAssignment =
    data.program && programDay
      ? data.program.assignments.find((a) => a.day === programDay)
      : null;

  async function logRep(type: RepType) {
    await update((d) => ({
      ...d,
      reps: [...d.reps, { id: newId("rep"), type, date: todayIso() }],
    }));
    setRepOpen(false);
    setRepLogged(quickReps.find((r) => r.value === type)?.label ?? "Rep");
    setTimeout(() => setRepLogged(null), 2500);
  }

  async function startProgram() {
    await update((d) => ({
      ...d,
      program: ai.generateThirtyDayProgram(d.profile),
    }));
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">
        {data.profile ? `Hey ${data.profile.name}` : "Dashboard"}
      </h1>

      {/* Tonight's action — visually dominant */}
      <div className="mt-4 rounded-card border border-moss-700 bg-gradient-to-b from-moss-700/25 to-ink-900 p-5">
        <p className="text-xs font-medium uppercase tracking-widest text-moss-300">
          Tonight
        </p>
        {tonightEvent ? (
          <>
            <h2 className="mt-2 text-xl font-semibold">
              {tonightEvent.title}
            </h2>
            <p className="mt-1 text-sm text-fog-400">
              {tonightEvent.startTime ? `${tonightEvent.startTime} · ` : ""}
              {tonightEvent.location ?? tonightEvent.neighborhood ?? ""}
            </p>
            <Link
              href={`/app/events/${tonightEvent.id}`}
              className="btn-primary mt-4"
            >
              View plan for tonight
            </Link>
          </>
        ) : todayItem ? (
          <>
            <h2 className="mt-2 text-xl font-semibold">{todayItem.title}</h2>
            <p className="mt-1 text-sm text-fog-400">{todayItem.detail}</p>
            <Link href="/app/tonight" className="btn-primary mt-4">
              Or generate a solo night
            </Link>
          </>
        ) : (
          <>
            <h2 className="mt-2 text-xl font-semibold">
              No plan for tonight yet
            </h2>
            <p className="mt-1 text-sm text-fog-400">
              Generate a solo night — three options in ten seconds.
            </p>
            <Link href="/app/tonight" className="btn-primary mt-4">
              Plan tonight
            </Link>
          </>
        )}
      </div>

      {/* Avoidance mirror */}
      {mirror && (
        <div className="card mt-4 border-clay-500/30">
          <p className="text-xs font-medium uppercase tracking-widest text-clay-300">
            Mirror
          </p>
          <p className="mt-2 text-sm text-fog-200">{mirror.message}</p>
          <p className="mt-2 text-sm text-fog-400">
            <span className="text-clay-300">Next rep:</span> {mirror.nextRep}
          </p>
        </div>
      )}

      {/* This week's plan */}
      {currentPlan && (
        <div className="card mt-4">
          <h2 className="font-medium">This week</h2>
          <ul className="mt-2 divide-y divide-ink-800">
            {currentPlan.items.map((i) => (
              <li key={i.day} className="flex gap-3 py-2 text-sm">
                <span
                  className={`w-10 shrink-0 pt-0.5 text-xs ${
                    i.day === today ? "text-moss-300" : "text-fog-500"
                  }`}
                >
                  {new Date(i.day + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>
                <span>
                  <span
                    className={
                      i.day === today ? "font-medium text-fog-50" : "text-fog-200"
                    }
                  >
                    {i.title}
                  </span>
                  <span className="block text-fog-500">{i.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upcoming events */}
      <div className="card mt-4">
        <h2 className="font-medium">Upcoming events</h2>
        {upcoming.length === 0 ? (
          <p className="mt-2 text-sm text-fog-400">
            Nothing on the calendar.{" "}
            <Link href="/app/events" className="text-moss-300 underline">
              Add your first event
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-ink-800">
            {upcoming.slice(0, 5).map((e) => (
              <li key={e.id}>
                <Link
                  href={`/app/events/${e.id}`}
                  className="flex min-h-tap items-center justify-between py-2 text-sm"
                >
                  <span>
                    {e.title}
                    {e.isRecurring && (
                      <span className="ml-2 rounded bg-moss-700/40 px-1.5 py-0.5 text-xs text-moss-300">
                        recurring
                      </span>
                    )}
                  </span>
                  <span className="text-fog-500">
                    {new Date(e.date + "T12:00:00").toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Follow-ups owed */}
      <div className="card mt-4">
        <h2 className="font-medium">
          Follow-ups owed{" "}
          {followUpsOwed.length > 0 && (
            <span className="ml-1 rounded-full bg-clay-500/20 px-2 py-0.5 text-xs text-clay-300">
              {followUpsOwed.length}
            </span>
          )}
        </h2>
        {followUpsOwed.length === 0 ? (
          <p className="mt-2 text-sm text-fog-400">
            No one waiting on you. Met someone recently?{" "}
            <Link href="/app/people" className="text-moss-300 underline">
              Add them
            </Link>{" "}
            before the tie goes cold.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-ink-800">
            {followUpsOwed.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/app/people/${p.id}`}
                  className="flex min-h-tap items-center justify-between py-2 text-sm"
                >
                  <span>
                    {p.name}
                    <span className="ml-2 text-fog-500">
                      {p.whereMet ? `met at ${p.whereMet}` : ""}
                    </span>
                  </span>
                  <span className="text-moss-300">Draft →</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Reps this week + quick add */}
      <div className="card mt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Reps this week</h2>
          <span className="text-2xl font-semibold text-moss-300">
            {weekReps.length}
          </span>
        </div>
        {repLogged && (
          <p role="status" className="mt-2 text-sm text-moss-300">
            Logged: {repLogged}
          </p>
        )}
        {repOpen ? (
          <div className="mt-3 space-y-2">
            {quickReps.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => logRep(r.value)}
                className="btn-secondary w-full justify-start"
              >
                {r.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setRepOpen(false)}
              className="btn-ghost w-full"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setRepOpen(true)}
            className="btn-secondary mt-3"
          >
            Log a rep
          </button>
        )}
      </div>

      {/* 30-day program */}
      <div className="card mt-4">
        <h2 className="font-medium">30-day rebuild</h2>
        {data.program && programDay ? (
          <>
            <div className="mt-2 h-1.5 overflow-hidden rounded bg-ink-800">
              <div
                className="h-full bg-moss-600"
                style={{ width: `${(programDay / 30) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-fog-400">
              Day {programDay} of 30
              {programAssignment ? ` — ${programAssignment.title}` : ""}
            </p>
            <Link href="/app/program" className="btn-secondary mt-3">
              Continue program
            </Link>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-fog-400">
              Four weeks, one assignment a day: leave the apartment, start
              conversations, follow up, build cadence.
            </p>
            <button
              type="button"
              onClick={startProgram}
              className="btn-secondary mt-3"
            >
              Start the 30-day rebuild
            </button>
          </>
        )}
      </div>

      {/* Quick adds */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link href="/app/events" className="btn-secondary">
          + Event
        </Link>
        <Link href="/app/people" className="btn-secondary">
          + Person
        </Link>
      </div>
    </section>
  );
}
