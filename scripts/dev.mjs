// Modo desenvolvimento: servidor (tsx watch) + Vite com hot reload.
import { spawn } from 'node:child_process';

const run = (cmd, args, env = {}) =>
  spawn(cmd, args, { stdio: 'inherit', shell: true, env: { ...process.env, ...env } });

const server = run('npx', ['tsx', 'watch', 'server/index.ts']);
const vite = run('npx', ['vite']);
const stop = () => {
  server.kill();
  vite.kill();
  process.exit();
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
