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
import { useRoute } from "vue-router";
import { printOfficialInvoice } from "~/utils/invoice-generator";

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
const orderRef = ref((route.query.ref as string) || (route.query.ref_command as string) || "N/A");
const orderAmount = ref(parseInt(route.query.amount as string) || 0);
const paymentMethod = ref((route.query.method as string) || "PayTech");

// Fallback depuis localStorage si besoin
const loadLocalOrder = () => {
  if (!process.client) return;
  const refKey = orderRef.value && orderRef.value !== "N/A" ? orderRef.value : "";
  let saved = refKey ? localStorage.getItem(`order_${refKey}`) : null;
  if (!saved) saved = localStorage.getItem("last_order");

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed) {
        if (!orderRef.value || orderRef.value === "N/A") {
          orderRef.value = parsed.orderRef || parsed.ref || `REF-${Date.now().toString().slice(-6)}`;
        }

        const calculatedItems = parsed.items && parsed.items.length > 0 ? parsed.items.map((i: any) => ({
          name: i.name || i.title || "Article EduShop",
          quantity: Number(i.quantity || 1),
          price: Number(i.price || i.unitPrice || 0),
        })) : [];

        const itemsSum = calculatedItems.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);
        const shippingFee = Number(parsed.shippingFee || 0);
        const totalVal = Number(parsed.total || parsed.amount || (itemsSum + shippingFee));

        if (totalVal > 0) {
          orderAmount.value = totalVal;
        }

        orderData.value = {
          id: parsed.id || orderRef.value,
          orderRef: orderRef.value,
          amount: totalVal,
          paymentMethod: parsed.paymentMethod || paymentMethod.value || "PayTech",
          status: "confirmed",
          customerName: parsed.customerName || "Client EduShop",
          customerEmail: parsed.customerEmail || parsed.email || "",
          createdAt: parsed.createdAt || parsed.date || new Date().toLocaleDateString("fr-FR"),
          items: calculatedItems,
        };

        // Marquer la commande comme payée/confirmée dans le localStorage
        parsed.status = "confirmed";
        localStorage.setItem(`order_${orderRef.value}`, JSON.stringify(parsed));
        localStorage.setItem("last_order", JSON.stringify(parsed));

        // Mettre à jour l'historique utilisateur dans local_storage
        const existingUserOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
        if (Array.isArray(existingUserOrders)) {
          const matchingIdx = existingUserOrders.findIndex((o: any) => (o.ref === orderRef.value || o.orderRef === orderRef.value));
          if (matchingIdx !== -1) {
            existingUserOrders[matchingIdx].status = "confirmed";
          } else {
            existingUserOrders.unshift({
              ref: orderRef.value,
              orderRef: orderRef.value,
              customerName: parsed.customerName || "Client EduShop",
              phone: parsed.customerPhone || parsed.phone || "",
              email: parsed.customerEmail || parsed.email || "",
              total: totalVal,
              amount: totalVal,
              status: "confirmed",
              items: calculatedItems,
              paymentMethod: parsed.paymentMethod || "PayTech",
              date: new Date().toLocaleDateString("fr-FR"),
            });
          }
          localStorage.setItem("user_orders", JSON.stringify(existingUserOrders));
        }

        // Mettre à jour la base des utilisateurs
        const allUsers = JSON.parse(localStorage.getItem("all_users") || "[]");
        const clientPhone = parsed.customerPhone || parsed.phone;
        const clientEmail = parsed.customerEmail || parsed.email;
        if (clientPhone || clientEmail) {
          if (!allUsers.some((u: any) => (clientPhone && u.phone === clientPhone) || (clientEmail && u.email === clientEmail))) {
            allUsers.unshift({
              name: parsed.customerName || "Client EduShop",
              phone: clientPhone || "+221770000000",
              email: clientEmail || "client@edushop.sn",
              city: parsed.city || parsed.address || "Dakar",
              role: "Parent / Client",
              active: true,
            });
            localStorage.setItem("all_users", JSON.stringify(allUsers));
          }
        }
      }
    } catch (e) {
      console.warn("Notice lecture fallback local:", e);
    }
  }
};

// Fonction pour récupérer les données de la commande depuis Airtable
const fetchOrderData = async () => {
  loadLocalOrder();

  if (!orderRef.value || orderRef.value === "N/A") {
    isLoading.value = false;
    return;
  }

  try {
    const response = await fetch(`/api/airtable/orders/${orderRef.value}`, {
      method: "GET",
    });

    if (response.ok) {
      const data: ApiResponse = await response.json();
      if (data.success && data.order && data.order.amount > 0) {
        orderData.value = data.order;
        orderAmount.value = data.order.amount;
        paymentMethod.value = data.order.paymentMethod || "PayTech";
      }
    }
  } catch (err: any) {
    console.warn("Notice API Airtable order fetch:", err);
  } finally {
    // Si amount est toujours 0, ré-essayer le fallback local
    if (orderAmount.value === 0 || !orderData.value || orderData.value.amount === 0) {
      loadLocalOrder();
    }
    isLoading.value = false;
  }

  // Tenter de notifier le serveur pour changer le statut de la commande en Paid
  if (orderRef.value && orderRef.value !== "N/A") {
    try {
      $fetch(`/api/airtable/orders/${orderRef.value}/status`, {
        method: "PATCH",
        body: { status: "Paid" },
      }).catch((e) => console.warn("Notice update status PATCH non-bloquant:", e));
    } catch (e) {}
  }
};

// Methods
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

const formatDate = (date: any): string => {
  if (!date) return new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "long", day: "numeric" }).format(new Date());
  if (date instanceof Date) {
    if (!isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
    }
    return new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "long", day: "numeric" }).format(new Date());
  }
  if (typeof date === "string") {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(parsedDate);
    }
    return date; // Déjà formaté sous forme de texte (ex: "23 septembre 2026 à 13:34")
  }
  return String(date);
};

const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    paid: "Payé & Confirmé",
    confirmed: "Payé & Confirmé",
    pending: "En attente",
    cancelled: "Annulé",
    processing: "En traitement",
    completed: "Terminé",
  };
  return statusMap[status] || "Payé & Confirmé";
};

const downloadInvoicePDF = () => {
  loadLocalOrder();

  const orderToPrint = {
    ref: orderRef.value && orderRef.value !== "N/A" ? orderRef.value : `REF-${Date.now().toString().slice(-6)}`,
    customerName: orderData.value?.customerName || "Client EduShop",
    phone: "",
    email: orderData.value?.customerEmail || "",
    city: "Dakar",
    address: "Dakar",
    total: orderAmount.value || orderData.value?.amount || 0,
    paymentMethod: paymentMethod.value || "PayTech",
    createdAt: orderData.value?.createdAt || new Date().toLocaleDateString("fr-FR"),
    items: orderData.value?.items || [],
  };

  printOfficialInvoice(orderToPrint);
};

// Charger les données au montage
onMounted(async () => {
  await fetchOrderData();
});
</script>
