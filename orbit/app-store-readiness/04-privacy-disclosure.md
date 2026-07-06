# App Privacy Disclosure Prep

Prep for Apple's "App Privacy" nutrition label and Google Play's Data Safety form. Answers reflect v0.1 (local-only) and flag what changes if account mode ships.

## Data categories

| Category | Collected in v0.1? | Linked to user? | Used for tracking? | Notes |
|----------|-------------------|-----------------|--------------------|-------|
| Contact info (name, phone, email of *people you add*) | Stored on-device only; **not collected by us** | No | No | Entered by the user about their contacts; never leaves the device in v0.1 |
| User content (notes, reflections, goals) | On-device only; not collected | No | No | Local storage only |
| Identifiers | None | — | No | No accounts, no device ids, no ad ids |
| Usage data | None in v0.1 | — | No | Analytics deferred; would be aggregate/opt-in only |
| Diagnostics | None | — | No | No crash/telemetry SDK in v0.1 |
| Location | None | — | No | Neighborhood is free-text the user types; no GPS |

## The honest v0.1 answer

For Apple's label, v0.1 qualifies as **"Data Not Collected"** — because everything is stored locally on the device and nothing is transmitted to the developer or any third party. This is the strongest possible privacy posture and should be stated plainly.

## What changes with account mode (future)

If/when Supabase account mode ships:
- Contact info and user content become **"Data Linked to You"** (stored in your private account, scoped to your user id).
- Still **not used for tracking**, still never sold, still never public.
- Update both store disclosures at that point — do not ship account mode under the "Data Not Collected" label.

## Third-party dependencies

- **v0.1:** none that receive user data. No analytics SDK, no ad SDK, no LLM API (the "AI" is on-device template logic).
- **Future:** Supabase (storage), a payment provider (Stripe), possibly a real LLM API and a privacy-first analytics tool. Each must be disclosed when added, and the LLM path must be designed so personal CRM content isn't sent without explicit consent.

## Tracking

Orbit does **no** cross-app or cross-site tracking, in v0.1 or as planned. No IDFA, no ad networks. If this ever changes it requires App Tracking Transparency prompts and a disclosure update — but it's not on the roadmap.
