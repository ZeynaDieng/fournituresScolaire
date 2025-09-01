<!-- pages/test-paytech.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Test PayTech Integration
        </h1>
        <p class="text-gray-600">
          Page de test pour vérifier l'intégration PayTech complète
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Formulaire de test -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-6">Simuler un paiement</h2>

          <form @submit.prevent="initiatePayment" class="space-y-4">
            <!-- Montant -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Montant (XOF)
              </label>
              <input
                v-model.number="testData.amount"
                type="number"
                min="100"
                max="1000000"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ex: 15000"
              />
            </div>

            <!-- Informations client -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  v-model="testData.customer.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Mamadou Diallo"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  v-model="testData.customer.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="mamadou@example.com"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                v-model="testData.customer.phone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="77 123 45 67"
              />
            </div>

            <!-- Méthode de paiement -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Méthode de paiement
              </label>
              <select
                v-model="testData.target_payment"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Toutes les méthodes</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Carte Bancaire">Carte Bancaire</option>
                <option value="Free Money">Free Money</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Wave">Wave</option>
              </select>
            </div>

            <!-- Nom de l'article -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'article
              </label>
              <input
                v-model="testData.item_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Pack CP - Fournitures scolaires"
              />
            </div>

            <!-- Boutons de soumission -->
            <div class="space-y-3">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                {{ isLoading ? "Traitement..." : "Tester PayTech Réel" }}
              </button>

              <button
                type="button"
                @click="testMockPaytech"
                :disabled="isLoading"
                class="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🧪 Tester Mock PayTech (Local)
              </button>
            </div>
          </form>
        </div>

        <!-- Résultats et logs -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-6">Résultats</h2>

          <!-- Statut -->
          <div v-if="paymentStatus" class="mb-6">
            <div class="flex items-center mb-2">
              <div
                :class="[
                  'w-3 h-3 rounded-full mr-2',
                  paymentStatus === 'success'
                    ? 'bg-green-500'
                    : paymentStatus === 'error'
                    ? 'bg-red-500'
                    : 'bg-yellow-500',
                ]"
              ></div>
              <span class="font-medium">
                {{
                  paymentStatus === "success"
                    ? "Succès"
                    : paymentStatus === "error"
                    ? "Erreur"
                    : "En cours"
                }}
              </span>
            </div>

            <div v-if="paymentResult" class="bg-gray-50 rounded-md p-4">
              <h3 class="font-medium mb-2">Réponse PayTech:</h3>
              <pre class="text-sm text-gray-700 overflow-auto">{{
                JSON.stringify(paymentResult, null, 2)
              }}</pre>
            </div>
          </div>

          <!-- Erreur -->
          <div v-if="error" class="mb-6">
            <div class="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 class="font-medium text-red-800 mb-2">Erreur:</h3>
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>

          <!-- Actions de test -->
          <div class="space-y-3">
            <h3 class="font-medium text-gray-900">Actions de test:</h3>

            <button
              @click="testWebhook"
              :disabled="isTestingWebhook"
              class="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50"
            >
              {{ isTestingWebhook ? "Test en cours..." : "Tester Webhook IPN" }}
            </button>

            <button
              @click="checkPaymentStatus"
              :disabled="!lastToken || isCheckingStatus"
              class="w-full py-2 px-4 border border-gray-600 text-gray-600 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              {{ isCheckingStatus ? "Vérification..." : "Vérifier Statut" }}
            </button>

            <button
              @click="testRefund"
              :disabled="!lastToken || isTestingRefund"
              class="w-full py-2 px-4 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50 disabled:opacity-50"
            >
              {{
                isTestingRefund ? "Remboursement..." : "Tester Remboursement"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta
useHead({
  title: "Test PayTech - EduShop",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

// Vérification dev seulement
if (process.env.NODE_ENV === "production") {
  throw createError({
    statusCode: 404,
    statusMessage: "Page non trouvée",
  });
}

// Types
interface PayTechResponse {
  success: boolean;
  token?: string;
  redirect_url?: string;
  ref_command?: string;
  amount: number;
  payment_method?: string;
  data?: any;
}

// States
const isLoading = ref(false);
const isTestingWebhook = ref(false);
const isCheckingStatus = ref(false);
const isTestingRefund = ref(false);
const paymentStatus = ref<"loading" | "success" | "error" | null>(null);
const paymentResult = ref<PayTechResponse | null>(null);
const error = ref("");
const lastToken = ref("");

// Données de test
const testData = ref({
  amount: 15000,
  customer: {
    name: "Mamadou Diallo",
    email: "mamadou.diallo@example.com",
    phone: "771234567",
  },
  target_payment: "",
  item_name: "Pack CP - Fournitures scolaires complètes",
  items: [
    {
      name: "Pack CP",
      quantity: 1,
      price: 15000,
    },
  ],
});

// Méthodes
const initiatePayment = async () => {
  isLoading.value = true;
  paymentStatus.value = "loading";
  error.value = "";
  paymentResult.value = null;

  try {
    const response = await $fetch<PayTechResponse>("/api/paytech/initiate", {
      method: "POST",
      body: {
        ...testData.value,
        currency: "XOF",
        ref_command: `TEST_${Date.now()}`,
      },
    });

    paymentStatus.value = "success";
    paymentResult.value = response;
    lastToken.value = response.token || "";

    // Redirection automatique après 3 secondes
    setTimeout(() => {
      if (response.redirect_url) {
        window.open(response.redirect_url, "_blank");
      }
    }, 3000);
  } catch (err: any) {
    paymentStatus.value = "error";
    error.value = err.data?.message || err.message || "Erreur inconnue";
  } finally {
    isLoading.value = false;
  }
};

// Test Mock PayTech
const testMockPaytech = async () => {
  isLoading.value = true;
  paymentStatus.value = "loading";
  error.value = "";
  paymentResult.value = null;

  try {
    const response = await $fetch<PayTechResponse>(
      "/api/paytech-mock/initiate",
      {
        method: "POST",
        body: {
          ...testData.value,
          currency: "XOF",
          ref_command: `MOCK_TEST_${Date.now()}`,
        },
      }
    );

    paymentStatus.value = "success";
    paymentResult.value = response;
    lastToken.value = response.token || "";

    // Redirection automatique vers la gateway mock après 2 secondes
    setTimeout(() => {
      if (response.redirect_url) {
        window.open(response.redirect_url, "_blank");
      }
    }, 2000);
  } catch (err: any) {
    paymentStatus.value = "error";
    error.value = err.data?.message || err.message || "Erreur Mock PayTech";
  } finally {
    isLoading.value = false;
  }
};

const testWebhook = async () => {
  isTestingWebhook.value = true;

  try {
    // Simuler un webhook de test
    const webhookData = {
      type_event: "sale_complete",
      custom_field: JSON.stringify({
        order_id: `TEST_${Date.now()}`,
        test: true,
      }),
      ref_command: `TEST_${Date.now()}`,
      item_price: testData.value.amount,
      item_name: testData.value.item_name,
      payment_method: "test",
      currency: "XOF",
    };

    const response = await $fetch("/api/paytech/webhook", {
      method: "POST",
      body: webhookData,
    });

    console.log("Webhook testé avec succès:", response);
  } catch (err: any) {
    console.error("Erreur webhook:", err);
  } finally {
    isTestingWebhook.value = false;
  }
};

const checkPaymentStatus = async () => {
  if (!lastToken.value) return;

  isCheckingStatus.value = true;

  try {
    const status = await $fetch(`/api/paytech/status/${lastToken.value}`);
    console.log("Statut du paiement:", status);
  } catch (err: any) {
    console.error("Erreur vérification statut:", err);
  } finally {
    isCheckingStatus.value = false;
  }
};

const testRefund = async () => {
  if (!lastToken.value) return;

  isTestingRefund.value = true;

  try {
    const refund = await $fetch("/api/paytech/refund", {
      method: "POST",
      body: {
        token: lastToken.value,
        amount: testData.value.amount,
        reason: "Test de remboursement",
      },
    });

    console.log("Remboursement testé:", refund);
  } catch (err: any) {
    console.error("Erreur remboursement:", err);
  } finally {
    isTestingRefund.value = false;
  }
};
</script>
