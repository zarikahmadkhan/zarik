"use client";

// Dev harness: renders sample output from every mock AI function so copy
// quality is inspectable. Not linked from navigation.

import { useMemo, useState } from "react";
import { getAI, type SoloNightInputs } from "@/lib/ai";
import { seedAppData } from "@/lib/storage/seed";
import type { FollowUpTone, SkipReason } from "@/lib/types";

const tones: FollowUpTone[] = [
  "casual",
  "warm",
  "direct",
  "professional",
  "low-pressure",
  "faith-community",
];

const skipReasons: SkipReason[] = [
  "avoidance",
  "logistics",
  "fatigue",
  "cost",
  "poor-fit",
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card mt-4">
      <h2 className="font-medium text-moss-300">{title}</h2>
      <div className="mt-2 space-y-2 text-sm text-fog-200">{children}</div>
    </div>
  );
}

export default function DevAIPage() {
  const ai = getAI();
  const data = useMemo(() => seedAppData(), []);
  const profile = data.profile;
  const event = data.events[0];
  const person = data.people[0];

  const [mood, setMood] = useState<SoloNightInputs["mood"]>("restless");
  const [energy, setEnergy] =
    useState<SoloNightInputs["energy"]>("medium");
  const [tone, setTone] = useState<FollowUpTone>("casual");

  const soloInputs: SoloNightInputs = {
    mood,
    energy,
    budget: 30,
    availableHours: 3,
    neighborhood: "Journal Square",
    vibe: "social-adjacent",
    openness: "one-person",
  };

  const soloPlans = ai.generateSoloNightPlans(soloInputs, profile);
  const weeklyPlan = profile
    ? ai.generateWeeklySocialPlan(profile, data.events)
    : null;
  const followUp = ai.generateFollowUpMessage(person, profile, tone);
  const score = ai.scoreEvent(event, profile);
  const review = ai.generateWeeklyReview(data);
  const mirror = ai.generateAvoidanceMirror(data);
  const parsed = ai.parseEventFromText(
    "Brooklyn Board Game Night\nThursday 7:30pm at Sip & Play, free entry, all levels welcome"
  );
  const program = ai.generateThirtyDayProgram(profile);
  const realityCheck = ai.generateRelationshipRealityCheck(person);
  const arrival = ai.generateEventArrivalStrategy(event);
  const openers = ai.generateConversationOpeners(event);
  const upgrade = ai.generateUpgradePrompt("solo-plan-limit");

  return (
    <section>
      <h1 className="text-2xl font-semibold">Mock AI harness</h1>
      <p className="mt-1 text-sm text-fog-500">
        Dev-only view of all 13 generator outputs against seed data.
      </p>

      <Section title="1. generateSoloNightPlans">
        <div className="flex flex-wrap gap-2 pb-2">
          <label className="text-xs text-fog-400">
            Mood{" "}
            <select
              className="input mt-1"
              value={mood}
              onChange={(e) =>
                setMood(e.target.value as SoloNightInputs["mood"])
              }
            >
              {["drained", "restless", "lonely", "bored", "anxious", "celebratory", "spiritually-low", "socially-motivated"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="text-xs text-fog-400">
            Energy{" "}
            <select
              className="input mt-1"
              value={energy}
              onChange={(e) =>
                setEnergy(e.target.value as SoloNightInputs["energy"])
              }
            >
              {["low", "medium", "high"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
        </div>
        {soloPlans.map((p) => (
          <div key={p.tier} className="rounded-lg bg-ink-800 p-3">
            <p className="text-xs uppercase tracking-wide text-fog-500">
              {p.tier}
            </p>
            <p className="font-medium">{p.title}</p>
            <ul className="mt-1 text-fog-400">
              {p.timeline.map((t) => (
                <li key={t.time}>
                  {t.time} — {t.step}
                </li>
              ))}
            </ul>
            <p className="mt-1 text-fog-400">
              {p.costEstimate} · difficulty {p.socialDifficulty}/5 ·
              conversation {p.conversationPotential}/5
            </p>
            <p className="mt-1">Exit rule: {p.exitRule}</p>
            <p>Micro-challenge: {p.microChallenge}</p>
            <p>Reflect: {p.reflectionPrompt}</p>
          </div>
        ))}
      </Section>

      <Section title="2. generateWeeklySocialPlan">
        {weeklyPlan?.items.map((i) => (
          <p key={i.day}>
            <span className="text-fog-500">{i.day.slice(5)}</span> —{" "}
            <span className="font-medium">{i.title}</span>: {i.detail}
          </p>
        ))}
      </Section>

      <Section title="3. generateFollowUpMessage">
        <label className="text-xs text-fog-400">
          Tone{" "}
          <select
            className="input mt-1"
            value={tone}
            onChange={(e) => setTone(e.target.value as FollowUpTone)}
          >
            {tones.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <p className="rounded-lg bg-ink-800 p-3">&ldquo;{followUp.message}&rdquo;</p>
        <p>
          <span className="text-fog-500">Why it works:</span>{" "}
          {followUp.whyItWorks}
        </p>
        <p>
          <span className="text-fog-500">Risk:</span> {followUp.riskLevel} ·{" "}
          <span className="text-fog-500">Timing:</span>{" "}
          {followUp.suggestedTiming}
        </p>
      </Section>

      <Section title="4. scoreEvent">
        <p>
          {event.title}: <span className="font-medium">{score.total}/100</span>
        </p>
        <ul className="list-inside list-disc text-fog-400">
          {score.reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Section>

      <Section title="5. generateWeeklyReview">
        <p>
          Attended {review.eventsAttended} · skipped {review.eventsSkipped} ·
          met {review.peopleMet} · sent {review.followUpsSent} · owed{" "}
          {review.followUpsOwed}
        </p>
        <p>
          <span className="text-fog-500">Pattern:</span>{" "}
          {review.avoidancePattern}
        </p>
        <p>
          <span className="text-fog-500">Assignment:</span>{" "}
          {review.uncomfortableAssignment}
        </p>
        <p>
          <span className="text-fog-500">Stop:</span> {review.thingToStop}
        </p>
        <ul className="list-inside list-disc text-fog-400">
          {review.nextWeekPlan.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Section>

      <Section title="6. generateAvoidanceMirror">
        <p>{mirror.message}</p>
        <p>
          <span className="text-fog-500">Next rep:</span> {mirror.nextRep}
        </p>
      </Section>

      <Section title="7. parseEventFromText">
        <pre className="overflow-x-auto rounded-lg bg-ink-800 p-3 text-xs">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      </Section>

      <Section title="8. generateThirtyDayProgram">
        {program.assignments.slice(0, 5).map((a) => (
          <p key={a.day}>
            <span className="text-fog-500">Day {a.day}</span> —{" "}
            <span className="font-medium">{a.title}</span>: {a.detail}
          </p>
        ))}
        <p className="text-fog-500">…{program.assignments.length} days total</p>
      </Section>

      <Section title="9. generateRecoveryAction (all reasons)">
        {skipReasons.map((r) => {
          const rec = ai.generateRecoveryAction(r, profile);
          return (
            <p key={r}>
              <span className="text-fog-500">{r}:</span> {rec.message}{" "}
              <span className="text-moss-300">→ {rec.action}</span>
            </p>
          );
        })}
      </Section>

      <Section title="10. generateRelationshipRealityCheck">
        <p>
          {person.name} ({realityCheck.severity}): {realityCheck.message}
        </p>
      </Section>

      <Section title="11. generateEventArrivalStrategy">
        <p>{arrival}</p>
      </Section>

      <Section title="12. generateConversationOpeners">
        <ul className="list-inside list-disc">
          {openers.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </Section>

      <Section title="13. generateUpgradePrompt">
        <p className="font-medium">{upgrade.headline}</p>
        <p>{upgrade.body}</p>
        <p className="text-moss-300">[{upgrade.cta}]</p>
      </Section>
    </section>
  );
}
