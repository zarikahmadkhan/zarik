# Lantern Night — Prototype Design

**Status: PROPOSED — awaiting creative approval.** Nothing here is approved until it is marked so in `DECISIONS.md`.
Working title, place names and character names are placeholders (see D1).

Core loop: explore a place → travel into its past → type an intervention → return to an altered present → investigate why it changed → revisit the past and revise.

---

## 0. Premise (one paragraph)

Bitternhaven, a small fictional harbour town. In the present, the ferry terminal is boarded up and a plaque blames the 1984 "Lantern Night disaster" on the ferry's engineer. The player finds the stopped Harbour Clock in the square; touching it sends them to 8:00 PM on Lantern Night 1984, one hour before the festival crossing. Only the player and what they *know* travel through time — no objects.

**Characters (same three people in every timeline, aged ~42 years in the present):**

| | 1984 | Present |
|---|---|---|
| **Mara Osei** — ferry engineer | 31, in the *Marigold*'s engine room. Has found a cracked shaft coupling. | 73. Present or absent depending on timeline. |
| **Dell Ruane** — owns Ruane Ferry Co. | 45, at the ticket booth. Bank note due Monday; tonight's crossing pays it. | 87, or gone. |
| **Jun Ruane** — Dell's nephew, deckhand | 14, sweeping the pier. Carries the chandlery keys. | 56. His job and attitude change per timeline. |

---

## 1. The causal puzzle

**Hidden fact:** the replacement coupling Mara ordered *arrived yesterday*. It sits in a crate in the pier chandlery's stockroom, tagged `RUANE — HOLD PENDING PAYMENT`. Dell hid this from Mara because he can't pay for it before Monday. Mara believes no spare exists, so her only options are "sail cracked" or "refuse and get fired."

**Past-state variables (the whole causal model):**

| Variable | Values | Set by |
|---|---|---|
| `crossing` | `sailed` · `cancelled` | default `sailed`; cancelled by sabotage, panic, untying, etc. |
| `coupling` | `cracked` · `replaced` | `replaced` only if Mara has the spare before the horn |
| `cancelMethod` | `sabotage` · `panic` · `adrift` · null | flavour only (changes 1–2 present lines) |
| `fixRoute` | `mara` · `jun` · `dell` · null | flavour only (who released the part) |

**Derivation (pure function, deterministic):**
`coupling=replaced` → **A2**. Else `crossing=cancelled` → **A1**. Else → **Baseline**. (Fix + sabotage on the same trip → A1: cancellation dominates.)

**Baseline chain (what history records):** crossing sails cracked → coupling shears mid-harbour → *Marigold* drifts into the wooden pier → pier and chandlery collapse (injuries, no deaths) → inquiry: "engine failure is the engineer's responsibility"; Dell testifies Mara never reported a fault → Mara leaves town → company folds → present: terminal boarded, pier stumps, plaque blames Mara.

**A1 chain — "Dry Dock" (the obvious fix: stop the ferry):** crossing cancelled → no collision → **pier and chandlery survive** → festival revenue lost → bank calls the note → company folds spring 1985, *Marigold* sold for scrap → Dell blames the cancellation on Mara ("sabotage" / "spreading panic") and fires her → Mara leaves town → the unpaid crate stays in the chandlery stockroom → Jun later takes over the chandlery as a junk-and-bait shop and keeps the crate as a curiosity.

**A2 chain — "Lantern Line" (the informed fix):** Mara learns the spare is in the stockroom (from the player, Jun, or Dell) → Jun unlocks it → Mara refuses to start the engine until it's fitted → Dell accepts a 40-minute delay over a cancellation → crossing sails late, safely → festival revenue pays the note → company survives → Mara made chief engineer, takes Jun as apprentice → present: ferry still runs, Jun is captain, Mara runs the engine works in the terminal; the pier was later replaced by the expanded terminal (chandlery demolished).

The intermediate links are what the player investigates. Every link in A1/A2 is surfaced by at least one present-day clue (§2).

---

## 2. What the player knows, and what each present teaches

| State | What the player can learn | Key clue sources |
|---|---|---|
| **Baseline (start)** | Official story: engineer negligence. Pier collapsed. Company folded. Mara left. | Plaque; old Dell on the bench ("Engine's the engineer's job"); Jun at a bait stall in the square ("Lost my uncle's whole shop that night"). |
| **1984 visit** | Mara found the crack and warned Dell. Dell refused: the bank note. Jun has keys to the chandlery. (Stockroom is locked; the crate is not visible.) | Talking to all three; Mara's log on the engine-room bench. |
| **A1** | Stopping the crossing didn't save the company *or* clear Mara — she's now "the saboteur." **And the spare part was 100 m away the whole time, held back for payment.** | Newspaper on the noticeboard (headline varies by `cancelMethod`); pier now walkable; Jun in the chandlery beside the unopened crate and its HOLD invoice ("Uncle wouldn't pay for it, then there was no boat to put it in"). |
| **A2** | Confirms the chain: the delay, the fix, the apprenticeship. Mara recognises the player ("You haven't aged a day"). | Mara in the terminal; Jun at the helm; new plaque ("The crossing that nearly wasn't"); Dell's portrait. |

