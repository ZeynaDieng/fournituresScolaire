<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard Test</h1>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
          ></div>
          <p class="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 rounded-md p-4"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Erreur de chargement
            </h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else-if="stats" class="space-y-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div class="bg-white overflow-hidden shadow rounded-lg p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 rounded-md flex items-center justify-center bg-blue-500 text-white"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Commandes Total
                  </dt>
                  <dd class="text-2xl font-semibold text-gray-900">
                    {{ stats.kpis.totalOrders }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 rounded-md flex items-center justify-center bg-green-500 text-white"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Chiffre d'Affaires
                  </dt>
                  <dd class="text-2xl font-semibold text-gray-900">
                    {{ formatCurrency(stats.kpis.totalRevenue) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 rounded-md flex items-center justify-center bg-purple-500 text-white"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Taux de Conversion
                  </dt>
                  <dd class="text-2xl font-semibold text-gray-900">
                    {{ stats.kpis.conversionRate }}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 rounded-md flex items-center justify-center bg-orange-500 text-white"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Panier Moyen
                  </dt>
                  <dd class="text-2xl font-semibold text-gray-900">
                    {{ formatCurrency(stats.kpis.averageOrderValue) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Top Produits
            </h3>
            <div class="space-y-4">
              <div
                v-for="(product, index) in stats.topProducts.slice(0, 5)"
                :key="product.name"
                class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div class="flex items-center flex-1">
                  <div
                    class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 bg-blue-100 text-blue-600"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ product.name }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ product.quantity }} unité{{
                        product.quantity > 1 ? "s" : ""
                      }}
                      vendue{{ product.quantity > 1 ? "s" : "" }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center ml-4">
                  <div class="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      class="h-2 rounded-full bg-blue-500 transition-all duration-300"
                      :style="{
                        width: `${
                          (product.quantity / stats.topProducts[0].quantity) *
                          100
                        }%`,
                      }"
                    ></div>
                  </div>
                  <span
                    class="text-sm font-medium text-gray-900 w-12 text-right"
                    >{{ product.quantity }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// Types
interface DashboardStats {
  kpis: {
    totalOrders: number;
    totalRevenue: number;
    totalPaidRevenue: number;
    pendingOrders: number;
    cancelledOrders: number;
    conversionRate: number;
    averageOrderValue: number;
    recentRevenue: number;
    recentOrders: number;
  };
  charts: {
    dailyStats: Array<{ date: string; orders: number; revenue: number }>;
    paymentMethodStats: Array<{ method: string; count: number }>;
    topLocations: Array<{ location: string; count: number }>;
  };
  topProducts: Array<{ name: string; quantity: number }>;
  topPacks: Array<{ name: string; quantity: number }>;
  conversionFunnel: {
    totalVisitors: number;
    cartAdditions: number;
    checkoutStarted: number;
    ordersCompleted: number;
    ordersPaid: number;
  };
  inventory: {
    totalProducts: number;
    totalPacks: number;
    activePromotions: number;
  };
  lastUpdated: string;
  dataRange: string;
}

// State
const stats = ref<DashboardStats | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Methods
const fetchStats = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await $fetch<{ success: boolean; data: DashboardStats }>(
      "/api/admin/stats/test"
    );

    if (response.success) {
      stats.value = response.data;
    } else {
      throw new Error("Erreur lors de la récupération des données");
    }
  } catch (err: any) {
    error.value = err.message || "Erreur de connexion";
    console.error("Erreur fetch stats:", err);
  } finally {
    isLoading.value = false;
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Lifecycle
onMounted(() => {
  fetchStats();
});

// SEO
useHead({
  title: "Dashboard Test - EduShop",
  meta: [{ name: "description", content: "Test du dashboard avancé" }],
});
</script>
