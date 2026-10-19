// Paints the district for one timeline: background (transparent where water shows through),
// three animated water frames, and an additive light layer for night.
// Art direction: docs/DECISIONS.md D9 + mockups/reference/. Quiet ground, solid depth, hard-edged light.
import type { PastState, Timeline } from '../state/past';
import { hash, Painter, pool } from './paint';
import {
  BENCH, BOOTH, CHANDLERY, CRATES, DOCK, FACADE_BOTTOM, FERRY, HOUSES, LAMPS, NOTICEBOARD, PIER, PLATFORM,
  PLAQUE, QUAY_Y, SHRUBS, STALL, STUMPS, TERMINAL, TOWER, WATER_Y, WORLD,
} from '../world/layout';

export interface WorldArt { bg: HTMLCanvasElement; water: HTMLCanvasElement[]; lights: HTMLCanvasElement | null }

const canvas = () => {
  const c = document.createElement('canvas');
  c.width = WORLD.w;
  c.height = WORLD.h;
  return c;
};

/** Light source at (x, y); its pool lands on the ground at groundY. r = 0 means reflection only. */
type LightFn = (x: number, y: number, groundY: number, r: number) => void;
const SHADOW = 'rgba(16,12,28,0.24)';

export function paintWorld(t: Timeline, past: PastState): WorldArt {
  const bgC = canvas();
  const p = new Painter(bgC, t);
  const lightsC = t === 'p1984' ? canvas() : null;
  const lg = lightsC?.getContext('2d') ?? null;
  const sources: { x: number; y: number }[] = [];
  const light: LightFn = (x, y, groundY, r) => {
    sources.push({ x, y });
    if (lg && r > 0) pool(lg, x, groundY, r, Math.max(3, Math.round(r * 0.36)));
  };
  const night = t === 'p1984';
  const has = {
    pier: t === 'p1984' || t === 'A1',
    stumps: t === 'baseline',
    ferry: t === 'p1984' || t === 'A2',
    fence: t === 'baseline' || t === 'A1',
    weeds: t === 'baseline' || t === 'A1',
  };

  // ---------- ground ----------
  cobbles(p, 0, 0, WORLD.w, QUAY_Y);
  quayWall(p, has.pier ? [PIER.x, PIER.x + PIER.w] : null, t === 'A2');

  // ---------- buildings ----------
  for (const h of HOUSES) house(p, h, night, light);
  tower(p, t);
  terminal(p, t, light);
  shrubs(p);
  // contact shadow where walls meet the paving
  p.g.fillStyle = SHADOW;
  p.g.fillRect(0, FACADE_BOTTOM, TERMINAL.x, 3);
  p.g.fillRect(TERMINAL.x, TERMINAL.y + TERMINAL.h, TERMINAL.w, 3);

  // ---------- harbour structures ----------
  dock(p, t);
  if (has.pier) pier(p, t, light);
  if (has.stumps) stumps(p);
  if (has.ferry) ferry(p, t, light);
  if (has.fence) fence(p, t);

  // ---------- square furniture ----------
  bench(p);
  if (t === 'baseline' || t === 'A2') plaque(p, t === 'A2');
  noticeboard(p, t, past);
  if (t === 'baseline') stall(p, '#4a7a8a');
  if (t === 'p1984') stall(p, '#a8483a');
  if (t === 'p1984' || t === 'A2') crates(p);
  if (t === 'baseline') brokenCrates(p);
  if (t === 'p1984' || t === 'A2') booth(p, t, light);
  if (has.weeds) weeds(p, t === 'A1' ? 12 : 22);
  for (const l of LAMPS) lamp(p, l.x, l.y, night, light);
  if (t === 'p1984') lanterns(p, light);
  if (t === 'A2') bunting(p);

  const water = [0, 1, 2].map((f) => waterFrame(t, f, sources, has));
  return { bg: bgC, water, lights: lightsC };
}

// ===================================================================== ground

function cobbles(p: Painter, x0: number, y0: number, w: number, h: number) {
  // Low-contrast setts: texture is there if you look, but it never competes with people or clues.
  p.R(x0, y0, w, h, '#86807a');
  for (let y = y0, row = 0; y < y0 + h; y += 4, row++) {
    for (let x = x0 - ((row * 3) % 5); x < x0 + w;) {
      const sw = 5 + ((hash(x, y) * 3) | 0);
      const r = hash(y, x);
      const base = r < 0.5 ? '#928c84' : r < 0.85 ? '#8e8880' : '#97918a';
      p.R(x + 1, y, sw - 2, 3, base);
      p.R(x, y + 1, sw, 1, base);
      p.R(x + 1, y, sw - 3, 1, '#9c968e');
      x += sw;
    }
  }
}

