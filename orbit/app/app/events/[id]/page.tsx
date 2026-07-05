"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { newId, useAppData } from "@/lib/storage";
import { getAI } from "@/lib/ai";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import EventForm from "@/components/EventForm";
import type {
  EventReflection,
  OrbitEvent,
  Person,
  RecoveryAction,
  SkipReason,
  SocialRep,
} from "@/lib/types";

const repAssignments = [
  "Introduce yourself to one person by name.",
  "Ask one person how they found this event.",
  "Stay at least 45 minutes.",
  "Learn the organizer's name and use it.",
  "Ask one follow-up question in a conversation.",
  "Find out if this repeats, and when.",
];

const exitRules = [
  "If it's bad after 45 minutes, you're free to leave — 45 minutes is a completed rep either way.",
  "You can leave after one full conversation or one hour, whichever comes first.",
  "If you're anxious at the door, go in for 15 minutes. You can leave after that. You usually won't.",
  "Give it until the halfway point. If you're still drained, go home without guilt.",
];

function hashPick<T>(arr: T[], seed: string): T {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0;
  return arr[Math.abs(h) % arr.length];
}

const skipReasons: { value: SkipReason; label: string }[] = [
  { value: "avoidance", label: "Avoidance — I just didn't go" },
  { value: "logistics", label: "Logistics got in the way" },
  { value: "fatigue", label: "Too tired" },
  { value: "cost", label: "Too expensive" },
  { value: "poor-fit", label: "Wrong event for me" },
];

