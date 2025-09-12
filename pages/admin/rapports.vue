<!-- /pages/admin/rapports.vue -->
<template>
  <div class="p-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">
        📊 Rapports et Analytics
      </h1>

      <!-- KPIs Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Commandes totales</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ metrics.totalOrders }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
                />
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">CA du mois</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ formatCurrency(metrics.monthlyRevenue) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Nouveaux clients</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ metrics.newCustomers }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">
                Commandes WhatsApp
              </p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ metrics.whatsappOrders }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Google Sheets Status -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">
            📊 Intégration Google Sheets
          </h2>
          <div
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              sheetsStatus.configured
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800',
            ]"
          >
            {{ sheetsStatus.configured ? "Configuré" : "Non configuré" }}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center space-x-3">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                sheetsStatus.sheetId ? 'bg-green-500' : 'bg-red-500',
              ]"
            ></div>
            <span class="text-sm text-gray-600">Sheet ID</span>
          </div>

          <div class="flex items-center space-x-3">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                sheetsStatus.apiKey ? 'bg-green-500' : 'bg-red-500',
              ]"
            ></div>
            <span class="text-sm text-gray-600">API Key</span>
          </div>

          <div class="flex items-center space-x-3">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                sheetsStatus.lastSync ? 'bg-green-500' : 'bg-yellow-500',
              ]"
            ></div>
            <span class="text-sm text-gray-600">
              {{
                sheetsStatus.lastSync
                  ? `Dernière sync: ${sheetsStatus.lastSync}`
                  : "Pas encore synchronisé"
              }}
            </span>
          </div>
        </div>

        <div class="mt-4 flex space-x-4">
          <NuxtLink
            to="/admin/test-google-sheets"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Tester l'intégration
          </NuxtLink>

          <button
            @click="openGoogleSheets"
            :disabled="!sheetsStatus.sheetId"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
          >
            Ouvrir Google Sheets
          </button>
        </div>
      </div>

      <!-- Commandes récentes -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">
            📋 Commandes récentes
          </h2>
          <NuxtLink
            to="/admin/orders-airtable"
            class="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            Voir toutes →
          </NuxtLink>
        </div>

        <div
          v-if="recentOrders.length === 0"
          class="text-center py-8 text-gray-500"
        >
          <svg
            class="w-12 h-12 mx-auto mb-4 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M5 4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5zm0 2h10v8H5V6z"
              clip-rule="evenodd"
            />
          </svg>
          <p>Aucune commande pour le moment</p>
          <p class="text-sm mt-1">
            Les nouvelles commandes WhatsApp apparaîtront ici
          </p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ order.ref }}</p>
                <p class="text-sm text-gray-600">{{ order.customerName }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900">
                {{ formatCurrency(order.total) }}
              </p>
              <span
                :class="[
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                  order.status === 'pending_whatsapp'
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ getStatusText(order.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });

// Métriques simulées (à remplacer par de vraies données)
const metrics = ref({
  totalOrders: 0,
  monthlyRevenue: 0,
  newCustomers: 0,
  whatsappOrders: 0,
});

// Statut Google Sheets
const sheetsStatus = ref({
  configured: false,
  sheetId: false,
  apiKey: false,
  lastSync: null as string | null,
});

// Commandes récentes
const recentOrders = ref([]);

// Formatage
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusText = (status: string) => {
  const statusMap = {
    pending_whatsapp: "En attente WhatsApp",
    completed: "Terminée",
    cancelled: "Annulée",
    processing: "En traitement",
  };
  return statusMap[status] || status;
};

// Ouvrir Google Sheets
const openGoogleSheets = () => {
  if (sheetsStatus.value.sheetId) {
    // Construire l'URL du Google Sheet
    const sheetId = process.env.GOOGLE_SHEET_ID; // À récupérer de la config
    window.open(
      `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
      "_blank"
    );
  }
};

// Charger les données au montage
onMounted(async () => {
  try {
    // Charger le statut Google Sheets
    const configResponse = await $fetch("/api/admin/config/google-sheets");
    sheetsStatus.value = {
      configured: configResponse.configured,
      sheetId: !!configResponse.sheetId,
      apiKey: !!configResponse.apiKey,
      lastSync: null, // À implémenter
    };

    // Charger les métriques (simulées pour l'instant)
    metrics.value = {
      totalOrders: 24,
      monthlyRevenue: 450000,
      newCustomers: 8,
      whatsappOrders: 24,
    };

    // Charger les commandes récentes (simulées)
    recentOrders.value = [
      {
        id: 1,
        ref: "WA-2024090101",
        customerName: "Aminata Sow",
        total: 25000,
        status: "pending_whatsapp",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        ref: "WA-2024090102",
        customerName: "Moussa Diallo",
        total: 18500,
        status: "completed",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
  }
});
</script>