function quayWall(p: Painter, gap: [number, number] | null, fresh: boolean) {
  const y = QUAY_Y;
  p.R(0, y, WORLD.w, 3, '#bdb4a3'); // cap stones
  p.R(0, y + 3, WORLD.w, 1, '#8e877a');
  for (let x = 0; x < WORLD.w; x += 14) p.R(x, y, 1, 3, '#9d9686');
  p.R(0, y + 4, WORLD.w, 7, '#6f695e');
  for (let x = 0; x < WORLD.w; x += 12) {
    p.R(x, y + 4, 1, 7, '#565048');
    p.R(x + 1, y + 4, 10, 1, '#7d776b');
    p.R(x + 6, y + 8, 1, 3, '#565048');
    if (!fresh && hash(x, 7) < 0.4) p.R(x + 2, y + 9, 3 + ((hash(x, 9) * 4) | 0), 2, '#4f6a42');
  }
  p.R(0, y + 11, WORLD.w, 1, '#2f3236');
  if (gap) p.R(gap[0] - 1, y, gap[1] - gap[0] + 2, 3, '#bdb4a3');
}

// ===================================================================== buildings

type House = (typeof HOUSES)[number];

function roof(p: Painter, x: number, y: number, w: number, h: number, c: string) {
  // overhang: 2px past the walls, fascia board, and a shadow cast onto the wall below
  const rx = x - 2, rw = w + 4;
  p.R(rx, y, rw, h, c);
  for (let ry = y + 2; ry < y + h - 3; ry += 3) {
    p.R(rx, ry, rw, 1, shade(c, -24));
    for (let k = rx + ((ry / 3) % 2 ? 2 : 5); k < rx + rw; k += 6) p.R(k, ry - 2, 1, 2, shade(c, -14));
  }
  p.R(rx, y, rw, 1, shade(c, 34));
  p.R(rx, y + h - 3, rw, 1, shade(c, -46));
  p.R(rx, y + h - 2, rw, 1, '#d8ccb4'); // fascia
  p.R(rx, y + h - 1, rw, 1, '#2e231c');
}

function wall(p: Painter, x: number, y: number, w: number, h: number, c: string) {
  p.R(x, y, w, h, c);
  for (let i = 0; i < w * h * 0.03; i++) p.R(x + hash(i, x) * w, y + hash(x, i) * h, 1, 1, shade(c, -8));
  p.R(x, y, w, 3, shade(c, -30)); // eave shadow
  p.R(x, y + 3, w, 1, shade(c, -14));
  p.R(x, y + h - 4, w, 4, '#77705f'); // plinth
  p.R(x, y + h - 4, w, 1, '#9a9282');
}

function windowAt(p: Painter, x: number, y: number, lit: boolean, boarded = false) {
  p.R(x - 2, y - 2, 14, 16, '#b8ad96'); // stone surround
  p.R(x - 1, y - 1, 12, 14, '#2f2219');
  if (lit) {
    p.L(x, y, 10, 12, '#ffd47a');
    p.L(x, y, 10, 2, '#e8a850'); // shadow of the frame head
    p.L(x, y + 8, 10, 4, '#f0ad52');
    p.L(x + 4, y, 2, 12, '#6a3e22');
    p.L(x, y + 5, 10, 1, '#6a3e22');
  } else {
    p.R(x, y, 10, 12, '#2e3d4c');
    p.R(x, y, 10, 2, '#1f2a36');
    p.R(x + 1, y + 2, 3, 3, '#56708a');
    p.R(x + 4, y, 2, 12, '#2f2219');
    p.R(x, y + 5, 10, 1, '#2f2219');
  }
  p.R(x - 2, y + 12, 14, 2, '#d6cbb4'); // sill
  p.g.fillStyle = SHADOW;
  p.g.fillRect(x - 1, y + 14, 12, 1);
  if (boarded) {
    p.R(x - 3, y + 2, 16, 3, '#a27a50');
    p.R(x - 3, y + 7, 16, 3, '#8f6b45');
    p.R(x, y + 3, 1, 1, '#4a3626');
    p.R(x + 9, y + 8, 1, 1, '#4a3626');
  }
}

function doorAt(p: Painter, x: number, y: number, opts: { boarded?: boolean; color?: string; lit?: boolean } = {}) {
  // recessed: stone frame and lintel, a dark reveal, panel set back
  p.R(x - 3, y - 4, 18, 22, '#b3a891');
  p.R(x - 3, y - 4, 18, 2, '#cfc4ac');
  p.R(x - 1, y - 2, 14, 20, '#22180f');
  if (opts.lit) {
    p.L(x + 1, y, 11, 18, '#f3b85c');
    p.L(x + 3, y + 2, 7, 16, '#ffd47a');
  } else {
    const c = opts.color ?? '#6e4630';
    p.R(x + 1, y, 11, 18, c);
    for (const [dx, dy] of [[2, 2], [7, 2], [2, 10], [7, 10]]) { p.R(x + dx, y + dy, 4, 6, shade(c, 12)); p.R(x + dx, y + dy, 4, 1, shade(c, -18)); }
    p.R(x + 10, y + 9, 1, 1, '#e0bc70');
  }
  p.R(x - 4, y + 18, 20, 2, '#aaa292'); // step
  p.R(x - 4, y + 18, 20, 1, '#c4bcab');
  if (opts.boarded) {
    p.R(x - 4, y + 3, 20, 3, '#a27a50');
    p.R(x - 4, y + 11, 20, 3, '#8f6b45');
    p.R(x + 4, y - 1, 3, 19, '#97704a');
  }
}

