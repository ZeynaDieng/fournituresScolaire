<template>
  <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition transform duration-300 fade-in">
    <img :src="product.image" alt="" class="w-full h-40 object-cover rounded">
    <h3 class="text-lg font-bold mt-2">{{ product.name }}</h3>
    <p class="text-gray-600 mt-1">{{ product.price }} CFA</p>
    <div class="flex gap-2 mt-2">
      <button @click="$emit('add-to-cart', product, 1)" class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition">1 unité</button>
      <button @click="$emit('add-to-cart', product, 10)" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition">Par 10</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ product: any }>()
</script>
