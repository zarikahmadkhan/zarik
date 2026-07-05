# Orbit — Phased Build Plan (Fable window: July 5–7)

## How to run this
- One phase per Claude Code session (or `/clear` between phases). Start each phase in **plan mode** (shift+tab), review the plan, then let it execute.
- Confirm model at session start: `/model` → Fable.
- Every phase ends with: `npm run build` + `npm run lint` passing, acceptance criteria checked, `git commit -m "phase-N: ..."`.
- If Claude proposes anything on the SPEC_V01 deferred list, say no and move on.
- Deploy after Phase 0 and keep deploying — test each phase on your phone at the live URL, since that's the real product surface.

## Setup (you, ~15 min, before first session)
```
mkdir orbit && cd orbit && git init
mkdir docs
# drop in: CLAUDE.md (repo root), docs/SPEC_V01.md, docs/orbit-spec.md (your doc 1), docs/orbit-marketing-spec.md (your doc 2), PLAN.md (repo root)
claude
```
Have a Vercel account ready; either `npm i -g vercel` or connect the GitHub repo.

---

## Day 1 — Sunday July 5

### Phase 0 — Scaffold + deploy skeleton (~45 min)
**Prompt:**
> Read CLAUDE.md, docs/SPEC_V01.md, and PLAN.md Phase 0. Scaffold the Next.js App Router project with TypeScript and Tailwind. Create all routes from SPEC_V01 as stub pages with the shared app shell: bottom tab nav on mobile (Dashboard, Tonight, Events, People, Reps, More→Review/Program/Settings), top nav on desktop. Add PWA manifest, theme color, placeholder icon. Calm, premium, minimal visual system — define Tailwind design tokens (palette, spacing, type scale) now so later phases stay consistent. Dark, muted palette; no bright SaaS blue. Verify build passes.

**Accept:** all routes reachable on phone via Vercel URL; nav works; looks intentional even empty.
**Then deploy:** `vercel --prod` or push to connected repo.

### Phase 1 — Types, storage, seed data (~1 hr)
**Prompt:**
> Read CLAUDE.md and docs/SPEC_V01.md. Implement /lib/types.ts with every model from spec section 25. Build the StorageAdapter interface and localStorage implementation with a versioned schema key. Build seed data per CLAUDE.md locale rules (Jersey City/NYC, recurring events weighted, faith/community events included, no bar-centric entries). Implement /demo route (seed + redirect), and Settings: export JSON, import JSON with validation, reset to seed, delete all, plain-English privacy note. No raw localStorage calls outside the adapter.

**Accept:** seed data visible after /demo; survives refresh; export produces valid JSON; import round-trips; reset and delete work.

### Phase 2 — Mock AI layer (~1.5 hrs) ← highest-leverage phase
**Prompt:**
> Read CLAUDE.md (especially the mock AI quality bar) and spec section 26. Implement all 13 mock AI functions in /lib/ai/ behind a single provider interface. This is the core product content: build large template banks (15+ variants per output category), parameterized by real state — user goal, energy, avoided settings, relationship lane, days since contact, response history, event recurrence. Avoidance mirrors must name the pattern + give one small rep. Follow-up drafts must include message, why-it-works, risk level, timing, and honor tone options including faith/community-oriented. Hard-filter avoided settings everywhere. Write a small test harness page at /app/dev-ai (dev-only) that renders sample outputs from each function so quality is inspectable.

**Accept:** outputs read like a sharp coach, vary meaningfully across states, never suggest avoided settings.
**Note:** review the actual copy yourself here — this is where you should spend YOUR judgment, not just Fable's.

### Phase 3 — Onboarding + Dashboard (~1.5 hrs)
**Prompt:**
> Read CLAUDE.md and spec sections 8–9. Build onboarding: all fields, 3–4 progressive screens, completable in under 2 minutes, generates the initial 7-day plan via the mock AI layer on finish. Build the dashboard per section 9: tonight's action, week plan, upcoming events, follow-ups owed, reps this week, program progress, one avoidance-mirror insight, quick-add event/person/rep, continue-program button. The next action must be visually dominant. Empty states always suggest an action.

