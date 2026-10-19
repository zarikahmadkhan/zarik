import Phaser from 'phaser';
import '@fontsource/pixelify-sans/400.css';
import '@fontsource/silkscreen/400.css';
import { WorldScene, type WorldData } from './scenes/WorldScene';
import { freshPast, type CancelMethod, type FixRoute, type PastState, type Timeline } from './state/past';
import { fitStage } from './ui/hud';
import { VIEW } from './world/layout';
import { mountDebug } from './debug';

// URL params let screenshots and playtests start anywhere: ?t=A1&method=panic&x=170&y=280&debug
const q = new URLSearchParams(location.search);
const timeline = (q.get('t') as Timeline) ?? 'baseline';
const past: PastState = freshPast();
if (timeline === 'A1') { past.crossing = 'cancelled'; past.cancelMethod = (q.get('method') as CancelMethod) ?? 'sabotage'; }
if (timeline === 'A2') { past.coupling = 'replaced'; past.fixRoute = (q.get('route') as FixRoute) ?? 'mara'; }
const spawn = q.has('x') ? { x: Number(q.get('x')), y: Number(q.get('y')) } : undefined;

fitStage();
const start: WorldData = { timeline, past, spawn, announce: !q.has('noannounce') };

document.fonts.ready.then(() => {
  const game = new Phaser.Game({
    type: Phaser.CANVAS,
    parent: 'game',
    width: VIEW.w,
    height: VIEW.h,
    zoom: VIEW.zoom,
    pixelArt: true,
    backgroundColor: '#000000',
    scene: [],
    banner: false,
  });
  game.scene.add('world', WorldScene, true, start);
  mountDebug(game, q.has('debug'));
  (window as unknown as { game: Phaser.Game }).game = game;
});
