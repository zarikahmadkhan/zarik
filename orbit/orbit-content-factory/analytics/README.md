# Analytics

Manual-first tracking (platform APIs come later, if ever). Fifteen minutes every Sunday: fill `content-tracker.csv` from platform dashboards, update `experiment-tracker.csv`, glance at the scorecard rules.

## Files
- `content-tracker.csv` — one row per posted asset per platform
- `experiment-tracker.csv` — hypothesis → result log
- `beta-conversion-tracker.csv` — person-level funnel for beta testers
- `metrics-definitions.md` — what each column means, and the North Star

## The weekly ritual (Sunday, 15 min)
1. Fill in the week's rows in `content-tracker.csv`.
2. Compute each asset's score (see definitions) — flag anything ≥3× median views or saves.
3. For each flagged asset: add next week's experiment ("two more assets on this insight") to the experiment tracker.
4. Kill rule: any content *category* below ½ median for two straight weeks gets halved in the next calendar.
5. Paste the top/bottom performers into the weekly marketing review session (see `../ops/RUNBOOK.md`).
