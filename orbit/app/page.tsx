import Link from "next/link";
import { tiers } from "@/lib/pricing";

const method = [
  { step: "Go out", detail: "One concrete plan for tonight — matched to your energy, budget, and hard no's." },
  { step: "Meet people", detail: "Arrival strategies, openers, and one micro-challenge per outing. Talk to one person. That's the rep." },
  { step: "Follow up", detail: "Drafts that sound like you, with a why-it-works and a risk level. You send it from your own apps." },
  { step: "Repeat", detail: "Recurring events score highest, because becoming a regular is how weak ties become friends." },
];

const features = [
  { name: "Solo Night Generator", detail: "Three plans for tonight: minimum viable, standard, bold." },
  { name: "Event scoring", detail: "Recurring, conversation-friendly events rise to the top." },
  { name: "Private people tracker", detail: "Who you met, where, and whether the tie is worth nurturing." },
  { name: "Follow-up drafts", detail: "Six tones, honest risk levels, and a two-unanswered-messages stop rule." },
  { name: "Social rep tracker", detail: "A training log, not a game. Streaks and repeat exposure." },
  { name: "Weekly review", detail: "Built from what you actually did — including the pattern you're avoiding." },
  { name: "30-Day Social Rebuild", detail: "Four weeks: leave the apartment, start conversations, follow up, build cadence." },
];

const personas = [
  "Rebuilding after divorce",
  "New to the city",
  "Remote worker whose office was the social life",
  "Introvert who wants more friends",
  "Faith- and community-centered",
  "Busy professional with a thin weekend",
];

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-app px-4 pb-16 pt-20">
        <p className="text-sm font-medium uppercase tracking-widest text-moss-400">
          Orbit
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
          Build a real social life in 30 days.
        </h1>
        <p className="mt-4 max-w-prose text-lg text-fog-400">
          Orbit gives you weekly outings, follow-up prompts, and a private
          relationship tracker — so you stop starting from zero every weekend.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/demo" className="btn-primary">
            Start your 7-day plan
          </Link>
          <Link href="/app/tonight" className="btn-secondary">
            Try the Solo Night Generator
          </Link>
        </div>
        <p className="mt-4 text-xs text-fog-500">
          Free demo · no account · everything stays in your browser
        </p>
      </section>

      {/* Problem */}
      <section className="border-t border-ink-800 bg-ink-900/50">
        <div className="mx-auto max-w-app px-4 py-14">
          <h2 className="max-w-prose text-2xl font-semibold leading-snug">
            You don&rsquo;t need more event options. You need a system that
            makes you go, follow up, and repeat.
          </h2>
          <p className="mt-4 max-w-prose text-fog-400">
            You have contacts, events, and intentions. What&rsquo;s missing is
            cadence: the loop that turns a night out into a familiar face, and
            a familiar face into a friend. Orbit is that loop, kept privately,
            with no feed and no performing.
          </p>
        </div>
      </section>

      {/* Method */}
      <section className="mx-auto max-w-app px-4 py-14">
        <h2 className="text-xl font-semibold">The method</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {method.map((m, i) => (
            <div key={m.step} className="card">
              <p className="text-xs font-medium uppercase tracking-widest text-moss-400">
                {i + 1} · {m.step}
              </p>
              <p className="mt-2 text-sm text-fog-300">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-ink-800 bg-ink-900/50">
        <div className="mx-auto max-w-app px-4 py-14">
          <h2 className="text-xl font-semibold">What you get</h2>
          <ul className="mt-6 space-y-4">
            {features.map((f) => (
              <li key={f.name} className="flex gap-3 text-sm">
                <span className="mt-0.5 text-moss-400">—</span>
                <span>
                  <span className="font-medium text-fog-50">{f.name}.</span>{" "}
                  <span className="text-fog-400">{f.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto max-w-app px-4 py-14">
        <h2 className="text-xl font-semibold">Who it&rsquo;s for</h2>
        <p className="mt-2 max-w-prose text-sm text-fog-400">
          Adults rebuilding a social life on purpose. Not a dating app, not a
          feed, not therapy, and never an AI that talks to people for you.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {personas.map((p) => (
            <span
              key={p}
              className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-1.5 text-sm text-fog-300"
            >
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-t border-ink-800 bg-ink-900/50">
        <div className="mx-auto max-w-app px-4 py-14">
          <h2 className="text-xl font-semibold">Pricing</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.id}
                className={`card ${t.id === "pro" ? "border-moss-700" : ""}`}
              >
                <p className="font-medium">{t.name}</p>
                <p className="mt-1 text-2xl font-semibold">
                  {t.pricePerMonth === 0 ? "Free" : `$${t.pricePerMonth}`}
                  {t.pricePerMonth > 0 && (
                    <span className="text-sm text-fog-500">/mo</span>
                  )}
                </p>
                <p className="mt-2 text-xs text-fog-400">{t.tagline}</p>
              </div>
            ))}
          </div>
          <Link href="/pricing" className="btn-secondary mt-5">
            Compare plans
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-app px-4 py-16">
        <h2 className="text-2xl font-semibold">
          Tonight is a rep. Take it.
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/demo" className="btn-primary">
            Start your 7-day plan
          </Link>
          <Link href="/app/tonight" className="btn-secondary">
            Try the Solo Night Generator
          </Link>
        </div>
        <p className="mt-10 text-xs text-fog-500">
          <Link href="/about" className="underline">
            About
          </Link>{" "}
          ·{" "}
          <Link href="/pricing" className="underline">
            Pricing
          </Link>{" "}
          · Private by default — your data stays in your browser.
        </p>
      </section>
    </main>
  );
}
