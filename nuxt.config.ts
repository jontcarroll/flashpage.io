export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    modules: ['@nuxtjs/tailwindcss'],
    css: ['~/assets/css/main.css'],
    pages: false,
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
        giphyApiKey: process.env.GIPHY_API_KEY || '',
        public: {
            siteUrl: process.env.SITE_URL || 'http://localhost:3000'
        }
    },
    nitro: {
        experimental: {
            wasm: true
        }
    },
    typescript: {
        strict: true,
        typeCheck: true,
        tsConfig: {
            compilerOptions: {
                paths: {
                    '~/types': ['./types'],
                    '~/types/*': ['./types/*']
                }
            }
        }
    },
})
