<!-- pages/mock-paytech-gateway.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
      <!-- Header PayTech Mock -->
      <div
        class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white text-center"
      >
        <div class="text-2xl font-bold mb-2">🔒 PayTech (MOCK)</div>
        <p class="text-blue-100 text-sm">Passerelle de paiement simulée</p>
      </div>

      <!-- Informations de paiement -->
      <div class="p-6">
        <div class="text-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">
            Confirmation de paiement
          </h2>
          <p class="text-gray-600 text-sm">Commande: {{ ref }}</p>
        </div>

        <!-- Montant -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Montant à payer:</span>
            <span class="text-2xl font-bold text-gray-800"
              >{{ formatAmount(amount) }} FCFA</span
            >
          </div>
        </div>

        <!-- Options de paiement mock -->
        <div class="space-y-3 mb-6">
          <div class="text-sm font-medium text-gray-700 mb-3">
            Choisir un mode de paiement :
          </div>

          <label
            v-for="method in paymentMethods"
            :key="method.id"
            class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
            :class="{
              'border-blue-500 bg-blue-50': selectedMethod.value === method.id,
            }"
          >
            <input
              type="radio"
              :value="method.id"
              v-model="selectedMethod.value"
              class="text-blue-600 focus:ring-blue-500"
            />
            <div class="ml-3 flex items-center">
              <span class="text-lg mr-2">{{ method.icon }}</span>
              <span class="font-medium">{{ method.name }}</span>
            </div>
          </label>
        </div>

        <!-- Simulation status -->
        <div v-if="processing.value" class="text-center py-4">
          <div class="inline-flex items-center space-x-2 text-blue-600">
            <div
              class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
            ></div>
            <span>Traitement en cours...</span>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div v-else class="space-y-3">
          <button
            @click="simulatePayment('success')"
            :disabled="!selectedMethod.value"
            class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            ✅ Simuler Paiement Réussi
          </button>

          <button
            @click="simulatePayment('failure')"
            class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            ❌ Simuler Échec de Paiement
          </button>

          <button
            @click="simulatePayment('cancel')"
            class="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            🚫 Annuler le Paiement
          </button>
        </div>

        <!-- Info développement -->
        <div class="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="text-xs text-yellow-800">
            <strong>Mode Développement:</strong> Cette page simule l'interface
            PayTech pour les tests locaux. <br />Token:
            <code class="text-xs">{{ token }}</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const route = useRoute();
const router = useRouter();

// Paramètres de l'URL
const token = route.query.token as string;
const ref = route.query.ref as string;
const amount = parseInt(route.query.amount as string) || 0;

// État du composant
const selectedMethod = reactive({ value: "mobile_money" });
const processing = reactive({ value: false });

// Méthodes de paiement mock
const paymentMethods = [
  { id: "mobile_money", name: "Orange Money / Wave", icon: "📱" },
  { id: "card", name: "Carte Bancaire", icon: "💳" },
  { id: "bank_transfer", name: "Virement Bancaire", icon: "🏦" },
];

// Formatage du montant
const formatAmount = (amount: number) => {
  return amount.toLocaleString("fr-SN");
};

// Simulation du paiement
const simulatePayment = async (result: "success" | "failure" | "cancel") => {
  processing.value = true;

  try {
    // Simulation d'un délai de traitement
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Appel du webhook mock pour notifier notre serveur
    await $fetch("/api/paytech-mock/webhook", {
      method: "POST",
      body: {
        token,
        ref_command: ref,
        status:
          result === "success"
            ? "paid"
            : result === "cancel"
            ? "canceled"
            : "failed",
        payment_method:
          paymentMethods.find((m) => m.id === selectedMethod.value)?.name ||
          "Mock",
        amount: amount,
        transaction_id: `mock_txn_${Date.now()}`,
        mock: true,
      },
    });

    // Redirection selon le résultat
    if (result === "success") {
      await router.push(
        `/payment/success?ref=${ref}&method=${selectedMethod.value}&mock=true`
      );
    } else if (result === "cancel") {
      await router.push(`/payment/cancel?ref=${ref}&mock=true`);
    } else {
      await router.push(
        `/payment/cancel?ref=${ref}&error=payment_failed&mock=true`
      );
    }
  } catch (error) {
    console.error("Erreur simulation paiement:", error);
    alert("Erreur lors de la simulation");
  } finally {
    processing.value = false;
  }
};

// Vérification des paramètres requis
onMounted(() => {
  if (!token || !ref || !amount) {
    console.error("Paramètres manquants pour la simulation PayTech");
    router.push("/");
  }
});
</script>

<style scoped>
code {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}
</style>
