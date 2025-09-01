<!-- pages/test/payment-debug.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          🔍 Diagnostic des Paiements PayTech
        </h1>

        <div v-if="loading" class="text-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"
          ></div>
          <p class="mt-2 text-gray-600">Diagnostic en cours...</p>
        </div>

        <div
          v-else-if="error"
          class="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <h3 class="text-red-800 font-semibold">❌ Erreur</h3>
          <p class="text-red-700">{{ error }}</p>
        </div>

        <div v-else-if="diagnostics">
          <!-- Configuration -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">
              ⚙️ Configuration
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">PayTech configuré</span>
                  <span
                    :class="
                      diagnostics.config.paytechConfigured
                        ? 'text-green-600'
                        : 'text-red-600'
                    "
                  >
                    {{
                      diagnostics.config.paytechConfigured ? "✅ Oui" : "❌ Non"
                    }}
                  </span>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">Mode Sandbox</span>
                  <span class="text-blue-600">
                    {{
                      diagnostics.config.sandbox ? "🧪 Activé" : "🚀 Production"
                    }}
                  </span>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">Base URL</span>
                  <span
                    :class="
                      diagnostics.config.baseUrl
                        ? 'text-green-600'
                        : 'text-red-600'
                    "
                  >
                    {{ diagnostics.config.baseUrl || "❌ Non définie" }}
                  </span>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">Base de données</span>
                  <span
                    :class="
                      diagnostics.database.connected
                        ? 'text-green-600'
                        : 'text-red-600'
                    "
                  >
                    {{
                      diagnostics.database.connected
                        ? "✅ Connectée"
                        : "❌ Erreur"
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="mb-6" v-if="diagnostics.database.connected">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">
              📊 Statistiques
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-blue-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-blue-600">
                  {{ diagnostics.database.orders }}
                </div>
                <div class="text-blue-700">Commandes totales</div>
              </div>

              <div class="bg-green-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-green-600">
                  {{ diagnostics.database.payments }}
                </div>
                <div class="text-green-700">Paiements enregistrés</div>
              </div>
            </div>
          </div>

          <!-- Dernières commandes -->
          <div class="mb-6" v-if="diagnostics.database.lastOrders.length > 0">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">
              📋 Dernières commandes
            </h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Référence
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Statut
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Montant
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Paiement
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="order in diagnostics.database.lastOrders"
                    :key="order.ref"
                  >
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {{ order.ref }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="{
                          'bg-green-100 text-green-800':
                            order.status === 'paid',
                          'bg-yellow-100 text-yellow-800':
                            order.status === 'pending',
                          'bg-red-100 text-red-800':
                            order.status === 'canceled',
                        }"
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      >
                        {{ order.status }}
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ formatAmount(order.total) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        v-if="order.hasPayment"
                        :class="{
                          'bg-green-100 text-green-800':
                            order.paymentStatus === 'completed',
                          'bg-yellow-100 text-yellow-800':
                            order.paymentStatus === 'pending',
                          'bg-red-100 text-red-800':
                            order.paymentStatus === 'failed',
                        }"
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      >
                        {{ order.paymentStatus }}
                      </span>
                      <span v-else class="text-gray-400 text-sm">Aucun</span>
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ formatDate(order.createdAt) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recommandations -->
          <div v-if="diagnostics.recommendations.length > 0">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">
              💡 Recommandations
            </h2>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <ul class="list-disc list-inside space-y-1">
                <li
                  v-for="rec in diagnostics.recommendations"
                  :key="rec"
                  class="text-yellow-800"
                >
                  {{ rec }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Actions de test -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">
              🧪 Actions de test
            </h2>
            <div class="flex flex-wrap gap-4">
              <button
                @click="refreshDiagnostics"
                :disabled="loading"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                🔄 Actualiser
              </button>

              <NuxtLink
                to="/test/create-order"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                ➕ Créer une commande de test
              </NuxtLink>

              <NuxtLink
                to="/test/payment-flow"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                🧪 Test flux complet
              </NuxtLink>

              <NuxtLink
                to="/checkout"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                🛒 Tester le checkout
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaymentDiagnosticsResult, PaymentDiagnostics } from "~/types/api";

// Configuration de la page
useHead({
  title: "Diagnostic Paiements - EduShop",
});

// États
const loading = ref(true);
const error = ref<string | null>(null);
const diagnostics = ref<PaymentDiagnostics | null>(null);

// Fonctions utilitaires
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("fr-FR");
};

// Chargement des diagnostics
const loadDiagnostics = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await $fetch<PaymentDiagnosticsResult>(
      "/api/test/payment-debug"
    );

    if (response.success) {
      diagnostics.value = response.data;
    } else {
      error.value = response.error || "Erreur inconnue";
    }
  } catch (err: any) {
    error.value = err.message || "Erreur lors du diagnostic";
  } finally {
    loading.value = false;
  }
};

// Actualiser les diagnostics
const refreshDiagnostics = () => {
  loadDiagnostics();
};

// Chargement initial
onMounted(() => {
  loadDiagnostics();
});
</script>
