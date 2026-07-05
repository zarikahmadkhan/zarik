import type { AppData } from "@/lib/types";
import { SCHEMA_VERSION, type StorageAdapter } from "./adapter";

const KEY = `orbit:v${SCHEMA_VERSION}`;

export class LocalStorageAdapter implements StorageAdapter {
  async load(): Promise<AppData | null> {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as AppData;
      if (parsed.schemaVersion !== SCHEMA_VERSION) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  async save(data: AppData): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY, JSON.stringify(data));
  }

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(KEY);
  }
}
