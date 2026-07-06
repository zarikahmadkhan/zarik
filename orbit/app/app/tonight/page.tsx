"use client";

import Link from "next/link";
import { useState } from "react";
import { newId, useAppData } from "@/lib/storage";
import UpgradeModal from "@/components/UpgradeModal";
import {
  getAI,
  type Mood,
  type SocialOpenness,
  type SoloNightInputs,
  type SoloNightPlan,
  type Vibe,
} from "@/lib/ai";

const moods: { value: Mood; label: string }[] = [
  { value: "drained", label: "Drained" },
  { value: "restless", label: "Restless" },
  { value: "lonely", label: "Lonely" },
  { value: "bored", label: "Bored" },
  { value: "anxious", label: "Anxious" },
  { value: "celebratory", label: "Celebratory" },
  { value: "spiritually-low", label: "Spiritually low" },
  { value: "socially-motivated", label: "Socially motivated" },
];

const vibes: { value: Vibe; label: string }[] = [
  { value: "quiet", label: "Quiet" },
  { value: "social-adjacent", label: "Social-adjacent" },
  { value: "adventurous", label: "Adventurous" },
  { value: "spiritual", label: "Spiritual" },
  { value: "creative", label: "Creative" },
  { value: "fitness", label: "Fitness" },
  { value: "food", label: "Food" },
  { value: "culture", label: "Culture" },
  { value: "productive", label: "Productive" },
];

const opennessOptions: { value: SocialOpenness; label: string }[] = [
  { value: "avoid-people", label: "I want to avoid people" },
  { value: "okay-around-people", label: "Okay being around people" },
  { value: "one-person", label: "I can talk to one person" },
  { value: "genuinely-social", label: "I want a genuinely social night" },
];

const tierLabels: Record<SoloNightPlan["tier"], string> = {
  "minimum-viable": "Minimum viable",
  standard: "Standard",
  bold: "Bold",
};

