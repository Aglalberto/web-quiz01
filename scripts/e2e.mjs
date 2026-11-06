// Teste ponta a ponta: broker MQTT local + site estático (dist/), abre a TV e N celulares,
// joga uma partida completa e salva screenshots em ./screenshots.
// Uso: npm run build && node scripts/e2e.mjs [numJogadores=3]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { createRequire } from 'node:module';
import { startBroker } from './broker.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');

const N = Number(process.argv[2] || 3);
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

// servidor estático simples para dist/ (como o GitHub Pages, num subcaminho)
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const site = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  let path = url.pathname.replace(/^\/web-quiz01/, '') || '/';
  if (path.endsWith('/')) path += 'index.html';
  const file = join('dist', path);
  if (!existsSync(file)) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(await readFile(file));
});
await new Promise((r) => site.listen(4173, r));
const broker = await startBroker(8884);
const BASE = 'http://localhost:4173/web-quiz01/';
const DEBUG = process.env.DEBUG === '1';
if (DEBUG) {
  const mqtt = createRequire(import.meta.url)('mqtt');
  const spy = mqtt.connect(broker.url);
  spy.on('connect', () => spy.subscribe('#'));
  spy.on('message', (t, p) => {
    const d = JSON.parse(p.toString());
    if (t.endsWith('/up')) console.log('UP', d.from.slice(0, 5), d.msg.type);
    else if (t.endsWith('/state')) console.log('STATE', d.phase, d.players.map((x) => `${x.name}:${x.id.slice(0, 5)}:${x.connected}`).join(' '));
  });
}

const browser = await chromium.launch();
const cleanup = async () => {
  await browser.close();
  await broker.close();
  site.close();
};
let debugPages = [];
const fail = async (msg) => {
  console.error('✗', msg);
  for (const [i, pg] of debugPages.entries()) await pg.screenshot({ path: `${OUT}/falha-${i}.png` }).catch(() => {});
  await cleanup();
  process.exit(1);
};

try {
  const tv = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  tv.on('pageerror', (e) => console.error('TV pageerror:', e.message));
  await tv.goto(`${BASE}?broker=${encodeURIComponent(broker.url)}&fast=1&vitoria=${process.env.WIN_SCORE || 4}&nova=1`);
  await tv.waitForSelector('canvas');
  if ((await tv.locator('button, input, a').count()) > 0) await fail('A TV não deveria ter elementos clicáveis');
  const code = (await tv.locator('text=/^Sala [A-Z0-9]{5}$/').innerText()).split(' ')[1];
  const joinUrl = `${BASE}?sala=${code}&broker=${encodeURIComponent(broker.url)}`;
  await tv.screenshot({ path: `${OUT}/tv-lobby-vazio.png` });

  const names = ['Ana', 'Beto', 'Caio', 'Duda', 'Edu', 'Fê', 'Gabi', 'Hugo'];
  const phones = [];
  for (let i = 0; i < N; i++) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => console.error(`Celular ${i} pageerror:`, e.message));
    p.on('dialog', (d) => d.accept());
    await p.goto(joinUrl);
    await p.fill('#name', names[i]);
    await p.click('button[type=submit]');
    await p.waitForSelector('text=Você está dentro!', { timeout: 15000 });
    phones.push(p);
  }
  debugPages = [tv, ...phones];
  await tv.waitForTimeout(500);
  await tv.screenshot({ path: `${OUT}/tv-lobby.png` });
  await phones[0].screenshot({ path: `${OUT}/phone-host-lobby.png` });

  // reconexão: recarrega um celular e confirma que volta como o mesmo jogador
  if (N > 1) {
    await phones[1].reload();
    await phones[1].waitForSelector('text=Você está dentro!', { timeout: 15000 });
  }

  // a TV recarrega no lobby e a sala continua a mesma, com todos dentro
  await tv.goto(`${BASE}?broker=${encodeURIComponent(broker.url)}&fast=1&vitoria=${process.env.WIN_SCORE || 4}`);
  await tv.waitForSelector(`text=Sala ${code}`);
  await tv.waitForSelector(`text=${N}/8 jogadores`);

  // celulares dão sinal de vida em até ~4 s
  await phones[0].waitForSelector('button:has-text("COMEÇAR!"):not([disabled])', { timeout: 15000 });
  await phones[0].click('text=COMEÇAR!');
  const shots = new Set();
  const snap = async (key, page, file) => {
    if (shots.has(key)) return;
    shots.add(key);
    await page.screenshot({ path: `${OUT}/${file}.png` });
  };

  const deadline = Date.now() + 180_000;
  let phase = '';
  while (Date.now() < deadline) {
    if (await tv.locator('text=venceu!').count()) break;
    const voting = await tv.locator('text=Escolham o tema!').count();
    const question = await tv.locator('text=/Pergunta \\d\\/3|Morte súbita/').count();
    if (voting) {
      if (phase !== 'voting') {
        phase = 'voting';
        await snap('vote-p', phones[0], 'phone-votacao');
        for (const [i, p] of phones.entries()) {
          const btns = p.locator('main button');
          if (await btns.count()) await btns.nth(i % 2).click().catch(() => {});
        }
        await snap('vote', tv, 'tv-votacao');
      }
    } else if (question) {
      const reveal = await tv.locator('text=Você sabia?').count();
      if (reveal) {
        phase = 'reveal';
        await snap('reveal', tv, 'tv-revelacao');
        await snap('reveal-p', phones[0], 'phone-revelacao');
      } else if (phase !== 'question') {
        phase = 'question';
        await snap('question-p0', phones[0], 'phone-pergunta');
        for (const [i, p] of phones.entries()) {
          const btns = p.locator('main button:not([disabled])');
          const c = await btns.count();
          if (c) await btns.nth((i * 3 + Math.floor(Math.random() * 4)) % c).click().catch(() => {});
          if (i === 0) {
            await tv.waitForTimeout(150);
            await snap('question', tv, 'tv-pergunta');
          }
        }
      }
    } else if (phase !== 'other') {
      phase = 'other';
      if (await tv.locator('text=O tema escolhido foi').count()) await snap('chosen', tv, 'tv-tema');
      if (await tv.locator('text=MORTE SÚBITA').count()) await snap('sd', tv, 'tv-morte-subita');
    }
    await tv.waitForTimeout(80);
  }
  if (!(await tv.locator('text=venceu!').count())) await fail('Partida não terminou a tempo');
  await tv.waitForTimeout(1500);
  await tv.screenshot({ path: `${OUT}/tv-podio.png` });
  await phones[0].screenshot({ path: `${OUT}/phone-fim.png` });

  await phones[0].click('text=JOGAR DE NOVO');
  await tv.waitForSelector('text=Escolham o tema!');
  console.log(`✔ Partida completa com ${N} jogadores (sala ${code}). Screenshots em ./${OUT}`);
} catch (e) {
  await fail(e.stack || String(e));
}
await cleanup();
process.exit(0);