**Knowledge, not inventory, carries forward.** A journal auto-records discovered facts (e.g. "A spare coupling was held in the chandlery stockroom"). This is the player's investigation record and the only thing that crosses time.

---

## 3. The two outcomes and the reason to revise

| | **A1 — Dry Dock** | **A2 — Lantern Line** |
|---|---|---|
| Who's here | Jun (chandlery), Dell (bench, broke and bitter). Mara absent. | Mara (terminal), Jun (aboard *Marigold*). Dell absent (portrait). |
| Access | Pier open; chandlery interior enterable. Slip empty and fenced. Terminal gated. | Terminal interior open. *Marigold* boardable (deck + engine room). Pier/chandlery gone. |
| Objects | HOLD crate + invoice; "Engineer Dismissed" newspaper. | Mara's framed 1984 log page; new plaque. |
| Feels like | "I stopped the disaster and it still went wrong — and I missed something." | Resolution, with a personal payoff. |

**Why revise from A1:** the player did the "right" thing and is shown, concretely, that (a) Mara is blamed anyway, (b) a better fix existed and they can now name it. The revision is driven by new knowledge, not trial-and-error — that's the loop we're testing.

**Sequence-break is allowed:** a player who asks Jun what's in the stockroom on the first trip can reach A2 without seeing A1. A2 then invites them to try "what if you'd just stopped the boat?" Expected majority path: Baseline → 1984 → A1 → 1984 → A2.

---

## 4. Smallest map and interactions

One Tiled map (~48×28 tiles at 16 px), shared base geometry, with per-timeline delta layers (`era_1984`, `present_base`, `present_A1`, `present_A2`) toggled by state. Two small interiors.

```
 [Harbour Clock square]──[Quay street]──[Terminal + ferry slip]
        │ noticeboard/plaque     │                │ Marigold berth
        │ bench                  │                └─ (interior) Engine room: 1984, A2
        └──────────[Pier]──────[Chandlery]
                                 └─ (interior) Stockroom: 1984 (locked), A1
```

| Zone | 1984 | Baseline | A1 | A2 |
|---|---|---|---|---|
| Square / clock | Festival lanterns, crowd | Plaque, Dell on bench, Jun's stall | Newspaper, Dell on bench | New plaque |
| Pier | Open, Jun sweeping | Collapsed (blocked) | Open | Replaced by terminal deck |
| Chandlery | Locked stockroom | Gone | Open, crate inside | Gone |
| Terminal / slip | Ticket booth (Dell), *Marigold* + engine room (Mara) | Boarded, slip fenced | Gated, slip empty | Open, Mara inside, *Marigold* boardable |

**Interactions:** walk (arrows/WASD); `E` = look/talk (free, authored lines, adds journal facts); `I` = intervene (opens text box; targets whatever is nearby; costs 15 in-world minutes); clock = travel; `J` = journal.
**Time budget in 1984:** arrive 8:00, horn at 9:00 → up to 4 interventions; talking and walking are free. Each trip resets 1984 and **replaces** the previous intervention (see D3).

Content budget: ~3 maps-worth of deltas, 6 character sprites (3 people × 2 ages), ~60 authored lines, ~25 intervention rules.

---

## 5. Typed interventions

