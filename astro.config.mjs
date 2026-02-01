// @ts-check

import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    // @ts-expect-error - Vite plugin type mismatch between Astro and @tailwindcss/vite
    plugins: [tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
  },
  integrations: [react()],
});