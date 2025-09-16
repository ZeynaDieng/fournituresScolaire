<!-- pages/payment/success.vue -->
<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <!-- Animation de succès -->
      <div class="text-center">
        <div
          class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 animate-bounce"
        >
          <svg
            class="h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h1 class="mt-6 text-3xl font-extrabold text-gray-900">
          Paiement réussi !
        </h1>

        <p class="mt-2 text-sm text-gray-600">
          Votre commande a été confirmée et sera traitée dans les plus brefs
          délais.
        </p>
      </div>

      <!-- Détails de la commande -->
      <div v-if="isLoading" class="bg-white shadow rounded-lg p-6">
        <div class="animate-pulse">
          <div class="border-b border-gray-200 pb-4 mb-4">
            <div class="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between">
              <div class="h-3 bg-gray-200 rounded w-20"></div>
              <div class="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div class="flex justify-between">
              <div class="h-3 bg-gray-200 rounded w-16"></div>
              <div class="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div class="flex justify-between">
              <div class="h-3 bg-gray-200 rounded w-18"></div>
              <div class="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div class="flex justify-between">
              <div class="h-3 bg-gray-200 rounded w-12"></div>
              <div class="h-3 bg-gray-200 rounded w-28"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white shadow rounded-lg p-6">
        <div class="border-b border-gray-200 pb-4 mb-4">
          <h2 class="text-lg font-medium text-gray-900">
            Détails de la commande
          </h2>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Référence</span>
            <span class="text-sm text-gray-900 font-mono">{{ orderRef }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Montant</span>
            <span class="text-sm text-gray-900 font-semibold">{{
              formatAmount(orderAmount)
            }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Méthode</span>
            <span class="text-sm text-gray-900">{{
              paymentMethod || "PayTech"
            }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Date</span>
            <span class="text-sm text-gray-900">{{
              orderData?.createdAt
                ? formatDate(orderData.createdAt)
                : formatDate(new Date())
            }}</span>
          </div>

          <div v-if="orderData?.customerName" class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Client</span>
            <span class="text-sm text-gray-900">{{
              orderData.customerName
            }}</span>
          </div>

          <div v-if="orderData?.status" class="flex justify-between">
            <span class="text-sm font-medium text-gray-500">Statut</span>
            <span
              class="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full"
            >
              {{ getStatusLabel(orderData.status) }}
            </span>
          </div>
        </div>

        <!-- Détails des articles commandés -->
        <div
          v-if="orderData?.items && orderData.items.length > 0"
          class="mt-6 pt-4 border-t border-gray-200"
        >
          <h3 class="text-sm font-medium text-gray-900 mb-3">
            Articles commandés
          </h3>
          <div class="space-y-2">
            <div
              v-for="(item, index) in orderData.items"
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
      </div>

      <!-- Prochaines étapes -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
            <h3 class="text-sm font-medium text-blue-900">Prochaines étapes</h3>
            <div class="mt-2 text-sm text-blue-700">
              <ul class="list-disc list-inside space-y-1">
                <li>Vous recevrez un email de confirmation</li>
                <li>Préparation de votre commande sous 24h</li>
                <li>Suivi de livraison par SMS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="space-y-3">
        <!-- Boutons de téléchargement -->
        <div class="space-y-2">
          <button
            @click="downloadInvoicePDF"
            :disabled="isDownloadingPDF || !orderRef || orderRef === 'N/A'"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="isDownloadingPDF"
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
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              ></path>
            </svg>
            {{ isDownloadingPDF ? "Génération..." : "Télécharger PDF (HTML)" }}
          </button>
        </div>

        <NuxtLink
          to="/"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
        >
          Retour à l'accueil
        </NuxtLink>
      </div>

      <!-- Support -->
      <div class="text-center">
        <p class="text-xs text-gray-500">
          Besoin d'aide ?
          <NuxtLink
            to="/contact"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Contactez-nous
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// Types
interface OrderData {
  id: string;
  orderRef: string;
  amount: number;
  paymentMethod?: string;
  status: string;
  customerName?: string;
  customerEmail?: string;
  createdAt: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface ApiResponse {
  success: boolean;
  order?: OrderData;
  invoiceUrl?: string;
  message?: string;
}

// Composables Nuxt
const route = useRoute();

// Meta
useHead({
  title: "Paiement réussi - Fournitures Scolaires",
  meta: [
    {
      name: "description",
      content:
        "Votre paiement a été traité avec succès. Merci pour votre confiance.",
    },
  ],
});

// States
const isDownloading = ref(false);
const isDownloadingPDF = ref(false);
const isLoading = ref(true);
const orderData = ref<OrderData | null>(null);
const error = ref<string | null>(null);

// Récupération des paramètres URL (fallback)
const orderRef = ref((route.query.ref as string) || "N/A");
const orderAmount = ref(parseInt(route.query.amount as string) || 0);
const paymentMethod = ref((route.query.method as string) || "PayTech");

// Fonction pour récupérer les données de la commande depuis Airtable
const fetchOrderData = async () => {
  if (!orderRef.value || orderRef.value === "N/A") {
    error.value = "Référence de commande manquante";
    isLoading.value = false;
    return;
  }

  try {
    const response = await fetch(`/api/airtable/orders/${orderRef.value}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    if (data.success && data.order) {
      orderData.value = data.order;
      // Mettre à jour les données avec les vraies valeurs
      orderAmount.value = data.order.amount;
      paymentMethod.value = data.order.paymentMethod || "PayTech";
    } else {
      throw new Error("Commande non trouvée");
    }
  } catch (err: any) {
    console.error("Erreur récupération commande:", err);
    error.value =
      err.message || "Impossible de récupérer les données de la commande";
  } finally {
    isLoading.value = false;
  }
};

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

const downloadInvoice = async () => {
  if (!orderRef.value || orderRef.value === "N/A") {
    return;
  }

  isDownloading.value = true;

  try {
    // Ouvrir la facture dans une nouvelle fenêtre pour impression/téléchargement
    const invoiceUrl = `/api/airtable/orders/${orderRef.value}/invoice`;
    const newWindow = window.open(invoiceUrl, "_blank");

    if (newWindow) {
      // La facture s'ouvrira dans une nouvelle fenêtre avec un bouton d'impression
      console.log(`Facture ouverte pour la commande ${orderRef.value}`);
    } else {
      // Si les popups sont bloquées, naviguer directement
      window.location.href = invoiceUrl;
    }
  } catch (error: any) {
    console.error("Erreur lors de l'ouverture de la facture:", error);
    // Essayer la navigation directe en cas d'erreur
    window.location.href = `/api/airtable/orders/${orderRef.value}/invoice`;
  } finally {
    isDownloading.value = false;
  }
};

const downloadInvoicePDF = async () => {
  if (!orderRef.value || orderRef.value === "N/A") {
    return;
  }

  isDownloadingPDF.value = true;

  try {
    // Télécharger directement le PDF
    const pdfUrl = `/api/airtable/orders/${orderRef.value}/invoice-pdf`;

    // Créer un lien de téléchargement temporaire
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `facture-${orderRef.value}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`PDF téléchargé pour la commande ${orderRef.value}`);
  } catch (error: any) {
    console.error("Erreur lors du téléchargement du PDF:", error);
    // Essayer la navigation directe en cas d'erreur
    window.location.href = `/api/airtable/orders/${orderRef.value}/invoice-pdf`;
  } finally {
    isDownloadingPDF.value = false;
  }
};

// Charger les données au montage
onMounted(async () => {
  await fetchOrderData();

  // Vérification optionnelle du statut de paiement
  if (orderRef.value && orderRef.value !== "N/A") {
    try {
      console.log(
        `✅ Confirmation du paiement pour la commande ${orderRef.value}`
      );
    } catch (error) {
      console.error("Erreur lors de la vérification du statut:", error);
    }
  }
});

// Utiliser useFetch pour charger les données côté serveur
const {
  data: orderResponse,
  error: fetchError,
  pending,
} = await useFetch<ApiResponse>(`/api/airtable/orders/${orderRef.value}`, {
  server: true,
  default: () => ({ success: false, order: null }),
});

// Mettre à jour les données si disponibles
if (orderResponse.value?.success && orderResponse.value?.order) {
  orderData.value = orderResponse.value.order;
  orderAmount.value = orderResponse.value.order.amount;
  paymentMethod.value = orderResponse.value.order.paymentMethod || "PayTech";
  isLoading.value = false;
} else if (fetchError.value) {
  error.value = "Impossible de récupérer les données de la commande";
  isLoading.value = false;
}
</script>
