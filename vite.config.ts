import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  resolve: {
    alias: {
      // Polyfill crypto using crypto-browserify
      crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
      stream: path.resolve(__dirname, 'node_modules/stream-browserify')
    }
  },
  optimizeDeps: {
    include: ['crypto-browserify', 'stream-browserify']
  },
  define: {
    'process.env': {}
  }
});
