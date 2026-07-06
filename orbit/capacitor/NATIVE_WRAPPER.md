# Capacitor Native Wrapper — Setup & Notes

> ⚠️ **This scaffold is UNVERIFIED.** It was written without access to Xcode or the Android SDK and has **not** been built into a native app. Every step below is standard Capacitor 6 practice, but treat it as a starting point to validate on a Mac, not a proven build. Do not submit to any store until `../app-store-readiness/06-testflight-checklist.md` passes on a real device.

## Goal

Wrap the existing Next.js web app in a native iOS/Android shell **without breaking the web version**. The web app remains the source of truth; Capacitor packages it. This is deliberately deferred per `SPEC_V01.md` and `PLAN.md` — do it only when the web app is stable (it is) and you have real reason to ship native.

## The one real blocker: static export

Capacitor serves a static `webDir`. The app currently uses Next.js App Router with dynamic routes (`/app/events/[id]`, `/app/people/[id]`) rendered on demand — that does **not** statically export as-is. Two paths:

1. **Static export (`output: 'export'`)** — requires making the dynamic routes client-rendered from localStorage (they already read all data client-side via `useAppData`, so this is mostly adding `generateStaticParams` returning `[]` + client fallback, or converting `[id]` pages to a query-param pattern). Most work, cleanest native result.
2. **Remote server URL** — point `server.url` at the deployed Netlify site so the native shell loads the live web app. Fastest, but the app then requires connectivity and Apple may view it as a thin wrapper (see review risk notes). Not recommended for submission.

Path 1 is the right one for a real native app. Budget real engineering time for the dynamic-route conversion and re-run the full e2e suite after.

## Setup steps (run on a Mac for iOS)

```bash
# from orbit/ project root
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# move the scaffold config to the root
mv capacitor/capacitor.config.ts ./capacitor.config.ts

# configure static export in next.config.mjs:
#   const nextConfig = { output: 'export', images: { unoptimized: true } }
# and resolve dynamic routes (see "static export" above)

npm run build            # produces ./out
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios         # opens Xcode
```

## Recommended plugins (add when needed)

- `@capacitor/share` — native share sheet (replaces web `navigator.share` for the follow-up handoff)
- `@capacitor/filesystem` — for `.ics` and JSON export/import inside the webview (browser `<a download>` is unreliable in a native webview)
- `@capacitor/preferences` — more durable than `localStorage` for the app data (OS can evict webview storage under pressure; migrate the `StorageAdapter` to this for native)
- `@capacitor/app` — lifecycle, back-button handling on Android

The `StorageAdapter` interface (`lib/storage/adapter.ts`) is the clean seam here: a `CapacitorPreferencesAdapter` implements the same three methods and swaps in for native without touching any component.

## Known limitations (unverified scaffold)

- **Not built or run** — no guarantee it compiles until validated on a Mac.
- Dynamic routes need conversion for static export (above).
- Handoff links (`wa.me`, `sms:`, `mailto:`) must be tested inside the native webview — link handling differs from mobile browsers.
- File download/export needs the Filesystem plugin, not the current browser download.
- `localStorage` durability on device is a risk — migrate to Preferences for anything you don't want the OS to evict.
- App icons and splash screens need generating (`@capacitor/assets`).

## What must be done before App Store submission

1. Complete the static-export conversion and re-pass the full web e2e suite.
2. Produce a real iOS build in Xcode and an Android build in Android Studio.
3. Swap the storage adapter to Capacitor Preferences for durability.
4. Wire native share/filesystem plugins for handoff and export.
5. Generate icons + splash assets.
6. Pass every item in `../app-store-readiness/06-testflight-checklist.md` on a real device.
7. Complete the store listing, privacy disclosure, and screenshots from `../app-store-readiness/`.

## Why it lives in /capacitor

Keeping the config and notes in this folder (not the project root) means **the web build is completely unaffected** — no Capacitor dependency is installed, `npm run build` and the Netlify deploy are untouched. Activating native is a deliberate, isolated step, exactly as the spec requires ("do not let Capacitor work break the web app").
