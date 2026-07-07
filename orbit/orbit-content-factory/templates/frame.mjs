// HTML frame builders for every rendered asset. One visual system:
// dark field, bold grotesque, moss accent, orbit-ring motif, progress bar.

const FONT = `"Liberation Sans", "DejaVu Sans", Helvetica, Arial, sans-serif`;

export const C = {
  ink: "#0e0f11",
  card: "#15161a",
  line: "#282b31",
  fog: "#f2f2ef",
  fogDim: "#96988f",
  moss: "#819561",
  mossLight: "#b9c5a2",
  clay: "#c18a67",
};

function ring(size = 64) {
  const r = size / 2 - 5;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="opacity:.92">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${C.moss}" stroke-width="4"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 9}" fill="${C.fog}"/>
    <circle cx="${size * 0.78}" cy="${size * 0.26}" r="${size / 12}" fill="${C.clay}"/>
  </svg>`;
}

// Highlight *word* spans with the accent color.
function mark(text, accent) {
  return text
    .replace(/\*([^*]+)\*/g, `<span style="color:${accent}">$1</span>`)
    .replace(/\n/g, "<br/>");
}

function base(body, w, h) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { width:${w}px; height:${h}px; background:${C.ink}; font-family:${FONT};
           -webkit-font-smoothing:antialiased; overflow:hidden; }
  </style></head><body>${body}</body></html>`;
}

// ---- Video scene: 1080x1920, text-first ----
export function videoScene({ kicker, text, sub, accent = C.moss, sceneIndex, sceneCount, register = "default", big = false }) {
  const acc = register === "mirror" ? C.clay : accent;
  const pct = sceneCount > 1 ? (sceneIndex / (sceneCount - 1)) * 100 : 100;
  return base(
    `<div style="width:1080px;height:1920px;display:flex;flex-direction:column;justify-content:center;padding:0 110px;position:relative">
      <div style="position:absolute;top:150px;left:110px;display:flex;align-items:center;gap:22px">
        ${ring(56)}
        <span style="color:${C.fogDim};font-size:30px;font-weight:bold;letter-spacing:8px">${kicker ?? "ORBIT"}</span>
      </div>
      <div style="color:${C.fog};font-size:${big ? 96 : 78}px;font-weight:bold;line-height:1.18;letter-spacing:-1px;max-width:860px">
        ${mark(text, acc)}
      </div>
      ${sub ? `<div style="color:${C.fogDim};font-size:44px;line-height:1.4;margin-top:56px;max-width:820px">${mark(sub, acc)}</div>` : ""}
      <div style="position:absolute;bottom:210px;left:110px;right:110px">
        <div style="height:5px;background:${C.line};border-radius:3px">
          <div style="height:5px;width:${pct}%;background:${acc};border-radius:3px"></div>
        </div>
      </div>
    </div>`,
    1080,
    1920
  );
}

// ---- Carousel slide: 1080x1350 ----
export function carouselSlide({ kicker, headline, body, footer, slideIndex, slideCount, register = "default", isCover = false, isCta = false }) {
  const acc = register === "mirror" ? C.clay : C.moss;
  const dots = Array.from({ length: slideCount }, (_, i) =>
    `<span style="width:${i === slideIndex ? 34 : 12}px;height:12px;border-radius:6px;background:${i === slideIndex ? acc : C.line};display:inline-block;margin-right:10px"></span>`
  ).join("");
  return base(
    `<div style="width:1080px;height:1350px;display:flex;flex-direction:column;padding:96px;position:relative;${isCta ? `border:6px solid ${acc};` : ""}">
      <div style="display:flex;align-items:center;gap:20px;margin-bottom:70px">
        ${ring(52)}
        <span style="color:${C.fogDim};font-size:27px;font-weight:bold;letter-spacing:7px">${kicker ?? "ORBIT"}</span>
      </div>
      <div style="color:${C.fog};font-size:${isCover ? 92 : 72}px;font-weight:bold;line-height:1.15;letter-spacing:-1px">
        ${mark(headline, acc)}
      </div>
      ${body ? `<div style="color:${C.fogDim};font-size:46px;line-height:1.5;margin-top:54px">${mark(body, acc)}</div>` : ""}
      <div style="margin-top:auto">
        ${footer ? `<div style="color:${acc};font-size:38px;font-weight:bold;margin-bottom:44px">${footer}</div>` : ""}
        <div>${dots}</div>
      </div>
    </div>`,
    1080,
    1350
  );
}

// ---- Static card: 1080x1350 ----
export function staticCard({ kicker, headline, body, cta, register = "default", variant = "quote" }) {
  const acc = register === "mirror" ? C.clay : C.moss;
  const quoteBar = variant === "quote" ? `border-left:10px solid ${acc};padding-left:54px;` : "";
  return base(
    `<div style="width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;padding:110px;position:relative">
      <div style="position:absolute;top:100px;left:110px;display:flex;align-items:center;gap:20px">
        ${ring(52)}
        <span style="color:${C.fogDim};font-size:27px;font-weight:bold;letter-spacing:7px">${kicker ?? "ORBIT"}</span>
      </div>
      <div style="${quoteBar}">
        <div style="color:${C.fog};font-size:82px;font-weight:bold;line-height:1.18;letter-spacing:-1px">
          ${mark(headline, acc)}
        </div>
        ${body ? `<div style="color:${C.fogDim};font-size:46px;line-height:1.5;margin-top:52px">${mark(body, acc)}</div>` : ""}
      </div>
      ${cta ? `<div style="position:absolute;bottom:110px;left:110px;color:${acc};font-size:36px;font-weight:bold">${cta}</div>` : ""}
    </div>`,
    1080,
    1350
  );
}

// ---- Video thumbnail: 1080x1920 cover frame ----
export function thumbnail({ title }) {
  return base(
    `<div style="width:1080px;height:1920px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 100px;position:relative">
      <div style="margin-bottom:80px">${ring(120)}</div>
      <div style="color:${C.fog};font-size:104px;font-weight:bold;line-height:1.12;letter-spacing:-2px">
        ${mark(title, C.moss)}
      </div>
      <div style="position:absolute;bottom:190px;left:100px;color:${C.fogDim};font-size:34px;font-weight:bold;letter-spacing:8px">ORBIT</div>
    </div>`,
    1080,
    1920
  );
}
