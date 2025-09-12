// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],
  ssr: true,

  css: ["@/assets/css/main.css", "@/assets/css/animations.css"],
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
    minify: process.env.NODE_ENV === "production",
    prerender: {
      ignore: ["/"],
      crawlLinks: false,
      routes: [],
    },
    // Configuration pour Vercel
    preset: "vercel",
  },
  devServer: {
    port: 3000,
    host: "0.0.0.0",
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

    // Configuration Airtable (NOUVEAU)
    airtableApiKey: process.env.AIRTABLE_API_KEY,
    airtableBaseId: process.env.AIRTABLE_BASE_ID,

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
