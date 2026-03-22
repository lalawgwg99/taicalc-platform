import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
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
  integrations: [vue(), tailwind(), react()],
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
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'react', 'react-dom'],
            charts: ['chart.js'],
            utils: ['decimal.js'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  },
});
