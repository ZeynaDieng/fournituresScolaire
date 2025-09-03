<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <AdminSidebar
      :sidebar-open="sidebarOpen"
      :pending-orders="stats.pendingOrders"
      @toggle-sidebar="toggleSidebar"
      @close-sidebar="closeSidebar"
    />

    <!-- Main content -->
    <div class="lg:ml-64">
      <!-- Top header -->
      <header class="bg-white shadow-sm border-b">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center">
            <button
              @click="toggleSidebar"
              class="text-gray-500 hover:text-gray-700 lg:hidden mr-4"
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
            <h1 class="text-2xl font-bold text-gray-900">Statistiques</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500"
              >Dernière mise à jour: {{ lastUpdated }}</span
            >
            <button
              @click="refreshStats"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                class="w-5 h-5"
                :class="{ 'animate-spin': loading }"
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
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="p-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Chiffre d'affaires -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">
                  Chiffre d'affaires
                </p>
                <p class="text-3xl font-bold text-gray-900">
                  {{ formatCurrency(stats.revenue) }}
                </p>
                <p
                  class="text-sm"
                  :class="
                    stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  "
                >
                  <span
                    >{{ stats.revenueGrowth >= 0 ? "+" : ""
                    }}{{ stats.revenueGrowth }}%</span
                  >
                  <span class="text-gray-500 ml-1">vs mois dernier</span>
                </p>
              </div>
              <div class="p-3 bg-emerald-100 rounded-lg">
                <svg
                  class="w-6 h-6 text-emerald-600"
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
          </div>

          <!-- Commandes -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Commandes</p>
                <p class="text-3xl font-bold text-gray-900">
                  {{ stats.totalOrders }}
                </p>
                <p
                  class="text-sm"
                  :class="
                    stats.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  "
                >
                  <span
                    >{{ stats.ordersGrowth >= 0 ? "+" : ""
                    }}{{ stats.ordersGrowth }}%</span
                  >
                  <span class="text-gray-500 ml-1">ce mois</span>
                </p>
              </div>
              <div class="p-3 bg-blue-100 rounded-lg">
                <OrderIcon :size="24" class="text-blue-600" />
              </div>
            </div>
          </div>

          <!-- Clients -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Clients</p>
                <p class="text-3xl font-bold text-gray-900">
                  {{ stats.totalCustomers }}
                </p>
                <p
                  class="text-sm"
                  :class="
                    stats.customersGrowth >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  "
                >
                  <span
                    >{{ stats.customersGrowth >= 0 ? "+" : ""
                    }}{{ stats.customersGrowth }}%</span
                  >
                  <span class="text-gray-500 ml-1">nouveaux</span>
                </p>
              </div>
              <div class="p-3 bg-purple-100 rounded-lg">
                <UserIcon :size="24" class="text-purple-600" />
              </div>
            </div>
          </div>

          <!-- Panier moyen -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Panier moyen</p>
                <p class="text-3xl font-bold text-gray-900">
                  {{ formatCurrency(stats.averageOrderValue) }}
                </p>
                <p
                  class="text-sm"
                  :class="
                    stats.aovGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  "
                >
                  <span
                    >{{ stats.aovGrowth >= 0 ? "+" : ""
                    }}{{ stats.aovGrowth }}%</span
                  >
                  <span class="text-gray-500 ml-1">vs précédent</span>
                </p>
              </div>
              <div class="p-3 bg-orange-100 rounded-lg">
                <svg
                  class="w-6 h-6 text-orange-600"
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
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Graphique des ventes -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">
                Évolution des ventes
              </h3>
              <select
                v-model="salesPeriod"
                class="text-sm border border-gray-300 rounded-md px-3 py-1"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
              </select>
            </div>
            <div class="h-64 flex items-center justify-center text-gray-500">
              <!-- Ici vous pouvez intégrer Chart.js ou autre -->
              <div class="text-center">
                <svg
                  class="w-16 h-16 mx-auto mb-4 text-gray-400"
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
                <p>Graphique des ventes ({{ salesPeriod }})</p>
              </div>
            </div>
          </div>

          <!-- Top produits -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">
              Produits les plus vendus
            </h3>
            <div class="space-y-4">
              <div
                v-for="(product, index) in stats.topProducts"
                :key="product.id"
                class="flex items-center justify-between"
              >
                <div class="flex items-center">
                  <span
                    class="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-medium mr-3"
                  >
                    {{ index + 1 }}
                  </span>
                  <div>
                    <p class="font-medium text-gray-900">{{ product.name }}</p>
                    <p class="text-sm text-gray-500">
                      {{ product.sales }} ventes
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">
                    {{ formatCurrency(product.revenue) }}
                  </p>
                  <div class="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      class="bg-emerald-500 h-2 rounded-full"
                      :style="{
                        width: `${
                          (product.sales / stats.topProducts[0].sales) * 100
                        }%`,
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tables Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Commandes récentes -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="p-6 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">
                  Commandes récentes
                </h3>
                <NuxtLink
                  to="/admin/orders"
                  class="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Voir tout →
                </NuxtLink>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="order in stats.recentOrders"
                  :key="order.id"
                  class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div class="flex items-center">
                    <div
                      class="w-2 h-2 rounded-full mr-3"
                      :class="getOrderStatusColor(order.status)"
                    ></div>
                    <div>
                      <p class="font-medium text-gray-900">#{{ order.ref }}</p>
                      <p class="text-sm text-gray-500">
                        {{ formatDate(order.createdAt) }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900">
                      {{ formatCurrency(order.total) }}
                    </p>
                    <p class="text-sm text-gray-500 capitalize">
                      {{ order.status }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statut des commandes -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="p-6 border-b border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900">
                Statut des commandes
              </h3>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="status in stats.ordersByStatus"
                  :key="status.status"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center">
                    <div
                      class="w-3 h-3 rounded-full mr-3"
                      :class="getOrderStatusColor(status.status)"
                    ></div>
                    <span class="font-medium text-gray-900 capitalize">{{
                      status.status
                    }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="font-semibold text-gray-900 mr-3">{{
                      status.count
                    }}</span>
                    <div class="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        class="h-2 rounded-full"
                        :class="getOrderStatusBg(status.status)"
                        :style="{
                          width: `${(status.count / stats.totalOrders) * 100}%`,
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// Protection par middleware
definePageMeta({
  middleware: "admin",
  layout: "admin",
});

// State
const sidebarOpen = ref(false);
const loading = ref(false);
const salesPeriod = ref("30d");

// Mock data - à remplacer par de vraies données API
const stats = ref({
  revenue: 125840,
  revenueGrowth: 12.5,
  totalOrders: 342,
  ordersGrowth: 8.3,
  pendingOrders: 15,
  totalCustomers: 156,
  customersGrowth: 15.2,
  averageOrderValue: 368,
  aovGrowth: -2.1,
  topProducts: [
    { id: 1, name: "Pack CP Complet", sales: 45, revenue: 13500 },
    { id: 2, name: "Cahiers Spirales x10", sales: 38, revenue: 11400 },
    { id: 3, name: "Pack CE2 Standard", sales: 32, revenue: 9600 },
    { id: 4, name: "Stylos Multicouleurs", sales: 28, revenue: 8400 },
    { id: 5, name: "Pack CM1 Premium", sales: 25, revenue: 7500 },
  ],
  recentOrders: [
    {
      id: 1,
      ref: "CMD-2025-001",
      status: "paid",
      total: 450,
      createdAt: new Date(),
    },
    {
      id: 2,
      ref: "CMD-2025-002",
      status: "pending",
      total: 320,
      createdAt: new Date(),
    },
    {
      id: 3,
      ref: "CMD-2025-003",
      status: "completed",
      total: 680,
      createdAt: new Date(),
    },
    {
      id: 4,
      ref: "CMD-2025-004",
      status: "paid",
      total: 290,
      createdAt: new Date(),
    },
    {
      id: 5,
      ref: "CMD-2025-005",
      status: "cancelled",
      total: 150,
      createdAt: new Date(),
    },
  ],
  ordersByStatus: [
    { status: "completed", count: 234 },
    { status: "paid", count: 78 },
    { status: "pending", count: 25 },
    { status: "cancelled", count: 5 },
  ],
});

// Computed
const lastUpdated = computed(() => {
  return new Date().toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

// Methods
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

const refreshStats = async () => {
  loading.value = true;
  // Simuler un appel API
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getOrderStatusColor = (status: string) => {
  const colors = {
    completed: "bg-green-500",
    paid: "bg-blue-500",
    pending: "bg-yellow-500",
    cancelled: "bg-red-500",
  };
  return colors[status as keyof typeof colors] || "bg-gray-500";
};

const getOrderStatusBg = (status: string) => {
  const colors = {
    completed: "bg-green-500",
    paid: "bg-blue-500",
    pending: "bg-yellow-500",
    cancelled: "bg-red-500",
  };
  return colors[status as keyof typeof colors] || "bg-gray-500";
};

// Lifecycle
onMounted(() => {
  // Charger les vraies données au montage
  refreshStats();
});
</script>