function wallLamp(p: Painter, x: number, y: number, lit: boolean, light: LightFn, groundY: number) {
  p.R(x, y, 3, 1, '#2a2a30');
  p.R(x, y + 1, 3, 4, '#2a2a30');
  if (lit) { p.L(x + 1, y + 2, 1, 2, '#fff0c0'); light(x + 1, y + 3, groundY, 11); } else p.R(x + 1, y + 2, 1, 2, '#9aa4a8');
}

function house(p: Painter, h: House, night: boolean, light: LightFn) {
  const fy = h.top + h.roofH;
  wall(p, h.x, fy, h.w, FACADE_BOTTOM - fy, '#e3d4b6');
  p.R(h.x + h.w - 1, fy, 1, FACADE_BOTTOM - fy, '#bcae92');
  roof(p, h.x, h.top, h.w, h.roofH, h.roof);
  for (const wx of h.windows) windowAt(p, h.x + wx, fy + 9, night && hash(h.x, wx) < 0.8);
  doorAt(p, h.x + h.door, FACADE_BOTTOM - 20);
  wallLamp(p, h.x + h.door - 8, FACADE_BOTTOM - 22, night, light, FACADE_BOTTOM + 7);
}

function tower(p: Painter, t: Timeline) {
  const { x, w } = TOWER;
  p.R(x + 4, 0, w - 8, 11, '#4c5468');
  for (let ry = 2; ry < 10; ry += 3) p.R(x + 4, ry, w - 8, 1, '#3c4356');
  p.R(x + 2, 10, w - 4, 1, '#d8ccb4');
  p.R(x + 2, 11, w - 4, 1, '#2e231c');
  wall(p, x + 2, 12, w - 4, FACADE_BOTTOM - 12, '#c7bc9f');
  for (let y = 18; y < FACADE_BOTTOM - 6; y += 6) p.R(x + 2, y, w - 4, 1, '#b5aa8e');
  p.R(x + 2, 12, 2, FACADE_BOTTOM - 12, '#d6cbb0'); // quoins catch the light
  p.R(x + w - 4, 12, 2, FACADE_BOTTOM - 12, '#a99e84');
  const cx = x + w / 2, cy = 30;
  p.R(cx - 10, cy - 10, 20, 20, '#5a4a32');
  p.R(cx - 10, cy - 10, 20, 1, '#7a6a4a');
  (t === 'p1984' ? p.L : p.R).call(p, cx - 8, cy - 8, 16, 16, t === 'p1984' ? '#fff0c4' : '#efe6cc');
  const ink = (dx: number, dy: number, ww: number, hh: number) => (t === 'p1984' ? p.L : p.R).call(p, cx + dx, cy + dy, ww, hh, '#1f1b16');
  for (const [dx, dy] of [[-1, -7], [6, -1], [-1, 6], [-7, -1]]) ink(dx, dy, 2, 2);
  ink(-1, -1, 2, 2);
  if (t === 'baseline') { ink(-6, -1, 6, 1); ink(0, 0, 1, 5); } // stopped at 9:12
  else if (t === 'p1984') { ink(-5, -4, 4, 1); ink(-2, -3, 1, 2); ink(0, 0, 4, 1); } // 8:15
  else { ink(0, -6, 1, 6); ink(0, 0, 5, 1); }
  doorAt(p, x + w / 2 - 6, FACADE_BOTTOM - 20, { color: '#5a3c2a' });
}

function terminal(p: Painter, t: Timeline, light: LightFn) {
  const { x, y, w } = TERMINAL;
  const base = y + TERMINAL.h;
  const open = t === 'p1984' || t === 'A2';
  wall(p, x, y + 26, w, base - y - 26, t === 'A2' ? '#e8eee9' : t === 'p1984' ? '#d6ddd7' : '#c6cac3');
  roof(p, x + 2, y, w - 2, 28, t === 'A2' ? '#2f7a72' : '#3f6f6a');
  const sx = x + 70, sy = y + 32, sw = 116;
  p.R(sx - 1, sy - 1, sw + 2, 13, '#22303e');
  p.R(sx, sy, sw, 11, open ? '#1f3a5c' : '#4d5862');
  p.R(sx, sy, sw, 1, open ? '#3a5f88' : '#6b7680');
  const label = t === 'baseline' ? 'RUANE FE  Y C .' : 'RUANE FERRY CO.';
  p.text(label, sx + (sw - Painter.textWidth(label)) / 2, sy + 3, open ? '#f4e7c6' : '#b3ada0', t === 'p1984');
  const winY = y + 50;
  for (const wx of [14, 36, 58, 170, 192, 214, 236]) windowAt(p, x + wx, winY, t === 'p1984', !open);
  for (const dx of [104, 122]) doorAt(p, x + dx, base - 20, { boarded: !open, lit: t === 'p1984', color: t === 'A2' ? '#2f5a7a' : '#5a3c2a' });
  wallLamp(p, x + 94, base - 24, t === 'p1984', light, base + 8);
  wallLamp(p, x + 142, base - 24, t === 'p1984', light, base + 8);
  if (t === 'p1984') light(x + 118, base, base + 6, 18);
  if (t === 'A1') {
    p.R(x + 102, base - 10, 34, 1, '#9aa0a6');
    p.R(x + 118, base - 12, 4, 4, '#6b7178');
    p.R(x + 150, base - 30, 26, 12, '#d8cfb8');
    p.R(x + 150, base - 30, 26, 1, '#f0e8d4');
    p.text('SOLD', x + 156, base - 26, '#a8483a');
    p.R(x + 162, base - 18, 2, 18, '#6e4630');
  }
  if (t === 'A2') {
    for (const wx of [14, 36, 58, 170, 192, 214, 236]) { p.R(x + wx - 2, winY + 15, 14, 3, '#7a5236'); p.R(x + wx, winY + 13, 3, 2, '#e05a6a'); p.R(x + wx + 4, winY + 13, 3, 2, '#f2c94c'); p.R(x + wx + 8, winY + 13, 3, 2, '#e05a6a'); }
  }
}

