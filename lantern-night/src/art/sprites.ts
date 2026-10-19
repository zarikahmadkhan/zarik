// Character sprite sheets, painted procedurally at 16x24.
// Each person has a silhouette that survives ageing (Mara's bun, Dell's flat cap, Jun's shock of hair)
// so players recognise them across timelines. Frame order: down0 down1 up0 up1 side0 side1 (side faces right).

export const SPRITE = { w: 16, h: 24 };

type HairStyle = 'bun' | 'short' | 'shock' | 'long' | 'neat';
type Top = 'overalls' | 'waistcoat' | 'jacket' | 'coat' | 'dress' | 'uniform' | 'cardigan';

export interface Look {
  skin: string; hair: string; hairStyle: HairStyle;
  top: Top; topColor: string; accent: string; pants: string; shoes?: string;
  hat?: { kind: 'flatcap' | 'captain' | 'beanie'; color: string };
  beard?: string;
  kid?: boolean; old?: boolean;
  prop?: 'broom' | 'wrench' | 'cane' | 'satchel';
}

const INK = '#1a1620';

type Dir = 'down' | 'up' | 'side';

function shade(h: string, d: number) {
  const n = parseInt(h.slice(1, 7), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, v + d)).toString(16).padStart(2, '0');
  return `#${ch((n >> 16) & 255)}${ch((n >> 8) & 255)}${ch(n & 255)}`;
}

