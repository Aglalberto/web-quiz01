import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { networkInterfaces } from 'node:os';
import { extname, join, normalize, resolve } from 'node:path';
import { WebSocketServer } from 'ws';
import { Game } from '../shared/game';
import { BANK } from '../shared/questions';
import { Hub } from './hub';

const PORT = Number(process.env.PORT) || 3000;
const FAST = process.env.FAST === '1';

// Em release (server.cjs), os arquivos do site ficam em ./public ao lado do bundle.
const HERE = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
const PUBLIC_DIR = [resolve(HERE, 'public'), resolve(process.cwd(), 'release/public')].find((d) =>
  existsSync(join(d, 'index.html')),
);

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

/** Descobre o IP do aparelho na rede Wi-Fi (funciona em PC e, quando permitido, no Android/Termux). */
export function lanAddress(): string | null {
  const candidates: string[] = [];
  try {
    for (const list of Object.values(networkInterfaces())) {
      for (const a of list ?? []) {
        if (a.family === 'IPv4' && !a.internal) candidates.push(a.address);
      }
    }
  } catch {
    // Android recente bloqueia os.networkInterfaces(); tenta via comando
    for (const cmd of ['ifconfig 2>/dev/null', 'ip -4 addr 2>/dev/null']) {
      try {
        const out = execSync(cmd, { encoding: 'utf8', timeout: 2000 });
        for (const m of out.matchAll(/inet (?:addr:)?(\d+\.\d+\.\d+\.\d+)/g)) {
          if (!m[1].startsWith('127.')) candidates.push(m[1]);
        }
        if (candidates.length) break;
      } catch {
        /* tenta o próximo */
      }
    }
  }
  const score = (ip: string) =>
    ip.startsWith('192.168.') ? 3 : ip.startsWith('10.') ? 2 : /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ? 1 : 0;
  candidates.sort((a, b) => score(b) - score(a));
  return candidates[0] ?? null;
}

const ip = process.env.PUBLIC_HOST || lanAddress();
const baseUrl = ip ? `http://${ip}:${PORT}` : `http://localhost:${PORT}`;

const game = new Game({
  bank: BANK,
  durations: FAST ? { voting: 2500, chosen: 800, question: 2500, reveal: 1200 } : undefined,
  winScore: Number(process.env.WIN_SCORE) || 15,
});

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  if (url.pathname === '/api/info') {
    res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ baseUrl }));
    return;
  }
  if (!PUBLIC_DIR) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Site não encontrado. Rode "npm run build" primeiro.');
    return;
  }
  let file = normalize(join(PUBLIC_DIR, decodeURIComponent(url.pathname)));
  if (!file.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    const s = await stat(file);
    if (s.isDirectory()) file = join(file, 'index.html');
  } catch {
    file = join(PUBLIC_DIR, 'index.html'); // rotas do app (/play)
  }
  try {
    const body = await readFile(file);
    const ext = extname(file);
    res.writeHead(200, {
      'content-type': MIME[ext] ?? 'application/octet-stream',
      'cache-control': file.includes(`${join('public', 'assets')}`) ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});

const wss = new WebSocketServer({ server, path: '/ws' });
const hub = new Hub(game, () => `${baseUrl}/play`);
wss.on('connection', (ws) => hub.add(ws));

server.listen(PORT, '0.0.0.0', () => {
  const line = '═'.repeat(52);
  console.log(`\n╔${line}╗`);
  console.log(`  🎉  QUIZ PARTY rodando!`);
  console.log(`  📺  Abra na TV:   ${baseUrl}`);
  console.log(`  📱  Celulares:    leiam o QR Code na TV`);
  if (!ip) console.log(`  ⚠️   Não achei o IP do Wi-Fi. Veja em Configurações > Wi-Fi\n      e abra http://SEU-IP:${PORT} na TV.`);
  if (FAST) console.log(`  ⚡  Modo rápido (FAST=1)`);
  console.log(`╚${line}╝\n`);
});
