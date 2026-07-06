# Privacy Documentation (draft)

This is the plain-English privacy basis for the store listing and the in-app note. A formal privacy policy page should mirror it before submission.

## What Orbit stores

**In v0.1 (demo/local mode):** everything you enter — profile, events, people, notes, reflections, follow-up history, reps — is stored **only in your browser/device**, in local storage. Nothing is transmitted to any server. There are no accounts.

## What is local-only vs. future

| Data | v0.1 (now) | Future account mode |
|------|-----------|---------------------|
| Profile & onboarding | Local only | Synced to your private account |
| Events | Local only | Private, scoped to your user id |
| People / CRM | Local only | Private, scoped to your user id, never public |
| Follow-up drafts & history | Local only | Private |
| Reps, reviews, program | Local only | Private |

Future account mode (Supabase) would scope every row to the authenticated user. **No data is ever public, shared, or used for a social graph.**

## What is never public — ever

- Your people/CRM data
- Private notes
- Relationship reality checks
- Follow-up history
- Contact info
- Your goals and reflections

Orbit has no feed, no profiles, no followers, and no sharing of relationship data by design. Product-led sharing (if added) is limited to generic, non-personal artifacts only (see `../marketing/17-plg-hooks.md`).

## What Orbit never does

- Never reads your messages
- Never sends messages for you (handoff only — you tap send in your own app)
- Never imports your contacts
- Never sends personal data to external APIs (the AI layer is on-device template logic in v0.1; no third party sees your data)

## Plain-English privacy promise (for the listing)

> Orbit is private by default. Your social life is yours. In demo mode everything stays on your device and nothing is sent anywhere. Orbit never reads your messages, never sends them for you, and never imports your contacts. There's no feed and no public profile — because a tracker of your relationships is the last thing that should be public.
