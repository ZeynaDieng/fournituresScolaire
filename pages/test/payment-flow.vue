<!-- pages/test/payment-flow.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          🧪 Test du Flux de Paiement Complet
        </h1>

        <!-- Étape 1: Créer une commande de test -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Étape 1: Créer une commande de test
          </h2>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p class="text-blue-800 mb-3">
              Créez d'abord une commande pour tester le flux de paiement
            </p>
            <button
              @click="createTestOrder"
              :disabled="creatingOrder"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ creatingOrder ? "Création..." : "Créer une commande test" }}
            </button>
          </div>

          <div
            v-if="testOrder"
            class="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <h3 class="text-green-800 font-semibold mb-2">
              ✅ Commande créée :
            </h3>
            <p><strong>Référence :</strong> {{ testOrder.ref }}</p>
            <p><strong>Montant :</strong> {{ testOrder.total }} CFA</p>
            <p><strong>Status :</strong> {{ testOrder.status }}</p>
          </div>
        </div>

        <!-- Étape 2: Simuler le paiement -->
        <div class="mb-8" v-if="testOrder">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Étape 2: Simuler le paiement réussi
          </h2>
          <div
            class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4"
          >
            <p class="text-yellow-800 mb-3">
              Simuler la réception d'un webhook PayTech de paiement réussi
            </p>
            <div class="flex gap-4 items-center">
              <button
                @click="simulatePayment"
                :disabled="simulatingPayment"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {{
                  simulatingPayment
                    ? "Simulation..."
                    : "Simuler paiement réussi"
                }}
              </button>
              <select v-model="paymentMethod" class="border rounded px-3 py-2">
                <option value="Orange Money">Orange Money</option>
                <option value="Wave">Wave</option>
                <option value="Free Money">Free Money</option>
                <option value="Carte Bancaire">Carte Bancaire</option>
              </select>
            </div>
          </div>

          <div
            v-if="paymentResult"
            class="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <h3 class="text-green-800 font-semibold mb-2">
              ✅ Paiement simulé :
            </h3>
            <p><strong>Message :</strong> {{ paymentResult.message }}</p>
            <p>
              <strong>Status commande :</strong>
              {{ paymentResult.order_status }}
            </p>
            <p>
              <strong>Paiement créé :</strong>
              {{ paymentResult.payment_created ? "Oui" : "Non" }}
            </p>
          </div>
        </div>

        <!-- Étape 3: Vérifier les résultats -->
        <div class="mb-8" v-if="paymentResult">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Étape 3: Vérifier les résultats en base de données
          </h2>
          <button
            @click="checkResults"
            :disabled="checkingResults"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 mb-4"
          >
            {{ checkingResults ? "Vérification..." : "Vérifier en BDD" }}
          </button>

          <div v-if="dbResults" class="space-y-4">
            <!-- Commande -->
            <div class="bg-gray-50 border rounded-lg p-4">
              <h3 class="font-semibold mb-2">📦 Commande</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Référence :</strong> {{ dbResults.order.ref }}
                </div>
                <div>
                  <strong>Status :</strong>
                  <span
                    :class="{
                      'text-green-600': dbResults.order.status === 'paid',
                      'text-yellow-600': dbResults.order.status === 'pending',
                      'text-red-600': dbResults.order.status === 'canceled',
                    }"
                  >
                    {{ dbResults.order.status }}
                  </span>
                </div>
                <div>
                  <strong>Montant :</strong> {{ dbResults.order.total }} CFA
                </div>
                <div>
                  <strong>Date :</strong>
                  {{ formatDate(dbResults.order.createdAt) }}
                </div>
              </div>
            </div>

            <!-- Paiement -->
            <div
              v-if="dbResults.payment"
              class="bg-gray-50 border rounded-lg p-4"
            >
              <h3 class="font-semibold mb-2">💳 Paiement</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Provider :</strong> {{ dbResults.payment.provider }}
                </div>
                <div>
                  <strong>Status :</strong>
                  <span
                    :class="{
                      'text-green-600':
                        dbResults.payment.status === 'completed',
                      'text-yellow-600': dbResults.payment.status === 'pending',
                      'text-red-600': dbResults.payment.status === 'failed',
                    }"
                  >
                    {{ dbResults.payment.status }}
                  </span>
                </div>
                <div>
                  <strong>Montant :</strong> {{ dbResults.payment.amount }} CFA
                </div>
                <div>
                  <strong>ID PayTech :</strong>
                  {{ dbResults.payment.paytechId }}
                </div>
              </div>
            </div>

            <div v-else class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-800">
                ❌ Aucun paiement trouvé pour cette commande
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="border-t pt-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div class="flex flex-wrap gap-4">
            <NuxtLink
              to="/test/payment-debug"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              📊 Diagnostic complet
            </NuxtLink>
            <NuxtLink
              to="/checkout"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              🛒 Tester checkout réel
            </NuxtLink>
            <button
              @click="resetTest"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              🔄 Nouveau test
            </button>
          </div>
        </div>

        <!-- Messages d'erreur -->
        <div
          v-if="error"
          class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <h3 class="text-red-800 font-semibold">❌ Erreur</h3>
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuration de la page
useHead({
  title: "Test Flux de Paiement - EduShop",
});

