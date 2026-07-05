"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppData } from "@/lib/types";
import { emptyAppData, SCHEMA_VERSION, type StorageAdapter } from "./adapter";
import { LocalStorageAdapter } from "./local";
import { seedAppData } from "./seed";

const adapter: StorageAdapter = new LocalStorageAdapter();

export async function loadAppData(): Promise<AppData | null> {
  return adapter.load();
}

export async function saveAppData(data: AppData): Promise<void> {
  await adapter.save(data);
}

export async function resetToSeed(): Promise<AppData> {
  const data = seedAppData();
  await adapter.save(data);
  return data;
}

export async function deleteAllData(): Promise<void> {
  await adapter.clear();
}

export function exportAppData(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function validateImport(raw: string): AppData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("That file is not valid JSON.");
  }
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("That file does not look like an Orbit export.");
  }
  const d = parsed as Partial<AppData>;
  if (d.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(
      `Schema version mismatch — expected ${SCHEMA_VERSION}, got ${String(
        d.schemaVersion
      )}.`
    );
  }
  const requiredArrays = [
    "events",
    "people",
    "followUps",
    "reps",
    "reviews",
    "plans",
  ] as const;
  for (const key of requiredArrays) {
    if (!Array.isArray(d[key])) {
      throw new Error(`Missing or invalid field: ${key}.`);
    }
  }
  return { ...emptyAppData(), ...(d as AppData) };
}

// React hook: loads once on mount, exposes update() which persists and
// re-renders. All components go through this — no raw localStorage anywhere.
export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    adapter.load().then((d) => {
      if (!cancelled) {
        setData(d);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(
    async (fn: (current: AppData) => AppData) => {
      const next = fn(data ?? emptyAppData());
      await adapter.save(next);
      setData(next);
      return next;
    },
    [data]
  );

  const replace = useCallback(async (next: AppData | null) => {
    if (next === null) {
      await adapter.clear();
    } else {
      await adapter.save(next);
    }
    setData(next);
  }, []);

  return { data, loaded, update, replace };
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
