<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with back button and search -->
    <div class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center">
          <button 
            @click="goBack"
            class="p-2 mr-2 text-gray-700 hover:bg-gray-100 rounded-full"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="relative flex-1">
            <input
              v-model="searchStore.query"
              @keyup.enter="searchStore.performSearch()"
              type="text"
              placeholder="Rechercher des produits..."
              class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-green focus:border-transparent"
            >
            <button 
              @click="searchStore.performSearch()"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-primary-green"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <!-- Loading State -->
      <div v-if="searchStore.isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-green"></div>
      </div>

      <!-- No Results -->
      <div v-else-if="searchStore.searchResults.length === 0 && searchStore.query" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">Aucun résultat trouvé</h3>
          <p class="mt-1 text-gray-500">Aucun produit ne correspond à votre recherche "{{ searchStore.query }}"</p>
          <div class="mt-6">
            <button
              @click="clearSearch"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-green hover:bg-primary-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
            >
              Effacer la recherche
            </button>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div v-else>
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          Résultats pour "{{ searchStore.query }}" ({{ searchStore.searchResults.length }})
        </h1>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="item in searchStore.searchResults" 
            :key="item.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <NuxtLink :to="`/products/${item.id}`" class="block">
              <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                <img 
                  :src="item.image || '/images/placeholder-product.png'" 
                  :alt="item.name"
                  class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                >
              </div>
              <div class="p-4">
                <h3 class="text-lg font-medium text-gray-900 mb-1 line-clamp-2">{{ item.name }}</h3>
                <p class="text-primary-green font-bold">
                  {{ item.price ? `${item.price} CFA` : 'Voir les détails' }}
                </p>
                <div v-if="item.isPromotion" class="mt-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Promotion
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '~/stores/search';

const router = useRouter();
const route = useRoute();
const searchStore = useSearchStore();

// Perform search when page loads with query
onMounted(() => {
  if (route.query.q) {
    searchStore.query = route.query.q as string;
    searchStore.performSearch();
  }
});

// Watch for query changes
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchStore.query = newQuery as string;
    searchStore.performSearch();
  } else {
    searchStore.clearSearch();
  }
});

function goBack() {
  router.go(-1);
}

function clearSearch() {
  searchStore.clearSearch();
  router.push('/');
}
</script>
