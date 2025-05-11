import adapter from '@sveltejs/adapter-node'; // Switch to the Node adapter
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(), // Use the Node adapter for server-side deployment
  }
};

export default config;
