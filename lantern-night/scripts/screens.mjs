// Renders review screenshots of each timeline into docs/screens/ (npm run screens).
// Uses the globally installed Playwright + preinstalled Chromium when the local one is absent.
import { createServer } from 'vite';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(execSync('npm root -g').toString().trim() + '/playwright'); }

const SHOTS = [
  // name, query, keys to press after load
  ['01-baseline-square', 't=baseline&x=200&y=140', []],
  ['02-baseline-dell', 't=baseline&x=262&y=128', ['ArrowLeft:120', 'e']],
  ['03-1984-quay', 't=p1984&x=300&y=146', []],
  ['04-1984-mara', 't=p1984&x=544&y=160', ['e']],
  ['05-1984-pier', 't=p1984&x=166&y=170', []],
  ['06-A1-chandlery', 't=A1&method=sabotage&x=150&y=252', ['ArrowRight:500', 'e', 'e']],
  ['07-A1-square', 't=A1&method=panic&x=290&y=140', []],
  ['08-A2-terminal', 't=A2&route=dell&x=470&y=140', []],
  ['09-A2-mara', 't=A2&route=dell&x=512&y=124', ['ArrowUp:60', 'e', 'e']],
];

const out = new URL('../docs/screens/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const server = await createServer({ root: new URL('..', import.meta.url).pathname, server: { port: 5199 }, logLevel: 'error' });
await server.listen();
const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1152, height: 648 } });
page.on('pageerror', (e) => console.error('pageerror:', e.message));
for (const [name, query, keys] of SHOTS) {
  await page.goto(`http://localhost:5199/?${query}&noannounce`);
  await page.waitForFunction(() => window.game?.scene?.getScene('world')?.sys?.isActive());
  await page.waitForTimeout(700);
  for (const k of keys) {
    const [key, ms] = k.split(':');
    if (ms) { await page.keyboard.down(key); await page.waitForTimeout(Number(ms)); await page.keyboard.up(key); }
    else await page.keyboard.press(key.toUpperCase() === 'E' ? 'KeyE' : key);
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${out}${name}.png` });
  console.log('shot', name);
}
await browser.close();
await server.close();
