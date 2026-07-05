"use client";

import Link from "next/link";
import { useAppData } from "@/lib/storage";

export default function DashboardPage() {
  const { data, loaded } = useAppData();

  if (!loaded) {
    return <p className="text-fog-400">Loading…</p>;
  }

  if (!data || (!data.profile && data.events.length === 0)) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="card mt-4">
          <p className="text-sm text-fog-400">
            Nothing here yet. Load the demo to explore Orbit with sample data,
            or start onboarding.
          </p>
          <div className="mt-4 flex gap-2">
            <Link href="/demo" className="btn-primary">
              Load demo data
            </Link>
            <Link href="/app/onboarding" className="btn-secondary">
              Start onboarding
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const upcoming = data.events
    .filter((e) => e.status === "planned" || e.status === "interested")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const followUpsOwed = data.people.filter(
    (p) => p.status === "needs-follow-up"
  );

  return (
    <section>
      <h1 className="text-2xl font-semibold">
        {data.profile ? `Welcome back, ${data.profile.name}` : "Dashboard"}
      </h1>
      <p className="mt-1 text-sm text-fog-500">
        The full dashboard — tonight&apos;s action, week plan, avoidance mirror
        — arrives in phase 3. Your data is loaded and persisting.
      </p>

      <div className="card mt-4">
        <h2 className="font-medium">Upcoming events</h2>
        {upcoming.length === 0 ? (
          <p className="mt-2 text-sm text-fog-400">
            No upcoming events.{" "}
            <Link href="/app/events" className="underline">
              Add your first event
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-ink-800">
            {upcoming.map((e) => (
              <li key={e.id} className="flex justify-between py-2 text-sm">
                <span>
                  {e.title}
                  {e.isRecurring && (
                    <span className="ml-2 rounded bg-moss-700/40 px-1.5 py-0.5 text-xs text-moss-300">
                      recurring
                    </span>
                  )}
                </span>
                <span className="text-fog-500">{e.date.slice(5)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card mt-4">
        <h2 className="font-medium">Follow-ups owed</h2>
        {followUpsOwed.length === 0 ? (
          <p className="mt-2 text-sm text-fog-400">No one waiting on you.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {followUpsOwed.map((p) => (
              <li key={p.id}>
                {p.name}
                <span className="ml-2 text-fog-500">
                  met at {p.whereMet ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card mt-4">
        <h2 className="font-medium">This week</h2>
        <p className="mt-2 text-sm text-fog-400">
          {data.reps.length} social reps logged · {data.people.length} people in
          your orbit
        </p>
      </div>
    </section>
  );
}
