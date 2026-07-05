"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/storage";
import { getAI } from "@/lib/ai";
import type {
  Channel,
  ComfortLevel,
  Goal,
  SettingTag,
  SocialEnergy,
  UserProfile,
} from "@/lib/types";

const goals: { value: Goal; label: string }[] = [
  { value: "make-friends", label: "Make new friends" },
  { value: "rebuild-after-divorce", label: "Rebuild after divorce/breakup" },
  { value: "new-city-reset", label: "New city reset" },
  { value: "build-community", label: "Build community" },
  { value: "dating-marriage-momentum", label: "Dating/marriage momentum" },
  { value: "stop-wasting-nights", label: "Stop wasting nights at home" },
];

const preferredOptions: { value: SettingTag; label: string }[] = [
  { value: "run-clubs", label: "Run clubs" },
  { value: "book-comic-clubs", label: "Book/comic clubs" },
  { value: "faith-community", label: "Faith/community events" },
  { value: "concerts", label: "Concerts" },
  { value: "classes-workshops", label: "Classes/workshops" },
  { value: "coffee-shops", label: "Coffee shops" },
  { value: "fitness", label: "Fitness" },
  { value: "volunteering", label: "Volunteering" },
  { value: "professional", label: "Professional events" },
  { value: "food-night-markets", label: "Food/night markets" },
  { value: "museums-culture", label: "Museums/culture" },
];

const avoidedOptions: { value: SettingTag; label: string }[] = [
  { value: "bars", label: "Bars" },
  { value: "heavy-nightlife", label: "Heavy nightlife" },
  { value: "loud-parties", label: "Loud parties" },
  { value: "large-networking", label: "Large networking events" },
  { value: "expensive-events", label: "Expensive events" },
];

const comfortOptions: { value: ComfortLevel; label: string }[] = [
  { value: "not-comfortable", label: "Not comfortable" },
  { value: "somewhat-comfortable", label: "Somewhat comfortable" },
  { value: "comfortable-but-rusty", label: "Comfortable but rusty" },
  { value: "very-comfortable", label: "Very comfortable" },
];