// États
const creatingOrder = ref(false);
const simulatingPayment = ref(false);
const checkingResults = ref(false);
const paymentMethod = ref("Orange Money");
const error = ref<string | null>(null);

const testOrder = ref<any>(null);
const paymentResult = ref<any>(null);
const dbResults = ref<any>(null);

// Fonctions utilitaires
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("fr-FR");
};

// Créer une commande de test
const createTestOrder = async () => {
  creatingOrder.value = true;
  error.value = null;

  try {
    const orderData = {
      customer: {
        name: "Test User",
        email: "test@example.com",
        phone: "+221701234567",
      },
      items: [
        {
          id: "test-item-1",
          name: "Article de test",
          price: 5000,
          quantity: 1,
        },
      ],
      amount: 5000,
      currency: "XOF",
      target_payment: "Orange Money",
    };

    const response = (await $fetch("/api/paytech/initiate", {
      method: "POST",
      body: orderData,
    })) as any;

    if (response.success) {
      testOrder.value = {
        ref: response.ref_command,
        total: response.amount,
        status: "pending",
      };
    } else {
      throw new Error("Erreur lors de la création de la commande");
    }
  } catch (err: any) {
    error.value = err.message || "Erreur lors de la création de la commande";
  } finally {
    creatingOrder.value = false;
  }
};

// Simuler un paiement réussi
const simulatePayment = async () => {
  if (!testOrder.value) return;

  simulatingPayment.value = true;
  error.value = null;

  try {
    const response = await $fetch("/api/test/simulate-payment-success", {
      method: "POST",
      body: {
        ref_command: testOrder.value.ref,
        amount: testOrder.value.total,
        payment_method: paymentMethod.value,
      },
    });

    paymentResult.value = response;
  } catch (err: any) {
    error.value = err.message || "Erreur lors de la simulation du paiement";
  } finally {
    simulatingPayment.value = false;
  }
};

// Vérifier les résultats en base de données
const checkResults = async () => {
  if (!testOrder.value) return;

  checkingResults.value = true;
  error.value = null;

  try {
    const response = await $fetch("/api/test/payment-debug");

    if (response.success && response.data.database.lastOrders.length > 0) {
      // Trouver notre commande de test
      const order = response.data.database.lastOrders.find(
        (o: any) => o.ref === testOrder.value.ref
      );

      if (order) {
        dbResults.value = {
          order: order,
          payment: order.hasPayment
            ? {
                provider: "paytech",
                status: order.paymentStatus,
                amount: order.total,
                paytechId: "TEST_" + Date.now(),
              }
            : null,
        };
      } else {
        throw new Error("Commande non trouvée en base de données");
      }
    } else {
      throw new Error("Erreur lors de la récupération des données");
    }
  } catch (err: any) {
    error.value = err.message || "Erreur lors de la vérification";
  } finally {
    checkingResults.value = false;
  }
};

// Réinitialiser le test
const resetTest = () => {
  testOrder.value = null;
  paymentResult.value = null;
  dbResults.value = null;
  error.value = null;
  paymentMethod.value = "Orange Money";
};
</script>
