import type { SettingTag, UserProfile } from "@/lib/types";

// Deterministic-ish selection: same inputs → same output within a day,
// different inputs → different picks. No Math.random so outputs are stable
// and testable.

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function pick<T>(bank: T[], seedParts: (string | number)[]): T {
  const seed = hashString(seedParts.join("|"));
  return bank[seed % bank.length];
}

export function pickN<T>(bank: T[], n: number, seedParts: (string | number)[]): T[] {
  const seed = hashString(seedParts.join("|"));
  const out: T[] = [];
  for (let i = 0; i < Math.min(n, bank.length); i++) {
    out.push(bank[(seed + i * 7919) % bank.length]);
  }
  return Array.from(new Set(out)).slice(0, n);
}

export function daySeed(): string {
  return new Date().toISOString().slice(0, 10);
}

// Hard filter — avoided settings are never suggested, period.
const settingKeywords: Record<string, SettingTag[]> = {
  bar: ["bars", "heavy-nightlife"],
  nightlife: ["heavy-nightlife"],
  club: ["heavy-nightlife", "loud-parties"],
  party: ["loud-parties"],
  networking: ["large-networking"],
};

export function violatesAvoided(
  text: string,
  profile: UserProfile | null
): boolean {
  if (!profile || profile.avoidedSettings.length === 0) return false;
  const lower = text.toLowerCase();
  for (const [word, tags] of Object.entries(settingKeywords)) {
    if (
      lower.includes(word) &&
      tags.some((t) => profile.avoidedSettings.includes(t))
    ) {
      return true;
    }
  }
  return false;
}

export function filterAvoided<T extends { title?: string; step?: string }>(
  items: T[],
  profile: UserProfile | null,
  textOf: (item: T) => string
): T[] {
  return items.filter((i) => !violatesAvoided(textOf(i), profile));
}

export function daysSince(iso: string | undefined): number | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  return Math.floor((Date.now() - then) / 86400000);
}
