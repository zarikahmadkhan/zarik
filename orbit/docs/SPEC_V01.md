# Orbit v0.1 — Scope Definition

This document trims the full spec (`/docs/orbit-spec.md`) to what ships in the Fable build window.
Anything marked DEFERRED gets an interface, a stub, or nothing — never a full implementation.

## In scope

### Routes
- `/` — landing page (conversion-focused, but built LAST — phase 7)
- `/pricing` — static tier cards + mock upgrade modal (phase 7)
- `/app` — dashboard
- `/app/onboarding`
- `/app/tonight` — Solo Night Generator
- `/app/events`, `/app/events/[id]`
- `/app/people`, `/app/people/[id]`
- `/app/reps`
- `/app/review`
- `/app/program`
- `/app/settings` — export/import/reset/delete data, privacy note
- `/demo` → seeds data + redirects to `/app`
- `/about` — one screen, minimal (phase 7)

### Features (full builds)
1. **Onboarding** — spec section 8, all fields, <2 min, progressive (3–4 screens max). Generates initial 7-day plan on completion.
2. **Dashboard** — spec section 9. Tonight's action, week plan, upcoming events, follow-ups owed, reps this week, program progress, one avoidance-mirror insight, quick-add buttons.
3. **Solo Night Generator** — spec section 10. All inputs, three plans (minimum viable / standard / bold), each with timeline, cost, difficulty + conversation ratings, exit rule, micro-challenge, reflection prompt, add-to-plan.
4. **Events** — spec sections 11–14. CRUD, all fields, scoring (recurring-weighted), filters, paste-text parser (mock), detail page with arrival strategy + openers + exit rule, attended/skipped reflections, recovery actions, **.ics export** and Google Calendar template link (no OAuth).
5. **People CRM** — spec sections 15–16. CRUD, all fields, relationship lanes, status, reality-check computed warnings.
6. **Follow-Up Generator + Handoff** — spec sections 17–18. Drafts with tone options, why-it-works, risk level, timing. Handoff buttons: copy, Web Share API, wa.me (if phone), sms: (if phone), mailto: (if email), mark sent, snooze.
7. **Social Rep Tracker** — spec section 19. Rep types, weekly progress, streak, repeat-exposure count, recovery action if behind. Training-log aesthetic.
8. **Weekly Review** — spec section 20. Generated from actual stored data.
9. **30-Day Program** — spec section 21. Four week themes, daily assignments, day counter, missed-day recovery (non-restart), progress.
10. **Data layer** — StorageAdapter interface, localStorage impl, JC/NYC seed data, export JSON, import JSON, reset to seed, delete all.
11. **Mock AI layer** — all 13 functions from spec section 26, behind one interface.
12. **Pricing mocks** — tier cards, locked-state UI on gated features, upgrade modal → pricing page. No payments.
13. **PWA basics** — manifest, theme color, placeholder icons, viewport. (~30 min, keep.)
14. **README** — what's real, what's mocked, deploy steps, data reset/export, Supabase swap path.

### Data models
All types from spec section 25 in `/lib/types.ts`, even ones only partially used (CityPack, PersonaPack get type + one seed instance each, no marketplace UI).

## DEFERRED (post-July-7, cheaper model territory)
- **Marketing folder (entire doc 2)** — write after Phase 0 personal-use week, informed by real friction
- App Store readiness folder
- Capacitor scaffold
- Supabase auth + client (interface exists; no implementation)
- Stripe / any payments
- Real LLM integration (interface exists)
- Google Calendar OAuth
- Analytics implementation (metrics plan can live as a doc later)
- Error logging service
- Advanced offline/service-worker PWA work

## Definition of done — v0.1 (trimmed from spec's 31 items)
1. Clean install → `npm run dev` works
2. Deployed to Vercel, usable on phone
3. Demo mode without login; onboarding <2 min
4. 7-day plan + Solo Night plans generate
5. Add event, parse event from pasted text, mark attended/skipped, complete reflection
6. Add person, generate follow-up, handoff buttons work, mark sent
7. Mark reps complete; weekly progress visible
8. Weekly review renders from real data; program shows day/theme/assignment/recovery
9. Data persists across refresh; export/import/reset/delete all work
10. Locked paid features clearly mocked; all routes reachable; no dead buttons
11. No hidden API-key dependency anywhere
12. Dashboard makes the next action obvious in <60 seconds
