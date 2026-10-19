// World geometry in low-res pixels. Art and collision both read from here so they can't drift apart.

export const WORLD = { w: 640, h: 264 };
export const VIEW = { w: 384, h: 216, zoom: 3 };

export interface Rect { x: number; y: number; w: number; h: number }
export const rect = (x: number, y: number, w: number, h: number): Rect => ({ x, y, w, h });
export const inRect = (r: Rect, px: number, py: number) => px >= r.x && px < r.x + r.w && py >= r.y && py < r.y + r.h;

export const FACADE_BOTTOM = 88;
export const QUAY_Y = 150; // top of quay wall
export const WATER_Y = 160;

export const HOUSES = [
  { x: 0, w: 74, roof: '#a8483a', roofH: 28, top: 2, door: 30, windows: [10, 52] },
  { x: 74, w: 68, roof: '#5f4f8e', roofH: 24, top: 6, door: 28, windows: [8, 48] },
  { x: 200, w: 70, roof: '#a8483a', roofH: 26, top: 4, door: 22, windows: [8, 46] },
  { x: 270, w: 60, roof: '#4f7a5a', roofH: 22, top: 8, door: 24, windows: [6, 42] },
];
export const TOWER = rect(152, 0, 40, FACADE_BOTTOM);
export const CLOCK_DOOR = { x: 172, y: 92 };
export const TERMINAL = rect(384, 8, 256, 86); // facade bottom 94
export const TERMINAL_DOOR = { x: 496, y: 98 };
export const BOOTH = rect(458, 82, 22, 16);

export const PIER = rect(150, QUAY_Y, 28, 44);
export const PLATFORM = rect(114, 192, 100, 66);
export const CHANDLERY = rect(122, 188, 84, 52); // building incl. roof; facade bottom 240
export const CHANDLERY_DOOR = { x: 164, y: 244 };
export const DOCK = rect(400, QUAY_Y - 2, 240, 16);
export const FERRY = rect(428, 174, 186, 66);

export const BENCH = rect(220, 120, 28, 8);
export const PLAQUE = { x: 202, y: 108 };
export const NOTICEBOARD = rect(300, 98, 22, 16);
export const STALL = rect(36, 100, 40, 28);
export const LAMPS = [{ x: 118, y: 104 }, { x: 290, y: 132 }, { x: 372, y: 104 }, { x: 600, y: 132 }];
/** Stumps of the collapsed pier (baseline), as offsets below the quay. */
export const STUMPS: [number, number][] = [[148, 24], [177, 30], [146, 52], [178, 58], [122, 72], [206, 76], [150, 90], [190, 96]];
export const CRATES = rect(598, 96, 36, 14);
export const SHRUBS = rect(334, 62, 46, 34);
