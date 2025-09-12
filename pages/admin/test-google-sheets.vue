<!-- /pages/admin/test-google-sheets.vue -->
<template>
  <div class="p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">
        Test Google Sheets Integration
      </h1>

      <!-- Configuration Status -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Configuration</h2>

        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                config.sheetId ? 'bg-green-500' : 'bg-red-500',
              ]"
            ></div>
            <span class="text-sm">
              Sheet ID: {{ config.sheetId || "Non configuré" }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                config.apiKey ? 'bg-green-500' : 'bg-red-500',
              ]"
            ></div>
            <span class="text-sm">
              API Key: {{ config.apiKey ? "Configuré" : "Non configuré" }}
            </span>
          </div>
        </div>

        <!-- Instructions -->
        <div class="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 class="font-medium text-blue-800 mb-2">Instructions:</h3>
          <ol class="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Créez un Google Sheet et copiez son ID depuis l'URL</li>
            <li>Activez l'API Google Sheets dans Google Cloud Console</li>
            <li>
              Créez une clé API et ajoutez-la aux variables d'environnement
            </li>
            <li>
              Ajoutez GOOGLE_SHEET_ID et GOOGLE_SHEETS_API_KEY à votre fichier
              .env
            </li>
          </ol>
        </div>
      </div>

      <!-- Test Form -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Test de commande</h2>

        <form @submit.prevent="testOrder" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nom du client
              </label>
              <input
                v-model="testData.customer.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                v-model="testData.customer.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                v-model="testData.customer.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                v-model="testData.shipping.city"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <textarea
              v-model="testData.shipping.address"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="isLoading || !canTest"
              class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? "Test en cours..." : "Tester la commande" }}
            </button>

            <button
              type="button"
              @click="createHeaders"
              :disabled="isLoading || !canTest"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer les en-têtes
            </button>
          </div>
        </form>
      </div>

      <!-- Results -->
      <div v-if="result" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">Résultat</h2>

        <div
          :class="[
            'p-4 rounded-lg',
            result.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200',
          ]"
        >
          <div class="flex items-center gap-2 mb-2">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                result.success ? 'bg-green-500' : 'bg-red-500',
              ]"
            ></div>
            <span
              :class="[
                'font-medium',
                result.success ? 'text-green-800' : 'text-red-800',
              ]"
            >
              {{ result.success ? "Succès" : "Erreur" }}
            </span>
          </div>

          <pre class="text-sm whitespace-pre-wrap">{{
            JSON.stringify(result, null, 2)
          }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });

// Données de test
const testData = ref({
  customer: {
    name: "Test Client",
    email: "test@example.com",
    phone: "221123456789",
  },
  shipping: {
    address: "123 Rue Test",
    city: "Dakar",
    method: "Livraison standard",
    cost: 2000,
  },
  items: [
    {
      name: "Pack CP complet",
      quantity: 1,
      price: 15000,
    },
    {
      name: "Cahier 200 pages",
      quantity: 3,
      price: 500,
    },
  ],
  amounts: {
    subtotal: 16500,
    shipping: 2000,
    discount: 0,
    total: 18500,
  },
});

// État de la configuration
const config = ref({
  sheetId: "",
  apiKey: "",
});

// État du test
const isLoading = ref(false);
const result = ref<any>(null);

// Vérifier si le test peut être effectué
const canTest = computed(() => {
  return config.value.sheetId && config.value.apiKey;
});

// Charger la configuration au montage
onMounted(async () => {
  try {
    const response = await $fetch("/api/admin/config/google-sheets");
    config.value = response;
  } catch (error) {
    console.error("Erreur lors du chargement de la config:", error);
  }
});

// Tester une commande
const testOrder = async () => {
  isLoading.value = true;
  result.value = null;

  try {
    const response = await $fetch("/api/admin/test/google-sheets", {
      method: "POST",
      body: testData.value,
    });

    result.value = response;
  } catch (error: any) {
    result.value = {
      success: false,
      error: error.message || "Erreur inconnue",
      details: error,
    };
  } finally {
    isLoading.value = false;
  }
};

// Créer les en-têtes
const createHeaders = async () => {
  isLoading.value = true;
  result.value = null;

  try {
    const response = await $fetch("/api/admin/test/google-sheets-headers", {
      method: "POST",
    });

    result.value = response;
  } catch (error: any) {
    result.value = {
      success: false,
      error: error.message || "Erreur lors de la création des en-têtes",
      details: error,
    };
  } finally {
    isLoading.value = false;
  }
};
</script>
