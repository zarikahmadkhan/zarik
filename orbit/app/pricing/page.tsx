import Link from "next/link";
import { tiers } from "@/lib/pricing";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-app px-4 py-12">
      <Link href="/" className="text-sm text-fog-500">
        ← Orbit
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">Pricing</h1>
      <p className="mt-3 max-w-prose text-fog-400">
        The free tier is enough to leave the apartment. Paid tiers keep the
        weekly loop running: outings chosen, follow-ups drafted, patterns
        named.
      </p>

      <div className="mt-8 space-y-4">
        {tiers.map((t) => (
          <div
            key={t.id}
            className={`card ${t.id === "pro" ? "border-moss-600" : ""}`}
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">
                {t.name}
                {t.id === "pro" && (
                  <span className="ml-2 rounded bg-moss-700/40 px-2 py-0.5 text-xs font-normal text-moss-300">
                    the loop
                  </span>
                )}
              </h2>
              <p className="text-2xl font-semibold">
                {t.pricePerMonth === 0 ? "Free" : `$${t.pricePerMonth}`}
                {t.pricePerMonth > 0 && (
                  <span className="text-sm font-normal text-fog-500">/mo</span>
                )}
              </p>
            </div>
            <p className="mt-1 text-sm text-fog-400">{t.tagline}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-fog-300">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-moss-400">—</span>
                  {f}
                </li>
              ))}
            </ul>
            {t.id === "free" ? (
              <Link href="/demo" className="btn-secondary mt-4">
                Start free
              </Link>
            ) : (
              <CheckoutButton tier={t.id} />
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-fog-500">
        v0.1 note: payments aren&rsquo;t implemented. Paid tiers exist so the
        product&rsquo;s edges are honest — locked features in the app point
        here rather than pretending everything is free forever.
      </p>
    </main>
  );
}
