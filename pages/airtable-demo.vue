<!-- pages/airtable-demo.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8 text-green-600">
        🚀 Démonstration Airtable - EduShop
      </h1>

      <!-- Section Produits -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-6">📦 Produits depuis Airtable</h2>

        <div v-if="airtableStore.loading" class="text-center py-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"
          ></div>
          <p class="mt-4 text-gray-600">Chargement des produits...</p>
        </div>

        <div
          v-else-if="airtableStore.error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          {{ airtableStore.error }}
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="product in airtableStore.products.slice(0, 6)"
            :key="product.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-48 object-cover"
              @error="
                $event.target.src =
                  'https://via.placeholder.com/400x300?text=Image'
              "
            />
            <div class="p-4">
              <span
                class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2"
              >
                {{ product.category }}
              </span>
              <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-3">
                {{ product.description }}
              </p>
              <div class="flex justify-between items-center">
                <div>
                  <span class="text-xl font-bold text-green-600">{{
                    formatPrice(product.price)
                  }}</span>
                  <span
                    v-if="product.originalPrice"
                    class="text-sm text-gray-500 line-through ml-2"
                  >
                    {{ formatPrice(product.originalPrice) }}
                  </span>
                </div>
                <span
                  :class="product.inStock ? 'text-green-600' : 'text-red-600'"
                  class="text-sm font-medium"
                >
                  {{ product.inStock ? "✅ En stock" : "❌ Rupture" }}
                </span>
              </div>
              <div v-if="product.isPromotion" class="mt-2">
                <span class="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  🔥 PROMOTION
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Packs -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-6">
          📚 Packs Populaires depuis Airtable
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="pack in airtableStore.popularPacks.slice(0, 3)"
            :key="pack.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-yellow-200"
          >
            <img
              :src="pack.image"
              :alt="pack.name"
              class="w-full h-48 object-cover"
              @error="
                $event.target.src =
                  'https://via.placeholder.com/400x300?text=Pack+Image'
              "
            />
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <span
                  class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {{ pack.level }}
                </span>
                <span
                  class="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold"
                >
                  ⭐ POPULAIRE
                </span>
              </div>
              <h3 class="font-semibold text-lg mb-2">{{ pack.name }}</h3>
              <p class="text-gray-600 text-sm mb-3">{{ pack.description }}</p>

              <!-- Contenu du pack -->
              <div class="mb-3">
                <p class="text-sm font-medium text-gray-700 mb-1">Contient :</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="item in pack.contents.slice(0, 3)"
                    :key="item"
                    class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {{ item }}
                  </span>
                  <span
                    v-if="pack.contents.length > 3"
                    class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    +{{ pack.contents.length - 3 }} autres
                  </span>
                </div>
              </div>

              <div class="flex justify-between items-center">
                <div>
                  <span class="text-xl font-bold text-green-600">{{
                    formatPrice(pack.price)
                  }}</span>
                  <span
                    v-if="pack.originalPrice"
                    class="text-sm text-gray-500 line-through ml-2"
                  >
                    {{ formatPrice(pack.originalPrice) }}
                  </span>
                </div>
                <span
                  :class="pack.inStock ? 'text-green-600' : 'text-red-600'"
                  class="text-sm font-medium"
                >
                  {{ pack.inStock ? "✅ Disponible" : "❌ Épuisé" }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Statistiques -->
      <section class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-6 text-center">
          📊 Statistiques Airtable
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">
              {{ airtableStore.products.length }}
            </div>
            <div class="text-blue-800">Produits</div>
          </div>

          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">
              {{ airtableStore.packs.length }}
            </div>
            <div class="text-green-800">Packs</div>
          </div>

          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">
              {{ airtableStore.categories.length }}
            </div>
            <div class="text-purple-800">Catégories</div>
          </div>

          <div class="text-center p-4 bg-yellow-50 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">
              {{ airtableStore.popularPacks.length }}
            </div>
            <div class="text-yellow-800">Packs Populaires</div>
          </div>
        </div>

        <!-- Categories -->
        <div class="mt-6">
          <h3 class="font-semibold mb-3">Catégories disponibles :</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="category in airtableStore.categories"
              :key="category"
              class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {{ category }}
            </span>
          </div>
        </div>
      </section>

      <!-- Actions -->
      <div class="mt-8 text-center">
        <button
          @click="refreshData"
          :disabled="airtableStore.loading"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {{
            airtableStore.loading
              ? "⏳ Chargement..."
              : "🔄 Actualiser les données"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAirtableStore } from "~/stores/airtable";

const airtableStore = useAirtableStore();

// Formatage du prix
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-SN", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(price);
};

// Actualiser les données
const refreshData = async () => {
  await airtableStore.initialize();
};

// Initialisation au montage du composant
onMounted(async () => {
  await airtableStore.initialize();
});

// SEO
useHead({
  title: "Démonstration Airtable - EduShop",
  meta: [
    {
      name: "description",
      content: "Page de démonstration de l'intégration Airtable avec EduShop",
    },
  ],
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
