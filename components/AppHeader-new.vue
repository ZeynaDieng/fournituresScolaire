<!-- components/AppHeader.vue -->
<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-100"
  >
    <!-- Barre de notification (optionnelle) -->
    <div class="bg-brand-600 text-white py-2 text-center text-sm font-medium">
      <div class="container">
        📚 Nouvelle rentrée scolaire ! -15% sur tous les packs jusqu'au 30
        septembre
      </div>
    </div>

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
        class="bg-white py-4 px-4 shadow-sm md:hidden border-b border-gray-100"
      >
        <div class="relative">
          <input
            v-model="searchStore.query"
            @keyup.enter="searchStore.performSearch()"
            type="text"
            placeholder="Rechercher des produits..."
            class="form-input w-full pl-11 pr-4 py-3"
            autocomplete="off"
          />
          <svg
            class="absolute left-3 top-3.5 h-5 w-5 text-academic-400"
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
            class="absolute right-3 top-3 text-academic-400 hover:text-academic-600 p-1"
            aria-label="Fermer la recherche"
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

    <!-- Header principal -->
    <div class="container">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <!-- Logo moderne -->
        <NuxtLink
          to="/"
          class="flex items-center space-x-3 text-academic-900 hover:text-brand-600 transition-colors group"
        >
          <div class="relative">
            <div
              class="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div
              class="absolute -top-1 -right-1 w-4 h-4 bg-education-400 rounded-full flex items-center justify-center"
            >
              <span class="text-xs text-white font-bold">!</span>
            </div>
          </div>
          <div class="hidden sm:block">
            <div class="font-heading font-bold text-xl lg:text-2xl">
              EduShop
            </div>
            <div class="text-xs text-academic-500 font-medium">
              Fournitures Scolaires
            </div>
          </div>
        </NuxtLink>

        <!-- Barre de recherche (Desktop) -->
        <div class="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
          <div class="relative w-full">
            <input
              v-model="searchStore.query"
              @input="handleSearchInput"
              @keyup.enter="searchStore.performSearch()"
              @focus="searchStore.isSearchOpen = true"
              type="text"
              placeholder="Rechercher cahiers, stylos, packs scolaires..."
              class="form-input w-full pl-11 pr-4 py-3"
              autocomplete="off"
            />
            <svg
              class="absolute left-3 top-3.5 h-5 w-5 text-academic-400"
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

            <!-- Suggestions de recherche -->
            <div
              v-if="searchSuggestions.length > 0 && searchStore.isSearchOpen"
              class="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50"
            >
              <div class="p-2">
                <div class="text-xs font-semibold text-academic-500 mb-2 px-2">
                  Suggestions populaires
                </div>
                <a
                  v-for="suggestion in searchSuggestions"
                  :key="suggestion"
                  @click="searchStore.setQuery(suggestion)"
                  class="block px-3 py-2 text-sm text-academic-700 hover:bg-academic-50 rounded cursor-pointer"
                >
                  {{ suggestion }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation et actions -->
        <div class="flex items-center space-x-2 lg:space-x-4">
          <!-- Recherche mobile -->
          <button
            @click="searchStore.toggleSearch()"
            class="lg:hidden p-2 text-academic-600 hover:text-brand-600 transition-colors"
            aria-label="Rechercher"
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

          <!-- Favoris -->
          <NuxtLink
            to="/favoris"
            class="hidden md:flex p-2 text-academic-600 hover:text-brand-600 transition-colors relative"
            aria-label="Mes favoris"
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </NuxtLink>

          <!-- Panier -->
          <button
            @click="cartStore.toggleCart()"
            class="relative p-2 text-academic-600 hover:text-brand-600 transition-colors"
            aria-label="Panier d'achat"
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m8.5-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m8.5 0H7"
              />
            </svg>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-1 -right-1 bg-education-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </button>

          <!-- Menu utilisateur -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="flex items-center space-x-2 p-2 text-academic-600 hover:text-brand-600 transition-colors"
              aria-label="Menu utilisateur"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span class="hidden lg:block text-sm font-medium"
                >Mon compte</span
              >
            </button>

            <!-- Menu déroulant -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
              >
                <NuxtLink
                  to="/profile"
                  class="flex items-center px-4 py-2 text-sm text-academic-700 hover:bg-academic-50"
                >
                  <svg
                    class="h-4 w-4 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Mon profil
                </NuxtLink>
                <NuxtLink
                  to="/commandes"
                  class="flex items-center px-4 py-2 text-sm text-academic-700 hover:bg-academic-50"
                >
                  <svg
                    class="h-4 w-4 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Mes commandes
                </NuxtLink>
                <div class="border-t border-gray-100 my-1"></div>
                <button
                  @click="handleLogout"
                  class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <svg
                    class="h-4 w-4 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Déconnexion
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Navigation secondaire -->
      <nav
        class="hidden lg:flex items-center space-x-8 py-3 border-t border-gray-100"
      >
        <NuxtLink to="/packs" class="nav-link flex items-center space-x-2">
          <PackageIcon :size="18" />
          <span>Packs scolaires</span>
        </NuxtLink>
        <NuxtLink to="/products" class="nav-link flex items-center space-x-2">
          <ProductIcon :size="18" />
          <span>Produits individuels</span>
        </NuxtLink>
        <NuxtLink to="/promotions" class="nav-link flex items-center space-x-2">
          <TagIcon :size="18" />
          <span>Promotions</span>
        </NuxtLink>
        <NuxtLink to="/about" class="nav-link flex items-center space-x-2">
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>À propos</span>
        </NuxtLink>
      </nav>
    </div>
  </header>

  <!-- Overlay pour fermer les menus -->
  <div
    v-if="isUserMenuOpen || searchStore.isSearchOpen"
    @click="closeAllMenus"
    class="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useSearchStore } from "~/stores/search";
import { useCartStore } from "~/stores/cart";

// Import des icônes
import PackageIcon from "~/components/icons/PackageIcon.vue";
import ProductIcon from "~/components/icons/ProductIcon.vue";
import TagIcon from "~/components/icons/TagIcon.vue";

// Stores
const searchStore = useSearchStore();
const cartStore = useCartStore();

// État local
const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);

// Suggestions de recherche
const searchSuggestions = ref([
  "Cahiers CP",
  "Stylos BIC",
  "Pack CE1",
  "Crayons de couleur",
  "Calculatrice",
  "Géométrie",
]);

// Méthodes
const handleSearchInput = () => {
  // Logique de recherche en temps réel si nécessaire
};

const handleLogout = () => {
  // Logique de déconnexion
  isUserMenuOpen.value = false;
};

const closeAllMenus = () => {
  isUserMenuOpen.value = false;
  searchStore.isSearchOpen = false;
};

// Gestion du clic en dehors
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