function shrubs(p: Painter) {
  const { x, y, w, h } = SHRUBS;
  p.R(x, y + h - 6, w, 6, '#5d564c');
  for (const [cx, cy, r] of [[x + 12, y + 18, 13], [x + 32, y + 14, 14], [x + 22, y + 26, 10], [x + 40, y + 26, 8]]) {
    for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) {
      const d = xx * xx + yy * yy;
      if (d > r * r) continue;
      const hi = xx + yy < -r * 0.5;
      p.R(cx + xx, cy + yy, 1, 1, d > r * r * 0.75 ? '#35603a' : hi ? '#6f9a52' : hash(cx + xx, cy + yy) < 0.12 ? '#3f6e40' : '#4f8044');
    }
  }
  p.g.fillStyle = SHADOW;
  p.g.fillRect(x, y + h, w, 3);
}

// ===================================================================== harbour

function pier(p: Painter, t: Timeline, light: LightFn) {
  const worn = t === 'A1';
  const plank = worn ? '#8a7560' : '#8a5a3a', gap = worn ? '#5a4a3c' : '#4f3220', hi = worn ? '#9a866e' : '#a06c46';
  p.R(PIER.x, PIER.y, PIER.w, PIER.h + 4, plank);
  for (let y = PIER.y; y < PIER.y + PIER.h + 4; y += 4) { p.R(PIER.x, y, PIER.w, 1, hi); p.R(PIER.x, y + 3, PIER.w, 1, gap); if (worn && hash(y, 3) < 0.3) p.R(PIER.x + 6, y + 1, 5, 2, gap); }
  p.R(PIER.x - 2, PIER.y, 2, PIER.h, '#3d2a1d');
  p.R(PIER.x + PIER.w, PIER.y, 2, PIER.h, '#3d2a1d');
  for (const py of [PIER.y + 12, PIER.y + 32]) { p.R(PIER.x - 3, py, 3, 12, '#3d2a1d'); p.R(PIER.x + PIER.w, py, 3, 12, '#3d2a1d'); }
  const P = PLATFORM;
  p.R(P.x, P.y, P.w, P.h, plank);
  for (let y = P.y; y < P.y + P.h; y += 4) { p.R(P.x, y, P.w, 1, hi); p.R(P.x, y + 3, P.w, 1, gap); }
  p.R(P.x, P.y + P.h, P.w, 2, '#2b1d14');
  for (const px of [P.x, P.x + P.w - 3]) for (const py of [P.y + 6, P.y + P.h - 8]) p.R(px, py, 3, 10, '#3d2a1d');
  const C = CHANDLERY;
  wall(p, C.x, C.y + 20, C.w, C.h - 20, worn ? '#b8ab92' : '#cdb990');
  roof(p, C.x, C.y, C.w, 22, worn ? '#5f6b56' : '#4f6b48');
  p.g.fillStyle = SHADOW;
  p.g.fillRect(C.x, C.y + C.h, C.w, 3);
  const lit = t === 'p1984';
  windowAt(p, C.x + 8, C.y + 27, lit);
  windowAt(p, C.x + C.w - 18, C.y + 27, lit);
  doorAt(p, C.x + C.w / 2 - 6, C.y + C.h - 20, { color: worn ? '#5a6a70' : '#5a3c2a' });
  const label = worn ? 'BAIT & SALVAGE' : 'CHANDLERY';
  const lw = Painter.textWidth(label) + 6;
  p.R(C.x + (C.w - lw) / 2, C.y + 22, lw, 8, '#2b2a24');
  p.text(label, C.x + (C.w - lw) / 2 + 3, C.y + 23, '#ecdcae', lit);
  wallLamp(p, C.x + C.w / 2 - 14, C.y + C.h - 22, lit, light, C.y + C.h + 8);
  if (worn) {
    const cx = C.x + 2, cy = C.y + C.h + 2; // the unpaid crate, by the door
    p.g.fillStyle = SHADOW;
    p.g.fillRect(cx, cy + 10, 12, 2);
    p.R(cx, cy, 12, 10, '#9a7a4e');
    p.R(cx, cy, 12, 1, '#b8955f');
    p.R(cx, cy + 5, 12, 1, '#6e5434');
    p.R(cx + 2, cy + 2, 8, 2, '#5a3c2a');
  }
}

