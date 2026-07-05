"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { resetToSeed, loadAppData } from "@/lib/storage";

export default function DemoPage() {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      // Only overwrite with seed data if nothing meaningful exists yet.
      const existing = await loadAppData();
      if (!existing || (existing.events.length === 0 && !existing.profile)) {
        await resetToSeed();
      }
      router.replace("/app");
    })();
  }, [router]);

  return (
    <main className="mx-auto max-w-app px-4 py-16">
      <h1 className="text-2xl font-semibold">Setting up demo…</h1>
      <p className="mt-2 text-fog-400">
        Loading sample data into this browser. Nothing leaves your device.
      </p>
    </main>
  );
}
