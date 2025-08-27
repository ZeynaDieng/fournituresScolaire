<!-- components/PackCard.vue -->
<template>
  <div class="product-card group" @click="showDetails">
    <!-- Badge Popular -->
    <div v-if="pack.isPopular" class="absolute top-3 left-3 z-10">
      <span class="badge bg-primary-yellow text-primary-dark-green font-bold">
        ⭐ Populaire
      </span>
    </div>

    <!-- Badge Promotion -->
    <div v-if="pack.isPromotion" class="absolute top-3 right-3 z-10">
      <span class="badge bg-red-500 text-white font-bold animate-pulse">
        -{{ discountPercentage }}%
      </span>
    </div>

    <!-- Image Container -->
    <div class="relative h-48 overflow-hidden rounded-t-2xl">
      <img 
        :src="pack.image" 
        :alt="pack.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      
      <!-- Overlay on hover -->
      <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span class="text-white font-semibold bg-primary-green px-4 py-2 rounded-full">
          Voir détails
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Pack Level & Name -->
      <div class="mb-3">
        <span class="inline-block px-3 py-1 text-sm font-medium text-primary-green bg-primary-light-green rounded-full mb-2">
          {{ pack.level }}
        </span>
        <h3 class="text-xl font-bold text-gray-800 group-hover:text-primary-green transition-colors">
          {{ pack.name }}
        </h3>
      </div>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ pack.description }}
      </p>

      <!-- Contents Preview -->
      <div class="mb-4">
        <span class="text-sm font-medium text-gray-700 mb-2 block">Contient :</span>
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="(item, index) in pack.contents.slice(0, 3)" 
            :key="index"
            class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
          >
            {{ item }}
          </span>
          <span 
            v-if="pack.contents.length > 3"
            class="text-xs bg-primary-green text-white px-2 py-1 rounded"
          >
            +{{ pack.contents.length - 3 }} autres
          </span>
        </div>
      </div>

      <!-- Price Section -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <span 
            v-if="pack.originalPrice"
            class="text-lg text-gray-400 line-through"
          >
            {{ formatPrice(pack.originalPrice) }}
          </span>
          <span class="text-2xl font-bold text-primary-green">
            {{ formatPrice(pack.price) }}
          </span>
        </div>
        
        <!-- Stock Status -->
        <div class="text-right">
          <span 
            v-if="pack.inStock"
            class="badge-success"
          >
            ✓ En stock
          </span>
          <span 
            v-else
            class="badge-error"
          >
            ⚠ Rupture
          </span>
        </div>
      </div>

      <!-- Countdown Timer (if promotion) -->
      <Countdown 
        v-if="pack.isPromotion && pack.promotionEndDate" 
        :end-date="pack.promotionEndDate"
        class="mb-4"
      />

      <!-- Actions -->
      <div class="flex space-x-3">
        <button 
          @click.stop="addToCart"
          :disabled="!pack.inStock || isLoading"
          class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed relative"
          :class="{
            'pulse-cta': pack.isPopular && !isLoading,
            'cursor-not-allowed opacity-50': !pack.inStock
          }"
        >
          <span v-if="!isLoading">
            {{ pack.inStock ? 'Acheter maintenant' : 'Rupture de stock' }}
          </span>
          <span v-else class="flex items-center justify-center">
            <div class="spinner mr-2"></div>
            Ajout...
          </span>
        </button>

        <button 
          @click.stop="toggleWishlist"
          class="p-3 border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white rounded-full transition-all duration-300"
          :class="{
            'bg-primary-green text-white': isWishlisted,
            'hover:scale-110': true
          }"
          aria-label="Ajouter aux favoris"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Details Modal -->
    <PackDetailsModal 
      v-if="showModal"
      :pack="pack"
      @close="showModal = false"
      @add-to-cart="addToCart"
    />
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import type { Pack } from '~/stores/products'

// Props
interface Props {
  pack: Pack
}

const props = defineProps<Props>()

// Stores
const cartStore = useCartStore()

// State
const isLoading = ref(false)
const showModal = ref(false)
const isWishlisted = ref(false)

// Computed
const discountPercentage = computed(() => {
  if (props.pack.originalPrice && props.pack.price) {
    return Math.round(((props.pack.originalPrice - props.pack.price) / props.pack.originalPrice) * 100)
  }
  return 0
})

// Composables
const { formatPrice } = useFormatter()

// Methods
const showDetails = () => {
  showModal.value = true
}

const addToCart = async () => {
  if (!props.pack.inStock || isLoading.value) return
  
  isLoading.value = true
  
  try {
    // Simulation d'un délai pour l'UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    cartStore.addItem({
      id: props.pack.id,
      name: props.pack.name,
      price: props.pack.price,
      image: props.pack.image,
      type: 'pack',
      description: props.pack.description
    })
    
    // Fermer le modal si ouvert
    showModal.value = false
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value
  
  // Ici vous pourriez sauvegarder en localStorage ou en
}
</script>