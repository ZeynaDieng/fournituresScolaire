<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header />
    
    <!-- Main Content -->
    <main class="pb-20 md:pb-0">
      <slot />
    </main>
    
    <!-- Bottom Navigation (Mobile) -->
    <BottomNav class="md:hidden" />
    
    <!-- Cart Sidebar -->
    <CartSidebar />
    
    <!-- Notifications Toast Container -->
    <div id="toast-container" class="fixed top-4 right-4 z-50"></div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useProductsStore } from '~/stores/products'

// Initialisation des stores
const cartStore = useCartStore()
const productsStore = useProductsStore()

// Charger les données au montage
onMounted(async () => {
  // Charger le panier depuis localStorage
  cartStore.loadFromStorage()
  
  // Charger les produits
  await productsStore.fetchProducts()
})

// Meta tags génériques
useHead({
  htmlAttrs: {
    lang: 'fr'
  },
  meta: [
    { name: 'author', content: 'EduShop Sénégal' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:site_name', content: 'EduShop Sénégal' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
  ]
})

// Auto-save du panier
useCartAutoSave()
</script>