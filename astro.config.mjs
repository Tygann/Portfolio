import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tylerkeegan.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
