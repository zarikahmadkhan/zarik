import type { AppData } from "@/lib/types";

// All persistence flows through this interface. The localStorage
// implementation ships in v0.1; a Supabase-backed implementation can be
// swapped in later without touching callers.
export interface StorageAdapter {
  load(): Promise<AppData | null>;
  save(data: AppData): Promise<void>;
  clear(): Promise<void>;
}

export const SCHEMA_VERSION = 1;

export function emptyAppData(): AppData {
  return {
    schemaVersion: SCHEMA_VERSION,
    mode: "demo",
    profile: null,
    events: [],
    people: [],
    followUps: [],
    reps: [],
    reviews: [],
    program: null,
    plans: [],
    cityPacks: [],
    personaPacks: [],
    soloPlansUsedThisMonth: 0,
  };
}
