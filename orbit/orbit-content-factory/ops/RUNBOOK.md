# Marketing Ops Runbook — the recurring loop

The "autonomous" marketing system, honestly defined: **the factory produces, a human posts, a scheduled AI review adapts.** No tool can post to TikTok/IG/Reddit for you without accounts and API access you don't have yet — so the loop is designed around the strongest version of what CAN run unattended.

## The loop

```
        ┌────────────────────────────────────────────────┐
        │  MON-SAT: post per calendar (human, ~20 min/day)│
        └──────────────────────┬─────────────────────────┘
                               ▼
        ┌────────────────────────────────────────────────┐
        │  SUN: fill tracker (human, 15 min)              │
        └──────────────────────┬─────────────────────────┘
                               ▼
        ┌────────────────────────────────────────────────┐
        │  MON 9am: Claude session wakes (scheduled       │
        │  Routine), reads tracker CSVs from the repo,    │
        │  and produces: performance read, next-week      │
        │  calendar adjustments, 2-3 new derivative       │
        │  assets on what over-performed, kill decisions  │
        └──────────────────────┬─────────────────────────┘
                               ▼
                     (repeat weekly; monthly:
                  quality re-audit + strategy review)
```

## What the weekly Routine session does
1. `git pull`, read `analytics/*.csv` for new rows.
2. Compute scores; compare against the scorecard rules in `analytics/metrics-definitions.md`.
3. Regenerate the calendar for the next 7 days (`render/calendar.mjs`), weighting toward over-performers.
4. Author + render 2-3 new derivative assets on the winning insights (same pipeline).
5. Apply kill rules; note decisions in `experiment-tracker.csv`.
6. Commit everything and summarize for the founder: what won, what died, what's queued.

If the tracker has no new rows, the session nudges once and otherwise makes no changes — no data, no adjustments, no invented insights.

## Escalation to the founder (things the loop never decides alone)
- Anything spending money (ads, tools)
- Entering a new community/subreddit
- Replying to press/partnership inquiries
- Any claim-guardrail judgment call
- Killing an entire channel

## Monthly (first Monday)
- Re-run the quality audit against real data
- Review funnel: content → landing → demo → activation → week-2 retention
- Revisit the launch-plan phase gate (`marketing/07-launch-plan.md`) — are we allowed to move to the next phase?
