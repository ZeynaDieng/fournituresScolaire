<template>
  <div class="min-h-screen bg-green-50 p-4">
    <!-- Bannière -->
    <div class="bg-yellow-400 rounded-xl p-6 text-center mb-6 fade-in">
      <h1 class="text-2xl sm:text-4xl font-bold text-white">Préparez la rentrée sans stress 🎒📚</h1>
      <NuxtLink to="/packs" class="mt-4 inline-block bg-white text-yellow-500 font-bold py-2 px-6 rounded-lg hover:scale-105 transition">Acheter un pack</NuxtLink>
    </div>

    <!-- Packs populaires -->
    <h2 class="text-xl font-bold mb-4">Packs populaires</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AppPackCard v-for="pack in packsStore.packs" :key="pack.id" :pack="pack" @add-to-cart="addToCart" />
    </div>

    <!-- Footer BottomNav -->
    <AppBottomNav />
  </div>
</template>

<script setup lang="ts">

import { useProductsStore } from '~/stores/products'
import { useCartStore } from '~/stores/cart'

const packsStore = useProductsStore()
const cartStore = useCartStore()

function addToCart(pack: any) {
  cartStore.addItem(pack)
  alert(`${pack.name} ajouté au panier !`)
}
</script>
