<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
        <p class="mt-2 text-gray-600">
          Gérez les statuts et suivez les commandes WhatsApp
        </p>
      </div>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Total</h3>
              <p class="text-2xl font-bold text-blue-600">{{ stats.total }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">En attente</h3>
              <p class="text-2xl font-bold text-yellow-600">
                {{ stats.pending }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Confirmées</h3>
              <p class="text-2xl font-bold text-green-600">
                {{ stats.confirmed }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Payées</h3>
              <p class="text-2xl font-bold text-purple-600">{{ stats.paid }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire de mise à jour de statut -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            Mettre à jour le statut d'une commande
          </h2>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="updateStatus" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Référence de commande
                </label>
                <input
                  v-model="updateForm.orderRef"
                  type="text"
                  placeholder="WA-1234567890"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Statut de la commande
                </label>
                <select
                  v-model="updateForm.orderStatus"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="En attente">En attente</option>
                  <option value="Confirmée">Confirmée</option>
                  <option value="Expédiée">Expédiée</option>
                  <option value="Livrée">Livrée</option>
                  <option value="Annulée">Annulée</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  État du paiement
                </label>
                <select
                  v-model="updateForm.paymentStatus"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="Non payé">Non payé</option>
                  <option value="Payé">Payé</option>
                  <option value="Remboursé">Remboursé</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Date de paiement
                </label>
                <input
                  v-model="updateForm.paymentDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Notes administratives
              </label>
              <textarea
                v-model="updateForm.adminNotes"
                rows="3"
                placeholder="Notes sur la commande..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading || !updateForm.orderRef"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? "Mise à jour..." : "Mettre à jour" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Actions rapides</h2>
        </div>
        <div class="px-6 py-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <NuxtLink
              to="/admin/commandes-locales"
              class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fill-rule="evenodd"
                  d="M4 5a2 2 0 012-2v1a2 2 0 002 2h6a2 2 0 002-2V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                  clip-rule="evenodd"
                />
              </svg>
              Voir toutes les commandes
            </NuxtLink>

            <button
              @click="downloadExcel"
              :disabled="loading"
              class="flex items-center justify-center px-4 py-3 border border-green-300 rounded-md text-green-700 hover:bg-green-50 disabled:opacity-50"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              📊 Télécharger Excel
            </button>

            <button
              @click="syncGoogleSheets"
              :disabled="loading"
              class="flex items-center justify-center px-4 py-3 border border-blue-300 rounded-md text-blue-700 hover:bg-blue-50 disabled:opacity-50"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clip-rule="evenodd"
                />
              </svg>
              🔄 Sync Google Sheets
            </button>

            <a
              :href="googleSheetsUrl"
              target="_blank"
              class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clip-rule="evenodd"
                />
              </svg>
              📈 Ouvrir Google Sheets
            </a>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div v-if="message" class="fixed bottom-4 right-4 max-w-md">
        <div
          :class="[
            'px-4 py-3 rounded-md shadow-lg',
            message.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white',
          ]"
        >
          {{ message.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

// État réactif
const loading = ref(false);
const message = ref(null);

// Formulaire de mise à jour
const updateForm = ref({
  orderRef: "",
  orderStatus: "",
  paymentStatus: "",
  paymentDate: "",
  adminNotes: "",
});

// Statistiques (simulées pour le moment)
const stats = ref({
  total: 0,
  pending: 0,
  confirmed: 0,
  paid: 0,
});

// URL Google Sheets
const googleSheetsUrl = computed(() => {
  const config = useRuntimeConfig();
  const sheetId =
    process.env.GOOGLE_SHEET_ID ||
    "1H5QEGhyaXB5A3ZBz9xqRqGp0CM508k4YyMZUtygTjl0";
  return `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
});

// Fonction pour mettre à jour le statut
const updateStatus = async () => {
  if (!updateForm.value.orderRef) {
    showMessage("Veuillez entrer une référence de commande", "error");
    return;
  }

  loading.value = true;

  try {
    const { data } = await $fetch("/api/admin/orders/update-status", {
      method: "POST",
      body: {
        orderRef: updateForm.value.orderRef,
        status: updateForm.value.orderStatus || undefined,
        paymentStatus: updateForm.value.paymentStatus || undefined,
        paymentDate: updateForm.value.paymentDate || undefined,
        adminNotes: updateForm.value.adminNotes || undefined,
      },
    });

    showMessage(
      "✅ Statut mis à jour avec succès! Excel et Google Sheets synchronisés.",
      "success"
    );

    // Réinitialiser le formulaire
    updateForm.value = {
      orderRef: "",
      orderStatus: "",
      paymentStatus: "",
      paymentDate: "",
      adminNotes: "",
    };
  } catch (error) {
    console.error("Erreur mise à jour:", error);
    showMessage(
      error.data?.message || "Erreur lors de la mise à jour",
      "error"
    );
  } finally {
    loading.value = false;
  }
};

// Fonction pour télécharger le fichier Excel
const downloadExcel = async () => {
  try {
    loading.value = true;
    showMessage("📊 Téléchargement du fichier Excel...", "success");
    window.open("/api/admin/orders/excel-master", "_blank");
  } catch (error) {
    console.error("Erreur téléchargement Excel:", error);
    showMessage("Erreur lors du téléchargement", "error");
  } finally {
    loading.value = false;
  }
};

// Fonction pour synchroniser avec Google Sheets
const syncGoogleSheets = async () => {
  try {
    loading.value = true;
    showMessage("🔄 Synchronisation avec Google Sheets...", "success");

    const response = await $fetch("/api/admin/sync-google-sheets", {
      method: "POST",
    });

    if (response.success) {
      showMessage(`✅ ${response.message}`, "success");
    } else {
      showMessage(`❌ ${response.message}`, "error");
    }
  } catch (error) {
    console.error("Erreur synchronisation:", error);
    showMessage("Erreur lors de la synchronisation", "error");
  } finally {
    loading.value = false;
  }
};

// Fonction pour afficher les messages
const showMessage = (text, type) => {
  message.value = { text, type };
  setTimeout(() => {
    message.value = null;
  }, 5000);
};

// Titre de la page
useHead({
  title: "Gestion des Commandes - Admin Fournitures Scolaires",
});
</script>