function Chip<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={selected === o.value}
          onClick={() => onSelect(o.value)}
          className={`min-h-tap rounded-lg border px-3 text-sm ${
            selected === o.value
              ? "border-moss-500 bg-moss-700/30 text-fog-50"
              : "border-ink-600 bg-ink-800 text-fog-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="tracking-widest text-moss-400" aria-label={`${n} out of 5`}>
      {"●".repeat(n)}
      <span className="text-ink-600">{"●".repeat(5 - n)}</span>
    </span>
  );
}

export default function TonightPage() {
  const { data, loaded, update } = useAppData();
  const [mood, setMood] = useState<Mood>("restless");
  const [energy, setEnergy] = useState<SoloNightInputs["energy"]>("medium");
  const [vibe, setVibe] = useState<Vibe>("social-adjacent");
  const [openness, setOpenness] = useState<SocialOpenness>("one-person");
  const [budget, setBudget] = useState(25);
  const [hours, setHours] = useState(3);
  const [neighborhood, setNeighborhood] = useState("");
  const [plans, setPlans] = useState<SoloNightPlan[] | null>(null);
  const [addedTier, setAddedTier] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const profile = data?.profile ?? null;
  const atFreeLimit = (data?.soloPlansUsedThisMonth ?? 0) >= 3;

  function generate() {
    if (atFreeLimit) {
      setShowUpgrade(true);
      return;
    }
    const inputs: SoloNightInputs = {
      mood,
      energy,
      budget,
      availableHours: hours,
      neighborhood:
        neighborhood.trim() ||
        profile?.neighborhood ||
        profile?.city ||
        "your neighborhood",
      vibe,
      openness,
    };
    setPlans(getAI().generateSoloNightPlans(inputs, profile));
    setAddedTier(null);
  }

  async function addToPlan(plan: SoloNightPlan) {
    const today = new Date().toISOString().slice(0, 10);
    await update((d) => ({
      ...d,
      soloPlansUsedThisMonth: d.soloPlansUsedThisMonth + 1,
      plans: [
        ...d.plans,
        {
          id: newId("solo"),
          kind: "solo-night" as const,
          createdAt: new Date().toISOString(),
          items: [
            {
              day: today,
              title: plan.title,
              detail: `${plan.microChallenge} Exit rule: ${plan.exitRule}`,
              done: false,
            },
          ],
        },
      ],
    }));
    setAddedTier(plan.tier);
  }

  if (!loaded) return <p className="text-fog-400">Loading…</p>;

  return (
    <section>
      {showUpgrade && (
        <UpgradeModal
          trigger="solo-plan-limit"
          onClose={() => setShowUpgrade(false)}
        />
      )}
      <h1 className="text-2xl font-semibold">Tonight</h1>
      <p className="mt-1 text-sm text-fog-400">
        Answer honestly, get three plans. The minimum one always counts.
        {atFreeLimit && (
          <span className="mt-1 block text-clay-300">
            You&rsquo;ve used your 3 free solo plans this month.
          </span>
        )}
      </p>

      <div className="card mt-4 space-y-4">
        <div>
          <p className="label">Mood right now</p>
          <Chip options={moods} selected={mood} onSelect={setMood} />
        </div>
        <div>
          <p className="label">Energy</p>
          <Chip
            options={[
              { value: "low" as const, label: "Low" },
              { value: "medium" as const, label: "Medium" },
              { value: "high" as const, label: "High" },
            ]}
            selected={energy}
            onSelect={setEnergy}
          />
        </div>
        <div>
          <p className="label">Desired vibe</p>
          <Chip options={vibes} selected={vibe} onSelect={setVibe} />
        </div>
        <div>
          <p className="label">People tonight?</p>
          <Chip
            options={opennessOptions}
            selected={openness}
            onSelect={setOpenness}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="budget" className="label">
              Budget: <span className="text-fog-50">${budget}</span>
            </label>
            <input
              id="budget"
              type="range"
              min={0}
              max={100}
              step={5}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-moss-500"
            />
          </div>
          <div>
            <label htmlFor="hours" className="label">
              Time: <span className="text-fog-50">{hours}h</span>
            </label>
            <input
              id="hours"
              type="range"
              min={1}
              max={6}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-moss-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="hood" className="label">
            Neighborhood{" "}
            <span className="text-fog-500">
              (defaults to {profile?.neighborhood ?? profile?.city ?? "yours"})
            </span>
          </label>
          <input
            id="hood"
            className="input"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder={profile?.neighborhood ?? "Journal Square"}
          />
        </div>
        <button type="button" onClick={generate} className="btn-primary w-full">
          {plans ? "Regenerate plans" : "Generate three plans"}
        </button>
      </div>

      {plans && (
        <div className="mt-4 space-y-3">
          {plans.map((p) => (
            <div
              key={p.tier}
              className={`card ${p.tier === "standard" ? "border-moss-700" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-semibold">{p.title}</h2>
                <span className="text-xs uppercase tracking-widest text-moss-400">
                  {tierLabels[p.tier]}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {p.timeline.map((t) => (
                  <li key={t.time + t.step} className="flex gap-3">
                    <span className="w-11 shrink-0 text-xs text-moss-300 pt-0.5">
                      {t.time}
                    </span>
                    <span className="text-fog-200">{t.step}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fog-500">
                <span>{p.costEstimate}</span>
                <span>
                  difficulty <Stars n={p.socialDifficulty} />
                </span>
                <span>
                  conversation <Stars n={p.conversationPotential} />
                </span>
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-widest text-fog-500">
                    Micro-challenge
                  </dt>
                  <dd className="mt-0.5 text-fog-200">{p.microChallenge}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-widest text-fog-500">
                    Exit rule
                  </dt>
                  <dd className="mt-0.5 text-fog-200">{p.exitRule}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-widest text-fog-500">
                    Reflect after
                  </dt>
                  <dd className="mt-0.5 text-fog-400">{p.reflectionPrompt}</dd>
                </div>
              </dl>
              {addedTier === p.tier ? (
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-sm text-moss-300">
                    Added as tonight&rsquo;s plan.
                  </span>
                  <Link href="/app" className="btn-secondary">
                    Dashboard
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => addToPlan(p)}
                  className="btn-primary mt-4"
                >
                  This is my night
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
