import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Minimal ambient type so the config can read a build-time env var without
// pulling in @types/node. Node provides the real `process` at runtime.
declare const process: { env: Record<string, string | undefined> };

// The site is published to GitHub Pages as a *project* site, served from a
// sub-path: https://hosseinorajzade.github.io/bita-memorial/
//
// Vite therefore needs `base` set to that sub-path so every generated URL
// (scripts, styles, fonts, images, the audio file) resolves correctly when the
// site is not at the domain root.
//
// In CI the workflow passes VITE_BASE from the GitHub Pages configuration
// (`actions/configure-pages` -> `base_path`), which keeps this correct even if
// the repository is renamed. Locally / as a fallback it defaults to the current
// repository path.
const base = process.env.VITE_BASE || '/bita-memorial/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: 'es2019',
    cssTarget: 'chrome80',
    assetsInlineLimit: 4096,
    modulePreload: { polyfill: false },
    reportCompressedSize: false,
  },
});
