import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://scruticus.github.io',
  base: '/the-traveller',
  publicDir: './assets',
  trailingSlash: 'always',
});