function paintPerson(g: CanvasRenderingContext2D, ox: number, look: Look, dir: Dir, step: number) {
  const px = (x: number, y: number, w: number, h: number, c: string) => { g.fillStyle = c; g.fillRect(ox + x, y, w, h); };
  const kid = !!look.kid;
  const legH = kid ? 4 : 5;
  const torsoH = kid ? 5 : 7;
  const footY = 22;
  const legTop = footY - legH;
  const torsoTop = legTop - torsoH;
  const headTop = torsoTop - 9 + (look.old ? 1 : 0);
  const stoop = look.old && dir === 'side' ? 1 : 0;

  // contact shadow
  g.fillStyle = 'rgba(0,0,0,0.28)';
  g.fillRect(ox + 3, footY, 10, 2);
  g.fillRect(ox + 2, footY + 1 - 1, 12, 1);

  // ---- legs ----
  const pants = look.pants, shoes = look.shoes ?? '#2a221e';
  const legs = (x: number, lift: number) => {
    px(x, legTop, 4, legH - lift, INK);
    px(x + 1, legTop, 2, legH - 1 - lift, pants);
    px(x, footY - 2 - lift, 4, 2, INK);
    px(x + 1, footY - 2 - lift, 3, 1, shoes);
  };
  if (look.top === 'dress') {
    px(4, legTop, 8, 3, INK); px(5, legTop, 6, 2, look.topColor);
    legs(5, step ? 1 : 0); legs(8, 0);
  } else if (dir === 'side') {
    if (step) { legs(4, 0); legs(8, 1); } else legs(6, 0);
  } else {
    legs(4, step ? 1 : 0);
    legs(8, 0);
  }

  // ---- torso ----
  const c = look.topColor, cd = shade(c, -34), cl = shade(c, 22);
  const tx = dir === 'side' ? 4 : 3, tw = dir === 'side' ? 8 : 10;
  px(tx, torsoTop, tw, torsoH + 1, INK);
  px(tx + 1, torsoTop, tw - 2, torsoH, c);
  px(tx + 1, torsoTop, tw - 2, 1, cl);
  if (dir !== 'up') {
    if (look.top === 'overalls') { px(tx + 2, torsoTop + 2, tw - 4, torsoH - 2, look.accent); px(tx + 3, torsoTop + 3, tw - 6, 2, c); px(tx + 2, torsoTop, 1, 2, look.accent); px(tx + tw - 3, torsoTop, 1, 2, look.accent); }
    if (look.top === 'waistcoat') { px(tx + 3, torsoTop, tw - 6, torsoH, look.accent); px(tx + tw / 2 - (dir === 'side' ? 1 : 0), torsoTop + 1, 1, torsoH - 1, cd); }
    if (look.top === 'jacket' || look.top === 'coat') { px(tx + tw / 2 - 1, torsoTop, 2, torsoH, cd); px(tx + tw / 2 - 1, torsoTop, 2, 2, look.accent); }
    if (look.top === 'uniform') { px(tx + tw / 2 - 1, torsoTop + 1, 1, torsoH - 1, look.accent); px(tx + tw / 2 + 1, torsoTop + 2, 1, 1, look.accent); px(tx + tw / 2 + 1, torsoTop + 4, 1, 1, look.accent); }
    if (look.top === 'cardigan') { px(tx + 1, torsoTop, 2, torsoH, cd); px(tx + tw - 3, torsoTop, 2, torsoH, cd); }
    if (look.top === 'dress') px(tx + 2, torsoTop + 1, tw - 4, 1, look.accent);
  }
  if (look.top === 'coat' && !kid) { px(tx, legTop, tw, 2, INK); px(tx + 1, legTop, tw - 2, 1, c); }
  // arms
  if (dir === 'side') {
    const swing = step ? 1 : 0;
    px(7 + swing, torsoTop + 1, 3, torsoH - 1, INK); px(8 + swing, torsoTop + 1, 1, torsoH - 2, cd);
    px(8 + swing, torsoTop + torsoH - 1, 2, 1, look.skin);
  } else {
    for (const ax of [tx - 1, tx + tw - 2]) { px(ax, torsoTop + 1, 3, torsoH, INK); px(ax + 1, torsoTop + 1, 1, torsoH - 1, cd); px(ax + 1, torsoTop + torsoH, 1, 1, look.skin); }
  }

  // ---- head ----
  const hx = 4 + stoop, hy = headTop;
  px(hx, hy, 8, 9, INK);
  px(hx + 1, hy + 1, 6, 8, look.skin);
  px(hx + 1, hy + 7, 6, 1, shade(look.skin, -22)); // jaw shade
  px(6 + stoop, torsoTop - 1, 4, 1, shade(look.skin, -30)); // neck
  const H = look.hair, Hd = shade(H, -30);
  if (dir === 'down') {
    px(hx + 2, hy + 4, 1, 2, INK); px(hx + 5, hy + 4, 1, 2, INK);
    if (look.beard) { px(hx + 1, hy + 6, 6, 2, look.beard); px(hx + 3, hy + 6, 2, 1, shade(look.skin, -40)); }
    else px(hx + 3, hy + 7, 2, 1, shade(look.skin, -45));
  } else if (dir === 'side') {
    px(hx + 5, hy + 4, 1, 2, INK);
    px(hx + 7, hy + 5, 1, 1, look.skin); // nose
    if (look.beard) px(hx + 3, hy + 6, 4, 2, look.beard);
  }
  // hair by style; 'up' covers the face
  const top = (rows: number) => { px(hx + 1, hy + 1, 6, rows, H); px(hx + 1, hy + 1, 6, 1, shade(H, 25)); };
  if (dir === 'up') { px(hx + 1, hy + 1, 6, 7, H); px(hx + 2, hy + 6, 4, 1, Hd); }
  switch (look.hairStyle) {
    case 'bun':
      top(3); px(hx + 1, hy + 3, 1, 3, H); px(hx + 6, hy + 3, 1, 3, H);
      px(hx + (dir === 'side' ? 0 : 2), hy - 1, 4, 2, INK); px(hx + (dir === 'side' ? 1 : 3), hy - 1, 2, 1, Hd);
      break;
    case 'short': top(2); px(hx + 1, hy + 3, 1, 2, H); px(hx + 6, hy + 3, 1, 1, H); break;
    case 'neat': top(2); px(hx + 1, hy + 3, 1, 1, H); break;
    case 'long': top(3); px(hx, hy + 2, 2, 7, H); px(hx + 6, hy + 2, 2, 7, H); if (dir === 'side') px(hx, hy + 2, 3, 8, H); break;
    case 'shock':
      top(3); px(hx, hy - 1, 3, 2, INK); px(hx + 3, hy - 2, 3, 3, INK); px(hx + 6, hy - 1, 2, 2, INK);
      px(hx + 1, hy - 1, 1, 2, H); px(hx + 4, hy - 1, 1, 2, H); px(hx + 6, hy, 1, 1, H); px(hx + 1, hy + 3, 1, 2, H);
      break;
  }
  if (look.hat) {
    const hc = look.hat.color, hl = shade(hc, 26);
    if (look.hat.kind === 'flatcap') { px(hx, hy - 1, 8, 3, INK); px(hx + 1, hy - 1, 6, 2, hc); px(hx + 1, hy - 1, 6, 1, hl); if (dir !== 'up') px(dir === 'side' ? hx + 5 : hx + 1, hy + 2, dir === 'side' ? 4 : 6, 1, shade(hc, -30)); }
    if (look.hat.kind === 'captain') { px(hx - 1, hy - 2, 10, 4, INK); px(hx, hy - 2, 8, 3, hc); px(hx, hy - 2, 8, 1, hl); if (dir !== 'up') { px(hx + 1, hy + 1, 6, 1, '#1a1a2a'); px(hx + 3, hy - 1, 2, 1, '#e6c25a'); } }
    if (look.hat.kind === 'beanie') { px(hx, hy - 1, 8, 4, INK); px(hx + 1, hy - 1, 6, 3, hc); px(hx + 1, hy + 1, 6, 1, shade(hc, -25)); }
  }

  // ---- props ----
  const bottom = footY;
  if (look.prop === 'broom') { px(13, torsoTop - 2, 1, bottom - torsoTop + 1, '#a07850'); px(12, bottom - 3, 4, 3, '#d8b26a'); px(12, bottom - 1, 4, 1, '#a88a4a'); }
  if (look.prop === 'wrench' && dir !== 'up') { px(dir === 'side' ? 9 : 12, torsoTop + torsoH - 1, 1, 4, '#c8ccd0'); px(dir === 'side' ? 8 : 11, torsoTop + torsoH + 3, 3, 1, '#c8ccd0'); }
  if (look.prop === 'cane') { px(13, torsoTop + 3, 1, bottom - torsoTop - 3, '#5a3a26'); px(12, torsoTop + 3, 2, 1, '#5a3a26'); }
  if (look.prop === 'satchel' && dir !== 'up') { px(dir === 'side' ? 3 : 2, torsoTop + 3, 3, 4, INK); px(dir === 'side' ? 4 : 3, torsoTop + 4, 2, 2, '#8a5a34'); px(tx + 2, torsoTop, 1, 3, '#8a5a34'); }
}

