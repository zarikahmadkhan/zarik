# Build status

_Last updated: 2026-10-19_

**Phase:** M1 (walkable timelines) — first pass done, in look-and-feel review.

| Item | State |
|---|---|
| Design (`DESIGN.md`) | APPROVED: all decisions settled (see `DECISIONS.md`) |
| Style reference | `mockups/reference/style-reference-v1.png` (from ChatGPT) is the visual target |
| M1 Walkable timelines | **First pass done.** All four states (1984, baseline, A1, A2) walkable; NPCs talk; clock travel works; debug panel sets the past. Screens in `docs/screens/`. |
| M2 Full loop, scripted parser | Not started |
| M3 Free-form (LLM) test | Not started; needs D8 (key, hosting) |

## What exists
- `src/state/past.ts` — causal model + `derivePresent` (unit-tested, `npm test`)
- `src/content/timelines.ts` — who/what is where per timeline, all dialogue
- `src/art/` — all art is procedural (code-painted pixels): world, light, water, 16×24 character sprites
- `src/scenes/WorldScene.ts` — movement, collision, talk, travel (D3: each trip to 1984 starts fresh)
- `src/debug.ts` — backtick toggles; jump to any timeline or simulate a 1984 outcome
- `scripts/screens.mjs` — `npm run screens` regenerates `docs/screens/*.png`

Run: `npm install && npm run dev`. URL params: `?t=p1984|baseline|A1|A2&method=sabotage|panic|adrift&route=mara|jun|dell&x=&y=&debug`.

## Deviations from the design (flag for review)
- **No Tiled (D7).** Maps are painted from code using shared geometry in `src/world/layout.ts`. Tiled only pays off once an artist supplies tilesets; revisit then.
- **No interiors yet.** Chandlery, terminal and ferry show "(interior: M2)". The A1 crate sits outside the chandlery door for now.
- `[I]` intervene and `[J]` journal show "arrives in M2" toasts.

## Look-and-feel pass 1 (ChatGPT notes, all addressed)
Larger distinct characters (16×24, silhouettes carry across ages: Mara's bun, Dell's flat cap, Jun's hair); quieter paving and water; door recesses, roof overhangs, contact shadows; hard-edged light pools instead of soft glows; rebuilt ferry (sheer, deck, railings, wheelhouse, funnel, mooring lines, gangway); wrapped dialogue at ~60 characters per line.

## Known visual gaps
- Night light pools are subtle; the reference's warmth is stronger.
- Old Dell's cap reads dark on the bench.
- Characters have a 2-frame walk only; no idle animations beyond a slight breathing bob.

**Input handling:** none yet. M2 adds a **scripted parser** (synonyms + patterns over a closed intent schema) — not free-form understanding; it must be labelled as such.

## Next step
Move to the dedicated repo (D10: waiting on the user to create it; history is on branch `lantern-night-export` in `zarik`). Then M2: intervention box, scripted parser, rules, time budget, journal, interiors.
