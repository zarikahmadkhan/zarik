// The district, rendered for one timeline. Reads state; the only state it changes is travel.
import Phaser from 'phaser';
import { paintWorld } from '../art/world';
import { LOOKS, makeSheet, SPRITE, type Look } from '../art/sprites';
import { contentFor, type Npc, type Thing, type TimelineContent } from '../content/timelines';
import { derivePresent, freshPast, type PastState, type Timeline } from '../state/past';
import { hud } from '../ui/hud';
import { CLOCK_DOOR, inRect, WORLD } from '../world/layout';

export interface WorldData { timeline: Timeline; past: PastState; spawn?: { x: number; y: number }; announce?: boolean }

type Dir = 'down' | 'up' | 'left' | 'right';
const FRAME: Record<Dir, number> = { down: 0, up: 2, left: 4, right: 4 };
const SPEED = 64;
const REACH = 18;

export class WorldScene extends Phaser.Scene {
  private data_!: WorldData;
  private content!: TimelineContent;
  private player!: Phaser.GameObjects.Sprite;
  private dir: Dir = 'down';
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private talk: { target: Npc | Thing; line: number; confirmTravel: boolean } | null = null;
  private npcBoxes: { x: number; y: number }[] = [];

  constructor() { super('world'); }

  init(data: WorldData) { this.data_ = data; this.talk = null; }

  create() {
    const { timeline: t, past } = this.data_;
    this.content = contentFor(t, past);
    const key = `${t}:${past.cancelMethod}:${past.fixRoute}`;

    if (!this.textures.exists(`bg:${key}`)) {
      const art = paintWorld(t, past);
      this.textures.addCanvas(`bg:${key}`, art.bg);
      art.water.forEach((c, i) => this.textures.addCanvas(`water:${key}:${i}`, c));
      if (art.lights) this.textures.addCanvas(`lights:${key}`, art.lights);
    }
    const water = this.add.image(0, 0, `water:${key}:0`).setOrigin(0).setDepth(-2);
    let wf = 0;
    this.time.addEvent({ delay: 420, loop: true, callback: () => water.setTexture(`water:${key}:${(wf = (wf + 1) % 3)}`) });
    this.add.image(0, 0, `bg:${key}`).setOrigin(0).setDepth(-1);
    if (this.textures.exists(`lights:${key}`)) this.add.image(0, 0, `lights:${key}`).setOrigin(0).setDepth(100000).setBlendMode(Phaser.BlendModes.ADD);

    const nightTint = t === 'p1984' ? 0xb8bce0 : 0xffffff;
    this.npcBoxes = [];
    for (const n of this.content.npcs) {
      const s = this.add.sprite(n.x, n.y, this.sheet(n.id + (t === 'p1984' ? '' : `:${t}`), n.look), FRAME[n.facing ?? 'down'])
        .setOrigin(0.5, 1).setDepth(n.y).setTint(nightTint).setFlipX(n.facing === 'left');
      this.npcBoxes.push({ x: n.x, y: n.y });
      // idle breathing, offset per character so the crowd doesn't bob in sync
      this.tweens.add({ targets: s, scaleY: 1.04, duration: 900 + (n.x % 7) * 60, yoyo: true, repeat: -1, ease: 'Sine.inOut', delay: n.x % 500 });
    }

    const spawn = this.data_.spawn ?? { x: CLOCK_DOOR.x, y: CLOCK_DOOR.y + 22 };
    this.player = this.add.sprite(spawn.x, spawn.y, this.sheet('player', LOOKS.player), 0).setOrigin(0.5, 1).setTint(nightTint);
    for (const d of ['down', 'up', 'side'] as const) {
      const k = `walk-${d}`;
      if (!this.anims.exists(k)) {
        const base = d === 'down' ? 0 : d === 'up' ? 2 : 4;
        this.anims.create({ key: k, frames: [{ key: 'sheet:player', frame: base + 1 }, { key: 'sheet:player', frame: base }], frameRate: 7, repeat: -1 });
      }
    }

    const cam = this.cameras.main;
    cam.setBounds(0, 0, WORLD.w, WORLD.h).startFollow(this.player, true, 0.15, 0.15).setRoundPixels(true);
    cam.setBackgroundColor(t === 'p1984' ? '#0b1022' : '#5f7f94');
    cam.fadeIn(500, 255, 255, 255);

    const kb = this.input.keyboard!;
    this.keys = kb.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,I,J,ESC,SPACE,ENTER') as Record<string, Phaser.Input.Keyboard.Key>;
    kb.on('keydown-E', () => this.interact());
    kb.on('keydown-SPACE', () => this.interact());
    kb.on('keydown-ENTER', () => this.interact());
    kb.on('keydown-ESC', () => this.endTalk());
    kb.on('keydown-I', () => { if (!this.talk) hud.toast('Typed interventions arrive in M2', 1600); });
    kb.on('keydown-J', () => { if (!this.talk) hud.toast('The journal arrives in M2', 1600); });

    hud.chip(this.content.chip);
    hud.close();
    if (this.data_.announce) hud.toast(this.content.arrival, 2200);
    this.game.events.emit('timeline', this.data_);
  }

