import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: true },
  routeRules: {
    '/': { prerender: true },
  },
  css: [
    'bootstrap/dist/css/bootstrap.css',
    '@fortawesome/fontawesome-free/css/all.css',
    // Add other CSS files as needed
  ],
  plugins: [
    { src: '~/plugins/firebase', mode: 'client' },
    // Ensure your Firebase plugin is correctly referenced
  ],
  build: {
    postcss: {
      plugins: {
        'postcss-import': {},
        'postcss-url': {},
        'postcss-preset-env': {
          features: {
            customProperties: false,
          },
        },
      },
    },
  },
  pwa: {
    meta: {
      theme_color: '#ffffff', // Customize your PWA theme color
    },
    manifest: {
      name: 'NewGas',
      short_name: 'NewGas',
      description: 'NewGas',
      lang: 'en',
    },
    workbox: {
      importScripts: [
        '/service-worker.js' // Path to your service worker file in the static directory
      ],
      // Other workbox configuration options if needed
    },
  },
  router: {
    base: '~/pages/todo', // Replace with your actual base path if applicable
  }
});
