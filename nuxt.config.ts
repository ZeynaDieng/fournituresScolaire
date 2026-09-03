// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],
  ssr: true,

  css: ["@/assets/css/main.css", "@/assets/css/animations.css"],
  
  typescript: {
    strict: false,
    typeCheck: false,
  },
  
  sourcemap: {
    server: false,
    client: false,
  },

  nitro: {
    compressPublicAssets: true,
    minify: false,
    preset: "vercel",
    routeRules: {
      "/**": { headers: { "cache-control": "no-cache, no-store, must-revalidate" } },
      "/api/airtable/**": { headers: { "cache-control": "no-cache, no-store, must-revalidate" } },
    },
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
        { name: "theme-color", content: "#0F3D91" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "EduShop Sénégal" },
        { property: "og:locale", content: "fr_FR" },
        {
          name: "keywords",
          content:
            "fournitures scolaires Sénégal, packs scolaires Dakar, vente cahiers stylos Sénégal",
        },
      ],
      script: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",
        },
        {
          src: "https://code.jquery.com/jquery-3.6.0.min.js",
        },
        {
          src: "https://paytech.sn/cdn/paytech.min.js",
        },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        { rel: "shortcut icon", type: "image/png", href: "/favicon.png" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "stylesheet", href: "https://paytech.sn/cdn/paytech.min.css" },
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
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
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

  devServer: {
    port: 3000,
    host: "0.0.0.0",
  },

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    airtableApiKey: process.env.AIRTABLE_API_KEY,
    airtableBaseId: process.env.AIRTABLE_BASE_ID,
    paytech: {
      apiKey: process.env.PAYTECH_API_KEY || "",
      secretKey: process.env.PAYTECH_SECRET_KEY || "",
      sandbox: process.env.PAYTECH_SANDBOX === "true",
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      baseUrl: process.env.BASE_URL || process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
  },
});
