// Emits every per-package text asset from content-data. Run before render.
//   node orbit-content-factory/render/generate.mjs

import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { videos } from "../content-data/videos.mjs";
import { carousels } from "../content-data/carousels.mjs";
import { statics } from "../content-data/statics.mjs";
import { reddit } from "../content-data/reddit.mjs";
import { facebook } from "../content-data/facebook.mjs";
import { youtubeLongform } from "../content-data/youtube-longform.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const w = (dir, name, content) => writeFileSync(join(dir, name), content.trim() + "\n");

const strip = (s) => s.replace(/\*/g, "").replace(/\n/g, " ");

// ---- Videos ----
for (const v of videos) {
  const dir = join(ROOT, "videos/ready-to-post", v.slug);
  mkdirSync(dir, { recursive: true });

  const total = v.scenes.reduce((a, s) => a + s.seconds, 0);
  w(dir, "script.md", [
    `# ${v.title}`,
    ``,
    `Length: ~${total}s · ${v.scenes.length} scenes · 1080x1920 · silent text-first (add trending audio in-app)`,
    ``,
    `| # | Seconds | On-screen | Support line |`,
    `|---|---------|-----------|--------------|`,
    ...v.scenes.map((s, i) => `| ${i + 1} | ${s.seconds} | ${strip(s.text)} | ${s.sub ? strip(s.sub) : "—"} |`),
    ``,
    `CTA: ${v.cta}`,
  ].join("\n"));

  w(dir, "voiceover.txt", v.voiceover);
  w(dir, "onscreen.txt", v.scenes.map((s, i) => `[${i + 1}] ${strip(s.text)}${s.sub ? `\n    ${strip(s.sub)}` : ""}`).join("\n\n"));
  w(dir, "scenes.json", JSON.stringify(v.scenes, null, 2));
  w(dir, "caption.txt", v.captions.generic);
  w(dir, "tiktok-caption.txt", v.captions.tiktok);
  w(dir, "instagram-caption.txt", v.captions.instagram);
  w(dir, "youtube-title.txt", v.ytTitle);
  w(dir, "youtube-description.txt", v.ytDescription);
  w(dir, "hashtags.txt", v.hashtags.join(" "));
  w(dir, "upload-notes.txt", v.uploadNotes);
}

// ---- Carousels ----
for (const c of carousels) {
  const dir = join(ROOT, "carousels/ready-to-post", c.slug);
  mkdirSync(dir, { recursive: true });
  w(dir, "slides.md", [
    `# ${c.title}`,
    ``,
    ...c.slides.map((s, i) => `## Slide ${i + 1}\n**${strip(s.headline)}**${s.body ? `\n\n${strip(s.body)}` : ""}${s.footer ? `\n\n_${s.footer}_` : ""}`),
  ].join("\n\n"));
  w(dir, "caption.txt", c.caption);
  w(dir, "alt-text.txt", c.slides.map((s, i) => `Slide ${i + 1}: ${strip(s.headline)}${s.body ? ` — ${strip(s.body)}` : ""}`).join("\n"));
  w(dir, "hashtags.txt", c.hashtags.join(" "));
  w(dir, "upload-notes.txt", c.uploadNotes);
}

// ---- Statics ----
for (const p of statics) {
  const dir = join(ROOT, "static-posts/ready-to-post", p.slug);
  mkdirSync(dir, { recursive: true });
  w(dir, "caption.txt", p.caption);
  w(dir, "alt-text.txt", `${strip(p.headline)}${p.body ? ` — ${strip(p.body)}` : ""}`);
  w(dir, "notes.txt", `Type: ${p.variant ?? "quote"} card · Platforms: ${p.platforms ?? "Instagram feed, Facebook page, LinkedIn"}\nCTA: ${p.cta ?? "Link in bio."}\n${p.notes ?? ""}`);
}

// ---- Reddit ----
{
  const dir = join(ROOT, "reddit/ready-to-post");
  mkdirSync(dir, { recursive: true });
  for (const p of reddit) {
    w(dir, `${p.slug}.md`, [
      `# [${p.kind}] ${p.title}`,
      ``,
      `## Body`,
      p.body,
      ``,
      `## Where`,
      p.subs,
      ``,
      `## Customize before posting`,
      p.customize,
      ``,
      `## Do NOT`,
      p.avoid,
      ``,
      `## Expected comment patterns`,
      p.expected,
      ``,
      `## Follow-up comments`,
      p.followUps.map((f) => `- ${f}`).join("\n"),
    ].join("\n"));
  }
}

// ---- Facebook ----
{
  const dir = join(ROOT, "facebook/ready-to-post");
  mkdirSync(dir, { recursive: true });
  for (const p of facebook) {
    w(dir, `${p.slug}.md`, [
      `# [${p.category}] ${p.slug}`,
      ``,
      `## Main post`,
      p.main,
      ``,
      `## Softer version (strict groups)`,
      p.softer,
      ``,
      `## Short version`,
      p.short,
      ``,
      `## DM response (when someone asks)`,
      p.dm,
      ``,
      `## Beta qualification question`,
      p.qualify,
      ``,
      `## Privacy note (include when sharing the link)`,
      p.privacy,
      ``,
      `## CTA`,
      p.cta,
    ].join("\n"));
  }
}

// ---- YouTube Shorts (adapted from videos) + longform ----
{
  const shortsDir = join(ROOT, "youtube/ready-to-post/shorts");
  mkdirSync(shortsDir, { recursive: true });
  for (const v of videos) {
    w(shortsDir, `${v.slug}.md`, [
      `# Short: ${v.ytTitle}`,
      ``,
      `Source package: \`videos/ready-to-post/${v.slug}/\` (upload video.mp4 as-is; Shorts accepts 9:16 up to 60s)`,
      ``,
      `## Title`,
      v.ytTitle,
      ``,
      `## Description`,
      v.ytDescription,
      ``,
      `## Hashtags (add #shorts)`,
      `#shorts ${v.hashtags.join(" ")}`,
      ``,
      `## Pinned comment`,
      `Free beta (no account): [LINK] — ${v.cta}`,
      ``,
      `## Upload notes`,
      v.uploadNotes,
    ].join("\n"));
  }

  const lfDir = join(ROOT, "youtube/ready-to-post/longform");
  mkdirSync(lfDir, { recursive: true });
  for (const y of youtubeLongform) {
    w(lfDir, `${y.slug}.md`, [
      `# ${y.title}`,
      ``,
      `**Thumbnail text:** ${y.thumbnailText.replace(/\n/g, " / ")}`,
      ``,
      `## Opening hook (first 20 seconds, verbatim-ready)`,
      y.hook,
      ``,
      `## Outline & section scripts`,
      y.outline.map(([h, s]) => `### ${h}\n${s}`).join("\n\n"),
      ``,
      `## Description`,
      y.description,
      ``,
      `## Pinned comment`,
      y.pinnedComment,
      ``,
      `## CTA`,
      y.cta,
      ``,
      `## Risk notes`,
      y.riskNotes,
    ].join("\n"));
  }
}

console.log(
  `generated: ${videos.length} videos, ${carousels.length} carousels, ${statics.length} statics, ${reddit.length} reddit, ${facebook.length} facebook, ${videos.length} shorts, ${youtubeLongform.length} longform`
);
