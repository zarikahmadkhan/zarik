# TestFlight / Pre-Submission Checklist

Run this against a **real native build** (Capacitor shell on device) before any TestFlight or store submission. The web app already passes the equivalent browser e2e; this re-verifies everything inside the native wrapper, where new failure modes (webview quirks, handoff links, safe-area insets) appear.

## Install & launch
- [ ] App installs from TestFlight on a real iPhone
- [ ] App launches to the landing or app shell without a white-screen/webview error
- [ ] Safe-area insets respected (notch, home indicator) — bottom tab bar not clipped
- [ ] App icon and splash render correctly

## Onboarding
- [ ] Onboarding completes in under 2 minutes
- [ ] All fields work with the native keyboard (no zoom-jank on inputs)
- [ ] Finishing generates a 7-day plan and lands on the dashboard

## Core loop
- [ ] Add an event (manual form)
- [ ] Paste-parse an event from text
- [ ] Mark an event attended → reflection creates a person + reps
- [ ] Mark an event skipped → recovery action shows
- [ ] Add a person directly
- [ ] Generate a follow-up (try all 6 tones)
- [ ] Handoff buttons open the right native apps: **wa.me → WhatsApp, sms: → Messages, mailto: → Mail** (this is the #1 thing to verify natively)
- [ ] Web Share sheet opens (native share is better on device than web)
- [ ] Copy-to-clipboard works
- [ ] Mark a follow-up sent → dashboard updates

## Reps / review / program
- [ ] Log a rep from the dashboard and the reps page
- [ ] Weekly review renders from real data
- [ ] Start the 30-day program; complete day 1; progress persists

## Calendar handoff
- [ ] `.ics` download/open triggers the native calendar add sheet
- [ ] Google Calendar link opens in browser/app

## Data & persistence
- [ ] Data persists across full app quit + relaunch (webview localStorage survives)
- [ ] Export JSON produces a file via the native share/save sheet
- [ ] Import JSON round-trips
- [ ] Reset to seed works
- [ ] Delete all data works

## Layout
- [ ] 390px-class and larger phones both look intentional
- [ ] Tap targets ≥44px on device
- [ ] No horizontal scroll anywhere
- [ ] Dark palette renders correctly (no forced light-mode webview override)

## Known native-specific risks to check
- [ ] `sms:` and `wa.me` links don't get blocked by the webview's link handler
- [ ] File download (.ics, JSON export) works inside the Capacitor webview — may need the Filesystem/Share plugin rather than a browser `<a download>`
- [ ] localStorage isn't cleared by the OS under storage pressure (consider migrating to Capacitor Preferences for durability)

**Do not submit until every box is checked on a real device.** The scaffold in `../capacitor/` is unverified until this passes.
