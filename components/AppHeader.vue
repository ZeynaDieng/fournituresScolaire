<!-- components/Header.vue -->
<template>
  <header class="sticky top-0 z-50 bg-gradient-primary shadow-lg">
    <div class="container">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2 text-white hover:text-primary-yellow transition-colors">
          <div class="w-8 h-8 bg-primary-yellow rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-primary-dark-green" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="text-xl md:text-2xl font-bold">EduShop</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            v-for="item in navigation" 
            :key="item.path"
            :to="item.path" 
            class="text-white hover:text-primary-yellow transition-colors font-medium"
            :class="{ 'text-primary-yellow': $route.path === item.path }"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- Actions (Search, Cart, Menu) -->
        <div class="flex items-center space-x-4">
          <!-- Search Button (Desktop) -->
          <button 
            @click="toggleSearch"
            class="hidden md:block p-2 text-white hover:text-primary-yellow transition-colors"
            aria-label="Rechercher"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>

          <!-- Cart Button -->
          <button 
            @click="cartStore.toggleCart()"
            class="relative p-2 bg-primary-yellow text-primary-dark-green rounded-full hover:bg-yellow-300 transition-all transform hover:scale-105"
            aria-label="Panier"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"/>
            </svg>
            
            <!-- Cart Counter -->
            <span 
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse"
            >
              {{ cartStore.itemCount }}
            </span>
          </button>

          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMobileMenu"
            class="md:hidden p-2 text-white hover:text-primary-yellow transition-colors"
            aria-label="Menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                v-if="!isMobileMenuOpen"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                v-else
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Search Bar (when toggled) -->
      <Transition name="slide-down">
        <div v-if="isSearchOpen" class="pb-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="performSearch"
              type="text"
              placeholder="Rechercher des produits, packs..."
              class="w-full px-4 py-3 pl-10 bg-white/10 backdrop-blur text-white placeholder-gray-300 rounded-lg border border-white/20 focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/50"
            />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div 
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-40 bg-black/50 md:hidden"
        @click="toggleMobileMenu"
      />
    </Transition>

    <!-- Mobile Menu -->
    <Transition name="slide-right">
      <div 
        v-if="isMobileMenuOpen"
        class="fixed top-0 right-0 h-full w-80 bg-white z-50 md:hidden shadow-2xl"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-8">
            <span class="text-xl font-bold text-primary-dark-green">Menu</span>
            <button @click="toggleMobileMenu" class="p-2 text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <nav class="space-y-4">
            <NuxtLink 
              v-for="item in navigation" 
              :key="item.path"
              :to="item.path"
              @click="toggleMobileMenu"
              class="block py-3 px-4 text-gray-700 hover:bg-primary-light-green hover:text-primary-dark-green rounded-lg transition-all"
              :class="{ 'bg-primary-light-green text-primary-dark-green': $route.path === item.path }"
            >
              <div class="flex items-center space-x-3">
                <component :is="item.icon" class="w-5 h-5" />
                <span class="font-medium">{{ item.name }}</span>
              </div>
            </NuxtLink>
          </nav>

          <!-- Search in Mobile -->
          <div class="mt-8 p-4 bg-gray-50 rounded-lg">
            <input
              v-model="searchQuery"
              @keyup.enter="performSearch"
              type="text"
              placeholder="Rechercher..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useProductsStore } from '~/stores/products'

const cartStore = useCartStore()
const productsStore = useProductsStore()

// State
const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')

// Navigation items
const navigation = [
  { 
    name: 'Accueil', 
    path: '/',
    icon: 'svg' // Remplacer par des composants d'icônes
  },
  { 
    name: 'Packs Scolaires', 
    path: '/packs',
    icon: 'svg'
  },
  { 
    name: 'Articles', 
    path: '/products',
    icon: 'svg'
  },
  { 
    name: 'Promotions', 
    path: '/promotions',
    icon: 'svg'
  },
  { 
    name: 'Blog', 
    path: '/blog',
    icon: 'svg'
  },
  { 
    name: 'Contact', 
    path: '/contact',
    icon: 'svg'
  }
]

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  if (!isSearchOpen.value) {
    searchQuery.value = ''
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    isSearchOpen.value = false
    isMobileMenuOpen.value = false
  }
}

// Close mobile menu on route change
watch(() => useRoute().path, () => {
  isMobileMenuOpen.value = false
})

// Close menus on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      isMobileMenuOpen.value = false
      isSearchOpen.value = false
    }
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>