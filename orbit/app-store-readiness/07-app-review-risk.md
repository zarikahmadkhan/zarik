# App Review Risk Notes

How Orbit stays on the safe side of App Store / Play review. Most risk for an app in this space comes from *overclaiming* — Orbit's guardrails are also its review defense.

## Risks and mitigations

| Risk | Why it matters | How Orbit avoids it |
|------|----------------|---------------------|
| **Presenting as therapy / medical treatment** | Health claims trigger stricter review, medical-app requirements, possible rejection | No clinical language anywhere; explicit "not therapy, not a mental-health app" in copy; Lifestyle category, not Medical |
| **Guaranteeing outcomes** (friends, dates, marriage, happiness) | Misleading-claims rejection | Hard guardrail folder-wide: only behavior claims ("leave the apartment," "become a regular"), never result claims |
| **Creepy automation** | Apps that act on a user's behalf on other platforms get scrutiny | Handoff-only architecture; Orbit never auto-sends, never automates messaging |
| **Reading private messages** | Major privacy-review flag | Orbit never reads messages — nothing in the app requests message access |
| **Importing contacts (v1)** | Contact-access permission scrutiny + privacy label complexity | No contact import; users add people manually; no contacts permission requested |
| **Dating-app mislabeling** | Dating apps face extra review + 17+ rating | Positioned explicitly as *not* a dating app; no matching, no strangers, no swiping |
| **Data collection mismatch** | Privacy-label inaccuracy is a rejection cause | v0.1 is genuinely "Data Not Collected" (local-only); label matches reality (see `04-privacy-disclosure.md`) |
| **Web wrapper "minimum functionality"** | Apple rejects thin webview wrappers | Orbit is a full app with native handoff, offline-capable local data, and a real feature set — not a bookmark; ensure the native build uses native share/calendar/file handoff, not just a webview |
| **Payments outside IAP** | If real payments are added, Apple requires IAP for digital goods | v0.1 has no payments; when added, use StoreKit/IAP for subscriptions per Apple's rules |

## The webview-wrapper caution (most likely real risk)

Apple 4.2 rejects apps that are "just a website." Mitigations, all already true or planned:
- Native handoff (share sheet, calendar add, message composers) rather than browser links
- Local-first data that works offline
- A genuine, multi-feature product — not a single web page

If review pushes back on 4.2, lean on the native handoff and offline behavior as evidence of native value, and consider adding one clearly-native capability (e.g. local notifications for follow-up reminders — only if genuinely useful, per the spec's "push notifications only if useful").

## Copy review pre-check (do before every submission)

Grep the listing and in-app copy for banned patterns: "guarantee", "find friends", "find love", "meet your", "cure", "treat", "therapy", "depression", "anxiety" (as a claim). None should appear as a promise. This mirrors the marketing folder's guardrails.
