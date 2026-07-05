# Orbit — Project Memory

## What this is
Orbit is a private personal social operating system for adults rebuilding social life.
Core promise: "Build a real social life in 30 days, one outing and one follow-up at a time."
Core loop: pick event → attend → talk to one person → capture weak tie → follow up → return to recurring settings.

The full product spec lives in `/docs/orbit-spec.md` and `/docs/orbit-marketing-spec.md`.
The v0.1 scope (what we are actually building now) lives in `/docs/SPEC_V01.md`. **SPEC_V01 wins on any conflict.**
The phased build plan with acceptance criteria lives in `PLAN.md`. Work one phase at a time.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- localStorage persistence behind a `StorageAdapter` interface (Supabase later — interface only, no client code)
- No external APIs, no API keys, no auth in v0.1. Demo mode only.
- Mock AI layer in `/lib/ai/` — pure functions, deterministic-ish, swappable for a real LLM later
- Deploy target: Vercel. The app must build clean (`npm run build`) at the end of every phase.

## Non-negotiable product principles
1. **Behavioral momentum over features.** The dashboard must always make the next action obvious.
2. **Handoff, not automation.** Never auto-send messages, never read messages, never import contacts. Copy / Web Share API / wa.me / sms: / mailto: links only, each only when the relevant field exists.
3. **Recurring exposure beats novelty.** Event scoring and recommendations weight recurring events heavily.
4. **Direct but not cruel.** Avoidance-mirror copy names the pattern and gives one small next rep. No shame language, no restart-from-zero framing.
5. **Private by default.** No feeds, no public profiles, no sharing of CRM data. Plain-English privacy note in settings.
6. **Not therapy, not dating app, not AI companion.** No medical/mental-health claims anywhere in copy.

## Copy and content guardrails
- Tone: calm, adult, direct, training-log energy. No gamification cuteness, no badges, no emoji-heavy UI, no therapy-speak, no pickup-artist tone.
- **No alcohol-centric defaults.** Seed data and Solo Night Generator suggestions must not center bars/nightlife. Bars appear only as an avoidable setting. Include faith/community events (mosque/church/community gatherings) as first-class event types, not an afterthought.
- Solo Night Generator and weekly plans must respect the user's `avoidedSettings` from onboarding — hard filter, not a soft preference.
- Food suggestions should never assume alcohol pairing; use coffee shops, dessert spots, food halls, night markets.
- Seed data locale: Jersey City / NYC (Journal Square, Grove St, downtown JC, Manhattan). Seed events: run club (recurring), comic book club, improv class, mosque community night, volunteer shift, museum late night, board game night, bookstore reading, fitness class, professional meetup, coffee reading night, neighborhood walk group.

## Mock AI layer — quality bar
This is the highest-leverage code in the repo. The mock functions ARE the product in demo mode.
- Each generator draws from large template banks (15+ variants per category minimum) parameterized by real user/event/person state — goal, energy, lane, days since contact, response history, avoided settings.
- Outputs must read like a sharp coach wrote them, not like string interpolation. Vary sentence structure, not just nouns.
- Every function lives behind an interface in `/lib/ai/index.ts` so a real LLM provider can replace the internals without touching callers.
- Follow-up drafts always include: message text, why-it-works, risk level (very safe / slightly vulnerable / scale back), suggested timing.

## Engineering conventions
- Types in `/lib/types.ts` — single source of truth, matches spec section 25.
- Storage: `/lib/storage/adapter.ts` (interface) + `/lib/storage/local.ts` (impl) + `/lib/storage/seed.ts`. All reads/writes through the adapter. No raw `localStorage` calls in components.
- Client components only where interaction requires it; keep pages lean.
- Mobile-first: design at 390px, verify nothing breaks at desktop. Tap targets ≥44px. No hover-only interactions.
- Semantic HTML, labeled forms, visible focus states.
- Empty states must suggest an action ("Add your first event"), never feel dead.

## Verification gate (every phase)
Before declaring any phase done:
1. `npm run build` passes with zero errors
2. `npm run lint` passes
3. Manually confirm the phase's acceptance criteria from PLAN.md
4. Commit with message `phase-N: <summary>`

## Scope freeze — do NOT build in v0.1 (deferred, see SPEC_V01)
Supabase client code, auth, Stripe, real LLM calls, Google Calendar OAuth, Capacitor,
app-store-readiness folder, marketing folder, scraping, contact import, push notifications,
analytics implementation. If a task seems to require any of these, stop and add a stub/TODO instead.
