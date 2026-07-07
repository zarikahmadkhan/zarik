"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { newId, useAppData } from "@/lib/storage";
import { getAI } from "@/lib/ai";
import UpgradeModal from "@/components/UpgradeModal";

export default function ReviewPage() {
  const { data, loaded, update } = useAppData();
  const [completed, setCompleted] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const ai = getAI();
  const review = useMemo(
    () => (data ? ai.generateWeeklyReview(data) : null),
    [data, ai]
  );

  if (!loaded) return <p className="text-fog-400">Loading…</p>;
  if (!data || !review) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Weekly review</h1>
        <div className="card mt-4">
          <p className="text-sm text-fog-400">
            Nothing to review yet — the review is built from what you actually
            do. Start with one event this week.
          </p>
          <Link href="/app/events" className="btn-primary mt-4">
            Find an event
          </Link>
        </div>
      </section>
    );
  }

  const alreadySaved = data.reviews.some((r) => r.weekStart === review.weekStart);

  async function completeReview() {
    await update((d) => ({
      ...d,
      reviews: d.reviews.some((r) => r.weekStart === review!.weekStart)
        ? d.reviews
        : [...d.reviews, review!],
      reps: [
        ...d.reps,
        {
          id: newId("rep"),
          type: "completed-weekly-review" as const,
          date: new Date().toISOString().slice(0, 10),
        },
      ],
    }));
    setCompleted(true);
  }

  const stats: { label: string; value: number }[] = [
    { label: "Attended", value: review.eventsAttended },
    { label: "Skipped", value: review.eventsSkipped },
    { label: "People met", value: review.peopleMet },
    { label: "Sent", value: review.followUpsSent },
    { label: "Owed", value: review.followUpsOwed },
  ];

  return (
    <section>
      <h1 className="text-2xl font-semibold">Weekly review</h1>
      <p className="mt-1 text-sm text-fog-500">
        Week of{" "}
        {new Date(review.weekStart + "T12:00:00").toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })}{" "}
        — built from your actual data, not your intentions.
      </p>

      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {stats.map((s) => (
          <div key={s.label} className="card px-1 py-3 text-center">
            <p className="text-xl font-semibold text-fog-50">{s.value}</p>
            <p className="mt-0.5 text-[0.65rem] uppercase tracking-wide text-fog-500">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {review.bestRep && (
        <div className="card mt-4">
          <p className="text-xs font-medium uppercase tracking-widest text-moss-300">
            Best rep this week
          </p>
          <p className="mt-1 text-sm capitalize text-fog-200">{review.bestRep}</p>
        </div>
      )}

      <div className="card mt-4 border-clay-500/30">
        <p className="text-xs font-medium uppercase tracking-widest text-clay-300">
          Pattern
        </p>
        <p className="mt-1 text-sm text-fog-200">{review.avoidancePattern}</p>
      </div>

      <div className="card mt-4">
        <p className="text-xs font-medium uppercase tracking-widest text-fog-500">
          Next week
        </p>
        <ul className="mt-2 space-y-2 text-sm text-fog-200">
          {review.nextWeekPlan.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-moss-400">→</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="card mt-4 border-moss-700">
        <p className="text-xs font-medium uppercase tracking-widest text-moss-300">
          The uncomfortable assignment
        </p>
        <p className="mt-1 text-sm text-fog-50">
          {review.uncomfortableAssignment}
        </p>
      </div>

      <div className="card mt-4 space-y-3 text-sm">
        {review.recurringEventToRepeat && (
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-fog-500">
              Repeat this
            </p>
            <p className="mt-0.5 text-fog-200">{review.recurringEventToRepeat}</p>
          </div>
        )}
        {review.weakTieToNurture && (
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-fog-500">
              Nurture this weak tie
            </p>
            <p className="mt-0.5 text-fog-200">{review.weakTieToNurture}</p>
          </div>
        )}
        {review.thingToStop && (
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-fog-500">
              Stop doing
            </p>
            <p className="mt-0.5 text-fog-200">{review.thingToStop}</p>
          </div>
        )}
      </div>

      {completed || alreadySaved ? (
        <p role="status" className="mt-4 text-sm text-moss-300">
          Review completed and logged as a rep.
        </p>
      ) : (
        <button
          type="button"
          onClick={completeReview}
          className="btn-primary mt-4 w-full"
        >
          Mark review complete
        </button>
      )}

      {/* Advanced review — mocked paid edge */}
      {(data?.tier ?? "free") === "free" && (
      <div className="card mt-4 border-dashed border-ink-600 opacity-80">
        <p className="text-xs font-medium uppercase tracking-widest text-clay-300">
          Advanced review · Pro
        </p>
        <p className="mt-1 text-sm text-fog-400">
          Energy-return by setting, follow-up conversion, and which event
          types actually produce friends for you.
        </p>
        <button
          type="button"
          onClick={() => setShowUpgrade(true)}
          className="btn-secondary mt-3"
        >
          See what&rsquo;s in it
        </button>
      </div>
      )}

      {showUpgrade && (
        <UpgradeModal
          trigger="advanced-review"
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </section>
  );
}
