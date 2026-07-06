"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { newId, useAppData } from "@/lib/storage";
import { getAI, type FollowUpDraft } from "@/lib/ai";
import PersonForm from "@/components/PersonForm";
import type { FollowUpTone, Person } from "@/lib/types";

const tones: { value: FollowUpTone; label: string }[] = [
  { value: "casual", label: "Casual" },
  { value: "warm", label: "Warm" },
  { value: "direct", label: "Direct" },
  { value: "professional", label: "Professional" },
  { value: "low-pressure", label: "Low-pressure" },
  { value: "faith-community", label: "Faith/community" },
];

const riskLabels = {
  "very-safe": { text: "Very safe", cls: "bg-moss-700/40 text-moss-300" },
  "slightly-vulnerable": {
    text: "Slightly vulnerable",
    cls: "bg-clay-500/20 text-clay-300",
  },
  "scale-back": { text: "Scale back", cls: "bg-danger/20 text-danger" },
} as const;

export default function PersonDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loaded, update } = useAppData();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tone, setTone] = useState<FollowUpTone>("casual");
  const [draft, setDraft] = useState<FollowUpDraft | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const ai = getAI();
  const person = data?.people.find((p) => p.id === params.id);
  const profile = data?.profile ?? null;

  const realityCheck = useMemo(
    () => (person ? ai.generateRelationshipRealityCheck(person) : null),
    [person, ai]
  );

  if (!loaded) return <p className="text-fog-400">Loading…</p>;
  if (!person) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Person not found</h1>
        <Link href="/app/people" className="btn-secondary mt-4">
          All people
        </Link>
      </section>
    );
  }

  function say(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  }

  async function savePerson(updated: Person) {
    await update((d) => ({
      ...d,
      people: d.people.map((p) => (p.id === updated.id ? updated : p)),
    }));
    setEditing(false);
  }

  async function remove() {
    await update((d) => ({
      ...d,
      people: d.people.filter((p) => p.id !== person!.id),
    }));
    router.push("/app/people");
  }

  function generate(selectedTone: FollowUpTone) {
    setTone(selectedTone);
    setDraft(ai.generateFollowUpMessage(person!, profile, selectedTone));
  }

  async function copyDraft() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.message);
      say("Copied.");
    } catch {
      say("Couldn't copy — select the text manually.");
    }
  }

  async function shareDraft() {
    if (!draft) return;
    try {
      await navigator.share({ text: draft.message });
    } catch {
      // user cancelled — nothing to do
    }
  }

  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function markSent() {
    if (!draft) return;
    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    await update((d) => ({
      ...d,
      followUps: [
        ...d.followUps,
        {
          id: newId("fu"),
          personId: person!.id,
          message: draft.message,
          tone: draft.tone,
          whyItWorks: draft.whyItWorks,
          riskLevel: draft.riskLevel,
          suggestedTiming: draft.suggestedTiming,
          status: "sent" as const,
          sentAt: now,
          createdAt: now,
        },
      ],
      people: d.people.map((p) =>
        p.id === person!.id
          ? {
              ...p,
              lastContacted: today,
              status: "active" as const,
              messagesSentWithoutResponse: p.messagesSentWithoutResponse + 1,
              nextFollowUp: undefined,
            }
          : p
      ),
      reps: [
        ...d.reps,
        { id: newId("rep"), type: "sent-follow-up" as const, date: today, personId: person!.id },
      ],
    }));
    setDraft(null);
    say("Marked sent — follow-up logged.");
  }

  async function snooze() {
    const next = new Date();
    next.setDate(next.getDate() + 7);
    await update((d) => ({
      ...d,
      people: d.people.map((p) =>
        p.id === person!.id
          ? { ...p, nextFollowUp: next.toISOString().slice(0, 10) }
          : p
      ),
    }));
    setDraft(null);
    say("Snoozed a week.");
  }

  async function theyResponded() {
    await update((d) => ({
      ...d,
      people: d.people.map((p) =>
        p.id === person!.id
          ? { ...p, hasResponded: true, messagesSentWithoutResponse: 0 }
          : p
      ),
    }));
    say("Noted — thread is alive.");
  }

  if (editing) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Edit {person.name}</h1>
        <div className="card mt-4">
          <PersonForm
            initial={person}
            onSave={savePerson}
            onCancel={() => setEditing(false)}
          />
        </div>
      </section>
    );
  }

  return (
    <section>
      <Link href="/app/people" className="text-sm text-fog-500">
        ← All people
      </Link>
      <div className="mt-2 flex items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold">{person.name}</h1>
        <span className="rounded bg-ink-800 px-2 py-1 text-xs text-fog-400">
          {person.status.replaceAll("-", " ")}
        </span>
      </div>
      <p className="mt-1 text-sm text-fog-400">
        {person.lane.replaceAll("-", " ")}
        {person.whereMet ? ` · met at ${person.whereMet}` : ""}
        {person.dateMet ? ` on ${person.dateMet}` : ""}
      </p>
      {person.context && (
        <p className="mt-1 text-sm text-fog-400">{person.context}</p>
      )}

      {realityCheck && (
        <div
          className={`card mt-4 ${
            realityCheck.severity === "stop"
              ? "border-danger/50"
              : realityCheck.severity === "caution"
                ? "border-clay-500/40"
                : ""
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-widest text-fog-500">
            Reality check
          </p>
          <p className="mt-1 text-sm text-fog-200">{realityCheck.message}</p>
          {!person.hasResponded && person.messagesSentWithoutResponse > 0 && (
            <button
              type="button"
              onClick={theyResponded}
              className="btn-secondary mt-3"
            >
              They responded
            </button>
          )}
        </div>
      )}

      {/* Follow-up generator */}
      <div className="card mt-4">
        <h2 className="font-medium">Follow-up draft</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {tones.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => generate(t.value)}
              className={`min-h-tap rounded-lg border px-3 text-sm ${
                draft && tone === t.value
                  ? "border-moss-500 bg-moss-700/30 text-fog-50"
                  : "border-ink-600 bg-ink-800 text-fog-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {draft && (
          <div className="mt-4">
            <blockquote className="rounded-lg border-l-2 border-moss-500 bg-ink-800 p-3 text-sm text-fog-50">
              {draft.message}
            </blockquote>
            <p className="mt-3 text-sm text-fog-400">
              <span className="font-medium text-fog-200">Why it works: </span>
              {draft.whyItWorks}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`rounded px-2 py-0.5 ${riskLabels[draft.riskLevel].cls}`}
              >
                {riskLabels[draft.riskLevel].text}
              </span>
              <span className="text-fog-500">
                Send: {draft.suggestedTiming}
              </span>
            </div>

            {/* Handoff — never automation */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={copyDraft} className="btn-secondary">
                Copy message
              </button>
              {canShare && (
                <button
                  type="button"
                  onClick={shareDraft}
                  className="btn-secondary"
                >
                  Share…
                </button>
              )}
              {person.phone && (
                <a
                  href={`https://wa.me/${person.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(draft.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  WhatsApp
                </a>
              )}
              {person.phone && (
                <a
                  href={`sms:${person.phone}?body=${encodeURIComponent(draft.message)}`}
                  className="btn-secondary"
                >
                  SMS
                </a>
              )}
              {person.email && (
                <a
                  href={`mailto:${person.email}?body=${encodeURIComponent(draft.message)}`}
                  className="btn-secondary"
                >
                  Email
                </a>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" onClick={markSent} className="btn-primary">
                Mark as sent
              </button>
              <button type="button" onClick={snooze} className="btn-ghost">
                Snooze a week
              </button>
            </div>
          </div>
        )}
      </div>

      {notice && (
        <p role="status" className="mt-3 text-sm text-moss-300">
          {notice}
        </p>
      )}

      {/* Details */}
      <div className="card mt-4 text-sm">
        <p className="text-xs font-medium uppercase tracking-widest text-fog-500">
          Details
        </p>
        <dl className="mt-2 grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-fog-200">
          {person.vibe && (
            <>
              <dt className="text-fog-500">Vibe</dt>
              <dd>{person.vibe}</dd>
            </>
          )}
          {person.sharedInterests.length > 0 && (
            <>
              <dt className="text-fog-500">Shared</dt>
              <dd>{person.sharedInterests.join(", ")}</dd>
            </>
          )}
          <dt className="text-fog-500">Channel</dt>
          <dd>{person.preferredChannel}</dd>
          {person.lastContacted && (
            <>
              <dt className="text-fog-500">Last contacted</dt>
              <dd>{person.lastContacted}</dd>
            </>
          )}
          {person.nextFollowUp && (
            <>
              <dt className="text-fog-500">Next follow-up</dt>
              <dd>{person.nextFollowUp}</dd>
            </>
          )}
          {person.notes && (
            <>
              <dt className="text-fog-500">Notes</dt>
              <dd className="whitespace-pre-wrap">{person.notes}</dd>
            </>
          )}
        </dl>
      </div>

      {/* Sent history */}
      {data && data.followUps.filter((f) => f.personId === person.id).length > 0 && (
        <div className="card mt-4 text-sm">
          <p className="text-xs font-medium uppercase tracking-widest text-fog-500">
            Sent follow-ups
          </p>
          <ul className="mt-2 space-y-2">
            {data.followUps
              .filter((f) => f.personId === person.id && f.status === "sent")
              .sort((a, b) => (b.sentAt ?? "").localeCompare(a.sentAt ?? ""))
              .map((f) => (
                <li key={f.id} className="text-fog-400">
                  <span className="text-fog-500">
                    {f.sentAt?.slice(0, 10)} ·{" "}
                  </span>
                  &ldquo;{f.message}&rdquo;
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
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
              Keep
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
