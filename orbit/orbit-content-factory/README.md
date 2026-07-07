# Orbit Content Factory

Actual ready-to-post content assets — not strategy documents. Everything here is either a finished file (MP4, PNG, caption text) or a one-command render away.

## How it works

```
content-data/     ← ALL copy lives here as structured data (edit here, never in output)
templates/        ← HTML frame templates (video scenes, carousel slides, static cards)
render/           ← generate.mjs (emits text file tree) + render.mjs (PNGs + MP4s)
```

```bash
# from orbit/ project root
node orbit-content-factory/render/generate.mjs   # emits all text assets per package
node orbit-content-factory/render/render.mjs     # renders PNGs + MP4s (Playwright + ffmpeg)
```

Rendered binaries land inside each package folder. They are **gitignored** (repo stays light); regenerate any time with the commands above, or grab the zips the factory produces.

## Output tree

```
videos/ready-to-post/NN-slug/      script.md, voiceover.txt, onscreen.txt, scenes.json,
                                   captions.srt, caption.txt, tiktok-caption.txt,
                                   instagram-caption.txt, youtube-title.txt,
                                   youtube-description.txt, hashtags.txt, upload-notes.txt,
                                   video.mp4*, thumbnail.png*
carousels/ready-to-post/NN-slug/   slide-N.png*, slides.md, caption.txt, alt-text.txt,
                                   hashtags.txt, upload-notes.txt
static-posts/ready-to-post/NN-slug/ image.png*, caption.txt, alt-text.txt, notes.txt
reddit/ready-to-post/              one .md per post (20)
facebook/ready-to-post/            one .md per post (20)
email/ready-to-send/               3 sequence files (7 + 5 + 3 emails)
youtube/ready-to-post/             shorts/ (20 adaptations) + longform/ (10 packages)
calendar/                          30-day calendar (md + csv), workflows, checklist
analytics/                         tracking CSVs, definitions, scorecard
repurposing/                       workflow + 10 worked examples
legal-and-claims/                  claims guardrails, employer optics, disclaimers
bios-and-profiles/                 per-platform bio/profile/pinned-post copy
quality-audit/                     content-quality-audit.md
brand-assets/                      wordmark, avatar, palette, style guide
                                   (* = rendered binary, gitignored)
```

## Voice contract (every asset obeys this)

Direct, adult, emotionally honest, practical, slightly contrarian, social-native. Never: cheesy, therapy-speak, hustle-bro, pickup-artist, corporate, "find your tribe," "never be lonely again." No guaranteed outcomes, no mental-health treatment claims, no dating promises, no employer mentions. Full rules: `legal-and-claims/`.

## The videos are silent-by-design

Text-first vertical video is a native format on TikTok/Reels/Shorts — the MP4s render with timed on-screen text and are postable as-is with trending audio added in-app (recommended; in-app audio boosts distribution). `voiceover.txt` is included per video if you'd rather record a VO take over it in CapCut.
