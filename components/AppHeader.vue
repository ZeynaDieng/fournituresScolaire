<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
    <!-- Top Bar -->
    <div class="bg-primary-700 text-white text-sm">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-10">
          <div class="flex items-center space-x-4">
            <a href="tel:+221338209000" class="flex items-center hover:text-primary-100 transition-colors">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +221 33 820 90 00
            </a>
            <a href="mailto:contact@edushop.sn" class="hidden md:flex items-center hover:text-primary-100 transition-colors">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contact@edushop.sn
            </a>
          </div>
          <div class="hidden md:flex items-center space-x-4">
            <a href="#" class="hover:text-primary-100 transition-colors">Suivi de commande</a>
            <span class="text-white/30">|</span>
            <a href="#" class="hover:text-primary-100 transition-colors">Aide</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Navigation -->
    <div class="bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="flex items-center">
              <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 20.477 5.754 20 7.5 20s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 20.477 18.247 20 16.5 20c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span class="text-2xl font-bold text-gray-900">Edu<span class="text-primary-600">Shop</span></span>
            </NuxtLink>
          </div>
          <!-- Search Bar -->
          <div class="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div class="relative w-full">
              <input
                type="text"
                placeholder="Rechercher des produits..."
                class="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
              <button class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Navigation Icons -->
          <div class="flex items-center space-x-4">
            <!-- Account -->
            <div class="relative group">
              <button class="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-gray-100 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <div class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                <NuxtLink to="/account" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mon compte</NuxtLink>
                <NuxtLink to="/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mes commandes</NuxtLink>
                <div class="border-t border-gray-100 my-1"></div>
                <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Déconnexion</button>
              </div>
            </div>

            <!-- Wishlist -->
            <NuxtLink to="/wishlist" class="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-gray-100 transition-colors relative">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </NuxtLink>

            <!-- Cart -->
            <button 
              @click="cartStore.toggleCart()"
              class="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span 
                v-if="cartStore.itemCount > 0"
                class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartStore.itemCount }}
              </span>
            </button>

            <!-- Mobile Menu Button -->
            <button 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="lg:hidden p-2 text-gray-600 hover:text-primary-600 rounded-md hover:bg-gray-100 transition-colors"
              :aria-expanded="isMobileMenuOpen"
              aria-controls="mobile-menu"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Category Navigation -->
      <nav class="hidden lg:block bg-gray-50 border-t border-gray-100">
        <div class="container mx-auto px-4">
          <div class="flex space-x-8">
            <NuxtLink 
              to="/packs" 
              class="px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition-colors"
              :class="{ 'text-primary-600 border-primary-600': $route.path.startsWith('/packs') }"
            >
              Packs Scolaires
            </NuxtLink>
            <NuxtLink 
              to="/products" 
              class="px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition-colors"
              :class="{ 'text-primary-600 border-primary-600': $route.path.startsWith('/products') }"
            >
              Fournitures
            </NuxtLink>
            <NuxtLink 
              to="/categories/cahiers" 
              class="px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition-colors"
            >
              Cahiers
            </NuxtLink>
            <NuxtLink 
              to="/categories/stylos" 
              class="px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition-colors"
            >
              Stylos & Crayons
            </NuxtLink>
            <NuxtLink 
              to="/categories/cartables" 
              class="px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition-colors"
            >
              Cartables
            </NuxtLink>
            <NuxtLink 
              to="/promotions" 
              class="px-3 py-3 text-sm font-medium text-red-600 hover:text-red-700 border-b-2 border-transparent hover:border-red-600 transition-colors"
            >
              Promotions
            </NuxtLink>
          </div>
        </div>
      </nav>
    </div>

    <!-- Mobile Search -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isSearchOpen" class="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div class="relative">
          <input
            type="text"
            placeholder="Rechercher des produits..."
            class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
          >
          <button class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div 
        v-if="isMobileMenuOpen" 
        id="mobile-menu"
        class="lg:hidden bg-white border-t border-gray-200 shadow-lg"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <!-- Mobile Search -->
          <div class="px-3 py-2">
            <button 
              @click="toggleSearch()"
              class="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              <span>Rechercher</span>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          <NuxtLink 
            to="/" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            @click="isMobileMenuOpen = false"
            :class="{ 'bg-gray-100': $route.path === '/' }"
          >
            Accueil
          </NuxtLink>
          <NuxtLink 
            to="/packs" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            @click="isMobileMenuOpen = false"
            :class="{ 'bg-gray-100': $route.path.startsWith('/packs') }"
          >
            Packs Scolaires
          </NuxtLink>
          <NuxtLink 
            to="/products" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            @click="isMobileMenuOpen = false"
            :class="{ 'bg-gray-100': $route.path.startsWith('/products') }"
          >
            Tous les produits
          </NuxtLink>
          <div class="border-t border-gray-200 my-1"></div>
          <div class="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Catégories
          </div>
          <NuxtLink 
            to="/categories/cahiers" 
            class="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="isMobileMenuOpen = false"
          >
            Cahiers
          </NuxtLink>
          <NuxtLink 
            to="/categories/stylos" 
            class="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="isMobileMenuOpen = false"
          >
            Stylos & Crayons
          </NuxtLink>
          <NuxtLink 
            to="/categories/cartables" 
            class="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="isMobileMenuOpen = false"
          >
            Cartables
          </NuxtLink>
          <div class="border-t border-gray-200 my-1"></div>
          <NuxtLink 
            to="/promotions" 
            class="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            @click="isMobileMenuOpen = false"
          >
            Promotions
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            @click="isMobileMenuOpen = false"
          >
            À propos
          </NuxtLink>
          <NuxtLink 
            to="/contact" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            @click="isMobileMenuOpen = false"
          >
            Contact
          </NuxtLink>
        </div>
        
        <!-- User Menu Mobile -->
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-5">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <svg class="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">Mon compte</div>
              <div class="text-sm font-medium text-gray-500">Connecté en tant qu'invité</div>
            </div>
          </div>
          <div class="mt-3 space-y-1 px-2">
            <NuxtLink 
              to="/account" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              @click="isMobileMenuOpen = false"
            >
              Mon profil
            </NuxtLink>
            <NuxtLink 
              to="/orders" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              @click="isMobileMenuOpen = false"
            >
              Mes commandes
            </NuxtLink>
            <NuxtLink 
              to="/wishlist" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center justify-between"
              @click="isMobileMenuOpen = false"
            >
              <span>Ma liste de souhaits</span>
              <span class="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">3</span>
            </NuxtLink>
            <button 
              class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              @click="logout()"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </header>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '~/stores/cart';
