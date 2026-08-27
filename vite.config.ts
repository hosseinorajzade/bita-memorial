import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// A relative base ('./') makes the built site work identically whether it is
// served from a user/organization GitHub Pages site (https://user.github.io/),
// a project site (https://user.github.io/repo/), a custom domain, or opened
// locally. No environment variables or repo-name juggling required.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2019',
    cssTarget: 'chrome80',
    assetsInlineLimit: 4096,
    modulePreload: { polyfill: false },
    reportCompressedSize: false,
  },
});
