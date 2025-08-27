<template>
  <div class="min-h-screen p-4 bg-green-50">
    <h1 class="text-2xl font-bold mb-4">Blog / Conseils</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="article in articles" :key="article.id" class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl fade-in transition">
        <h2 class="font-bold text-lg">{{ article.title }}</h2>
        <p class="mt-2 text-gray-600">{{ article.summary }}</p>
        <NuxtLink :to="article.link" class="mt-2 inline-block text-yellow-500 font-bold hover:underline">Lire plus</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const articles = ref([
  { id: 1, title: '5 fournitures essentielles pour réussir sa rentrée', summary: 'Découvrez les 5 fournitures indispensables pour votre enfant.', link: '#' },
  { id: 2, title: 'Comment économiser sur les fournitures scolaires ?', summary: 'Astuces pratiques pour acheter malin et économiser.', link: '#' },
  { id: 3, title: 'Organiser le sac de votre enfant', summary: 'Méthodes simples pour ne rien oublier et gagner du temps.', link: '#' }
])
</script>