import { useSearchStore } from '~/stores/search';

const route = useRoute();
const cartStore = useCartStore();
const searchStore = useSearchStore();

// États
const isMobileMenuOpen = ref(false);
const isSearchOpen = ref(false);
const isScrolled = ref(false);

// Fermer le menu mobile lors du changement de route
watch(() => route.path, () => {
  isMobileMenuOpen.value = false;
});

// Gestion du défilement pour l'ombre de l'en-tête
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// Basculer la recherche mobile
const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  if (!isSearchOpen.value) {
    searchStore.query = '';
  }
};

// Gérer la soumission de la recherche
const handleSearch = () => {
  if (searchStore.query.trim()) {
    searchStore.performSearch();
    isSearchOpen.value = false;
    isMobileMenuOpen.value = false;
  }
};

// Déconnexion
const logout = async () => {
  try {
    // Ici, vous pouvez ajouter la logique de déconnexion
    console.log('Déconnexion...');
    // Redirection vers la page d'accueil
    await navigateTo('/');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  } finally {
    isMobileMenuOpen.value = false;
  }
};

// Écouteurs d'événements
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', (e) => {
    // Fermer le menu si on clique en dehors
    if (!e.target.closest('.mobile-menu-container') && isMobileMenuOpen.value) {
      isMobileMenuOpen.value = false;
    }
    if (!e.target.closest('.search-container') && isSearchOpen.value) {
      isSearchOpen.value = false;
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', () => {});
});
</script>

<style scoped>
/* Animation pour les menus déroulants */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Style pour le header fixe */
.fixed-header {
  @apply fixed top-0 left-0 right-0 z-50 transition-all duration-300;
  box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04);
}

/* Style pour l'ombre au scroll */
.scrolled {
  @apply shadow-md;
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
}

/* Animation pour le menu mobile */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease-in-out;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Style pour les liens de navigation */
.nav-link {
  @apply relative px-3 py-2 text-sm font-medium transition-colors duration-200;
}

.nav-link::after {
  @apply absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 scale-x-0 origin-left transition-transform duration-200;
  content: '';
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  @apply scale-x-100;
}

/* Style pour les boutons avec icônes */
.icon-button {
  @apply p-2 rounded-full transition-colors duration-200;
}

.icon-button:hover {
  @apply bg-gray-100 text-primary-600;
}

/* Style pour les badges de notification */
.notification-badge {
  @apply absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-primary-600 rounded-full;
}

/* Style pour le menu utilisateur */
.user-menu {
  @apply absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 invisible opacity-0 transition-all duration-200;
}

.group:hover .user-menu {
  @apply visible opacity-100;
}