  private sheet(id: string, look: Look) {
    const key = `sheet:${id}`;
    if (!this.textures.exists(key)) {
      const tex = this.textures.addCanvas(key, makeSheet(look))!;
      for (let i = 0; i < 6; i++) tex.add(i, 0, i * SPRITE.w, 0, SPRITE.w, SPRITE.h);
    }
    return key;
  }

  update(_: number, dtMs: number) {
    if (this.talk) { this.player.anims.stop(); this.player.setFrame(FRAME[this.dir]); return; }
    const k = this.keys;
    const vx = (k.RIGHT.isDown || k.D.isDown ? 1 : 0) - (k.LEFT.isDown || k.A.isDown ? 1 : 0);
    const vy = (k.DOWN.isDown || k.S.isDown ? 1 : 0) - (k.UP.isDown || k.W.isDown ? 1 : 0);
    const dt = Math.min(dtMs, 50) / 1000;
    if (vx || vy) {
      const n = vx && vy ? Math.SQRT1_2 : 1;
      const nx = this.player.x + vx * SPEED * n * dt, ny = this.player.y + vy * SPEED * n * dt;
      if (this.free(nx, this.player.y)) this.player.x = nx;
      if (this.free(this.player.x, ny)) this.player.y = ny;
      this.dir = vy < 0 ? 'up' : vy > 0 ? 'down' : vx < 0 ? 'left' : 'right';
      if (vx) this.dir = vx < 0 ? 'left' : 'right';
      this.player.setFlipX(this.dir === 'left');
      this.player.anims.play(`walk-${this.dir === 'left' || this.dir === 'right' ? 'side' : this.dir}`, true);
    } else {
      this.player.anims.stop();
      this.player.setFrame(FRAME[this.dir]);
    }
    this.player.setDepth(this.player.y);
    const near = this.nearest();
    hud.hint(near ? `<b>[E]</b> ${'name' in near ? `Talk · ${near.name}` : near.verb}` : null);
  }

  /** Feet box must sit on walkable ground and clear of blockers and people. */
  private free(x: number, y: number) {
    const pts: [number, number][] = [[x - 4, y - 3], [x + 3, y - 3], [x - 4, y], [x + 3, y]];
    const c = this.content;
    return pts.every(([px, py]) => c.walkable.some((r) => inRect(r, px, py)) && !c.blockers.some((r) => inRect(r, px, py)))
      && !this.npcBoxes.some((b) => Math.abs(b.x - x) < 10 && y > b.y - 5 && y < b.y + 3);
  }

  private nearest(): Npc | Thing | null {
    let best: Npc | Thing | null = null, bd = REACH;
    for (const o of [...this.content.npcs, ...this.content.things]) {
      const d = Math.hypot(o.x - this.player.x, o.y - this.player.y);
      if (d < bd) { bd = d; best = o; }
    }
    return best;
  }

  private interact() {
    if (this.talk) {
      const { target, line, confirmTravel } = this.talk;
      if (confirmTravel) return this.travel();
      if (line + 1 < target.lines.length) { this.talk.line++; this.show(); return; }
      if ('travel' in target && target.travel) { this.talk.confirmTravel = true; this.show(); return; }
      return this.endTalk();
    }
    const near = this.nearest();
    if (!near) return;
    this.talk = { target: near, line: 0, confirmTravel: false };
    if ('name' in near) this.turnToward(near);
    this.show();
  }

  private show() {
    if (!this.talk) return;
    const { target, line, confirmTravel } = this.talk;
    const name = 'name' in target ? target.name : null;
    if (confirmTravel) {
      const to = this.data_.timeline === 'p1984' ? 'back to the present' : 'into Lantern Night, 1984';
      hud.say(null, `Your hand is on the clock. Its hum climbs. Go ${to}?`, '[E] go · [Esc] step back');
      return;
    }
    const more = line + 1 < target.lines.length || ('travel' in target && target.travel);
    hud.say(name, target.lines[line], more ? '[E] ▸' : '[E] close');
  }

  private endTalk() { this.talk = null; hud.close(); }

  private turnToward(n: Npc) {
    const dx = this.player.x - n.x, dy = this.player.y - n.y;
    this.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'left' : 'right') : dy > 0 ? 'up' : 'down';
  }

  /** D3: every trip into 1984 starts from recorded history. Coming back derives the present. */
  travel(past?: PastState) {
    this.endTalk();
    const goingBack = this.data_.timeline !== 'p1984';
    const nextPast = past ?? (goingBack ? freshPast() : this.data_.past);
    const timeline: Timeline = goingBack ? 'p1984' : derivePresent(nextPast);
    this.cameras.main.fadeOut(450, 255, 255, 255);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart({ timeline, past: nextPast, announce: true } satisfies WorldData));
  }

  jump(data: WorldData) { this.scene.restart(data); }
  get state() { return this.data_; }
}
