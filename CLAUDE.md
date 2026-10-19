# Lantern Night — working rules

Small browser time-travel adventure prototype. Claude is implementation owner; ChatGPT assists with design review; the user makes final creative decisions.

Read before working: `docs/DESIGN.md` (the design), `docs/DECISIONS.md` (what's approved vs. pending), `docs/STATUS.md` (what exists). Update STATUS.md at the end of every working session.

Rules:
- Stay in scope: one district, three characters, one incident, baseline + two altered presents, 5–10 min. No combat, overworld, multiplayer, accounts, payments, extra missions.
- Altered presents must be playable (characters, access, objects, interactions change) — never just an ending card.
- Interpretation and resolution are separate. The interpreter (scripted or LLM) only produces an `Intent`; authored deterministic rules decide what happens. An LLM never writes world state.
- Describe scripted input handling honestly: "scripted parser, limited phrasings." Never claim free-form understanding without the M3 eval results.
- Don't treat PENDING decisions as approved; use the default and say so.
- Look and feel is the user's top concern: send screenshots (SendUserFile) whenever the visuals meaningfully change.
- Original art only — inspired by 16-bit readability, never copied from existing games.
