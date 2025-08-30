// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@vueuse/nuxt'
  ],

  // CSS
  css: [
    '~/assets/styles/main.css'
  ],

  // App config
  app: {
    head: {
      title: 'EduShop Sénégal - Fournitures Scolaires',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Fournitures scolaires Sénégal - Packs scolaires complets pour CP, CE, Collège, Lycée. Livraison Dakar et régions.' 
        },
        { name: 'keywords', content: 'fournitures scolaires Sénégal, packs scolaires Dakar, vente cahiers stylos Sénégal' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Tailwind configuration
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: {
              green: '#16a34a',
              yellow: '#facc15',
              'dark-green': '#15803d',
              'light-green': '#dcfce7'
            }
          },
          animation: {
            'fade-in-up': 'fadeInUp 0.6s ease-out',
            'pulse-btn': 'pulse 2s infinite',
            'slide-down': 'slideDown 0.8s ease-out'
          },
          keyframes: {
            fadeInUp: {
              '0%': { opacity: '0', transform: 'translateY(30px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' }
            },
            slideDown: {
              '0%': { opacity: '0', transform: 'translateY(-20px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' }
            }
          }
        }
      }
    }
  },

  // Runtime config
  runtimeConfig: {
    paytech: {
      apiKey: process.env.PAYTECH_API_KEY,
      secretKey: process.env.PAYTECH_SECRET_KEY,
      sandbox: process.env.NODE_ENV !== 'production'
    },
    public: {
      paytechSandbox: process.env.NODE_ENV !== 'production',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      payTechApiKey: process.env.PAYTECH_API_KEY,
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
      facebookPixelId: process.env.FACEBOOK_PIXEL_ID
    }
  },

  // SSR
  ssr: true,

  // Nitro config for deployment
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    },
    compatibilityDate: '2025-08-27'
  }
})