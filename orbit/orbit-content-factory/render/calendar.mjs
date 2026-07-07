// Emits the 30-day publishing calendar (md + csv) mapping real asset slugs
// to dates. Day 1 = next Monday by default, or pass a YYYY-MM-DD start.
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { videos } from "../content-data/videos.mjs";
import { carousels } from "../content-data/carousels.mjs";
import { statics } from "../content-data/statics.mjs";
import { reddit } from "../content-data/reddit.mjs";
import { facebook } from "../content-data/facebook.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const start = process.argv[2] ? new Date(process.argv[2] + "T12:00:00") : (() => {
  const d = new Date(); d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)); return d;
})();

// Sequencing: insight videos lead; product content (19, 15-carousel) waits
// until week 3; discussion Reddit before beta Reddit; FB soft entry.
const vids = videos.filter(v => !["19-orbit-in-30-seconds"].includes(v.slug));
const productVid = videos.find(v => v.slug === "19-orbit-in-30-seconds");
const cars = carousels.filter(c => c.slug !== "15-how-orbit-works");
const productCar = carousels.find(c => c.slug === "15-how-orbit-works");
const rDisc = reddit.filter(r => r.kind === "discussion");
const rVal = reddit.filter(r => r.kind === "validation");
const rBeta = reddit.filter(r => r.kind === "beta");

let vi = 0, ci = 0, si = 0, rdi = 0, rvi = 0, rbi = 0, fbi = 0;
const rows = [];
const themes = ["Week 1 — The core insights (no product talk)", "Week 2 — Personas & pain points", "Week 3 — Product enters + beta recruiting", "Week 4 — Challenge + double down on what worked", "Week 5 (partial) — review & re-plan"];

for (let day = 0; day < 30; day++) {
  const date = new Date(start); date.setDate(start.getDate() + day);
  const iso = date.toISOString().slice(0, 10);
  const dow = date.getDay(); // 0 Sun
  const week = Math.floor(day / 7);
  const items = [];

  // Video: Mon/Wed/Fri → TikTok + Reels + Shorts simultaneously
  if ([1, 3, 5].includes(dow)) {
    const v = (week === 2 && dow === 5 && productVid && !productVid._used)
      ? (productVid._used = true, productVid)
      : vids[vi++ % vids.length];
    items.push([`videos/${v.slug}`, "TikTok + IG Reels + YT Shorts", "6-9pm ET"]);
  }
  // Carousel: Tue (product carousel lands week 3 Tue)
  if (dow === 2) {
    const c = (week === 2 && productCar && !productCar._used)
      ? (productCar._used = true, productCar)
      : cars[ci++ % cars.length];
    items.push([`carousels/${c.slug}`, "Instagram carousel", "12-2pm ET"]);
  }
  // Static: Thu + Sun
  if ([4, 0].includes(dow)) {
    const s = statics[si++ % statics.length];
    items.push([`static-posts/${s.slug}`, "IG feed + FB page", "11am ET"]);
  }
  // Reddit: Tue/Sat — discussion weeks 1-2, validation week 2-3, beta week 3+
  if ([2, 6].includes(dow)) {
    let r;
    if (week < 2 && rdi < rDisc.length) r = rDisc[rdi++];
    else if (rvi < rVal.length) r = rVal[rvi++];
    else if (rbi < rBeta.length) r = rBeta[rbi++];
    else r = rDisc[rdi++ % rDisc.length];
    items.push([`reddit/${r.slug}`, "Reddit", "9-11am ET"]);
  }
  // Facebook: Mon/Thu, soft versions week 1
  if ([1, 4].includes(dow) && fbi < facebook.length) {
    const f = facebook[fbi++];
    items.push([`facebook/${f.slug}${week === 0 ? " (softer version)" : ""}`, "Facebook group", "7-9pm ET"]);
  }
  if (items.length === 0) items.push(["—", "Rest / engage with comments", "—"]);
  for (const [asset, platform, time] of items) rows.push({ iso, day: day + 1, week: week + 1, asset, platform, time });
}

const csv = ["date,day,week,asset,platform,post_time"].concat(
  rows.map(r => `${r.iso},${r.day},${r.week},"${r.asset}","${r.platform}","${r.time}"`)
).join("\n");

let md = `# 30-Day Publishing Calendar\n\nStart: ${start.toISOString().slice(0, 10)} (regenerate with \`node orbit-content-factory/render/calendar.mjs YYYY-MM-DD\`)\n\n`;
for (let wk = 1; wk <= 5; wk++) {
  const wkRows = rows.filter(r => r.week === wk);
  if (!wkRows.length) continue;
  md += `\n## ${themes[wk - 1]}\n\n| Date | Asset | Platform | Time |\n|------|-------|----------|------|\n`;
  for (const r of wkRows) md += `| ${r.iso} | \`${r.asset}\` | ${r.platform} | ${r.time} |\n`;
}
md += `\n## Rules\n- Videos post to all three vertical platforms the same evening (native upload each, never cross-watermarked).\n- Comments are the job: 30 min of replies the morning after every post.\n- Week 3 is when product content is allowed. Not before — audience first.\n- If something outperforms 3x median, make two more assets on that exact insight next week (see analytics/experiment-tracker).\n`;

const dir = join(ROOT, "calendar");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "30-day-calendar.md"), md);
writeFileSync(join(dir, "30-day-calendar.csv"), csv + "\n");
console.log(`calendar: ${rows.length} scheduled slots from ${start.toISOString().slice(0, 10)}`);
