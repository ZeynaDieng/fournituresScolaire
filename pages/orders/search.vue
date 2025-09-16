<!-- pages/orders/search.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <!-- En-tête -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Rechercher ma commande
        </h1>
        <p class="text-gray-600">
          Entrez votre email, numéro de téléphone ou ID de commande
        </p>
      </div>

      <!-- Formulaire de recherche -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <form @submit.prevent="searchOrder" class="space-y-4">
          <!-- Champ de recherche -->
          <div>
            <label
              for="search"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email, téléphone ou ID de commande
            </label>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="ex: client@email.com, +221777780456, CMD_123..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :disabled="isSearching"
              required
            />
          </div>

          <!-- Bouton de recherche -->
          <button
            type="submit"
            :disabled="isSearching || !searchQuery.trim()"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="isSearching"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              class="-ml-1 mr-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            {{ isSearching ? "Recherche..." : "Rechercher" }}
          </button>
        </form>
      </div>

      <!-- Résultats de recherche -->
      <div v-if="searchResults.length > 0" class="space-y-4">
        <h2 class="text-lg font-medium text-gray-900">
          Commandes trouvées ({{ searchResults.length }})
        </h2>

        <div
          v-for="order in searchResults"
          :key="order.id"
          class="bg-white shadow rounded-lg p-6"
        >
          <!-- En-tête de la commande -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                Commande {{ order.orderRef }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </p>
            </div>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusClass(order.status)"
            >
              {{ getStatusLabel(order.status) }}
            </span>
          </div>

          <!-- Détails de la commande -->
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Client:</span>
              <span class="text-gray-900">{{ order.customerName }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Email:</span>
              <span class="text-gray-900">{{ order.customerEmail }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Téléphone:</span>
              <span class="text-gray-900">{{ order.customerPhone }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Montant:</span>
              <span class="text-gray-900 font-semibold">{{
                formatAmount(order.amount)
              }}</span>
            </div>
          </div>

          <!-- Articles commandés -->
          <div v-if="order.items && order.items.length > 0" class="mb-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Articles:</h4>
            <div class="space-y-1">
              <div
                v-for="(item, index) in order.items"
                :key="index"
                class="flex justify-between text-sm"
              >
                <span class="text-gray-600"
                  >{{ item.name }} (x{{ item.quantity }})</span
                >
                <span class="text-gray-900">{{
                  formatAmount(item.price * item.quantity)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3">
            <button
              @click="downloadInvoicePDF(order.orderRef)"
              :disabled="isDownloading"
              class="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="isDownloading"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <svg
                v-else
                class="-ml-1 mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                ></path>
              </svg>
              {{ isDownloading ? "Génération..." : "Télécharger PDF" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <svg
            class="h-5 w-5 text-red-400 mt-0.5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <h3 class="text-sm font-medium text-red-800">Erreur</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Message de succès -->
      <div
        v-if="successMessage"
        class="bg-green-50 border border-green-200 rounded-lg p-4"
      >
        <div class="flex">
          <svg
            class="h-5 w-5 text-green-400 mt-0.5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <h3 class="text-sm font-medium text-green-800">Succès</h3>
            <p class="text-sm text-green-700 mt-1">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Lien vers l'accueil -->
      <div class="text-center mt-8">
        <NuxtLink
          to="/"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Retour à l'accueil
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Types
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderRef: string;
  amount: number;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  items?: OrderItem[];
}

interface SearchResponse {
  success: boolean;
  orders: Order[];
  message?: string;
}

// Meta
useHead({
  title: "Rechercher ma commande - EduShop",
  meta: [
    {
      name: "description",
      content:
        "Recherchez votre commande par email, téléphone ou ID de commande",
    },
  ],
});

// States
const searchQuery = ref("");
const isSearching = ref(false);
const isDownloading = ref(false);
const searchResults = ref<Order[]>([]);
const error = ref("");
const successMessage = ref("");

// Methods
const searchOrder = async () => {
  if (!searchQuery.value.trim()) return;

  isSearching.value = true;
  error.value = "";
  successMessage.value = "";
  searchResults.value = [];

  try {
    const response = await fetch("/api/orders/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: searchQuery.value.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data: SearchResponse = await response.json();

    if (data.success) {
      searchResults.value = data.orders;
      if (data.orders.length === 0) {
        error.value = "Aucune commande trouvée avec ces critères";
      } else {
        successMessage.value = `${data.orders.length} commande(s) trouvée(s)`;
      }
    } else {
      error.value = data.message || "Erreur lors de la recherche";
    }
  } catch (err: any) {
    console.error("Erreur recherche commande:", err);
    error.value = err.message || "Erreur lors de la recherche";
  } finally {
    isSearching.value = false;
  }
};

const downloadInvoicePDF = async (orderRef: string) => {
  isDownloading.value = true;

  try {
    const pdfUrl = `/api/airtable/orders/${orderRef}/invoice-pdf`;

    // Créer un lien de téléchargement temporaire
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `facture-${orderRef}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    successMessage.value = `Facture PDF téléchargée pour la commande ${orderRef}`;
  } catch (error: any) {
    console.error("Erreur téléchargement PDF:", error);
    this.error = "Erreur lors du téléchargement du PDF";
  } finally {
    isDownloading.value = false;
  }
};

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    paid: "Payé",
    pending: "En attente",
    cancelled: "Annulé",
    processing: "En traitement",
    completed: "Terminé",
  };
  return statusMap[status] || status;
};

const getStatusClass = (status: string): string => {
  const classMap: Record<string, string> = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };
  return classMap[status] || "bg-gray-100 text-gray-800";
};
</script>
