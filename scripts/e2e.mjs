// Teste ponta a ponta: sobe o servidor (modo rápido), abre a TV e N celulares,
// joga uma partida completa e salva screenshots em ./screenshots.
// Uso: npm run build && node scripts/e2e.mjs [numJogadores=3]
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const N = Number(process.argv[2] || 3);
const PORT = 3123;
const BASE = `http://localhost:${PORT}`;
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

const server = spawn('node', ['release/server.cjs'], {
  env: { ...process.env, PORT: String(PORT), FAST: process.env.SLOW ? '0' : '1', WIN_SCORE: process.env.WIN_SCORE || '4' },
  stdio: ['ignore', 'pipe', 'inherit'],
});
await new Promise((res) => server.stdout.on('data', (d) => String(d).includes('QUIZ PARTY') && res()));

const browser = await chromium.launch();
const fail = async (msg) => {
  console.error('✗', msg);
  await browser.close();
  server.kill();
  process.exit(1);
};

try {
  const tv = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await tv.goto(BASE);
  await tv.waitForSelector('canvas');
  if ((await tv.locator('button, input, a').count()) > 0) await fail('A TV não deveria ter elementos clicáveis');
  await tv.screenshot({ path: `${OUT}/tv-lobby-vazio.png` });

  const names = ['Ana', 'Beto', 'Caio', 'Duda', 'Edu', 'Fê', 'Gabi', 'Hugo'];
  const phones = [];
  for (let i = 0; i < N; i++) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true });
    const p = await ctx.newPage();
    p.on('dialog', (d) => d.accept());
    await p.goto(`${BASE}/play`);
    await p.fill('#name', names[i]);
    await p.click('button[type=submit]');
    await p.waitForSelector('text=Você está dentro!');
    phones.push(p);
  }
  await tv.waitForTimeout(400);
  await tv.screenshot({ path: `${OUT}/tv-lobby.png` });
  await phones[0].screenshot({ path: `${OUT}/phone-host-lobby.png` });
  if (N > 1) await phones[1].screenshot({ path: `${OUT}/phone-lobby.png` });

  // reconexão: recarrega o celular 2 e confirma que volta para a mesma conta
  if (N > 1) {
    await phones[1].reload();
    await phones[1].waitForSelector('text=Você está dentro!');
  }

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
        for (const [i, p] of phones.entries()) {
          const btns = p.locator('main button');
          if (await btns.count()) await btns.nth(i % 2).click().catch(() => {});
        }
        await tv.waitForTimeout(150);
        await snap('vote', tv, 'tv-votacao');
        await snap('vote-p', phones[0], 'phone-votacao');
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
        // jogador 0 sempre tenta a 1ª alternativa, os outros chutam
        for (const [i, p] of phones.entries()) {
          const btns = p.locator('main button:not([disabled])');
          const c = await btns.count();
          if (c) await btns.nth((i * 3 + Math.floor(Math.random() * 4)) % c).click().catch(() => {});
          if (i === 0) await tv.waitForTimeout(120);
          if (i === 0) await snap('question', tv, 'tv-pergunta');
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

  // jogar de novo
  await phones[0].click('text=JOGAR DE NOVO');
  await tv.waitForSelector('text=Escolham o tema!');
  console.log(`✔ Partida completa com ${N} jogadores. Screenshots em ./${OUT}`);
} catch (e) {
  await fail(e.stack || String(e));
}
await browser.close();
server.kill();
