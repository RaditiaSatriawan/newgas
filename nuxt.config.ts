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
    { src: '~/public/firebase-messaging-sw.js', mode: 'client' },
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
  firebase: {
    config: {
      apiKey: "AIzaSyD-pOsvvcXBTuFcPo14vM7YbmpTV0DM8g0",
      authDomain: "newgas-d9d01.firebaseapp.com",
      projectId: "newgas-d9d01",
      storageBucket: "newgas-d9d01.appspot.com",
      messagingSenderId: "271282040066",
      appId: "1:271282040066:web:1782fdbad081cb930c261b",
      measurementId: "G-GGGSPQEBQP",
      databaseURL: "https://newgas-d9d01-default-rtdb.asia-southeast1.firebasedatabase.app/"
    },
    services: {
      messaging: true,
    },
  },
  router: {
    base: '/pages/todo', // Replace with your actual base path if applicable
  },
  server: {
    host: '0.0.0.0', // default: localhost
    port: 3000 // default: 3000
  }
});
