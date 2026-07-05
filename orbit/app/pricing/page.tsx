import Link from "next/link";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-app px-4 py-12">
      <h1 className="text-3xl font-semibold">Pricing</h1>
      <p className="mt-3 text-fog-400">
        Free, Pro, and Premium tiers land in phase 7. Everything in the demo is
        free to use right now.
      </p>
      <Link href="/demo" className="btn-primary mt-6">
        Try the demo
      </Link>
    </main>
  );
}
