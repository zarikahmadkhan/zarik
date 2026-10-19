// DOM overlay: location chip, interaction hint, dialogue box, toasts. Text stays crisp at any scale.

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

export const hud = {
  chip(html: string) { $('chip').innerHTML = html; },
  hint(text: string | null) {
    const el = $('hint');
    el.style.display = text ? 'block' : 'none';
    if (text) el.innerHTML = text;
  },
  say(name: string | null, text: string, footer = '') {
    const box = $('dialog');
    box.style.display = 'block';
    $('dialog-name').textContent = name ? `${name}:` : '';
    $('dialog-text').textContent = text;
    $('dialog-foot').innerHTML = `<span class="keys"><b>[E]</b> talk · <b>[I]</b> intervene · <b>[J]</b> journal</span><span>${footer}</span>`;
  },
  close() { $('dialog').style.display = 'none'; },
  get open() { return $('dialog').style.display === 'block'; },
  toast(text: string, ms = 1800) {
    const el = $('toast');
    el.textContent = text;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
    window.setTimeout(() => el.classList.remove('show'), ms);
  },
};

/** Keep the fixed 1152x648 stage scaled to the window. */
export function fitStage() {
  const stage = $('stage');
  const fit = () => {
    const s = Math.min(window.innerWidth / 1152, window.innerHeight / 648);
    stage.style.transform = `scale(${s})`;
  };
  window.addEventListener('resize', fit);
  fit();
}
