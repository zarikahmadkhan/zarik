// Low-level pixel painting: colour grading per timeline, rect fills, a 3x5 sign font.
import type { Timeline } from '../state/past';

type RGB = [number, number, number];

const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1, 7), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: RGB, b: RGB, t: number): RGB => a.map((v, i) => Math.round(v + (b[i] - v) * t)) as RGB;
const lum = (c: RGB) => (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11);

/** Each timeline has its own light: warm-lit night, flat overcast, dusty, bright. */
const GRADES: Record<Timeline, (c: RGB) => RGB> = {
  p1984: (c) => mix(mix(c, [lum(c), lum(c), lum(c)], 0.15), [20, 28, 60], 0.56),
  baseline: (c) => {
    const l = lum(c);
    return mix(mix(c, [l, l + 3, l + 9], 0.32), [146, 154, 162], 0.14);
  },
  A1: (c) => {
    const l = lum(c);
    return mix(mix(c, [l + 6, l + 2, l - 4], 0.25), [162, 150, 136], 0.12);
  },
  A2: (c) => mix(c.map((v) => Math.min(255, Math.round((v - 128) * 1.08 + 134))) as RGB, [255, 236, 200], 0.05),
};

export const hash = (x: number, y: number) => {
  let n = x * 374761393 + y * 668265263;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
};

export class Painter {
  readonly g: CanvasRenderingContext2D;
  private cache = new Map<string, string>();
  constructor(readonly canvas: HTMLCanvasElement, readonly timeline: Timeline) {
    this.g = canvas.getContext('2d')!;
  }
  get night() { return this.timeline === 'p1984'; }

  col(h: string): string {
    let v = this.cache.get(h);
    if (!v) {
      const c = GRADES[this.timeline](hex(h));
      v = `rgb(${c.join(',')})`;
      this.cache.set(h, v);
    }
    return v;
  }
  /** Graded fill. */
  R(x: number, y: number, w: number, h: number, c: string) {
    this.g.fillStyle = this.col(c);
    this.g.fillRect(x | 0, y | 0, w | 0, h | 0);
  }
  /** Ungraded fill — for light sources that must glow through the grade. */
  L(x: number, y: number, w: number, h: number, c: string) {
    this.g.fillStyle = c;
    this.g.fillRect(x | 0, y | 0, w | 0, h | 0);
  }
  text(s: string, x: number, y: number, c: string, lit = false) {
    for (const ch of s.toUpperCase()) {
      const gl = FONT[ch] ?? FONT[' '];
      for (let i = 0; i < 15; i++) if (gl[i] === '#') (lit ? this.L : this.R).call(this, x + (i % 3), y + ((i / 3) | 0), 1, 1, c);
      x += 4;
    }
  }
  static textWidth(s: string) { return s.length * 4 - 1; }
}

/**
 * A hard-edged pool of light on the ground: two flat bands with a dithered rim.
 * Deliberately not a soft gradient — overlapping fuzzy circles muddy pixel art.
 */
export function pool(g: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, rgb = '255,186,84') {
  for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) {
    const d = (x * x) / (rx * rx) + (y * y) / (ry * ry);
    if (d > 1) continue;
    if (d > 0.62 && (x + y) % 2) continue;
    if (d > 0.85 && (x * 3 + y) % 4) continue;
    g.fillStyle = `rgba(${rgb},${d < 0.12 ? 0.36 : d < 0.36 ? 0.24 : 0.13})`;
    g.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
  }
}

const rows = (...r: string[]) => r.join('');
const FONT: Record<string, string> = {
  A: rows('.#.', '#.#', '###', '#.#', '#.#'), B: rows('##.', '#.#', '##.', '#.#', '##.'), C: rows('.##', '#..', '#..', '#..', '.##'),
  D: rows('##.', '#.#', '#.#', '#.#', '##.'), E: rows('###', '#..', '##.', '#..', '###'), F: rows('###', '#..', '##.', '#..', '#..'),
  G: rows('.##', '#..', '#.#', '#.#', '.##'), H: rows('#.#', '#.#', '###', '#.#', '#.#'), I: rows('###', '.#.', '.#.', '.#.', '###'),
  J: rows('..#', '..#', '..#', '#.#', '.#.'), K: rows('#.#', '#.#', '##.', '#.#', '#.#'), L: rows('#..', '#..', '#..', '#..', '###'),
  M: rows('#.#', '###', '###', '#.#', '#.#'), N: rows('##.', '#.#', '#.#', '#.#', '#.#'), O: rows('.#.', '#.#', '#.#', '#.#', '.#.'),
  P: rows('##.', '#.#', '##.', '#..', '#..'), Q: rows('.#.', '#.#', '#.#', '##.', '.##'), R: rows('##.', '#.#', '##.', '#.#', '#.#'),
  S: rows('.##', '#..', '.#.', '..#', '##.'), T: rows('###', '.#.', '.#.', '.#.', '.#.'), U: rows('#.#', '#.#', '#.#', '#.#', '###'),
  V: rows('#.#', '#.#', '#.#', '#.#', '.#.'), W: rows('#.#', '#.#', '###', '###', '#.#'), X: rows('#.#', '#.#', '.#.', '#.#', '#.#'),
  Y: rows('#.#', '#.#', '.#.', '.#.', '.#.'), Z: rows('###', '..#', '.#.', '#..', '###'),
  '0': rows('###', '#.#', '#.#', '#.#', '###'), '1': rows('.#.', '##.', '.#.', '.#.', '###'), '2': rows('##.', '..#', '.#.', '#..', '###'),
  '3': rows('##.', '..#', '.#.', '..#', '##.'), '4': rows('#.#', '#.#', '###', '..#', '..#'), '5': rows('###', '#..', '##.', '..#', '##.'),
  '6': rows('.##', '#..', '###', '#.#', '###'), '7': rows('###', '..#', '.#.', '.#.', '.#.'), '8': rows('###', '#.#', '###', '#.#', '###'),
  '9': rows('###', '#.#', '###', '..#', '##.'), '.': rows('...', '...', '...', '...', '.#.'), '-': rows('...', '...', '###', '...', '...'),
  '&': rows('.#.', '#.#', '.#.', '#.#', '.##'), "'": rows('.#.', '.#.', '...', '...', '...'), ' ': rows('...', '...', '...', '...', '...'),
};
