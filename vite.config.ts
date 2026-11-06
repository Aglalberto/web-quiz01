import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  // caminhos relativos: funciona em https://<usuario>.github.io/<repo>/
  base: './',
  plugins: [preact()],
  build: {
    outDir: 'dist',
    // compatível com navegadores de Smart TV mais antigos (Chromium ~69+)
    target: ['es2017', 'chrome69', 'safari12'],
    cssTarget: ['chrome69', 'safari12'],
    chunkSizeWarningLimit: 1200,
  },
});
