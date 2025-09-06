<!-- pages/orders.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900">Mes commandes</h1>
        <p class="mt-2 text-sm text-gray-600">
          Consultez l'historique et le statut de vos commandes
        </p>
      </div>

      <!-- Formulaire de recherche par email -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <div class="max-w-md mx-auto">
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Rechercher mes commandes
          </label>
          <div class="flex space-x-3">
            <input
              v-model="searchEmail"
              type="email"
              id="email"
              name="email"
              placeholder="votre-email@example.com"
              class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :disabled="isLoading"
            />
            <button
              @click="searchOrders"
              :disabled="isLoading || !searchEmail"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
              {{ isLoading ? "Recherche..." : "Rechercher" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Résultats -->
      <div v-if="hasSearched">
        <!-- Aucune commande trouvée -->
        <div v-if="!isLoading && orders.length === 0" class="text-center py-12">
          <svg
            class="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            Aucune commande trouvée
          </h3>
          <p class="mt-2 text-sm text-gray-500">
            Aucune commande n'a été trouvée pour cette adresse email.
          </p>
        </div>

        <!-- Liste des commandes -->
        <div v-else-if="!isLoading" class="space-y-6">
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white shadow rounded-lg p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  Commande {{ order.orderRef }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </p>
              </div>
              <div class="flex items-center space-x-3">
                <span
                  :class="getStatusClass(order.status)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
                <span class="text-lg font-semibold text-gray-900">
                  {{ formatAmount(order.amount) }}
                </span>
              </div>
            </div>

            <!-- Détails de la commande -->
            <div class="border-t border-gray-200 pt-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-500">Client :</span>
                  <span class="ml-2 text-gray-900">{{
                    order.customerName || "N/A"
                  }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-500">Email :</span>
                  <span class="ml-2 text-gray-900">{{
                    order.customerEmail || "N/A"
                  }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-500">Téléphone :</span>
                  <span class="ml-2 text-gray-900">{{
                    order.customerPhone || "N/A"
                  }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-500">Méthode :</span>
                  <span class="ml-2 text-gray-900">{{
                    order.paymentMethod || "PayTech"
                  }}</span>
                </div>
              </div>

              <!-- Articles commandés -->
              <div v-if="order.items && order.items.length > 0" class="mt-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">
                  Articles :
                </h4>
                <div class="bg-gray-50 rounded-lg p-3 space-y-2">
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
              <div class="mt-4 flex flex-wrap gap-3">
                <button
                  @click="downloadInvoice(order.orderRef)"
                  :disabled="isDownloading[order.orderRef]"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <svg
                    class="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {{
                    isDownloading[order.orderRef]
                      ? "Téléchargement..."
                      : "Télécharger facture"
                  }}
                </button>

                <NuxtLink
                  :to="`/contact?order=${order.orderRef}`"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Contacter le support
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message d'aide -->
      <div class="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex">
          <svg
            class="h-5 w-5 text-blue-400 mt-0.5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <h3 class="text-sm font-medium text-blue-900">Aide</h3>
            <div class="mt-2 text-sm text-blue-700">
              <p>
                Saisissez l'adresse email utilisée lors de votre commande pour
                retrouver vos achats.
              </p>
              <p class="mt-1">
                Besoin d'aide ?
                <NuxtLink to="/contact" class="underline"
                  >Contactez-nous</NuxtLink
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

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
  paymentMethod?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  createdAt: string;
  items?: OrderItem[];
}

interface ApiResponse {
  success: boolean;
  orders?: Order[];
  message?: string;
}

// Meta
useHead({
  title: "Mes commandes - Fournitures Scolaires",
  meta: [
    {
      name: "description",
      content:
        "Consultez l'historique et le statut de vos commandes de fournitures scolaires.",
    },
  ],
});

// States
const searchEmail = ref("");
const orders = ref<Order[]>([]);
const isLoading = ref(false);
const hasSearched = ref(false);
const isDownloading = reactive<Record<string, boolean>>({});

// Methods
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
  const statusClasses: Record<string, string> = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

const searchOrders = async () => {
  if (!searchEmail.value) return;

  isLoading.value = true;
  hasSearched.value = true;
  orders.value = [];

  try {
    const response = await $fetch<ApiResponse>(
      `/api/airtable/orders/by-email`,
      {
        method: "POST",
        body: { email: searchEmail.value },
      }
    );

    if (response.success && response.orders) {
      orders.value = response.orders;
    }
  } catch (error: any) {
    console.error("Erreur lors de la recherche des commandes:", error);
    // Afficher une notification d'erreur
    alert("Erreur lors de la recherche. Veuillez réessayer.");
  } finally {
    isLoading.value = false;
  }
};

const downloadInvoice = async (orderRef: string) => {
  isDownloading[orderRef] = true;

  try {
    const response = await $fetch<{ success: boolean; invoiceUrl?: string }>(
      `/api/airtable/orders/${orderRef}/invoice`
    );

    if (response.success && response.invoiceUrl) {
      const link = document.createElement("a");
      link.href = response.invoiceUrl;
      link.download = `facture-${orderRef}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      throw new Error("Impossible de générer la facture");
    }
  } catch (error: any) {
    console.error("Erreur téléchargement facture:", error);
    alert("Erreur lors du téléchargement. Veuillez réessayer.");
  } finally {
    isDownloading[orderRef] = false;
  }
};

// Auto-recherche si email dans l'URL
onMounted(() => {
  const route = useRoute();
  if (route.query.email) {
    searchEmail.value = route.query.email as string;
    searchOrders();
  }
});
</script>

<style scoped>
.primary-600 {
  background-color: rgb(34 197 94);
}
.primary-700 {
  background-color: rgb(21 128 61);
}
.primary-500 {
  border-color: rgb(34 197 94);
  --tw-ring-color: rgb(34 197 94);
}
.primary-100 {
  background-color: rgb(220 252 231);
}
.primary-200 {
  background-color: rgb(187 247 208);
}
</style>
