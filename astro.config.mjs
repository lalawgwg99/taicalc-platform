import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import react from '@astrojs/react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://astro.build/config
export default defineConfig({
  site: 'https://taicalc.com',
  build: {
    format: 'file'
  },
  security: {
    checkOrigin: true,
  },
  integrations: [vue(), react()],
  vite: {
    plugins: [
      ViteImageOptimizer({
        png: {
          quality: 80,
        },
        jpeg: {
          quality: 80,
        },
        jpg: {
          quality: 80,
        },
        webp: {
          quality: 80,
        },
        avif: {
          quality: 80,
        },
      }),
    ],
    build: {
      chunkSizeWarningLimit: 1000,
    },
  },
});
