# Decisions log

The user makes final creative decisions. Each item is `PENDING` (recommended default shown, used provisionally), `APPROVED`, or `CHANGED`.
When a decision is made, update the status here and in `DESIGN.md` if affected.

| # | Decision | Recommended default | Status |
|---|---|---|---|
| D1 | Working title, town, names, era | "Lantern Night"; **Bitternhaven**; Mara Osei / Dell Ruane / Jun Ruane; ferry *Marigold*; past = 1984, present ≈ 42 years later | CHANGED (2026-10-19): town is Bitternhaven; rest approved |
| D2 | Protagonist identity | Unnamed visitor, no backstory; the clock is not explained | PENDING |
| D3 | Revision model | Each trip resets 1984; the new intervention **replaces** the old one (no stacking) | APPROVED 2026-10-19 |
| D4 | Interventions per trip | Time budget: arrive 8:00, horn 9:00, 15 min per intervention (max 4); talking/walking free | APPROVED 2026-10-19 |
| D5 | A2 tone | Clear resolution, light bittersweet note (Dell gone, pier replaced); no hard trade-off in the prototype | APPROVED 2026-10-19 |
| D6 | Show parsed intent before resolving | Yes, for the prototype | PENDING |
| D7 | Engine/stack | Phaser 3 + TypeScript + Vite + Tiled + Vitest | PENDING |
| D8 | M3 LLM provider/hosting | Small, fast Claude model behind a serverless proxy; user supplies key and spend cap | PENDING (needed before M3) |
| D9 | Art source | Original placeholder pixel art made in-repo for M1–M2; decide on commissioned art after the loop is validated. **Visual target: `mockups/reference/style-reference-v1.png`** | APPROVED 2026-10-19 |
| D10 | Repository location | Lives in `lantern-night/` in this repo for now; move to a dedicated repo before M2 | PENDING |
| D11 | Objects across time | Only the player and their knowledge travel | PENDING |

Defaults still in use (not yet answered): D2, D6, D7, D8, D10, D11.

## Notes on the style reference (v1, from ChatGPT)
Adopted from it: richer palette and detail, warm-lit night vs. flat overcast day, water reflections, mixed-case pixel font for dialogue, `[I]` for intervene (was `[T]`).
Deliberately **not** adopted, pending the user's word:
- Sign reads "RYME FERRY CO."; the approved name is Ruane (D1), so the build says RUANE.
- Chandlery sits on the quay in the reference; the causal design needs it **at the end of the pier** (the pier collapse destroys it in the baseline, its survival exposes the crate in A1).
- Dell's line "Nobody asked why" hints at his guilt in the opening; the design keeps him defending the official story until A1.
