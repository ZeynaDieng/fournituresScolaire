<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header avec actions -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Dashboard Admin - Test
            </h1>
            <p class="text-sm text-gray-600 mt-1">
              Dernière mise à jour: {{ formatDate(stats?.lastUpdated) }}
              <span
                class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="dataSourceClass"
              >
                {{ dataSource }}
              </span>
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="refreshData"
              :disabled="isLoading"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <svg
                :class="{ 'animate-spin': isLoading }"
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualiser
            </button>
            <select
              v-model="selectedPeriod"
              @change="refreshData"
              class="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="7">7 jours</option>
              <option value="30">30 jours</option>
              <option value="90">90 jours</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div
        v-if="isLoading && !stats"
        class="flex items-center justify-center h-64"
      >
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
          <KPICard
            title="Commandes Total"
            :value="stats.kpis.totalOrders"
            :change="getOrderChange()"
            icon="orders"
            color="blue"
          />
          <KPICard
            title="Chiffre d'Affaires"
            :value="formatCurrency(stats.kpis.totalRevenue)"
            :change="getRevenueChange()"
            icon="revenue"
            color="green"
          />
          <KPICard
            title="Taux de Conversion"
            :value="`${stats.kpis.conversionRate}%`"
            :change="getConversionChange()"
            icon="conversion"
            color="purple"
          />
          <KPICard
            title="Panier Moyen"
            :value="formatCurrency(stats.kpis.averageOrderValue)"
            :change="getAOVChange()"
            icon="cart"
            color="orange"
          />
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Revenue Chart -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Évolution du Chiffre d'Affaires
              </h3>
              <SimpleChart
                :data="
                  stats.charts.dailyStats.map((d) => ({
                    date: d.date,
                    value: d.revenue,
                  }))
                "
                title="Chiffre d'Affaires"
                value-type="currency"
              />
            </div>
          </div>

          <!-- Orders Chart -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Commandes par Jour
              </h3>
              <SimpleChart
                :data="
                  stats.charts.dailyStats.map((d) => ({
                    date: d.date,
                    value: d.orders,
                  }))
                "
                title="Commandes"
                value-type="number"
              />
            </div>
          </div>
        </div>

        <!-- Top Products & Conversion Funnel -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Top Products -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Top Produits
              </h3>
              <TopProductsChart :data="stats.topProducts" />
            </div>
          </div>

          <!-- Conversion Funnel -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Entonnoir de Conversion
              </h3>
              <ConversionFunnel :data="stats.conversionFunnel" />
            </div>
          </div>
        </div>

        <!-- Payment Methods & Locations -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Payment Methods -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Méthodes de Paiement
              </h3>
              <PaymentMethodsChart :data="stats.charts.paymentMethodStats" />
            </div>
          </div>

          <!-- Top Locations -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Top Localisations
              </h3>
              <LocationsChart :data="stats.charts.topLocations" />
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Actions Rapides
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <QuickActionButton
                title="Nouveau Produit"
                description="Ajouter un produit"
                icon="plus"
                color="blue"
                @click="() => {}"
              />
              <QuickActionButton
                title="Nouveau Pack"
                description="Créer un pack"
                icon="package"
                color="green"
                @click="() => {}"
              />
              <QuickActionButton
                title="Commandes"
                description="Voir les commandes"
                icon="orders"
                color="purple"
                @click="() => {}"
              />
              <QuickActionButton
                title="Promotions"
                description="Gérer les promotions"
                icon="tag"
                color="orange"
                @click="() => {}"
              />
              <QuickActionButton
                title="Utilisateurs"
                description="Gérer les utilisateurs"
                icon="users"
                color="red"
                @click="() => {}"
              />
              <QuickActionButton
                title="Paramètres"
                description="Configuration"
                icon="settings"
                color="yellow"
                @click="() => {}"
              />
              <QuickActionButton
                title="Rapports"
                description="Exporter les données"
                icon="chart"
                color="indigo"
                @click="() => {}"
              />
              <QuickActionButton
                title="Sauvegarde"
                description="Exporter les données"
                icon="download"
                color="pink"
                @click="() => {}"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import KPICard from "~/components/admin/KPICard.vue";
import TopProductsChart from "~/components/admin/TopProductsChart.vue";
import ConversionFunnel from "~/components/admin/ConversionFunnel.vue";
import PaymentMethodsChart from "~/components/admin/PaymentMethodsChart.vue";
import LocationsChart from "~/components/admin/LocationsChart.vue";
import QuickActionButton from "~/components/admin/QuickActionButton.vue";
import SimpleChart from "~/components/admin/SimpleChart.vue";

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
const selectedPeriod = ref("30");
const dataSource = ref<string>("");
const isRealData = ref(false);

// Computed
const previousStats = ref<DashboardStats | null>(null);

// Methods
const fetchStats = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // Essayer d'abord l'API principale (données réelles)
    let response;
    try {
      response = await $fetch<{ success: boolean; data: DashboardStats }>(
        "/api/admin/stats/airtable"
      );
      console.log("✅ Données réelles chargées depuis Airtable");
      dataSource.value = "Données Airtable";
      isRealData.value = true;
    } catch (apiError) {
      console.log(
        "⚠️ API Airtable indisponible, utilisation des données hybrides"
      );
      // Fallback vers l'API hybride
      response = await $fetch<{ success: boolean; data: DashboardStats }>(
        "/api/admin/stats/hybrid"
      );
      dataSource.value = "Données Hybrides";
      isRealData.value = false;
    }

    if (response.success) {
      previousStats.value = stats.value;
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

const refreshData = () => {
  fetchStats();
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("fr-FR");
};

// Calcul des changements (simulation)
const getOrderChange = (): number => {
  if (!previousStats.value) return 0;
  const current = stats.value?.kpis.totalOrders || 0;
  const previous = previousStats.value.kpis.totalOrders || 0;
  return previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;
};

const getRevenueChange = (): number => {
  if (!previousStats.value) return 0;
  const current = stats.value?.kpis.totalRevenue || 0;
  const previous = previousStats.value.kpis.totalRevenue || 0;
  return previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;
};

const getConversionChange = (): number => {
  if (!previousStats.value) return 0;
  const current = stats.value?.kpis.conversionRate || 0;
  const previous = previousStats.value.kpis.conversionRate || 0;
  return Math.round((current - previous) * 100) / 100;
};

const getAOVChange = (): number => {
  if (!previousStats.value) return 0;
  const current = stats.value?.kpis.averageOrderValue || 0;
  const previous = previousStats.value.kpis.averageOrderValue || 0;
  return previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;
};

const dataSourceClass = computed(() => {
  return isRealData.value
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";
});

// Lifecycle
onMounted(() => {
  fetchStats();

  // Auto-refresh toutes les 30 secondes pour un dashboard vraiment dynamique
  setInterval(() => {
    if (!isLoading.value) {
      fetchStats();
    }
  }, 30 * 1000);
});

// SEO
useHead({
  title: "Dashboard Admin - Test EduShop",
  meta: [
    {
      name: "description",
      content: "Tableau de bord administrateur avancé avec KPI temps réel",
    },
  ],
});
</script>
