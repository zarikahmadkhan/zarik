"use client";

import { useAppData } from "@/lib/storage";
import { getAI } from "@/lib/ai";

const weekThemes = [
  { range: [1, 7], name: "Week 1 — Leave the apartment" },
  { range: [8, 14], name: "Week 2 — Start conversations" },
  { range: [15, 21], name: "Week 3 — Follow up" },
  { range: [22, 30], name: "Week 4 — Build cadence" },
];

function themeFor(day: number) {
  return (
    weekThemes.find((w) => day >= w.range[0] && day <= w.range[1])?.name ??
    weekThemes[3].name
  );
}

const recoveryLines = [
  "You missed some days. Do not restart. Complete one small rep today.",
  "You fell behind. The next move is not analysis. It is one rep.",
  "Restarting is a trap. Continue from today.",
];

export default function ProgramPage() {
  const { data, loaded, update } = useAppData();
  const ai = getAI();

  if (!loaded) return <p className="text-fog-400">Loading…</p>;

  const program = data?.program;

  async function start() {
    await update((d) => ({
      ...d,
      program: ai.generateThirtyDayProgram(d.profile),
    }));
  }

  if (!program || !program.active) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">30-day social rebuild</h1>
        <div className="card mt-4">
          <p className="text-sm text-fog-400">
            Four weeks, one assignment a day. Week 1: leave the apartment.
            Week 2: start conversations. Week 3: follow up. Week 4: build
            cadence. Miss a day and you continue — never restart.
          </p>
          <button type="button" onClick={start} className="btn-primary mt-4">
            Start day 1 today
          </button>
        </div>
      </section>
    );
  }

  const currentDay = Math.max(
    1,
    Math.min(
      30,
      Math.floor(
        (Date.now() - new Date(program.startedAt + "T00:00:00").getTime()) /
          86400000
      ) + 1
    )
  );

  const todayAssignment = program.assignments.find((a) => a.day === currentDay);
  const completedCount = program.assignments.filter((a) => a.completed).length;
  const missedCount = program.assignments.filter(
    (a) => !a.completed && a.day < currentDay
  ).length;
  const behind = missedCount >= 2;

  async function setDone(day: number, completed: boolean) {
    await update((d) => ({
      ...d,
      program: d.program
        ? {
            ...d.program,
            assignments: d.program.assignments.map((a) =>
              a.day === day ? { ...a, completed, missed: !completed && a.day < currentDay } : a
            ),
          }
        : d.program,
    }));
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">30-day social rebuild</h1>
      <p className="mt-1 text-sm text-fog-500">{themeFor(currentDay)}</p>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-3xl font-semibold text-moss-300">
          Day {currentDay}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded bg-ink-800">
          <div
            className="h-full bg-moss-600"
            style={{ width: `${(currentDay / 30) * 100}%` }}
          />
        </div>
        <span className="text-sm text-fog-500">
          {completedCount}/30 done
        </span>
      </div>

      {behind && (
        <div className="card mt-4 border-clay-500/40">
          <p className="text-sm text-fog-200">
            {recoveryLines[missedCount % recoveryLines.length]}
          </p>
        </div>
      )}

      {todayAssignment && (
        <div className="card mt-4 border-moss-700">
          <p className="text-xs font-medium uppercase tracking-widest text-moss-300">
            Today&rsquo;s assignment
          </p>
          <h2 className="mt-1 text-lg font-semibold">{todayAssignment.title}</h2>
          <p className="mt-1 text-sm text-fog-400">{todayAssignment.detail}</p>
          {todayAssignment.completed ? (
            <p role="status" className="mt-3 text-sm text-moss-300">
              Done. That&rsquo;s the whole job today.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setDone(todayAssignment.day, true)}
              className="btn-primary mt-4"
            >
              Mark complete
            </button>
          )}
        </div>
      )}

      <div className="card mt-4">
        <h2 className="font-medium">All 30 days</h2>
        <ul className="mt-2 divide-y divide-ink-800">
          {program.assignments.map((a) => {
            const isPast = a.day < currentDay;
            const isToday = a.day === currentDay;
            return (
              <li key={a.day} className="flex items-center gap-3 py-2 text-sm">
                <button
                  type="button"
                  aria-label={`Mark day ${a.day} ${a.completed ? "incomplete" : "complete"}`}
                  onClick={() => setDone(a.day, !a.completed)}
                  disabled={a.day > currentDay}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                    a.completed
                      ? "border-moss-500 bg-moss-600 text-ink-950"
                      : isPast
                        ? "border-clay-500/50 text-clay-300"
                        : "border-ink-600 text-fog-500"
                  } disabled:opacity-40`}
                >
                  {a.completed ? "✓" : a.day}
                </button>
                <div className={a.day > currentDay ? "opacity-50" : ""}>
                  <p
                    className={`${
                      isToday ? "font-medium text-fog-50" : "text-fog-200"
                    }`}
                  >
                    {a.title}
                    {isToday && (
                      <span className="ml-2 text-xs text-moss-300">today</span>
                    )}
                  </p>
                  {(isToday || isPast) && (
                    <p className="text-xs text-fog-500">{a.detail}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