export function makeSheet(look: Look): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = SPRITE.w * 6;
  c.height = SPRITE.h;
  const g = c.getContext('2d')!;
  const frames: [Dir, number][] = [['down', 0], ['down', 1], ['up', 0], ['up', 1], ['side', 0], ['side', 1]];
  frames.forEach(([dir, step], i) => paintPerson(g, i * SPRITE.w, look, dir, step));
  return c;
}

// ---- cast: young and old share a silhouette ----
export const LOOKS = {
  player: { skin: '#c48a62', hair: '#3a2a22', hairStyle: 'short', top: 'coat', topColor: '#2f7f7f', accent: '#efe2c4', pants: '#2c3444', prop: 'satchel' },
  mara: { skin: '#6e4228', hair: '#1f1a18', hairStyle: 'bun', top: 'overalls', topColor: '#3a5a7a', accent: '#d9772e', pants: '#c0602a', prop: 'wrench' },
  maraOld: { skin: '#6e4228', hair: '#dcd6cc', hairStyle: 'bun', top: 'cardigan', topColor: '#d9772e', accent: '#f2d27a', pants: '#2f4a6a', old: true },
  dell: { skin: '#e0b08a', hair: '#6a4a2a', hairStyle: 'neat', top: 'waistcoat', topColor: '#efe6d2', accent: '#5a3346', pants: '#2a2a30', hat: { kind: 'flatcap', color: '#6a5a48' } },
  dellOld: { skin: '#e4b896', hair: '#ece8e0', hairStyle: 'neat', top: 'waistcoat', topColor: '#cfc8bc', accent: '#4a3a46', pants: '#2a2a30', hat: { kind: 'flatcap', color: '#8a7a66' }, old: true, prop: 'cane' },
  jun: { skin: '#c99a6e', hair: '#2a2420', hairStyle: 'shock', top: 'jacket', topColor: '#c0503a', accent: '#f0e0c0', pants: '#3a4a5a', kid: true, prop: 'broom' },
  junOld: { skin: '#c99a6e', hair: '#8a847c', hairStyle: 'shock', top: 'jacket', topColor: '#7a3a30', accent: '#c8b88a', pants: '#3a4a5a', beard: '#8a847c', hat: { kind: 'beanie', color: '#c0503a' } },
  junCaptain: { skin: '#c99a6e', hair: '#8a847c', hairStyle: 'shock', top: 'uniform', topColor: '#1f3a5c', accent: '#e6c25a', pants: '#1f2a3a', beard: '#8a847c', hat: { kind: 'captain', color: '#f4f1e6' } },
} satisfies Record<string, Look>;

export function crowdLook(i: number): Look {
  const styles: HairStyle[] = ['long', 'short', 'neat', 'long', 'bun'];
  const tops: Top[] = ['dress', 'jacket', 'coat', 'cardigan', 'jacket'];
  return {
    skin: ['#e0b08a', '#6e4228', '#c99a6e', '#a8744e', '#f0c8a0'][i % 5],
    hair: ['#2a2420', '#6a4a2a', '#a07040', '#1f1a18', '#c8a060'][(i * 3) % 5],
    hairStyle: styles[i % 5],
    top: tops[(i * 2) % 5],
    topColor: ['#7a3a48', '#3a5a4a', '#4c5a7a', '#6a5a3a', '#5a4a6a'][i % 5],
    accent: '#d8c8a8', pants: '#2a2a30',
    kid: i % 7 === 3,
    hat: i % 4 === 2 ? { kind: 'flatcap', color: '#d8c8a0' } : undefined,
  };
}