function stumps(p: Painter) {
  p.R(PIER.x, QUAY_Y, PIER.w, 4, '#6d4a33');
  p.R(PIER.x + 9, QUAY_Y + 4, 8, 3, '#5c3a24');
  for (const [x, dy] of STUMPS) {
    p.R(x, QUAY_Y + dy, 3, 9, '#3a281b');
    p.R(x, QUAY_Y + dy, 3, 1, '#5c4030');
  }
}

const BOLLARDS = [FERRY.x + 2, FERRY.x + FERRY.w - 10];

function dock(p: Painter, t: Timeline) {
  const D = DOCK;
  const c = t === 'A2' ? '#9a6a44' : '#7a5236';
  p.R(D.x, D.y, D.w, D.h, c);
  for (let y = D.y; y < D.y + D.h; y += 4) { p.R(D.x, y, D.w, 1, shade(c, 14)); p.R(D.x, y + 3, D.w, 1, shade(c, -28)); }
  p.R(D.x, D.y + D.h, D.w, 2, '#2b1d14');
  for (let x = D.x + 8; x < D.x + D.w; x += 34) p.R(x, D.y + D.h, 4, 12, '#3d2a1d');
  for (const bx of BOLLARDS) { p.R(bx, D.y + D.h - 7, 5, 6, '#2a2a30'); p.R(bx - 1, D.y + D.h - 8, 7, 2, '#3e3e46'); p.R(bx, D.y + D.h - 8, 5, 1, '#62626c'); }
}

function ferry(p: Painter, t: Timeline, light: LightFn) {
  const X = FERRY.x, Y = FERRY.y, W = FERRY.w, fresh = t === 'A2', lit = t === 'p1984';
  const hull = fresh ? '#203f6c' : '#1d2a46';
  const cabin = fresh ? '#f6f2e6' : '#e6e0d0';
  const LR = (lit ? p.L : p.R).bind(p);
  const sheer = (i: number) => Y + 30 - Math.round((4 * i) / W) - (i > W - 30 ? Math.round(((i - (W - 30)) ** 2) / 120) : 0);
  const keel = (i: number) => Y + 54 - (i > W - 22 ? Math.round((i - (W - 22)) * 0.9) : 0) - (i < 5 ? 5 - i : 0);
  // waterline shadow
  p.g.fillStyle = 'rgba(8,12,28,0.35)';
  p.g.fillRect(X + 2, Y + 54, W - 16, 5);
  // hull, column by column for the sheer and the raked bow
  for (let i = 0; i < W; i++) {
    const top = sheer(i), bot = keel(i);
    if (bot <= top + 2) continue;
    p.R(X + i, top, 1, bot - top, hull);
    p.R(X + i, top, 1, 1, '#f2eee2'); // rub rail
    p.R(X + i, top + 1, 1, 1, shade(hull, 26));
    p.R(X + i, bot - 5, 1, 3, '#b23a2e'); // boot-top
    p.R(X + i, bot - 1, 1, 1, shade(hull, -18));
  }
  p.text('MARIGOLD', X + 34, Y + 39, fresh ? '#f4f1e6' : '#e6e1d2', lit);
  for (const hx of [X + 140, X + 152]) { p.R(hx, Y + 38, 5, 5, '#b9b4a4'); LR(hx + 1, Y + 39, 3, 3, lit ? '#ffd47a' : '#3a4a5c'); }
  // deck planking
  for (let i = 4; i < W - 18; i++) { const top = sheer(i); p.R(X + i, top - 3, 1, 3, '#b08a5e'); p.R(X + i, top - 3, 1, 1, '#c8a274'); }
  // saloon
  const sx = X + 22, sy = Y + 8, sw = 92, sh = 15;
  p.R(sx, sy, sw, sh, cabin);
  p.R(sx, sy, sw, 2, '#7d8a96');
  p.R(sx, sy + sh - 1, sw, 1, '#a8a294');
  p.R(sx + sw - 1, sy, 1, sh, '#b9b2a2');
  for (let wx = sx + 16; wx < sx + sw - 6; wx += 10) {
    if (lit) { p.L(wx, sy + 5, 7, 6, '#ffd47a'); p.L(wx, sy + 5, 7, 1, '#e8a850'); } else { p.R(wx, sy + 5, 7, 6, '#3a4a5c'); p.R(wx + 1, sy + 6, 2, 2, '#6d8399'); }
  }
  // lifebuoy
  p.R(sx + 4, sy + 4, 8, 8, '#f2eee2');
  p.R(sx + 6, sy + 6, 4, 4, cabin);
  for (const [dx, dy] of [[0, 3], [6, 3], [3, 0], [3, 6]]) p.R(sx + 4 + dx, sy + 4 + dy, 2, 2, '#c23a2e');
  // wheelhouse
  const wx0 = X + 100, wy0 = Y - 4;
  p.R(wx0, wy0, 30, 13, cabin);
  p.R(wx0 - 1, wy0 - 2, 32, 3, '#3a4250');
  for (const ox of [5, 13]) { p.R(wx0 + ox, wy0 + 4, 5, 5, '#8a8478'); LR(wx0 + ox + 1, wy0 + 5, 3, 3, lit ? '#ffe2a0' : '#3a4a5c'); }
  LR(wx0 + 21, wy0 + 3, 7, 6, lit ? '#ffd47a' : '#3a4a5c');
  // funnel
  p.R(X + 134, Y - 14, 11, 24, '#e0b23a');
  p.R(X + 134, Y - 14, 11, 5, '#1c1a22');
  p.R(X + 134, Y - 6, 11, 2, '#b88a24');
  p.R(X + 134, Y - 14, 2, 24, '#f0c85a');
  // railings along the deck edge
  for (let i = 6; i < W - 20; i++) {
    const top = sheer(i) - 9;
    if (i % 5 === 0) p.R(X + i, top, 1, 6, '#e8e2d2');
    p.R(X + i, top, 1, 1, '#f4f0e4');
  }
  // mooring lines to the dock bollards
  rope(p, X + 6, sheer(6) - 2, BOLLARDS[0] + 2, DOCK.y + DOCK.h - 6);
  rope(p, X + W - 22, sheer(W - 22) - 2, BOLLARDS[1] + 2, DOCK.y + DOCK.h - 6);
  // gangway with handrails
  const gx = X + 150, gTop = DOCK.y + DOCK.h, gBot = sheer(150) - 3;
  p.R(gx, gTop, 12, gBot - gTop, '#8a8478');
  for (let y = gTop; y < gBot; y += 3) p.R(gx, y, 12, 1, '#6e695e');
  p.R(gx - 1, gTop - 3, 1, gBot - gTop + 3, '#d9d3c4');
  p.R(gx + 12, gTop - 3, 1, gBot - gTop + 3, '#d9d3c4');
  if (lit) for (let wx = sx + 20; wx < sx + sw - 6; wx += 20) light(wx, sy + 40, 0, 0); // reflections only
}

