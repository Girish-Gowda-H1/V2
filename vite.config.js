import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import { sentryVitePlugin } from '@sentry/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'RB_',

  // Sentry Config
  build: {
    sourcemap: true,
  },

  plugins: [
    react(),
    // eslintPlugin({
    //   cache: false,
    // }),
    sentryVitePlugin({
      org: 'royal-brothers-04',
      project: 'cdash-reactjs',
      authToken: process.env.RB_SENTRY_AUTH_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      '@components': new URL('src/ui/components', import.meta.url).pathname,
      '@assets': new URL('src/assets', import.meta.url).pathname,
      '@schemas': new URL('src/ui/form-schemas', import.meta.url).pathname,
      '@constants': new URL('src/constants', import.meta.url).pathname,
      '@hooks': new URL('src/hooks', import.meta.url).pathname,
      '@utils': new URL('src/utils', import.meta.url).pathname,
      '@config': new URL('config.js', import.meta.url).pathname,
      '@menu-items': new URL('src/menu-items', import.meta.url).pathname,
      '@context': new URL('src/context', import.meta.url).pathname,
      '@pages': new URL('src/ui/pages', import.meta.url).pathname,
    },
  },

  // For Less Preprocessor

  css: {
    preprocessorOptions: {
      less: {
        math: 'always',
        relativeUrls: true,
        javascriptEnabled: true,
      },
    },
  },
});
