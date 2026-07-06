"use client";

import Link from "next/link";
import { getAI, type UpgradeTrigger } from "@/lib/ai";

// Mock locked-state modal. No payments — routes to /pricing.
export default function UpgradeModal({
  trigger,
  onClose,
}: {
  trigger: UpgradeTrigger;
  onClose: () => void;
}) {
  const copy = getAI().generateUpgradePrompt(trigger);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/80 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-card border border-ink-700 bg-ink-900 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-medium uppercase tracking-widest text-clay-300">
          Pro feature
        </p>
        <h2 className="mt-2 text-lg font-semibold">{copy.headline}</h2>
        <p className="mt-2 text-sm text-fog-400">{copy.body}</p>
        <div className="mt-5 flex gap-2">
          <Link href="/pricing" className="btn-primary flex-1">
            {copy.cta}
          </Link>
          <button type="button" onClick={onClose} className="btn-secondary">
            Not now
          </button>
        </div>
        <p className="mt-3 text-xs text-fog-500">
          Demo note: payments aren&rsquo;t wired up in v0.1 — this shows where
          the paid edge sits.
        </p>
      </div>
    </div>
  );
}
