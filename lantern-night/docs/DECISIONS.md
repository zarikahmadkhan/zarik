# Decisions log

The user makes final creative decisions. Each item is `PENDING` (recommended default shown, used provisionally), `APPROVED`, or `CHANGED`.
When a decision is made, update the status here and in `DESIGN.md` if affected.

| # | Decision | Recommended default | Status |
|---|---|---|---|
| D1 | Working title, town, names, era | "Lantern Night"; **Bitternhaven**; Mara Osei / Dell Ruane / Jun Ruane; ferry *Marigold*; past = 1984, present ≈ 42 years later | CHANGED (2026-10-19): town is Bitternhaven; rest approved |
| D2 | Protagonist identity | Unnamed visitor, no backstory; the clock is not explained | APPROVED 2026-10-19 (option a). Revisit the light "Mara's grandchild" hook only if playtests feel motiveless |
| D3 | Revision model | Each trip resets 1984; the new intervention **replaces** the old one (no stacking) | APPROVED 2026-10-19 |
| D4 | Interventions per trip | Time budget: arrive 8:00, horn 9:00, 15 min per intervention (max 4); talking/walking free | APPROVED 2026-10-19 |
| D5 | A2 tone | Clear resolution, light bittersweet note (Dell gone, pier replaced); no hard trade-off in the prototype | APPROVED 2026-10-19 |
| D6 | Show parsed intent before resolving | Show it in the prototype; decide after playtests whether to soften or hide it | APPROVED 2026-10-19 (option d) |
| D7 | Engine/stack | Phaser 3 + TypeScript + Vite + Vitest. Tiled dropped: maps are drawn from code until an artist supplies tilesets | PENDING (built this way; not yet confirmed) |
| D8 | M3 LLM provider/hosting | Small, fast Claude model behind a **Netlify Function** proxy (the user already uses Netlify). API key lives only in Netlify environment variables; spend cap set in the Anthropic console; playtesters told their typing is sent to an AI provider | APPROVED 2026-10-19. Needs before M3: the key, a spend cap, and Netlify access for this project |
| D9 | Art source | Original placeholder pixel art made in-repo for M1–M2; decide on commissioned art after the loop is validated. **Visual target: `mockups/reference/style-reference-v1.png`** | APPROVED 2026-10-19 |
| D10 | Repository location | Dedicated repo, moved with history, before M2 | APPROVED 2026-10-19 (option a) |
| D11 | Objects across time | Only the player and their knowledge travel. In-world rule: "The clock carries nothing heavier than memory." | APPROVED 2026-10-19 |

Defaults still in use (not yet answered): D7 (built as described), R1, R3.

## Notes on the style reference (v1, from ChatGPT)
Adopted from it: richer palette and detail, warm-lit night vs. flat overcast day, water reflections, mixed-case pixel font for dialogue, `[I]` for intervene (was `[T]`).
Deliberately **not** adopted:
- **R1** (PENDING, default in use): sign reads "RYME FERRY CO."; the approved name is Ruane (D1), so the build says RUANE.
- **R2** (APPROVED 2026-10-19): chandlery stays **at the end of the pier**, not on the quay. The causal design needs it: the pier collapse destroys it in the baseline, and its survival exposes the crate in A1. Future style references should match.
- **R3** (PENDING, default in use): Dell's reference line "Nobody asked why" hints at his guilt in the opening; the build keeps him defending the official story, and the line's idea moves to A1.
