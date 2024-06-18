import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: true },
  routeRules: {
    '/': { prerender: true },
  },
  css: [
    'bootstrap/dist/css/bootstrap.css',
    '@fortawesome/fontawesome-free/css/all.css',
    '~/assets/css/todo.css',
  ],
  plugins: [
    { src: '~/plugins/firebase', mode: 'client' },
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
});
