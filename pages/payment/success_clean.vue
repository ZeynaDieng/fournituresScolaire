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
      <div class="bg-white shadow rounded-lg p-6">
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
              formatDate(new Date())
            }}</span>
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
        <button
          @click="downloadInvoice"
          :disabled="isDownloading"
          class="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
        >
          <svg
            v-if="!isDownloading"
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
          <svg
            v-else
            class="animate-spin h-4 w-4 mr-2"
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
          {{ isDownloading ? "Génération..." : "Télécharger la facture" }}
        </button>

        <NuxtLink
          to="/"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-green hover:bg-primary-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
        >
          Retour à l'accueil
        </NuxtLink>

        <NuxtLink
          to="/orders"
          class="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
        >
          Voir mes commandes
        </NuxtLink>
      </div>

      <!-- Support -->
      <div class="text-center">
        <p class="text-xs text-gray-500">
          Besoin d'aide ?
          <NuxtLink
            to="/contact"
            class="text-primary-green hover:text-primary-dark-green font-medium"
          >
            Contactez-nous
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta
useHead({
  title: "Paiement réussi - EduShop",
  meta: [
    {
      name: "description",
      content:
        "Votre paiement a été traité avec succès. Merci pour votre confiance.",
    },
  ],
});

// States
const route = useRoute();
const isDownloading = ref(false);

// Récupération des paramètres
const orderRef = ref((route.query.ref as string) || "N/A");
const orderAmount = ref(parseInt(route.query.amount as string) || 0);
const paymentMethod = ref((route.query.method as string) || "PayTech");

// Methods
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const downloadInvoice = async () => {
  if (!orderRef.value || orderRef.value === "N/A") {
    return;
  }

  isDownloading.value = true;

  try {
    // Simuler le téléchargement de facture
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Ici, vous pourriez appeler une API pour générer et télécharger la facture
    // const response = await $fetch(`/api/orders/${orderRef.value}/invoice`);

    console.log(
      `Téléchargement de la facture pour la commande ${orderRef.value}`
    );
  } catch (error) {
    console.error("Erreur lors du téléchargement de la facture:", error);
  } finally {
    isDownloading.value = false;
  }
};

// Vérification du statut de paiement au montage
onMounted(async () => {
  if (orderRef.value && orderRef.value !== "N/A") {
    try {
      // Optionnel: vérifier le statut final avec PayTech
      // const status = await $fetch(`/api/paytech/status/${orderRef.value}`);
      console.log(
        `Confirmation du paiement pour la commande ${orderRef.value}`
      );
    } catch (error) {
      console.error("Erreur lors de la vérification du statut:", error);
    }
  }
});
</script>