const channels: { value: Channel; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "other", label: "Other" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ageRanges = ["25-34", "35-44", "45-54", "55-64", "65+"];

function ChoiceGrid<T extends string>({
  options,
  selected,
  onToggle,
  multi,
}: {
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (v: T) => void;
  multi: boolean;
}) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-2" role={multi ? "group" : "radiogroup"}>
      {options.map((o) => {
        const active = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={active}
            onClick={() => onToggle(o.value)}
            className={`min-h-tap rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
              active
                ? "border-moss-500 bg-moss-700/30 text-fog-50"
                : "border-ink-600 bg-ink-800 text-fog-200"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useAppData();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [ageRange, setAgeRange] = useState("35-44");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [energy, setEnergy] = useState<SocialEnergy>("medium");
  const [comfort, setComfort] = useState<ComfortLevel>("comfortable-but-rusty");
  const [preferred, setPreferred] = useState<SettingTag[]>([]);
  const [avoided, setAvoided] = useState<SettingTag[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [budget, setBudget] = useState(25);
  const [channel, setChannel] = useState<Channel>("whatsapp");

  const toggle = <T,>(list: T[], set: (v: T[]) => void) => (v: T) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const steps = 4;

  const canNext =
    step === 0
      ? name.trim().length > 0 && city.trim().length > 0
      : step === 1
        ? goal !== null
        : step === 2
          ? preferred.length > 0
          : true;

  async function finish() {
    if (!goal) return;
    setSaving(true);
    const profile: UserProfile = {
      name: name.trim(),
      city: city.trim(),
      neighborhood: neighborhood.trim() || undefined,
      ageRange,
      goal,
      energy,
      preferredSettings: preferred,
      avoidedSettings: avoided,
      weeklyAvailability: availability,
      budgetPerOuting: budget,
      comfortWithStrangers: comfort,
      preferredChannel: channel,
      onboardedAt: new Date().toISOString(),
    };
    await update((d) => {
      const plan = getAI().generateWeeklySocialPlan(profile, d.events);
      return { ...d, profile, plans: [...d.plans, plan] };
    });
    router.push("/app");
  }

  return (
    <section className="mx-auto max-w-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Set up Orbit</h1>
        <span className="text-sm text-fog-500">
          {step + 1} / {steps}
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded bg-ink-800">
        <div
          className="h-full bg-moss-600 transition-all"
          style={{ width: `${((step + 1) / steps) * 100}%` }}
        />
      </div>

      {step === 0 && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-fog-400">
            Two minutes, then you get a 7-day plan. Everything stays on this
            device.
          </p>
          <div>
            <label htmlFor="name" className="label">
              First name
            </label>
            <input
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="given-name"
            />
          </div>
          <div>
            <label htmlFor="city" className="label">
              City
            </label>
            <input
              id="city"
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Jersey City"
            />
          </div>
          <div>
            <label htmlFor="hood" className="label">
              Neighborhood <span className="text-fog-500">(optional)</span>
            </label>
            <input
              id="hood"
              className="input"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Journal Square"
            />
          </div>
          <div>
            <label htmlFor="age" className="label">
              Age range
            </label>
            <select
              id="age"
              className="input"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
            >
              {ageRanges.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 space-y-5">
          <div>
            <p className="label">What are you rebuilding toward?</p>
            <ChoiceGrid
              options={goals}
              selected={goal ? [goal] : []}
              onToggle={(v) => setGoal(v)}
              multi={false}
            />
          </div>
          <div>
            <p className="label">Social energy, honestly</p>
            <ChoiceGrid
              options={[
                { value: "low" as SocialEnergy, label: "Low" },
                { value: "medium" as SocialEnergy, label: "Medium" },
                { value: "high" as SocialEnergy, label: "High" },
              ]}
              selected={[energy]}
              onToggle={(v) => setEnergy(v)}
              multi={false}
            />
          </div>
          <div>
            <p className="label">Talking to strangers right now feels…</p>
            <ChoiceGrid
              options={comfortOptions}
              selected={[comfort]}
              onToggle={(v) => setComfort(v)}
              multi={false}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-5">
          <div>
            <p className="label">Settings you&rsquo;d actually go to</p>
            <ChoiceGrid
              options={preferredOptions}
              selected={preferred}
              onToggle={toggle(preferred, setPreferred)}
              multi
            />
          </div>
          <div>
            <p className="label">
              Hard no&rsquo;s <span className="text-fog-500">(never suggested)</span>
            </p>
            <ChoiceGrid
              options={avoidedOptions}
              selected={avoided}
              onToggle={toggle(avoided, setAvoided)}
              multi
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-6 space-y-5">
          <div>
            <p className="label">Evenings you can usually go out</p>
            <div className="mt-2 flex flex-wrap gap-2" role="group">
              {days.map((d) => {
                const active = availability.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    role="checkbox"
                    aria-checked={active}
                    onClick={() => toggle(availability, setAvailability)(d)}
                    className={`min-h-tap min-w-tap rounded-lg border px-3 text-sm ${
                      active
                        ? "border-moss-500 bg-moss-700/30 text-fog-50"
                        : "border-ink-600 bg-ink-800 text-fog-200"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label htmlFor="budget" className="label">
              Budget per outing: <span className="text-fog-50">${budget}</span>
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
            <p className="label">How you&rsquo;d usually follow up with someone</p>
            <ChoiceGrid
              options={channels}
              selected={[channel]}
              onToggle={(v) => setChannel(v)}
              multi={false}
            />
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-2">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="btn-secondary"
          >
            Back
          </button>
        )}
        {step < steps - 1 ? (
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setStep(step + 1)}
            className="btn-primary flex-1 disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            disabled={saving}
            onClick={finish}
            className="btn-primary flex-1 disabled:opacity-40"
          >
            {saving ? "Building your week…" : "Generate my 7-day plan"}
          </button>
        )}
      </div>
    </section>
  );
}
