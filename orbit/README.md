# Orbit

A private personal social operating system for adults rebuilding social life.

**Core promise:** build a real social life in 30 days, one outing and one follow-up at a time.
**Core loop:** pick event → attend → talk to one person → capture weak tie → follow up → return to recurring settings.

This is **v0.1** — a fully working demo-mode product with no accounts, no payments, and no external APIs. See `docs/SPEC_V01.md` for exact scope; `docs/orbit-spec.md` for the full product spec.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (must pass clean)
npm run lint
```

Visit `/demo` to seed sample data (Jersey City/NYC locale) and land on the dashboard, or `/app/onboarding` to start fresh. Deployed on Netlify (also Vercel-ready) — `netlify.toml` pins the Next.js runtime plugin.

## What's real vs. mocked

**Real:** every user flow. Onboarding, 7-day plan generation, Solo Night Generator, event CRUD + scoring + paste-text parsing, .ics export, attended/skipped reflections, people CRM with reality checks, follow-up drafting with conditional handoff (copy / Web Share / wa.me / sms: / mailto:), rep tracking with streaks, weekly review from stored data, 30-day program. Data persists in localStorage; export/import/reset/delete all work from Settings.

**Mocked:**
- **The AI layer** (`lib/ai/`) — all 13 "generator" functions are deterministic template banks parameterized by real user/event/person state. No LLM is called and no API key exists anywhere. The `AIProvider` interface in `lib/ai/index.ts` is the swap point for a real LLM later: implement the interface, change one line in `getAI()`, and no caller changes.
- **Payments** — pricing tiers, locked features (3 solo plans/month, program week 2+, advanced review), and upgrade modals exist as honest edges, but every "upgrade" routes to the static `/pricing` page.
- **Event parsing** — heuristic text extraction, not scraping.

## Architecture

- `lib/types.ts` — every data model, single source of truth
- `lib/storage/` — `adapter.ts` (StorageAdapter interface) + `local.ts` (localStorage impl, versioned key `orbit:v1`) + `seed.ts`. All persistence flows through the adapter via the `useAppData` hook; no raw localStorage anywhere else
- `lib/ai/` — provider interface + mock implementation, split by domain (soloNight, followUp, events, plans, review)
- `app/` — Next.js App Router; client components only where interaction requires it
- `/app/dev-ai` — dev harness rendering sample output from all 13 generators

## Swapping localStorage for Supabase later

1. Implement `StorageAdapter` (`load`/`save`/`clear`) against Supabase, scoping rows to the authenticated user id
2. Swap the adapter instance in `lib/storage/index.ts`
3. Keep profiles private: no public profiles, no feed, no social graph

## Data & privacy

Demo data lives only in the browser. Export/import as JSON, reset to seed, or delete everything from Settings. Nothing is sent to any server. Orbit never auto-sends messages, never reads messages, never imports contacts — handoff, not automation.

## Reset / export

Settings → Export JSON (backup), Import JSON (restore), Reset to sample data, Delete all local data.

## v0.1 definition of done

Tracked in `docs/SPEC_V01.md` — 12 items, all verified by browser e2e at 390px before each phase was committed.

## Post-v0.1 backlog (deliberately not built)

Supabase auth/persistence, real LLM behind the existing interface, Stripe, Google Calendar OAuth, Capacitor wrapper, marketing folder, app-store-readiness folder, analytics. See `PLAN.md`.
