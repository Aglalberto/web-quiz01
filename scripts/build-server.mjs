// Empacota o servidor (com a lib ws e o banco de perguntas) num único arquivo:
// release/server.cjs — no Android basta "node release/server.cjs", sem npm install.
import { build } from 'esbuild';

await build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  outfile: 'release/server.cjs',
  external: ['bufferutil', 'utf-8-validate'],
  legalComments: 'none',
  banner: { js: '// Quiz Party — servidor gerado por "npm run build". Não edite.' },
});
console.log('✔ release/server.cjs');
