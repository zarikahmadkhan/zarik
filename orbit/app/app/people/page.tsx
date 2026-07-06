"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppData } from "@/lib/storage";
import PersonForm from "@/components/PersonForm";
import type { Person, PersonStatus } from "@/lib/types";

type StatusFilter = "all" | PersonStatus;

const filters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "needs-follow-up", label: "Needs follow-up" },
  { value: "new", label: "New" },
  { value: "active", label: "Active" },
  { value: "dormant", label: "Dormant" },
];

const laneLabels: Record<string, string> = {
  acquaintance: "Acquaintance",
  "potential-friend": "Potential friend",
  "community-contact": "Community",
  "dating-marriage-interest": "Dating/marriage",
  professional: "Professional",
  family: "Family",
  other: "Other",
};

export default function PeoplePage() {
  const { data, loaded, update } = useAppData();
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("all");

  if (!loaded) return <p className="text-fog-400">Loading…</p>;

  const people = (data?.people ?? [])
    .filter((p) => filter === "all" || p.status === filter)
    .sort((a, b) => a.name.localeCompare(b.name));

  async function save(person: Person) {
    await update((d) => ({ ...d, people: [...d.people, person] }));
    setAdding(false);
  }

  if (adding) {
    return (
      <section>
        <h1 className="text-2xl font-semibold">Add person</h1>
        <p className="mt-1 text-sm text-fog-400">
          Capture the weak tie while you still remember the conversation.
        </p>
        <div className="card mt-4">
          <PersonForm
            onSave={save}
            onCancel={() => setAdding(false)}
            saveLabel="Add person"
          />
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">People</h1>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="btn-primary"
        >
          + Add
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`min-h-tap rounded-lg border px-3 text-sm ${
              filter === f.value
                ? "border-moss-500 bg-moss-700/30 text-fog-50"
                : "border-ink-600 bg-ink-800 text-fog-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {people.length === 0 ? (
        <div className="card mt-4">
          <p className="text-sm text-fog-400">
            {data?.people.length === 0
              ? "No one in your orbit yet. Add the last person you had a real conversation with."
              : "No one matches this filter."}
          </p>
          {data?.people.length === 0 && (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="btn-primary mt-4"
            >
              Add your first person
            </button>
          )}
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {people.map((p) => (
            <li key={p.id}>
              <Link href={`/app/people/${p.id}`} className="card block">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="mt-0.5 text-sm text-fog-500">
                      {laneLabels[p.lane]}
                      {p.whereMet ? ` · met at ${p.whereMet}` : ""}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 text-xs ${
                      p.status === "needs-follow-up"
                        ? "bg-clay-500/20 text-clay-300"
                        : p.status === "active"
                          ? "bg-moss-700/40 text-moss-300"
                          : "bg-ink-800 text-fog-500"
                    }`}
                  >
                    {p.status.replaceAll("-", " ")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
