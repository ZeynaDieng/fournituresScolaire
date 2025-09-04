// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],
  ssr: true,

  css: ["@/assets/css/main.css"],
  typescript: {
    strict: true,
    typeCheck: true,
  },
  sourcemap: {
    server: false,
    client: false,
  },
  app: {
    head: {
      title: "EduShop Sénégal - Fournitures Scolaires",
      htmlAttrs: {
        lang: "fr",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Votre fournisseur de fournitures scolaires au Sénégal. Packs scolaires complets pour tous les niveaux. Livraison partout au Sénégal.",
        },
        { name: "format-detection", content: "telephone=yes" },
        { name: "theme-color", content: "#059669" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "EduShop Sénégal" },
        { property: "og:locale", content: "fr_FR" },
        {
          name: "keywords",
          content:
            "fournitures scolaires Sénégal, packs scolaires Dakar, vente cahiers stylos Sénégal",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "manifest", href: "/manifest.json" },
        { rel: "apple-touch-icon", href: "/icons/icon-512x512.svg" },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
          crossorigin: "anonymous",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
          media: "print",
          onload: "this.media='all'",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  generate: {
    routes: ["/"],
  },
  routeRules: {
    "/about": { prerender: false },
    "/paiement/**": { ssr: false },
    "/api/**": { cors: true },
  },
  build: {
    transpile: ["@heroicons/vue"],
  },
  postcss: {
    plugins: {
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
      ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
    },
  },
  nitro: {
    compressPublicAssets: true,
    minify: false, // Désactivé temporairement pour debug
    prerender: {
      ignore: ["/"],
      crawlLinks: false,
      routes: [],
    },
  },
  devServer: {
    port: 3000,
    host: "0.0.0.0",
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: {
              green: "#16a34a",
              yellow: "#facc15",
              "dark-green": "#15803d",
              "light-green": "#dcfce7",
            },
          },
          animation: {
            "fade-in-up": "fadeInUp 0.6s ease-out",
            "pulse-btn": "pulse 2s infinite",
            "slide-down": "slideDown 0.8s ease-out",
            float: "float 6s ease-in-out infinite",
            "float-delayed": "float 8s ease-in-out infinite 2s",
          },
          keyframes: {
            fadeInUp: {
              "0%": { opacity: "0", transform: "translateY(30px)" },
              "100%": { opacity: "1", transform: "translateY(0)" },
            },
            slideDown: {
              "0%": { opacity: "0", transform: "translateY(-20px)" },
              "100%": { opacity: "1", transform: "translateY(0)" },
            },
            float: {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
          },
          backgroundImage: {
            "grid-white":
              "url(\"data:image/svg+xml,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3e%3cpath d='m 40 0 l 0 40 m -40 0 l 40 0' fill='none' stroke='white' stroke-width='1' opacity='0.1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e\")",
            "fourniture-pattern": "url('/images/fournitureBanniere.png')",
          },
        },
      },
    },
  },
  runtimeConfig: {
    // Configuration PayTech (désactivée)
    paytech: {
      apiKey: process.env.PAYTECH_API_KEY,
      secretKey: process.env.PAYTECH_SECRET_KEY,
      sandbox:
        process.env.PAYTECH_SANDBOX === "true" ||
        process.env.NODE_ENV !== "production",
    },

    // Configuration Google Sheets (NOUVEAU)
    googleSheets: {
      sheetId: process.env.GOOGLE_SHEET_ID,
      apiKey: process.env.GOOGLE_SHEETS_API_KEY,
    },

    // Configuration WhatsApp (NOUVEAU)
    whatsapp: {
      businessNumber: process.env.WHATSAPP_BUSINESS_NUMBER || "221123456789",
    },

    public: {
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL ||
        process.env.BASE_URL ||
        "https://fournitures-scolaire.vercel.app",
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",

      // Configuration PayTech publique (optionnelle maintenant)
      paytechApiKey:
        process.env.NUXT_PUBLIC_PAYTECH_API_KEY || process.env.PAYTECH_API_KEY,
      paytechApiSecret: process.env.NUXT_PUBLIC_PAYTECH_API_SECRET,
      paytechMerchantId: process.env.NUXT_PUBLIC_PAYTECH_MERCHANT_ID,
      paytechSandbox: process.env.NODE_ENV !== "production",

      baseUrl:
        process.env.BASE_URL ||
        process.env.NUXT_PUBLIC_SITE_URL ||
        "https://fournitures-scolaire.vercel.app",
      payTechApiKey: process.env.PAYTECH_API_KEY,

      // Configuration publique WhatsApp
      whatsappBusinessNumber:
        process.env.WHATSAPP_BUSINESS_NUMBER || "221123456789",

      // Analytics
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
      facebookPixelId: process.env.FACEBOOK_PIXEL_ID,
    },
  },
  compatibilityDate: "2025-09-02",
});
