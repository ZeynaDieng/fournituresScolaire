<template>
  <div class="min-h-screen p-4 bg-green-50">
    <h1 class="text-2xl font-bold mb-4">Panier & Paiement</h1>

    <div v-if="cartStore.items.length === 0" class="text-center text-gray-600">Votre panier est vide.</div>

    <div v-else class="bg-white p-6 rounded-lg shadow-md fade-in">
      <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between items-center border-b py-2">
        <div>
          <p class="font-bold">{{ item.name }}</p>
          <p>{{ item.quantity }} × {{ item.price }} CFA</p>
        </div>
        <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700">Supprimer</button>
      </div>

      <p class="font-bold mt-4">Total : {{ cartStore.total }} CFA</p>

      <button @click="pay" class="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-lg transition">Payer avec PayTech</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
const cartStore = useCartStore()

function removeItem(id: number) {
  cartStore.removeItem(id)
}

function pay() {
  // Placeholder pour intégration PayTech
  alert(`Paiement de ${cartStore.total} CFA initié via PayTech !`)
  cartStore.clearCart()
  window.location.href = '/success'
}
</script>
