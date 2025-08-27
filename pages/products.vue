<template>
  <div class="min-h-screen p-4 bg-green-50">
    <h1 class="text-2xl font-bold mb-4">Articles à l'unité</h1>

    <!-- Filtres -->
    <div class="flex gap-2 mb-4">
      <button v-for="cat in categories" :key="cat" @click="filterCategory(cat)"
        :class="['px-3 py-1 rounded-lg', currentCategory === cat ? 'bg-yellow-400 text-white' : 'bg-white shadow']">
        {{ cat }}
      </button>
    </div>

    <!-- Produits -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AppProductCard v-for="product in filteredProducts" :key="product.id" :product="product" @add-to-cart="addToCart" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '~/components/ProductCard.vue'
import { useProductsStore } from '~/stores/products'
import { useCartStore } from '~/stores/cart'
import { ref, computed } from 'vue'

const store = useProductsStore()
const cartStore = useCartStore()

const categories = ['Tous', ...new Set(store.products.map(p => p.category))]
const currentCategory = ref('Tous')

const filteredProducts = computed(() => {
  if (currentCategory.value === 'Tous') return store.products
  return store.products.filter(p => p.category === currentCategory.value)
})

function filterCategory(cat: string) {
  currentCategory.value = cat
}

function addToCart(product: any, quantity = 1) {
  cartStore.addItem(product, quantity)
  alert(`${product.name} ajouté au panier !`)
}
</script>