**Accept:** fresh user → onboarded → dashboard with a real plan in <2 min on phone; seeded user sees populated dashboard.

### Phase 4 — Events end-to-end (~2 hrs)
**Prompt:**
> Read CLAUDE.md and spec sections 11–14. Build events: CRUD with all fields, scoring per section 11 with heavy recurring weighting, list filters, paste-text parser using parseEventFromText mock, detail page (why-worth-attending, rep assignment, arrival strategy, exit rule, conversation openers, .ics download, Google Calendar template link — no OAuth), attended flow (talked-to-anyone, people met → prompt to add to CRM, exchanged contact, attend again, learned, energy-after) and skipped flow (reason taxonomy, smallest recovery action from mock AI). Statuses: interested/planned/attended/skipped.

**Accept:** full event lifecycle works on phone; .ics opens in iOS calendar; parser produces a sensible event from pasted text; skipped flow returns a non-shaming recovery action.

---

## Day 2 — Monday July 6

### Phase 5 — People CRM + follow-ups + handoff (~2 hrs)
**Prompt:**
> Read CLAUDE.md and spec sections 15–18. Build people: CRUD with all fields, lanes, statuses, computed relationship reality-check warnings per section 16 (direct, not cruel; includes the two-unanswered-messages stop rule). Build the follow-up generator UI using the mock AI layer: tone selector, draft + why-it-works + risk level + timing. Handoff buttons per section 18 exactly: copy, Web Share API when available, wa.me only if phone exists, sms: only if phone exists, mailto: only if email exists, mark as sent (updates last-contacted + rep), snooze (sets next follow-up date). No automation of any kind.

**Accept:** add person from event reflection or directly; generate draft; every handoff button conditional-renders correctly; mark-sent updates dashboard follow-ups-owed.

### Phase 6 — Reps + Weekly Review + 30-Day Program (~2 hrs)
**Prompt:**
> Read CLAUDE.md and spec sections 19–21. Build the rep tracker: all rep types, quick-complete, weekly progress, streak, repeat-exposure count, recovery action if behind — training-log aesthetic, zero gamification cuteness. Build weekly review generated from actual stored data via mock AI: attended/skipped, people met, follow-ups sent/owed, best rep, avoidance pattern, next-week plan, one uncomfortable assignment, one recurring event to repeat, one weak tie to nurture, one thing to stop. Build the 30-day program: four week themes, day counter, today's assignment, completed/missed, non-restart recovery copy, progress bar.

**Accept:** completing reps updates dashboard; review reflects real data (attend something in seed flow to verify); missing program days produces recovery, never reset.

### Phase 7 — Landing, pricing mocks, polish, audit (~2 hrs)
**Prompt:**
> Read CLAUDE.md, spec sections 7 and 22–23, and marketing spec section 4 (landing structure only — do NOT build the marketing folder). Build the landing page: hero ("Build a real social life in 30 days"), problem, method (go out / meet people / follow up / repeat), features, who-it's-for, pricing teaser, CTAs to /demo and /app/tonight. Build /pricing with Free/Pro/Premium and outcome-focused copy per marketing spec section 14. Add locked-state UI + upgrade modal on gated features (3 solo plans/month on Free, program continuation, advanced review). Then run the audit: every item in SPEC_V01's definition of done, fix failures, write the README (what's real vs mocked, deploy, reset/export, Supabase swap path). Final build + deploy.

**Accept:** the full v0.1 DoD checklist passes on your phone at the live URL.

---

## July 7 buffer — punch list only
Use remaining Fable time on whatever the audit surfaced + one real dogfood pass: complete onboarding as yourself, add 2 real events for this week, add 1 real person, generate a follow-up. Fix what feels fake or annoying. Do NOT add features.

## Post-Fable backlog (any model, after Phase 0 personal-use week)
1. Marketing folder (doc 2) — informed by your own usage friction
2. App-store-readiness folder
3. Supabase auth + persistence behind the existing adapter
4. Real LLM behind the existing AI interface
5. Capacitor scaffold
6. Stripe — only after the behavior loop demonstrably works for you
