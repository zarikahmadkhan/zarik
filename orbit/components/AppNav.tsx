"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const tabs = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/tonight", label: "Tonight" },
  { href: "/app/events", label: "Events" },
  { href: "/app/people", label: "People" },
  { href: "/app/reps", label: "Reps" },
];

const moreLinks = [
  { href: "/app/review", label: "Weekly Review" },
  { href: "/app/program", label: "30-Day Program" },
  { href: "/app/settings", label: "Settings" },
];

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AppNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = moreLinks.some((l) => isActive(pathname, l.href));

  return (
    <>
      {/* Desktop top nav */}
      <header className="hidden border-b border-ink-800 md:block">
        <nav className="mx-auto flex max-w-app items-center gap-1 px-4 py-3">
          <Link href="/app" className="mr-4 text-lg font-semibold text-fog-50">
            Orbit
          </Link>
          {[...tabs, ...moreLinks].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`rounded-lg px-3 py-2 text-sm ${
                isActive(pathname, t.href)
                  ? "bg-ink-800 text-fog-50"
                  : "text-fog-400 hover:text-fog-200"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-800 bg-ink-900/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-6">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              onClick={() => setMoreOpen(false)}
              className={`flex min-h-tap flex-col items-center justify-center py-2 text-[0.6875rem] ${
                isActive(pathname, t.href) && !moreOpen
                  ? "text-moss-300"
                  : "text-fog-400"
              }`}
            >
              {t.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className={`flex min-h-tap flex-col items-center justify-center py-2 text-[0.6875rem] ${
              moreOpen || moreActive ? "text-moss-300" : "text-fog-400"
            }`}
          >
            More
          </button>
        </div>
      </nav>

      {/* Mobile "More" sheet */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/70 md:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute inset-x-0 bottom-14 rounded-t-card border-t border-ink-700 bg-ink-900 p-4 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            {moreLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMoreOpen(false)}
                className={`block min-h-tap rounded-lg px-3 py-3 text-sm ${
                  isActive(pathname, l.href)
                    ? "bg-ink-800 text-fog-50"
                    : "text-fog-200"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
