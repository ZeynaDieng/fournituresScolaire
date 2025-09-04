<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar fixe -->
    <AdminSidebar
      :sidebar-open="sidebarOpen"
      :stats="adminStats"
      @toggle-sidebar="toggleSidebar"
      @close-sidebar="closeSidebar"
    />

    <!-- Overlay mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    />

    <!-- Main content avec marge pour la sidebar -->
    <div class="lg:ml-64">
      <!-- Header commun -->
      <header class="bg-white shadow-sm border-b sticky top-0 z-30">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center">
            <button
              @click="toggleSidebar"
              class="text-gray-500 hover:text-gray-700 lg:hidden mr-4 p-2 rounded-md"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button
              class="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
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
                  d="M15 17h5l-5 5v-5zM4 2h9v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2H4c-2.21 0-4-1.79-4-4V4c0-2.21 1.79-4 4-4z"
                />
              </svg>
              <span
                v-if="adminStats.pendingOrders > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{
                  adminStats.pendingOrders > 99
                    ? "99+"
                    : adminStats.pendingOrders
                }}
              </span>
            </button>

            <!-- Profile -->
            <div class="flex items-center space-x-2">
              <div
                class="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center"
              >
                <span class="text-white text-sm font-medium">A</span>
              </div>
              <span class="text-sm text-gray-600 hidden sm:block">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Contenu de la page -->
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, provide } from "vue";
import { useRoute, useNuxtApp } from "nuxt/app";
import AdminSidebar from "../components/AdminSidebar.vue";

// Nuxt composables
const route = useRoute();
const nuxtApp = useNuxtApp();

// State global de la sidebar
const sidebarOpen = ref(false);

// Stats dynamiques de l'admin
const adminStats = ref({
  pendingOrders: 0,
  totalProducts: 0,
  totalPacks: 0,
  totalPromotions: 0,
  totalUsers: 0,
  monthlyRevenue: 0,
  lastUpdated: new Date(),
});

// Titre de la page basé sur la route
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    "/admin": "Tableau de bord",
    "/admin/statistics": "Statistiques",
    "/admin/stats-simple": "Statistiques",
    "/admin/products": "Gestion des produits",
    "/admin/packs": "Gestion des packs",
    "/admin/promotions": "Gestion des promotions",
    "/admin/orders": "Gestion des commandes",
    "/admin/users": "Gestion des utilisateurs",
    "/admin/test": "Page de test",
  };
  return titles[route.path] || "Administration";
});

// Méthodes de gestion de la sidebar
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

// Fonction pour récupérer les stats en temps réel
const fetchAdminStats = async () => {
  try {
    // Récupérer les données depuis les APIs
    const [products, packs, promotions, orders, users] = await Promise.all([
      ($fetch as any)("/api/admin/products").catch(() => []),
      ($fetch as any)("/api/admin/packs").catch(() => []),
      ($fetch as any)("/api/admin/promotions").catch(() => []),
      ($fetch as any)("/api/admin/orders").catch(() => []),
      ($fetch as any)("/api/admin/users").catch(() => []),
    ]);

    // Calculer les statistiques
    adminStats.value = {
      totalProducts: Array.isArray(products) ? products.length : 0,
      totalPacks: Array.isArray(packs) ? packs.length : 0,
      totalPromotions: Array.isArray(promotions) ? promotions.length : 0,
      totalUsers: Array.isArray(users) ? users.length : 0,
      pendingOrders: Array.isArray(orders)
        ? orders.filter((order) => order.status === "pending").length
        : 0,
      monthlyRevenue: Array.isArray(orders)
        ? orders
            .filter((order) => {
              const orderDate = new Date(
                order.createdAt || order.date || Date.now()
              );
              const currentMonth = new Date().getMonth();
              const currentYear = new Date().getFullYear();
              return (
                orderDate.getMonth() === currentMonth &&
                orderDate.getFullYear() === currentYear
              );
            })
            .reduce(
              (total, order) => total + (order.total || order.amount || 0),
              0
            )
        : 0,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques:", error);
    // Valeurs par défaut en cas d'erreur
    adminStats.value = {
      pendingOrders: 0,
      totalProducts: 0,
      totalPacks: 0,
      totalPromotions: 0,
      totalUsers: 0,
      monthlyRevenue: 0,
      lastUpdated: new Date(),
    };
  }
};

// Charger les stats au montage et les actualiser périodiquement
onMounted(() => {
  fetchAdminStats();

  // Actualiser toutes les 5 minutes
  const interval = setInterval(fetchAdminStats, 5 * 60 * 1000);

  // Nettoyer l'intervalle au démontage
  onUnmounted(() => {
    clearInterval(interval);
  });
});

// Actualiser les stats quand la route change
watch(
  () => route.path,
  () => {
    fetchAdminStats();
  }
);

// Exposer la fonction pour permettre l'actualisation manuelle
provide("refreshAdminStats", fetchAdminStats);
</script>
