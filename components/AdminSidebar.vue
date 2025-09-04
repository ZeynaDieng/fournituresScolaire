<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
    :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }"
  >
    <!-- Header sidebar -->
    <div class="flex items-center justify-between h-16 px-6 bg-emerald-600">
      <div class="flex items-center">
        <svg
          class="w-8 h-8 text-white mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
          />
        </svg>
        <span class="text-xl font-bold text-white">Admin</span>
      </div>
      <button @click="toggleSidebar" class="text-white lg:hidden">
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

    <!-- Navigation -->
    <nav class="mt-6 px-3">
      <!-- Dashboard -->
      <NuxtLink
        to="/admin"
        class="sidebar-link"
        :class="{
          'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500':
            $route.path === '/admin',
        }"
        @click="closeSidebarOnMobile"
      >
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
          />
        </svg>
        <span>Tableau de bord</span>
      </NuxtLink>

      <!-- Statistiques -->
      <NuxtLink
        to="/admin/statistics"
        class="sidebar-link"
        :class="{
          'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500':
            $route.path === '/admin/statistics',
        }"
        @click="closeSidebarOnMobile"
      >
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
          />
        </svg>
        <span>Statistiques</span>
      </NuxtLink>

      <!-- Rapports -->
      <NuxtLink
        to="/admin/rapports"
        class="sidebar-link"
        :class="{
          'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500':
            $route.path === '/admin/rapports',
        }"
        @click="closeSidebarOnMobile"
      >
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Rapports & Analytics</span>
      </NuxtLink>

      <!-- Divider -->
      <div class="border-t border-gray-200 my-4"></div>

      <!-- Gestion -->
      <div class="mb-2">
        <span
          class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >Gestion</span
        >
      </div>

      <!-- Produits -->
      <NuxtLink
        to="/admin/products"
        class="sidebar-link"
        :class="{
          'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500':
            $route.path === '/admin/products',
        }"
        @click="closeSidebarOnMobile"
      >
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 9h8v8H6V9z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Produits</span>
        <span
          v-if="stats?.totalProducts"
          class="ml-auto bg-emerald-100 text-emerald-700 text-xs rounded-full px-2 py-1"
        >
          {{ stats.totalProducts }}
        </span>
      </NuxtLink>

      <!-- Packs -->
      <NuxtLink
        to="/admin/packs"
        class="sidebar-link"
        :class="{
          'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500':
            $route.path === '/admin/packs',
        }"
        @click="closeSidebarOnMobile"
      >
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Packs</span>
        <span
          v-if="stats?.totalPacks"
          class="ml-auto bg-blue-100 text-blue-700 text-xs rounded-full px-2 py-1"
        >
          {{ stats.totalPacks }}
        </span>
      </NuxtLink>

      <!-- Promotions -->
      <NuxtLink
        to="/admin/promotions"
        class="sidebar-link"
        :class="{
          'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500':
            $route.path === '/admin/promotions',
        }"
        @click="closeSidebarOnMobile"
      >
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Promotions</span>
        <span
          v-if="stats?.totalPromotions"
          class="ml-auto bg-orange-100 text-orange-700 text-xs rounded-full px-2 py-1"
        >
          {{ stats.totalPromotions }}
        </span>
      </NuxtLink>

      <!-- Divider -->
      <div class="border-t border-gray-200 my-4"></div>

      <!-- Configuration/Tests -->
      <div class="mb-2">
        <span
          class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >Configuration</span
        >
      </div>

      <!-- Test Google Sheets -->
      <NuxtLink
        to="/admin/test-google-sheets"
        class="sidebar-link"
        :class="{
          'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500':
            $route.path === '/admin/test-google-sheets',
        }"
        @click="closeSidebarOnMobile"
      >
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Test Google Sheets</span>
      </NuxtLink>

      <!-- Divider -->
      <div class="border-t border-gray-200 my-4"></div>

      <!-- Commandes -->
      <NuxtLink
        to="/admin/orders"
        class="sidebar-link"
        :class="{
          'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500':
            $route.path === '/admin/orders',
        }"
        @click="closeSidebarOnMobile"
      >
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Commandes</span>
        <span
          v-if="(stats?.pendingOrders || pendingOrders) && (stats?.pendingOrders || pendingOrders)! > 0"
          class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1"
        >
          {{ stats?.pendingOrders || pendingOrders }}
        </span>
      </NuxtLink>

      <!-- Commandes Locales -->
      <NuxtLink
        to="/admin/commandes-locales"
        class="sidebar-link"
        :class="{
          'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500':
            $route.path === '/admin/commandes-locales',
        }"
        @click="closeSidebarOnMobile"
      >
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
            clip-rule="evenodd"
          />
          <path
            fill-rule="evenodd"
            d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h4a1 1 0 100-2H7z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Commandes Locales</span>
        <span
          class="ml-auto bg-orange-100 text-orange-700 text-xs rounded-full px-2 py-1"
        >
          TEMP
        </span>
      </NuxtLink>

      <!-- Utilisateurs -->
      <NuxtLink
        to="/admin/users"
        class="sidebar-link"
        :class="{
          'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500':
            $route.path === '/admin/users',
        }"
        @click="closeSidebarOnMobile"
      >
        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
          />
        </svg>
        <span>Utilisateurs</span>
        <span
          v-if="stats?.totalUsers"
          class="ml-auto bg-indigo-100 text-indigo-700 text-xs rounded-full px-2 py-1"
        >
          {{ stats.totalUsers }}
        </span>
      </NuxtLink>
    </nav>

    <!-- Stats rapides -->
    <div v-if="stats" class="px-3 py-4 border-t border-gray-200">
      <div
        class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
      >
        Aperçu rapide
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">CA du mois</span>
          <span class="font-semibold text-emerald-600">{{
            formatCurrency(stats.monthlyRevenue)
          }}</span>
        </div>
        <div class="text-xs text-gray-500">
          Mis à jour: {{ formatTime(stats.lastUpdated) }}
        </div>
      </div>
    </div>

    <!-- Footer sidebar -->
    <div class="absolute bottom-0 w-full p-4 border-t border-gray-200">
      <NuxtLink
        to="/"
        class="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
        @click="closeSidebarOnMobile"
      >
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Retour au site
      </NuxtLink>
    </div>
  </aside>

  <!-- Overlay mobile -->
  <div
    v-if="sidebarOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    @click="closeSidebar"
  ></div>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  sidebarOpen: boolean;
  stats?: {
    pendingOrders: number;
    totalProducts: number;
    totalPacks: number;
    totalPromotions: number;
    totalUsers: number;
    monthlyRevenue: number;
    lastUpdated: Date;
  };
  pendingOrders?: number; // Pour compatibilité
}>();

// Emits
const emit = defineEmits<{
  toggleSidebar: [];
  closeSidebar: [];
}>();

// Methods
const toggleSidebar = () => {
  emit("toggleSidebar");
};

const closeSidebar = () => {
  emit("closeSidebar");
};

const closeSidebarOnMobile = () => {
  // Fermer sur mobile après navigation
  if (window.innerWidth < 1024) {
    emit("closeSidebar");
  }
};

// Fonctions utilitaires pour le formatage
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
</script>

<style scoped>
.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  margin: 0.25rem 0;
  color: #374151;
  border-radius: 0.5rem;
  transition: colors 200ms;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
}

.sidebar-link:hover {
  background-color: #f3f4f6;
}
</style>