function rope(p: Painter, x0: number, y0: number, x1: number, y1: number) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2;
  for (let k = 0; k <= n; k++) {
    const u = k / n;
    p.R(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u + Math.sin(u * Math.PI) * 5, 1, 1, '#c8b48a');
  }
}

function fence(p: Painter, t: Timeline) {
  const x0 = 392, x1 = 640, y = QUAY_Y - 16;
  for (let x = x0; x < x1; x++) for (let k = 0; k < 12; k++) if ((x + k) % 4 === 0 || (x - k + 400) % 4 === 0) p.R(x, y + k, 1, 1, '#7d838a');
  p.R(x0, y, x1 - x0, 1, '#4b5057');
  p.R(x0, y + 12, x1 - x0, 1, '#4b5057');
  p.g.fillStyle = SHADOW;
  p.g.fillRect(x0, y + 13, x1 - x0, 2);
  for (let x = x0; x < x1; x += 26) { p.R(x, y - 6, 3, 20, '#3a3e44'); p.R(x, y - 6, 3, 1, '#6b7178'); }
  if (t === 'baseline') { p.R(520, y - 4, 26, 14, '#d8cfb8'); p.text('KEEP', 524, y - 2, '#a8483a'); p.text('OUT', 526, y + 4, '#a8483a'); }
}

// ===================================================================== furniture

function contact(p: Painter, x: number, y: number, w: number) {
  p.g.fillStyle = SHADOW;
  p.g.fillRect(x + 1, y, w - 2, 2);
  p.g.fillRect(x, y + 1, w, 1);
}

function lamp(p: Painter, x: number, y: number, lit: boolean, light: LightFn) {
  contact(p, x - 2, y, 6);
  p.R(x, y - 22, 2, 22, '#2a2a30');
  p.R(x, y - 22, 1, 22, '#44444c');
  p.R(x - 1, y - 2, 4, 2, '#2a2a30');
  p.R(x - 2, y - 29, 6, 7, '#2a2a30');
  p.R(x - 3, y - 30, 8, 1, '#2a2a30');
  if (lit) { p.L(x - 1, y - 28, 4, 5, '#ffe2a0'); p.L(x, y - 27, 2, 3, '#fff6d8'); light(x + 1, y - 26, y + 2, 17); } else p.R(x - 1, y - 28, 4, 5, '#b8c4c8');
}

function bench(p: Painter) {
  const { x, y, w } = BENCH;
  contact(p, x, y + 7, w);
  p.R(x, y - 7, w, 2, '#6e4630');
  p.R(x, y - 7, w, 1, '#8a5a3a');
  p.R(x, y - 4, w, 1, '#6e4630');
  p.R(x, y, w, 3, '#8a5a3a');
  p.R(x, y, w, 1, '#a87650');
  for (const lx of [x + 2, x + w - 4]) p.R(lx, y - 7, 2, 15, '#2e2a26');
}

