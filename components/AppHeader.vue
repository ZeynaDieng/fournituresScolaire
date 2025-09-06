<!-- components/AppHeader.vue -->

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-green-800 shadow-lg">
    <!-- Barre de recherche mobile -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="searchStore.isSearchOpen"
        class="bg-white py-3 px-4 shadow-md md:hidden"
      >
        <div class="relative">
          <input
            v-model="searchStore.query"
            @keyup.enter="searchStore.performSearch()"
            type="text"
            placeholder="Rechercher des produits..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-transparent"
          />
          <svg
            class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
          <button
            @click="searchStore.toggleSearch()"
            class="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <div
            class="w-10 h-10 bg-accent-400 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 20.477 5.754 20 7.5 20s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 20.477 18.247 20 16.5 20c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span class="text-2xl font-bold text-white"
            >Edu<span class="text-accent-400">Shop</span></span
          >
        </NuxtLink>

        <!-- Barre de recherche (Desktop) -->
        <div class="hidden md:flex items-center flex-1 max-w-2xl mx-8">
          <div class="relative w-full">
            <input
              v-model="searchStore.query"
              @input="handleSearchInput"
              @keyup.enter="searchStore.performSearch()"
              @focus="searchStore.isSearchOpen = true"
              type="text"
              placeholder="Rechercher des produits..."
              class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-transparent"
            />
            <svg
              class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
            <button
              v-if="searchStore.query"
              @click="searchStore.clearSearch()"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation principale (Desktop) -->
        <nav class="hidden md:flex items-center space-x-6 mr-6">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.path"
            class="text-white hover:text-accent-400 transition-colors text-sm font-medium"
            :class="{ 'text-accent-400': $route.path === item.path }"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- Actions (Cart, Search, Menu) -->
        <div class="flex items-center space-x-4">
          <!-- Cart Button -->
          <button
            @click="cartStore.toggleCart()"
            class="relative p-2 bg-accent-400 text-primary-700 rounded-full hover:bg-yellow-300 transition-all transform hover:scale-105"
            aria-label="Panier"
          >
            <ShoppingCartIcon :width="20" :height="20" fill="currentColor" />

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
            class="p-2 text-white hover:text-accent-400 md:hidden"
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
            class="md:hidden p-2 text-white hover:text-accent-400 transition-colors"
            aria-label="Menu"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
          v-if="
            searchStore.searchResults.length > 0 &&
            searchStore.query &&
            searchStore.isSearchOpen
          "
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
                  />
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
                  class="text-primary-600 hover:underline"
                  @click="searchStore.isSearchOpen = false"
                >
                  Voir tous les résultats ({{
                    searchStore.searchResults.length
                  }})
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
              class="flex items-center space-x-2 text-primary-600"
              @click="isMobileMenuOpen = false"
            >
              <div
                class="w-8 h-8 bg-accent-400 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-primary-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-xl font-bold">EduShop</span>
            </NuxtLink>
            <button
              @click="isMobileMenuOpen = false"
              class="p-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
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
import { useCartStore } from "~/stores/cart";
import { useProductsStore } from "~/stores/products";
import { useSearchStore } from "~/stores/search";
import { useNavigation } from "~/composables/useNavigation";
import { useDebounceFn } from "@vueuse/core";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon.vue";

const cartStore = useCartStore();
const productsStore = useProductsStore();
const searchStore = useSearchStore();

// Réinitialiser la recherche lors du changement de page
const route = useRoute();
watch(
  () => route.path,
  () => {
    searchStore.clearSearch();
  }
);

// State
const isMobileMenuOpen = ref(false);

// Navigation items
const { navItems: navigation } = useNavigation();

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Close mobile menu on route change
watch(
  () => useRoute().path,
  () => {
    isMobileMenuOpen.value = false;
  }
);

// Gérer la saisie de la recherche
const handleSearchInput = useDebounceFn(() => {
  if (searchStore.query.trim()) {
    searchStore.performSearch();
  } else {
    searchStore.searchResults = [];
  }
}, 300);

// Close menus on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      isMobileMenuOpen.value = false;
      searchStore.isSearchOpen = false;
    }
  };
  document.addEventListener("keydown", handleEscape);
  onUnmounted(() => {
    document.removeEventListener("keydown", handleEscape);
  });
});
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
