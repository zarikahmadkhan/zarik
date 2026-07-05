import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-app flex-col justify-center px-4 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-moss-400">
        Orbit
      </p>
      <h1 className="mt-3 text-4xl font-semibold leading-tight">
        Build a real social life in 30 days.
      </h1>
      <p className="mt-4 max-w-prose text-fog-400">
        Weekly outings, follow-up prompts, and a private relationship tracker —
        so you stop starting from zero every weekend.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/demo" className="btn-primary">
          Try the demo
        </Link>
        <Link href="/app/tonight" className="btn-secondary">
          Solo Night Generator
        </Link>
      </div>
      <p className="mt-10 text-sm text-fog-500">
        Full landing page ships in phase 7.{" "}
        <Link href="/pricing" className="text-fog-400 underline">
          Pricing
        </Link>{" "}
        ·{" "}
        <Link href="/about" className="text-fog-400 underline">
          About
        </Link>
      </p>
    </main>
  );
}
