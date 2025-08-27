<template>
  <div class="min-h-screen p-4 bg-green-50">
    <h1 class="text-2xl font-bold mb-4">Promotions de rentrée</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="promo in promotions" :key="promo.id"
        class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition transform duration-300 fade-in">
        <h2 class="font-bold">{{ promo.title }}</h2>
        <p class="mt-1">{{ promo.description }}</p>
        <p class="mt-2 text-red-500 font-bold">Prix : {{ promo.price }} CFA</p>
        <AppCountdown :endTime="promo.endTime" class="mt-2" />
        <button @click="addToCart(promo.product)" class="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-lg transition">
          Acheter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppCountdown from '~/components/AppCountdown.vue'
import { useCartStore } from '~/stores/cart'
import { ref } from 'vue'

const cartStore = useCartStore()

const promotions = ref([
  { id: 1, title: '10 cahiers grand format', description: 'Au lieu de 5000 CFA', price: 4000, endTime: new Date(Date.now() + 5*24*60*60*1000), product: { id: 101, name: '10 Cahiers', price: 4000 } },
  { id: 2, title: 'Pack Lycée', description: 'Livraison gratuite', price: 15000, endTime: new Date(Date.now() + 10*24*60*60*1000), product: { id: 4, name: 'Pack Lycée', price: 15000 } }
])

function addToCart(product: any) {
  cartStore.addItem(product)
  alert(`${product.name} ajouté au panier !`)
}
</script>
