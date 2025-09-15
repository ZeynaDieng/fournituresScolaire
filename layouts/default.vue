<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-grow pt-16 pb-20 md:pb-0">
      <div class="">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Bottom Navigation (Mobile) -->
    <AppBottomNav class="md:hidden" />

    <!-- Cart Sidebar -->
    <CartSidebar />

    <!-- Notifications Container -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useCartStore, useCartAutoSave } from "~/stores/cart";
import { useRoute, navigateTo, useHead, createError } from "nuxt/app";

// Protection : empêcher l'utilisation du layout par défaut sur les routes admin (sauf login)
const route = useRoute();
if (route.path.startsWith("/admin") && route.path !== "/admin/login") {
  console.warn(
    "⚠️ Layout par défaut détecté sur une route admin. Redirection vers le layout admin."
  );
  // Cette route admin devrait utiliser le layout admin, pas le layout par défaut
  throw createError({
    statusCode: 500,
    statusMessage:
      "Configuration incorrecte: cette page admin doit utiliser le layout admin",
  });
}

// Initialisation des stores
const cartStore = useCartStore();

// Charger les données au montage
onMounted(async () => {
  // Charger le panier depuis localStorage
  // cartStore.loadFromStorage() // Assuming this method exists
});

// Meta tags génériques
useHead({
  htmlAttrs: {
    lang: "fr",
  },
  meta: [
    { name: "author", content: "EduShop Sénégal" },
    { name: "robots", content: "index, follow" },
    { property: "og:site_name", content: "EduShop Sénégal" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
  ],
});

// Auto-save du panier
useCartAutoSave();
</script>
