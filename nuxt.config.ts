export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxt/content', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  ui: {
    colorMode: false
  },
  features: {
    inlineStyles: true // Inline all styles to prevent FOUC
  },
  experimental: {
    renderJsonPayloads: true, // Default in Nuxt 4
    lazyHydration: true // Default in Nuxt 4
  },
  components: {
    dirs: [
      {
        path: '~/app/components',
        pathPrefix: false
      },
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
    mongoUri:
      process.env.NUXT_MONGO_URI ||
      process.env.MONGODB_URI ||
      `mongodb://admin:${process.env.MONGO_PASSWORD || 'localpassword'}@localhost:27017/flashpage?authSource=admin`,
    klipyApiKey: process.env.NUXT_KLIPY_API_KEY || process.env.KLIPY_API_KEY || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000'
    }
  },
  typescript: {
    strict: true,
    typeCheck: process.env.NODE_ENV !== 'production',
    tsConfig: {
      compilerOptions: {
        baseUrl: '.',
        paths: {
          '~/*': ['./*'],
          '~/types': ['../types'],
          '~/types/*': ['../types/*'],
          '~/utils': ['../app/utils'],
          '~/utils/*': ['../app/utils/*'],
          '~/composables/*': ['../app/composables/*']
        }
      }
    }
  }
})