function plaque(p: Painter, fresh: boolean) {
  const { x, y } = PLAQUE;
  contact(p, x + 3, y + 20, 8);
  p.R(x + 5, y + 10, 3, 10, '#4a4036');
  p.R(x, y, 14, 11, fresh ? '#3a5f50' : '#5a4a2e');
  p.R(x + 1, y + 1, 12, 9, fresh ? '#c9a95a' : '#a8925a');
  p.R(x + 1, y + 1, 12, 1, fresh ? '#e2c47a' : '#bca670');
  for (const ly of [3, 5, 7]) p.R(x + 3, y + ly, ly === 7 ? 5 : 8, 1, fresh ? '#6e5a2c' : '#6e6040');
}

function noticeboard(p: Painter, t: Timeline, past: PastState) {
  const { x, y, w, h } = NOTICEBOARD;
  contact(p, x, y + h + 10, w);
  p.R(x + 2, y + h, 2, 10, '#3d2a1d');
  p.R(x + w - 4, y + h, 2, 10, '#3d2a1d');
  p.R(x - 1, y - 2, w + 2, 2, '#4a2e1c');
  p.R(x, y, w, h, '#5c3a24');
  p.R(x + 1, y + 1, w - 2, h - 2, '#b08a5a');
  if (t === 'p1984') { p.R(x + 3, y + 3, 16, 10, '#2a3a5c'); p.R(x + 5, y + 5, 3, 4, '#f2a24e'); p.R(x + 10, y + 6, 7, 1, '#efe6cf'); p.R(x + 10, y + 9, 5, 1, '#efe6cf'); return; }
  p.R(x + 3, y + 3, 8, 10, '#efe6cf');
  for (const ly of [5, 7, 9]) p.R(x + 4, y + ly, 6, 1, '#8a8478');
  if (t === 'A1') {
    p.R(x + 12, y + 2, 8, 11, '#e6dcc0');
    p.R(x + 13, y + 3, 6, past.cancelMethod === 'panic' ? 1 : 2, '#2a2a2a');
    for (const ly of [7, 9, 11]) p.R(x + 13, y + ly, 6, 1, '#7a7468');
  } else p.R(x + 13, y + 4, 6, 6, '#e8d9a8');
}

function stall(p: Painter, stripe: string) {
  const { x, y, w } = STALL;
  contact(p, x, y + 27, w);
  for (let i = 0; i < w; i += 6) { p.R(x + i, y, 6, 8, (i / 6) % 2 ? '#ece4d0' : stripe); p.R(x + i, y + 8, 6, 2, (i / 6) % 2 ? '#c9c0aa' : shade(stripe, -30)); }
  p.R(x, y, w, 1, '#f6f0e0');
  p.R(x + 2, y + 10, 2, 18, '#5c3a24');
  p.R(x + w - 4, y + 10, 2, 18, '#5c3a24');
  p.R(x, y + 18, w, 9, '#7a5236');
  p.R(x, y + 18, w, 1, '#9a6e4a');
  p.R(x + 4, y + 20, 9, 4, '#8fa8b0');
  p.R(x + 16, y + 20, 10, 4, '#6f8f74');
  p.R(x + 28, y + 20, 8, 4, '#c9a95a');
}

function crates(p: Painter) {
  const { x, y } = CRATES;
  contact(p, x, y + 10, 36);
  for (const [cx, cy] of [[x, y], [x + 13, y], [x + 6, y - 9]]) { p.R(cx, cy, 12, 10, '#9a7a4e'); p.R(cx, cy, 12, 1, '#b8955f'); p.R(cx, cy + 5, 12, 1, '#6e5434'); p.R(cx + 5, cy, 1, 10, '#6e5434'); }
  p.R(x + 27, y - 4, 9, 14, '#7a4e30');
  p.R(x + 27, y - 4, 2, 14, '#94603c');
  p.R(x + 27, y - 1, 9, 1, '#3a3a40');
  p.R(x + 27, y + 6, 9, 1, '#3a3a40');
}

function brokenCrates(p: Painter) {
  const { x, y } = CRATES;
  contact(p, x, y + 10, 24);
  p.R(x, y, 12, 10, '#7f6a4e');
  p.R(x, y + 5, 12, 1, '#5a4a36');
  p.R(x + 14, y + 6, 10, 3, '#7f6a4e');
}

function booth(p: Painter, t: Timeline, light: LightFn) {
  const { x, y, w, h } = BOOTH;
  contact(p, x, y + h, w);
  p.R(x - 1, y, w + 2, 4, t === 'A2' ? '#2f7a72' : '#a8483a');
  p.R(x - 1, y, w + 2, 1, t === 'A2' ? '#4a9a90' : '#c86050');
  p.R(x + 1, y + 4, w - 2, h - 4, '#d6c9a8');
  if (t === 'p1984') { p.L(x + 4, y + 5, w - 8, 6, '#ffd47a'); light(x + w / 2, y + 8, y + h + 3, 12); } else p.R(x + 4, y + 5, w - 8, 6, '#3a4a5c');
  p.R(x + 1, y + 11, w - 2, 1, '#7a5236');
}

function weeds(p: Painter, n: number) {
  for (let i = 0; i < n; i++) {
    const x = (hash(i, 31) * 380) | 0, y = 94 + ((hash(31, i) * 52) | 0);
    p.R(x, y, 1, 3, '#5f7a4a');
    p.R(x + 2, y + 1, 1, 2, '#6f8a55');
    p.R(x + 1, y + 2, 1, 2, '#4f6a3d');
  }
}