type View = "detail" | "edit" | "attended" | "skipped";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loaded, update } = useAppData();
  const [view, setView] = useState<View>("detail");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Attended form state
  const [talked, setTalked] = useState<boolean | null>(null);
  const [peopleNames, setPeopleNames] = useState("");
  const [exchanged, setExchanged] = useState(false);
  const [again, setAgain] = useState(true);
  const [learned, setLearned] = useState("");
  const [energyAfter, setEnergyAfter] =
    useState<EventReflection["energyAfter"]>("neutral");

  // Skip form state
  const [skipReason, setSkipReason] = useState<SkipReason | null>(null);
  const [recovery, setRecovery] = useState<RecoveryAction | null>(null);

  const ai = getAI();
  const event = data?.events.find((e) => e.id === params.id);
  const profile = data?.profile ?? null;

  const score = useMemo(
    () => (event ? ai.scoreEvent(event, profile) : null),
    [event, profile, ai]
  );
  const arrival = event ? ai.generateEventArrivalStrategy(event) : "";
  const openers = event ? ai.generateConversationOpeners(event) : [];

  if (!loaded) return <p className="text-fog-400">Loading…</p>;
  if (!event) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Event not found</h1>
        <Link href="/app/events" className="btn-secondary mt-4">
          All events
        </Link>
      </section>
    );
  }

  async function saveEdit(updated: OrbitEvent) {
    await update((d) => ({
      ...d,
      events: d.events.map((e) => (e.id === updated.id ? updated : e)),
    }));
    setView("detail");
  }

  async function remove() {
    await update((d) => ({
      ...d,
      events: d.events.filter((e) => e.id !== event!.id),
    }));
    router.push("/app/events");
  }

  async function setStatus(status: OrbitEvent["status"]) {
    await update((d) => ({
      ...d,
      events: d.events.map((e) => (e.id === event!.id ? { ...e, status } : e)),
    }));
  }

  async function saveAttended() {
    const names = peopleNames
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    const now = new Date().toISOString();
    const newPeople: Person[] = names.map((name) => ({
      id: newId("person"),
      name,
      whereMet: event!.title,
      dateMet: event!.date,
      lane: "acquaintance",
      sharedInterests: [],
      preferredChannel: profile?.preferredChannel ?? "sms",
      status: "needs-follow-up",
      messagesSentWithoutResponse: 0,
      hasResponded: false,
      createdAt: now,
    }));
    const reflection: EventReflection = {
      talkedToAnyone: talked === true,
      peopleMet: newPeople.map((p) => p.id),
      exchangedContact: exchanged,
      wouldAttendAgain: again,
      learned: learned.trim() || undefined,
      energyAfter,
    };
    const reps: SocialRep[] = [
      { id: newId("rep"), type: "attended-event", date: event!.date, eventId: event!.id },
    ];
    if (talked)
      reps.push({ id: newId("rep"), type: "introduced-self", date: event!.date, eventId: event!.id });
    if (exchanged)
      reps.push({ id: newId("rep"), type: "exchanged-contact", date: event!.date, eventId: event!.id });
    for (const p of newPeople)
      reps.push({ id: newId("rep"), type: "added-person", date: event!.date, personId: p.id });

    await update((d) => ({
      ...d,
      events: d.events.map((e) =>
        e.id === event!.id
          ? {
              ...e,
              status: "attended" as const,
              timesAttended: e.timesAttended + 1,
              reflection,
            }
          : e
      ),
      people: [...d.people, ...newPeople],
      reps: [...d.reps, ...reps],
    }));
    setView("detail");
  }

  async function saveSkipped() {
    if (!skipReason) return;
    const rec = ai.generateRecoveryAction(skipReason, profile);
    setRecovery(rec);
    await update((d) => ({
      ...d,
      events: d.events.map((e) =>
        e.id === event!.id
          ? {
              ...e,
              status: "skipped" as const,
              skipReflection: {
                reason: skipReason,
                recoveryAction: rec.action,
              },
            }
          : e
      ),
    }));
  }

  if (view === "edit") {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Edit event</h1>
        <div className="card mt-4">
          <EventForm
            initial={event}
            onSave={saveEdit}
            onCancel={() => setView("detail")}
          />
        </div>
      </section>
    );
  }

  if (view === "attended") {
    return (
      <section>
        <h1 className="text-2xl font-semibold">How did it go?</h1>
        <div className="card mt-4 space-y-4">
          <div>
            <p className="label">Did you talk to anyone?</p>
            <div className="flex gap-2">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => setTalked(v)}
                  className={`min-h-tap flex-1 rounded-lg border px-3 text-sm ${
                    talked === v
                      ? "border-moss-500 bg-moss-700/30 text-fog-50"
                      : "border-ink-600 bg-ink-800 text-fog-200"
                  }`}
                >
                  {v ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
          {talked && (
            <div>
              <label htmlFor="people" className="label">
                Who did you meet?{" "}
                <span className="text-fog-500">(names, comma-separated — they&rsquo;ll be added to People)</span>
              </label>
              <input
                id="people"
                className="input"
                value={peopleNames}
                onChange={(e) => setPeopleNames(e.target.value)}
                placeholder="Omar, Dana"
              />
              <label className="mt-3 flex min-h-tap items-center gap-3 text-sm text-fog-200">
                <input
                  type="checkbox"
                  checked={exchanged}
                  onChange={(e) => setExchanged(e.target.checked)}
                  className="h-5 w-5 accent-moss-500"
                />
                Exchanged contact info
              </label>
            </div>
          )}
          <label className="flex min-h-tap items-center gap-3 text-sm text-fog-200">
            <input
              type="checkbox"
              checked={again}
              onChange={(e) => setAgain(e.target.checked)}
              className="h-5 w-5 accent-moss-500"
            />
            I&rsquo;d attend this again
          </label>
          <div>
            <label htmlFor="learned" className="label">
              One thing you learned <span className="text-fog-500">(optional)</span>
            </label>
            <textarea
              id="learned"
              className="input min-h-16"
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="energy" className="label">
              Energy after
            </label>
            <select
              id="energy"
              className="input"
              value={energyAfter}
              onChange={(e) =>
                setEnergyAfter(e.target.value as EventReflection["energyAfter"])
              }
            >
              <option value="drained">Drained</option>
              <option value="neutral">Neutral</option>
              <option value="better">Better</option>
              <option value="energized">Energized</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveAttended}
              disabled={talked === null}
              className="btn-primary flex-1 disabled:opacity-40"
            >
              Save reflection
            </button>
            <button
              type="button"
              onClick={() => setView("detail")}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (view === "skipped") {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Skipped it — what happened?</h1>
        {recovery ? (
          <div className="card mt-4">
            <p className="text-sm text-fog-200">{recovery.message}</p>
            <p className="mt-3 text-sm">
              <span className="text-xs font-medium uppercase tracking-widest text-moss-300">
                Recovery
              </span>
              <span className="mt-1 block text-fog-50">{recovery.action}</span>
            </p>
            <Link href="/app" className="btn-primary mt-4">
              Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="card mt-4 space-y-2">
            {skipReasons.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setSkipReason(r.value)}
                className={`w-full min-h-tap rounded-lg border px-3 py-2 text-left text-sm ${
                  skipReason === r.value
                    ? "border-moss-500 bg-moss-700/30 text-fog-50"
                    : "border-ink-600 bg-ink-800 text-fog-200"
                }`}
              >
                {r.label}
              </button>
            ))}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={saveSkipped}
                disabled={!skipReason}
                className="btn-primary flex-1 disabled:opacity-40"
              >
                Get recovery action
              </button>
              <button
                type="button"
                onClick={() => setView("detail")}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section>
      <Link href="/app/events" className="text-sm text-fog-500">
        ← All events
      </Link>
      <div className="mt-2 flex items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold">{event.title}</h1>
        <span className="rounded bg-ink-800 px-2 py-1 text-xs text-fog-400">
          {event.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-fog-400">
        {new Date(event.date + "T12:00:00").toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
        {event.startTime ? ` · ${event.startTime}` : ""}
        {event.location ? ` · ${event.location}` : ""}
        {event.cost > 0 ? ` · $${event.cost}` : " · Free"}
      </p>

      {score && (
        <div className="card mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-moss-300">
              {score.total}
            </span>
            <span className="text-sm text-fog-500">/ 100 — why it&rsquo;s worth attending</span>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-fog-400">
            {score.reasons.map((r) => (
              <li key={r}>+ {r}</li>
            ))}
          </ul>
        </div>
      )}

      {(event.status === "interested" || event.status === "planned") && (
        <>
          <div className="card mt-4 space-y-3 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-moss-300">
                Your rep for this event
              </p>
              <p className="mt-1 text-fog-50">
                {hashPick(repAssignments, event.id + "rep")}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-fog-500">
                Arrival strategy
              </p>
              <p className="mt-1 text-fog-200">{arrival}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-fog-500">
                Exit rule
              </p>
              <p className="mt-1 text-fog-200">
                {hashPick(exitRules, event.id + "exit")}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-fog-500">
                Openers
              </p>
              <ul className="mt-1 space-y-1 text-fog-200">
                {openers.map((o) => (
                  <li key={o}>&ldquo;{o}&rdquo;</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => downloadIcs(event)}
              className="btn-secondary"
            >
              Add to calendar (.ics)
            </button>
            <a
              href={googleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Google Calendar
            </a>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {event.status === "interested" ? (
              <button
                type="button"
                onClick={() => setStatus("planned")}
                className="btn-primary"
              >
                Commit — mark planned
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStatus("interested")}
                className="btn-secondary"
              >
                Back to interested
              </button>
            )}
            <button
              type="button"
              onClick={() => setView("attended")}
              className="btn-primary"
            >
              I attended
            </button>
            <button
              type="button"
              onClick={() => setView("skipped")}
              className="btn-secondary col-span-2"
            >
              I skipped it
            </button>
          </div>
        </>
      )}

      {event.status === "attended" && event.reflection && (
        <div className="card mt-4 text-sm">
          <p className="text-xs font-medium uppercase tracking-widest text-moss-300">
            Your reflection
          </p>
          <p className="mt-2 text-fog-200">
            {event.reflection.talkedToAnyone
              ? `Talked to ${event.reflection.peopleMet.length > 0 ? event.reflection.peopleMet.length : "someone"}${event.reflection.exchangedContact ? ", exchanged contact" : ""}.`
              : "Went, didn't talk to anyone — attendance still counts."}
            {event.reflection.wouldAttendAgain ? " Would attend again." : ""}
          </p>
          {event.reflection.learned && (
            <p className="mt-1 text-fog-400">
              Learned: {event.reflection.learned}
            </p>
          )}
          <p className="mt-1 text-fog-400">
            Energy after: {event.reflection.energyAfter} · Attended{" "}
            {event.timesAttended}×
          </p>
          {event.isRecurring && (
            <button
              type="button"
              onClick={() => setStatus("planned")}
              className="btn-primary mt-3"
            >
              Going again — mark planned
            </button>
          )}
        </div>
      )}

      {event.status === "skipped" && event.skipReflection && (
        <div className="card mt-4 text-sm">
          <p className="text-xs font-medium uppercase tracking-widest text-clay-300">
            Skipped — {event.skipReflection.reason}
          </p>
          {event.skipReflection.recoveryAction && (
            <p className="mt-2 text-fog-200">
              Recovery: {event.skipReflection.recoveryAction}
            </p>
          )}
          <button
            type="button"
            onClick={() => setStatus("interested")}
            className="btn-secondary mt-3"
          >
            Reconsider it
          </button>
        </div>
      )}

      {event.notes && (
        <div className="card mt-4 text-sm">
          <p className="text-xs font-medium uppercase tracking-widest text-fog-500">
            Notes
          </p>
          <p className="mt-1 whitespace-pre-wrap text-fog-200">{event.notes}</p>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setView("edit")}
          className="btn-secondary"
        >
          Edit
        </button>
        {confirmDelete ? (
          <>
            <button
              type="button"
              onClick={remove}
              className="btn bg-danger text-fog-50"
            >
              Confirm delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="btn-ghost"
            >
              Keep it
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="btn-ghost"
          >
            Delete
          </button>
        )}
      </div>
    </section>
  );
}
