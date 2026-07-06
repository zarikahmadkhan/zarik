# Landing Page — Marketing Requirements

The shipped landing page (`app/page.tsx`) already implements this structure. This document is the source of truth for its copy and the A/B variants to test.

## Structure (implemented)

**Hero**
- Headline (see variants below)
- Subheadline: "Orbit gives you weekly outings, follow-up prompts, and a private relationship tracker so you stop starting from zero every weekend."
- Primary CTA: *Start your 7-day plan* → `/demo`
- Secondary CTA: *Try the Solo Night Generator* → `/app/tonight`
- Social-proof placeholder (see `13-testimonials.md` — must stay clearly labelled until real quotes exist)
- Screenshot/mockup placeholder

**Problem section**
- "You don't need more event options. You need a system that makes you go, follow up, and repeat."

**Method section** — Go out · Meet people · Follow up · Repeat

**Feature section** — Solo Night Generator, Event scoring, Private people tracker, Follow-up drafts, Social Rep Tracker, Weekly Review, 30-Day Social Rebuild

**Persona section** — post-divorce, new-city, remote, introvert, faith/community, fitness/routine

**Pricing teaser** — Free / Pro / Premium

**Final CTA** — "Tonight is a rep. Take it." with both CTAs repeated

## Headline variants to test

**Variant A — Direct / action-oriented**
> Stop starting from zero every weekend.

Best for: remote workers, high-performers. Leads with the recurring frustration.

**Variant B — Transformation-oriented** *(currently live)*
> Build a real social life in 30 days.

Best for: post-divorce, new-city. Leads with the outcome (a rebuilt life, not a guaranteed relationship — stays on the right side of the claim line).

**Variant C — Private-operating-system angle**
> Your private operating system for rebuilding social life.

Best for: introverts, privacy-sensitive, high-performers. Leads with the category and the privacy promise.

## Test method

Run one variant per two-week window at equal traffic; measure demo-start rate (primary) and 7-day-plan-generation rate (secondary), per `11-analytics-metrics.md`. Do not change more than the headline between variants or the read is muddy.

## Copy rules on this page

- No guaranteed-outcome language anywhere ("a real social life," yes; "real friends guaranteed," never).
- The word "lonely" never appears in the hero. The buyer is "rebuilding," not "lonely."
- Every feature line ties to a behavior, not a capability.