function lanterns(p: Painter, light: LightFn) {
  const strings: [number, number, number, number][] = [[6, 64, 150, 60], [194, 60, 384, 74], [60, 66, 118, 78]];
  const cols = ['#ffd47a', '#ff8a5c', '#ffe2a0', '#f26b5b'];
  strings.forEach(([x0, y0, x1, y1], si) => {
    const sag = 9;
    for (let k = 0; k <= 1; k += 0.004) { const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k + Math.sin(k * Math.PI) * sag; p.L(x, y, 1, 1, '#1a1a1e'); }
    let n = 0;
    for (let k = 0.07; k < 1; k += 0.1) {
      const x = (x0 + (x1 - x0) * k) | 0, y = (y0 + (y1 - y0) * k + Math.sin(k * Math.PI) * sag) | 0;
      p.L(x - 1, y + 1, 3, 4, cols[(n + si) % 4]);
      p.L(x, y + 2, 1, 1, '#fff6d8');
      p.L(x - 1, y + 5, 3, 1, '#7a3a20');
      n++; // lanterns glow but cast no pools; lamps and doorways light the ground
    }
  });
}

function bunting(p: Painter) {
  const cols = ['#e05a6a', '#f2c94c', '#4a9ad8', '#f4f1e6'];
  for (const [x0, y0, x1, y1] of [[6, 64, 150, 60], [194, 60, 384, 74]] as const) {
    for (let k = 0; k <= 1; k += 0.004) p.R(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k + Math.sin(k * Math.PI) * 8, 1, 1, '#3a3a3a');
    let i = 0;
    for (let k = 0.04; k < 1; k += 0.06) {
      const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k + Math.sin(k * Math.PI) * 8;
      const c = cols[i++ % 4];
      p.R(x - 1, y + 1, 3, 2, c);
      p.R(x, y + 3, 1, 1, c);
    }
  }
}

// ===================================================================== water

function waterFrame(t: Timeline, f: number, sources: { x: number; y: number }[], has: { pier: boolean; stumps: boolean }) {
  const c = canvas();
  const p = new Painter(c, t);
  const deep = t === 'A2' ? '#2a6898' : '#285a82';
  p.R(0, WATER_Y - 2, WORLD.w, WORLD.h - WATER_Y + 2, deep);
  p.R(0, WATER_Y - 2, WORLD.w, 6, shade(deep, -18)); // shade under the quay
  // sparse, short ripple dashes: calm water, not noise
  for (let y = WATER_Y + 8; y < WORLD.h; y += 5) {
    for (let x = 0; x < WORLD.w; x += 2) {
      const v = Math.sin((x + f * 4) * 0.09 + y * 2.3) + Math.sin(x * 0.031 - y * 0.9 + f * 0.8);
      if (v > 1.86 && hash(x, y) < 0.6) p.R(x, y, 4, 1, shade(deep, 30));
    }
  }
  const posts: [number, number][] = [];
  if (has.pier) posts.push([PIER.x - 3, PIER.y + 24], [PIER.x + PIER.w, PIER.y + 44], [PLATFORM.x, PLATFORM.y + PLATFORM.h + 2], [PLATFORM.x + PLATFORM.w - 3, PLATFORM.y + PLATFORM.h + 2]);
  if (has.stumps) posts.push(...STUMPS.map(([x, dy]) => [x, QUAY_Y + dy + 9] as [number, number]));
  for (const [x, y] of posts) { const o = f % 2; p.R(x - 2 - o, y, 7 + o * 2, 1, shade(deep, 44)); }
  if (t === 'p1984') {
    // reflections: thin warm broken columns under light sources near the water
    for (const l of sources) {
      if (l.y < 100) continue; // only lights near the water reflect in it
      const top = Math.max(WATER_Y + 4, l.y + 10);
      for (let y = top; y < Math.min(WORLD.h, top + 34); y += 2) {
        if (hash(y, l.x + f) > 0.6) continue;
        const jitter = Math.round(Math.sin(y * 0.7 + f * 2 + l.x) * 1.5);
        const len = 2 + ((hash(l.x + y, f) * 3) | 0);
        p.g.fillStyle = `rgba(255,196,110,${0.55 - (y - top) / 70})`;
        p.g.fillRect(Math.round(l.x - len / 2 + jitter), y, len, 1);
      }
    }
  } else {
    for (let i = 0; i < 4; i++) { const x = (hash(i, 77) * WORLD.w) | 0, y = WATER_Y + 24 + ((hash(77, i) * 70) | 0); p.L(x + f, y, 2, 1, '#f0f0f0'); p.L(x + f + 3, y, 2, 1, '#f0f0f0'); p.L(x + f + 2, y + 1, 1, 1, '#f0f0f0'); }
  }
  return c;
}

function shade(h: string, d: number) {
  const n = parseInt(h.slice(1, 7), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, v + d)).toString(16).padStart(2, '0');
  return `#${ch((n >> 16) & 255)}${ch((n >> 8) & 255)}${ch(n & 255)}`;
}
