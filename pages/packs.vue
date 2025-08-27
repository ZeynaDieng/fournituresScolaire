<template>
  <div class="min-h-screen p-4 bg-green-50">
    <h1 class="text-2xl font-bold mb-4">Packs scolaires</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AppPackCard v-for="pack in packsStore.packs" :key="pack.id" :pack="pack" @add-to-cart="addToCart" />
    </div>

    <!-- Comparateur simple -->
    <div class="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h2 class="font-bold mb-2">Comparer les packs</h2>
      <table class="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr class="bg-yellow-400 text-white">
            <th class="border px-2 py-1">Pack</th>
            <th class="border px-2 py-1">Prix</th>
            <th class="border px-2 py-1">Cahiers</th>
            <th class="border px-2 py-1">Stylos</th>
            <th class="border px-2 py-1">Ardoises</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pack in packsStore.packs" :key="pack.id" class="hover:bg-green-100 transition">
            <td class="border px-2 py-1">{{ pack.name }}</td>
            <td class="border px-2 py-1">{{ pack.price }} CFA</td>
            <td class="border px-2 py-1">{{ pack.items.filter(i => i.toLowerCase().includes('cahier')).length }}</td>
            <td class="border px-2 py-1">{{ pack.items.filter(i => i.toLowerCase().includes('stylo')).length }}</td>
            <td class="border px-2 py-1">{{ pack.items.filter(i => i.toLowerCase().includes('ardoise')).length }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import PackCard from '~/components/PackCard.vue'
import { useProductsStore } from '~/stores/products'
import { useCartStore } from '~/stores/cart'

const packsStore = useProductsStore()
const cartStore = useCartStore()

function addToCart(pack: any) {
  cartStore.addItem(pack)
  alert(`${pack.name} ajouté au panier !`)
}
</script>
