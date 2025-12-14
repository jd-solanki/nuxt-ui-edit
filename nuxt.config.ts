// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $production: {
    app: {
      head: {
        script: [
          { src: 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4' },
        ],
      },
    },
  },
  ssr: false,
  css: ['~/assets/css/main.css'],
  imports: {
    dirs: [
      'constants/ui.ts',
    ],
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/ui',
    'nuxt-jsoneditor',
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
  jsoneditor: {
    componentName: 'JsonEditor',
    includeCss: true,
    options: {
      /**
       *
       * SET GLOBAL OPTIONS
       *
       */
    },
  },
})