### Pipeline — understanding is separate from success
```
text ──interpret()──▶ Intent {verb, target, object?, claim?, manner, confidence, clarify?}
                         │  (scripted parser in M2; LLM in M3 — same interface)
                         ▼
                 rules.resolve(intent, worldState) ──▶ {effects, response, timeCost}
                         (deterministic, authored; the only thing that changes the world)
```
- **Verbs (closed set):** tell, ask, persuade, give, take, unlock, damage, untie, warn, distract, delay, fix, search, wait.
- **Claims (closed set of propositions)** for tell/persuade: `spare_in_stockroom`, `coupling_cracked`, `ferry_will_crash`, `bank_is_watching`, `from_the_future`, …
- The game shows the parsed intent before resolving ("You try to: tell Mara the spare coupling is in the stockroom"). That makes understanding visible and separate from outcome. Recommended on for the prototype (D6).
- Response tiers: **effective** (state changes) · **ineffective** (understood, attempted, world pushes back with an informative line) · **impossible** (understood, can't happen, in-world reason) · **ambiguous** (clarifying question with 2–3 contextual options, no time cost) · **not understood** (honest system message in scripted builds).

### Examples

| Type | Player types | Result |
|---|---|---|
| Valid → A1 | "Pour sand in the fuel tank" / "Untie the Marigold" / "Tell the passengers the ferry will sink" | Crossing cancelled; `cancelMethod` = sabotage / adrift / panic. |
| Valid → A2 | "Tell Mara her coupling arrived — it's in the stockroom" | Mara: "Dell said it hadn't come." She goes to Jun for the key → fitted. |
| Valid → A2 | "Ask Jun to bring Mara the crate marked Ruane" | Jun hesitates (uncle), agrees if told it's for the engine. |
| Valid but ineffective | "Convince Dell the ferry isn't safe" | Dell: "Bank calls the note Monday. This crossing *is* the safety." (Clue, no change.) |
| Ambiguous | "Help her" / "Stop it" / "Fix it" | "Help Mara how? — stop the crossing · get her a part · talk to Dell" |
| Impossible | "Replace the coupling myself" | "You've never touched a marine engine. Mara could do it — with a part." |
| Impossible | "Give Mara the coupling I found in the future" | "The clock carries nothing heavier than memory." |
| Impossible | "Pay Dell for the part" | Your money is 40 years too new. "What is this, Monopoly money?" |
| Impossible (out of genre) | "Throw Dell in the harbour" | Understood as violence; deflected in-world. No combat verbs exist. |
| Ineffective | "Tell Mara I'm from the future" | She doesn't believe you; costs time. |
| **Clever** | "Tell Dell a bank inspector is riding tonight" | Dell fears a breakdown in front of the bank → releases the crate himself → A2 (`fixRoute=dell`). Works on *his* incentive, not safety. |
| **Clever** | "Ask Jun to ring the festival bell early" | Crowd goes to the lantern launch; horn slips 15 min → one extra intervention. |
| **Clever** | "Ask Jun what's in the stockroom" (first trip) | Sequence-break: reveals the crate before A1. |

### Honest labelling of the scripted parser
M2 ships a **scripted parser**: synonym tables + patterns mapped onto the closed verb/target/claim sets. It will recognise a few hundred phrasings, not arbitrary language. The UI says so ("Prototype parser — understands a limited set of phrasings"), and an unrecognised input gets an out-of-world message, not a fake in-world shrug. It must not be described as understanding free-form input.

### What's needed to test real free-form interaction (M3)
1. An LLM interpreter behind a small server proxy (no key in the browser), constrained to output only the `Intent` schema with enum-valued fields. It never decides outcomes.
2. An API key and a hosting choice (D8).
3. A corpus of **real player utterances** — logged from M2 playtests, not written by us.
4. A labelled eval set (~150 utterances incl. ambiguous/impossible/clever) and metrics: intent accuracy, **false-claim rate** (attributing a claim the player didn't make — the worst error), clarification rate, p95 latency.
5. 5–8 cold playtesters. Cheaper first step: a Wizard-of-Oz session where a human maps typed text to intents live, to test the *design* before the integration.

---

## 6. Implementation approach and milestones

**Stack (D7):** Phaser 3 + TypeScript + Vite; maps in Tiled (JSON); Vitest for causal rules. Static build, no backend until M3. Placeholder pixel art at 16 px tiles, rendered at integer scale (crisp pixels), original palette.

**Architecture:** game logic in plain TS, independent of Phaser, so it's unit-testable:
- `state/past.ts` — past variables + `derivePresent(past) → 'baseline'|'A1'|'A2'`
- `intervention/interpret.ts` — `Interpreter` interface; `ScriptedInterpreter` (M2), `LlmInterpreter` (M3)
- `intervention/rules.ts` — authored rule table: (verb, target, claim/object, preconditions) → effects, line, time cost
- `content/` — entities per timeline, dialogue, journal facts
- `scenes/` — Phaser scenes read state; never own it
- Telemetry: every intervention (raw text, parsed intent, tier) logged locally with an export button for playtests.

**M1 — Walkable timelines (look-and-feel milestone).** District map with all four timeline variants, 3 characters × 2 ages, talk lines, clock travel, debug panel to set past variables and jump to any present. *Exit:* all four states walkable and visually distinct; `derivePresent` unit-tested; screenshots sent.
**M2 — Full loop, scripted parser.** Intervention box, intent preview, rules engine, time budget, journal, clue placement, A1/A2 fully playable, utterance logging, honest parser label. *Exit:* a cold player completes Baseline → A1 → A2 in ≤10 min; logs exported.
**M3 — Free-form test.** LLM interpreter behind the same interface, proxy, eval harness, scripted-vs-LLM comparison on real utterances, playtest round. *Exit:* metrics against thresholds we set after M2.

---

## 7. Biggest risk

**Expressive input vs. a two-outcome world.** Typing promises "do anything"; the world has four variables and three presents. If most inputs land as "nothing changed," typing feels like guessing a password and is *worse* than a dialogue menu. If the LLM is allowed to invent consequences, causal coherence (the whole point) breaks.

Mitigations: keep the LLM to interpretation only; make every ineffective/impossible response informative (a clue or a character's motive, never a dead "you can't"); design levers around motives (Dell's debt, Mara's pride, Jun's loyalty) so many phrasings map to few variables; log every miss.

**The honest test:** if M2/M3 logs show players' interventions collapsing into the same 3–4 ideas, typed input isn't earning its cost and a hybrid (typed + suggested actions) should be considered. This prototype tests whether the *loop* is compelling; it does not show that the concept sustains a full commercial game — A1→A2 is ultimately one lock and one key.

Secondary risk: art. "Readable 16-bit" is cheap to start and expensive to make good; it's the user's top concern, so M1 is built around visual iteration.
