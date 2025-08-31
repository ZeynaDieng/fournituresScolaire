// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],
  pinia: {},
  // ...
  css: ["@fontsource/inter/index.css", "@/assets/css/main.css"],
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
        { name: "theme-color", content: "#10B981" },
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
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap",
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
    minify: true,
    prerender: {
      crawlLinks: true,
      routes: ["/", "/sitemap.xml"],
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
          },
        },
      },
    },
  },
  runtimeConfig: {
    paytech: {
      apiKey: process.env.PAYTECH_API_KEY,
      secretKey: process.env.PAYTECH_SECRET_KEY,
      sandbox: process.env.NODE_ENV !== "production",
    },
    public: {
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL ||
        process.env.BASE_URL ||
        "http://localhost:3000",
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",
      paytechApiKey:
        process.env.NUXT_PUBLIC_PAYTECH_API_KEY || process.env.PAYTECH_API_KEY,
      paytechApiSecret: process.env.NUXT_PUBLIC_PAYTECH_API_SECRET,
      paytechMerchantId: process.env.NUXT_PUBLIC_PAYTECH_MERCHANT_ID,
      paytechSandbox: process.env.NODE_ENV !== "production",
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
      payTechApiKey: process.env.PAYTECH_API_KEY,
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
      facebookPixelId: process.env.FACEBOOK_PIXEL_ID,
    },
  },
  compatibilityDate: "2025-08-27",
});
