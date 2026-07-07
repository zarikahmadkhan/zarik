# Repurposing Workflow

One core insight → eight surfaces. Write the insight once (as a video package — the richest format), then derive. Deriving takes ~20 minutes per insight once you've done it twice.

## The cascade

| Surface | Derivation rule |
|---------|----------------|
| 1. TikTok | The video package as-is + tiktok-caption (lowercase, punchy) + trending audio |
| 2. IG Reel | Same MP4, instagram-caption (fuller, line-broken), post 1-2 days after TikTok |
| 3. YT Short | Same MP4, youtube title + description + #shorts, pinned comment carries the link |
| 4. IG Carousel | The video's scenes become slides; the sub-lines become slide bodies; add 1-2 slides of depth the video didn't have room for |
| 5. Reddit post | Strip ALL product mentions; turn the insight into a genuine question ("has anyone else…"); the video's hook becomes the title |
| 6. FB group post | First-person, warmer, ends with a question; product only in DM responses |
| 7. Email note | The insight + one practical action + one CTA; subject = the hook |
| 8. App prompt | One-line version for the avoidance mirror / weekly review copy bank in `lib/ai/` |

## Rules
- Never post identical text on two platforms — each has its own register (see per-surface captions in the video packages).
- The MP4 is shared across the three vertical platforms; everything else is rewritten.
- Reddit/FB derivations must survive with the product deleted — if the post is empty without Orbit, it's an ad, don't post it.

## 10 worked examples

Each maps an existing insight across all 8 surfaces using assets already in this factory:

| # | Core insight | TikTok/Reel/Short | Carousel | Reddit | Facebook | Email | App prompt |
|---|-------------|-------------------|----------|--------|----------|-------|------------|
| 1 | Friendship is follow-up | `videos/01` | `carousels/03` | `reddit/d01` | `facebook/fb04` | waitlist #3 | "You met {n} people this week and followed up with none." (shipped in `lib/ai/mock/review.ts`) |
| 2 | Loop > options | `videos/02` | `carousels/14` | `reddit/v02` | `facebook/fb03` | waitlist #1 | "You've marked several events interested and committed to none." (shipped) |
| 3 | Weak ties die | `videos/03` | `carousels/02` | `reddit/d03` | `facebook/fb04` (short ver.) | waitlist #3 | Reality-check copy (shipped) |
| 4 | Become a regular | `videos/04` | `carousels/06` | `reddit/d02` | `facebook/fb05` | waitlist #4 | "Round two is where familiarity starts paying." (shipped) |
| 5 | Second interaction | `videos/05` | `carousels/04` (slide 3) | `reddit/d01` | `facebook/fb04` | waitlist #3 P.S. | Program day 12 copy (shipped) |
| 6 | Stop collecting events | `videos/06` | `carousels/07` | `reddit/d07` | `facebook/fb03` | waitlist #1 P.S. | Mirror: interested-but-no-planned (shipped) |
| 7 | Reps not motivation | `videos/08` | `carousels/01` | `reddit/d09` | `facebook/fb13` | waitlist #2 | Rep tracker empty-state copy |
| 8 | 72-hour rule | `videos/10` | `carousels/13` | `reddit/d03` (comment) | `facebook/fb04` | waitlist #3 | Follow-up timing copy (shipped in `followUp.ts`) |
| 9 | Remote broke rhythm | `videos/12` | `carousels/11` | `reddit/d05` | `facebook/fb12` | segment email (remote) | Onboarding goal copy |
| 10 | 45 minutes counts | `videos/16` | `carousels/08` (slide 5) | `reddit/d10` | `facebook/fb10` | waitlist #5 | Exit-rule bank (shipped in `soloNight.ts`) |

Note the last column: the app itself is a repurposing surface. The best-performing content lines should flow INTO `lib/ai/` copy banks — content and product share one voice by design.