/* Style pour le menu mobile */
.mobile-menu-container {
  @apply lg:hidden bg-white border-t border-gray-200 shadow-lg;
  max-height: calc(100vh - 5rem);
  overflow-y: auto;
}

/* Style pour la barre de recherche mobile */
.search-container {
  @apply lg:hidden bg-white border-b border-gray-200 px-4 py-3;
}

/* Style pour les liens du menu mobile */
.mobile-link {
  @apply block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200;
}

.mobile-link:hover {
  @apply bg-gray-100;
}

/* Style pour les catégories dans le menu mobile */
.category-link {
  @apply block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200;
}

/* Style pour le bouton de déconnexion */
.logout-button {
  @apply w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200;
}
</style>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <button 
              v-if="searchStore.query"
              @click="searchStore.clearSearch()"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation principale (Desktop) -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink 
            v-for="item in navigation" 
            :key="item.name" 
            :to="item.path"
            class="text-white hover:text-primary-yellow transition-colors text-sm font-medium"
            :class="{ 'text-primary-yellow': $route.path === item.path }"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- Actions (Cart, Search, Menu) -->
        <div class="flex items-center space-x-4">
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

          <!-- Mobile Search Button -->
          <button
            @click="searchStore.toggleSearch()"
            class="p-2 text-white hover:text-primary-yellow md:hidden"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
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

      <!-- Résultats de recherche (Desktop) -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div 
          v-if="searchStore.searchResults.length > 0 && searchStore.query && searchStore.isSearchOpen"
          class="absolute left-0 right-0 top-full bg-white shadow-xl rounded-b-lg z-40 max-h-96 overflow-y-auto"
        >
          <div class="container mx-auto px-4 py-2">
            <div class="divide-y divide-gray-100">
              <div 
                v-for="item in searchStore.searchResults.slice(0, 5)" 
                :key="item.id"
                class="p-3 hover:bg-gray-50 cursor-pointer"
                @click="navigateTo(`/products/${item.id}`)"
              >
                <div class="flex items-center">
                  <img 
                    :src="item.image || '/images/placeholder-product.png'" 
                    :alt="item.name"
                    class="w-12 h-12 object-cover rounded-md mr-3"
                  >
                  <div>
                    <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
                    <p class="text-sm text-gray-500">{{ item.category }}</p>
                  </div>
                </div>
              </div>
              <div 
                v-if="searchStore.searchResults.length > 5"
                class="p-3 text-center"
              >
                <NuxtLink 
                  to="/search" 
                  class="text-primary-green hover:underline"
                  @click="searchStore.isSearchOpen = false"
                >
                  Voir tous les résultats ({{ searchStore.searchResults.length }})
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div 
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        @click="isMobileMenuOpen = false"
      ></div>
    </Transition>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-x-full"
      enter-to-class="transform translate-x-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-x-0"
      leave-to-class="transform -translate-x-full"
    >
      <div 
        v-if="isMobileMenuOpen"
        class="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-50 overflow-y-auto"
      >
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <NuxtLink 
              to="/" 
              class="flex items-center space-x-2 text-primary-green"
              @click="isMobileMenuOpen = false"
            >
              <div class="w-8 h-8 bg-primary-yellow rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-dark-green" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xl font-bold">EduShop</span>
            </NuxtLink>
            <button 
              @click="isMobileMenuOpen = false"
              class="p-2 text-gray-500 hover:text-gray-700"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav class="py-4">
            <NuxtLink 
              v-for="item in navigation" 
              :key="item.name"
              :to="item.path"
              class="block px-6 py-3 text-gray-700 hover:bg-gray-100"
              :class="{ 'bg-gray-100': $route.path === item.path }"
              @click="isMobileMenuOpen = false"
            >
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import { useProductsStore } from '~/stores/products';
import { useSearchStore } from '~/stores/search';
import { useNavigation } from '~/composables/useNavigation'
import { useDebounceFn } from '@vueuse/core'

const cartStore = useCartStore();
const productsStore = useProductsStore();
const searchStore = useSearchStore();

// Réinitialiser la recherche lors du changement de page
const route = useRoute();
watch(() => route.path, () => {
  searchStore.clearSearch();
});

// State
const isMobileMenuOpen = ref(false)

// Navigation items
const { navItems: navigation } = useNavigation()

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu on route change
watch(() => useRoute().path, () => {
  isMobileMenuOpen.value = false
})

// Gérer la saisie de la recherche
const handleSearchInput = useDebounceFn(() => {
  if (searchStore.query.trim()) {
    searchStore.performSearch()
  } else {
    searchStore.searchResults = []
  }
}, 300)

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