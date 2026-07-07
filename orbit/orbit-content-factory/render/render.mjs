// Renders every binary asset: video scene PNGs → MP4 via ffmpeg, carousel
// slides, static cards, thumbnails. Idempotent — re-run any time.
//
//   node orbit-content-factory/render/render.mjs [--only videos|carousels|statics]
//
// Requires: Playwright chromium (env-provided here) and ffmpeg (path below
// falls back to system ffmpeg).

import { chromium } from "playwright";
import { execFileSync } from "child_process";
import { mkdirSync, writeFileSync, existsSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { videoScene, carouselSlide, staticCard, thumbnail } from "../templates/frame.mjs";
import { videos } from "../content-data/videos.mjs";
import { carousels } from "../content-data/carousels.mjs";
import { statics } from "../content-data/statics.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FFMPEG =
  process.env.FFMPEG_PATH ??
  (existsSync("/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux")
    ? "/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux"
    : "ffmpeg");
const CHROMIUM = existsSync("/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
  ? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
  : undefined;

const only = process.argv.includes("--only")
  ? process.argv[process.argv.indexOf("--only") + 1]
  : null;

const browser = await chromium.launch({
  executablePath: CHROMIUM,
  args: ["--force-color-profile=srgb"],
});

async function shot(html, path, w, h) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path });
  await page.close();
}

function srt(scenes) {
  let t = 0;
  const fmt = (s) => {
    const ms = Math.round((s % 1) * 1000);
    const total = Math.floor(s);
    const hh = String(Math.floor(total / 3600)).padStart(2, "0");
    const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss},${String(ms).padStart(3, "0")}`;
  };
  return scenes
    .map((s, i) => {
      const start = t;
      t += s.seconds;
      const text = (s.text + (s.sub ? " " + s.sub : "")).replace(/\*/g, "");
      return `${i + 1}\n${fmt(start)} --> ${fmt(t)}\n${text}\n`;
    })
    .join("\n");
}

// ---- Videos ----
if (!only || only === "videos") {
  for (const v of videos) {
    const dir = join(ROOT, "videos/ready-to-post", v.slug);
    const framesDir = join(dir, ".frames");
    mkdirSync(framesDir, { recursive: true });

    const listLines = [];
    for (let i = 0; i < v.scenes.length; i++) {
      const s = v.scenes[i];
      const png = join(framesDir, `scene-${String(i).padStart(2, "0")}.png`);
      await shot(
        videoScene({
          kicker: v.kicker,
          text: s.text,
          sub: s.sub,
          sceneIndex: i,
          sceneCount: v.scenes.length,
          register: s.register ?? v.register ?? "default",
          big: s.big ?? false,
        }),
        png,
        1080,
        1920
      );
      listLines.push(`file '${png}'`, `duration ${s.seconds}`);
    }
    // ffmpeg concat requires the last file repeated without duration
    listLines.push(`file '${join(framesDir, `scene-${String(v.scenes.length - 1).padStart(2, "0")}.png`)}'`);
    const listPath = join(framesDir, "list.txt");
    writeFileSync(listPath, listLines.join("\n"));

    execFileSync(FFMPEG, [
      "-y", "-f", "concat", "-safe", "0", "-i", listPath,
      "-vf", "fps=30,format=yuv420p",
      "-c:v", "libx264", "-preset", "medium", "-crf", "23",
      "-movflags", "+faststart",
      join(dir, "video.mp4"),
    ], { stdio: "pipe" });

    writeFileSync(join(dir, "captions.srt"), srt(v.scenes));
    await shot(thumbnail({ title: v.thumbnailTitle ?? v.title }), join(dir, "thumbnail.png"), 1080, 1920);
    rmSync(framesDir, { recursive: true, force: true });
    console.log("video:", v.slug);
  }
}

// ---- Carousels ----
if (!only || only === "carousels") {
  for (const c of carousels) {
    const dir = join(ROOT, "carousels/ready-to-post", c.slug);
    mkdirSync(dir, { recursive: true });
    for (let i = 0; i < c.slides.length; i++) {
      const s = c.slides[i];
      await shot(
        carouselSlide({
          kicker: c.kicker,
          headline: s.headline,
          body: s.body,
          footer: s.footer,
          slideIndex: i,
          slideCount: c.slides.length,
          register: s.register ?? c.register ?? "default",
          isCover: i === 0,
          isCta: i === c.slides.length - 1,
        }),
        join(dir, `slide-${i + 1}.png`),
        1080,
        1350
      );
    }
    console.log("carousel:", c.slug);
  }
}

// ---- Statics ----
if (!only || only === "statics") {
  for (const p of statics) {
    const dir = join(ROOT, "static-posts/ready-to-post", p.slug);
    mkdirSync(dir, { recursive: true });
    await shot(
      staticCard({
        kicker: p.kicker,
        headline: p.headline,
        body: p.body,
        cta: p.cta,
        register: p.register ?? "default",
        variant: p.variant ?? "quote",
      }),
      join(dir, "image.png"),
      1080,
      1350
    );
    console.log("static:", p.slug);
  }
}

await browser.close();
console.log("RENDER COMPLETE");
