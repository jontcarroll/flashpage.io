export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false
      }
    ]
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/icon.svg' }
      ]
    }
  },
  runtimeConfig: {
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/flashpage',
    klipyApiKey: process.env.KLIPY_API_KEY || '',
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000'
    }
  }
})
