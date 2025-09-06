<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Ma Liste d'Envies</h1>
        <p class="text-gray-600">Retrouvez tous vos produits favoris</p>
      </div>

      <!-- Wishlist vide pour l'instant -->
      <div class="bg-white rounded-lg shadow-md p-8 text-center">
        <div class="mb-6">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Votre liste d'envies est vide
        </h3>
        <p class="text-gray-500 mb-6">
          Ajoutez des produits à votre liste d'envies pour les retrouver
          facilement plus tard.
        </p>
        <NuxtLink
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
        >
          Découvrir nos produits
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuration SEO
useSeoMeta({
  title: "Ma Liste d'Envies - Fournitures Scolaires",
  description: "Retrouvez tous vos produits favoris dans votre liste d'envies.",
});
</script>
