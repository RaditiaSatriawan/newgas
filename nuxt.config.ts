// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },
  css: [
    'bootstrap/dist/css/bootstrap.css',
    '@fortawesome/fontawesome-free/css/all.css',
    '~/assets/css/todo.css' // Custom styles
  ],
  build: {
    postcss: {
      plugins: {
        'postcss-import': {},
        'postcss-url': {},
        'postcss-preset-env': {
          features: {
            customProperties: false
          }
        }
      }
    }
  }
});
