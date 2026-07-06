# Analytics & Metrics

**Do not implement analytics unless it's easy and privacy-respecting.** This is the measurement plan; in demo mode nothing is tracked server-side, consistent with the privacy promise. When analytics do land, prefer a privacy-first, cookieless tool (Plausible, Fathom) and never send personal CRM content anywhere.

## North Star

**Weekly completed social reps.** This is the one number that means the product is working — it maps directly to real-world behavior.

**Secondary North Star:** follow-ups sent after real-world interactions. (Reps prove they left the house; follow-ups prove the loop closed.)

## Funnel metrics

### Activation
- Started onboarding
- Completed onboarding
- Generated 7-day plan
- Added first event
- Added first person
- Generated first follow-up

### Engagement
- Events added
- Events attended
- Social reps completed
- Follow-ups sent
- Weekly reviews completed
- 30-day program days completed

### Retention
- Returned after 1 day
- Returned after 7 days
- Completed week 1
- Started week 2
- Completed the 30-day program

### Monetization
- Viewed pricing
- Hit a free limit (3 solo plans, program week 2, advanced review)
- Clicked upgrade
- Selected a plan
- Started mock checkout

## What each stage tells you

- **Activation drop between "started" and "completed onboarding"** → onboarding is too long or unclear. It's built for <2 min; watch it.
- **Plan generated but no event added** → the plan isn't translating to action; check the dashboard's "next action" clarity.
- **Reps flat, follow-ups zero** → the CRM half of the loop isn't landing; this is the classic "collecting events instead of attending" failure the app is designed to counter.
- **Return after 7 days low** → the weekly rhythm isn't forming; the review and program are the retention levers.

## Instrumentation note

Because the North Star is *behavioral* and stored locally, the honest early measurement is qualitative (Phase 1 tester interviews) plus opt-in aggregate counts if/when accounts exist. Do not compromise the privacy posture to chase a dashboard.
