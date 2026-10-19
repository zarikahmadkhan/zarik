// Debug panel (toggle with backtick). Stands in for interventions until M2: set the past directly, or jump.
import type Phaser from 'phaser';
import type { WorldData, WorldScene } from './scenes/WorldScene';
import { derivePresent, freshPast, type CancelMethod, type FixRoute, type Timeline } from './state/past';

export function mountDebug(game: Phaser.Game, visible: boolean) {
  const el = document.getElementById('debug')!;
  const scene = () => game.scene.getScene('world') as WorldScene;
  el.style.display = visible ? 'block' : 'none';
  window.addEventListener('keydown', (e) => { if (e.key === '`') el.style.display = el.style.display === 'none' ? 'block' : 'none'; });

  const render = (d: WorldData) => {
    const p = d.past;
    el.innerHTML = `
      <div class="row">DEBUG · now: <b>${d.timeline}</b> · present from this past: <b>${derivePresent(p)}</b></div>
      <div class="row">jump: ${(['p1984', 'baseline', 'A1', 'A2'] as Timeline[]).map((t) => `<button data-jump="${t}">${t}</button>`).join('')}</div>
      <div class="row">simulate 1984 outcome:
        <select data-k="cancelMethod">${['', 'sabotage', 'panic', 'adrift'].map((v) => `<option ${p.cancelMethod === (v || null) ? 'selected' : ''} value="${v}">${v ? 'cancel: ' + v : 'not cancelled'}</option>`).join('')}</select>
        <select data-k="fixRoute">${['', 'mara', 'jun', 'dell'].map((v) => `<option ${p.fixRoute === (v || null) ? 'selected' : ''} value="${v}">${v ? 'fixed via ' + v : 'not fixed'}</option>`).join('')}</select>
      </div>`;
    el.querySelectorAll<HTMLButtonElement>('[data-jump]').forEach((b) => (b.onclick = () => {
      const t = b.dataset.jump as Timeline;
      const past = t === 'p1984' || t === 'baseline' ? freshPast() : { ...p };
      if (t === 'A1') { past.crossing = 'cancelled'; past.cancelMethod ??= 'sabotage'; }
      if (t === 'A2') { past.crossing = 'sailed'; past.cancelMethod = null; past.coupling = 'replaced'; past.fixRoute ??= 'mara'; }
      scene().jump({ timeline: t, past, announce: true });
    }));
    el.querySelectorAll<HTMLSelectElement>('select').forEach((s) => (s.onchange = () => {
      const cur = scene().state;
      const past = { ...cur.past };
      if (s.dataset.k === 'cancelMethod') { past.cancelMethod = (s.value || null) as CancelMethod; past.crossing = s.value ? 'cancelled' : 'sailed'; }
      else { past.fixRoute = (s.value || null) as FixRoute; past.coupling = s.value ? 'replaced' : 'cracked'; }
      // In 1984 this only changes what the clock will return you to; in a present it re-renders that present.
      if (cur.timeline === 'p1984') { cur.past = past; render(cur); } else scene().jump({ timeline: derivePresent(past), past });
    }));
  };
  game.events.on('timeline', render);
}
