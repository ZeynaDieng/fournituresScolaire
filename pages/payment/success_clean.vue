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
        <NuxtLink
          to="/"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
        >
          Retour à l'accueil
        </NuxtLink>

        <!-- BOUTON WHATSAPP -->
        <button
          @click="sendOrderViaWhatsApp"
          class="w-full flex justify-center items-center py-3 px-4 border border-green-500 rounded-md shadow-sm bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.688"
            />
          </svg>
          Envoyer la commande sur WhatsApp
        </button>
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
const sendOrderViaWhatsApp = () => {
  const number = "221777780456"; // Numéro WhatsApp business
  const message = encodeURIComponent(
    `🛒 Nouvelle commande EduShop\n\nRéférence: ${
      orderRef.value
    }\nMontant: ${formatAmount(orderAmount.value)}\nMéthode: ${
      paymentMethod.value
    }\nDate: ${formatDate(new Date())}\n\nMerci pour votre confiance !`
  );
  const url = `https://wa.me/${number}?text=${message}`;
  window.open(url, "_blank");
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
    // const response = await $fetch(`/api/airtable/orders/${orderRef.value}/invoice`);

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
