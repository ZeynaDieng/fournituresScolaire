<!-- pages/test/create-order.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          🧪 Créer une commande de test
        </h1>

        <form @submit.prevent="createTestOrder" class="space-y-6">
          <!-- Informations client -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-3">
              👤 Informations client
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  v-model="form.customer.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="Test User"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  v-model="form.customer.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="test@example.com"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  v-model="form.customer.phone"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="+221701234567"
                />
              </div>
            </div>
          </div>

          <!-- Articles -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-3">
              🛍️ Articles
            </h2>
            <div class="space-y-3">
              <div
                v-for="(item, index) in form.items"
                :key="index"
                class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <input
                  v-model="item.name"
                  type="text"
                  placeholder="Nom du produit"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
                <input
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  placeholder="Qté"
                  class="w-20 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
                <input
                  v-model.number="item.price"
                  type="number"
                  min="0"
                  placeholder="Prix"
                  class="w-32 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
                <button
                  type="button"
                  @click="removeItem(index)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  ✕
                </button>
              </div>
            </div>

            <button
              type="button"
              @click="addItem"
              class="mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ➕ Ajouter un article
            </button>
          </div>

          <!-- Méthode de paiement -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-3">
              💳 Méthode de paiement
            </h2>
            <select
              v-model="form.target_payment"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            >
              <option value="">Toutes les méthodes</option>
              <option value="Orange Money">Orange Money</option>
              <option value="Free Money">Free Money</option>
              <option value="Wave">Wave</option>
              <option value="Carte Bancaire">Carte Bancaire</option>
            </select>
          </div>

          <!-- Total -->
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">Total</span>
              <span class="text-xl font-bold text-blue-600">
                {{ formatAmount(totalAmount) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-4">
            <button
              type="submit"
              :disabled="loading || totalAmount === 0"
              class="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <span v-if="loading">🔄 Création...</span>
              <span v-else>🚀 Créer et payer</span>
            </button>

            <NuxtLink
              to="/test/payment-debug"
              class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-center"
            >
              📊 Diagnostic
            </NuxtLink>
          </div>
        </form>

        <!-- Résultat -->
        <div
          v-if="result"
          class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <h3 class="text-green-800 font-semibold">
            ✅ Commande créée avec succès
          </h3>
          <p class="text-green-700">Référence: {{ result.ref_command }}</p>
          <p class="text-green-700">
            URL de paiement: {{ result.redirect_url }}
          </p>

          <div class="mt-3">
            <a
              :href="result.redirect_url"
              target="_blank"
              class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              💳 Aller au paiement
            </a>
          </div>
        </div>

        <!-- Erreur -->
        <div
          v-if="error"
          class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
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
  title: "Créer commande de test - EduShop",
});

// États
const loading = ref(false);
const error = ref<string | null>(null);
const result = ref<any>(null);

// Formulaire
const form = reactive({
  customer: {
    name: "Test User",
    email: "test@example.com",
    phone: "+221701234567",
  },
  items: [
    { name: "Stylo Plume Test", quantity: 2, price: 5000 },
    { name: "Cahier Test", quantity: 3, price: 2500 },
  ],
  target_payment: "Orange Money",
  shipping: {
    address: "Adresse de test, Dakar",
    city: "Dakar",
    method: "standard",
    cost: 2000,
  },
});

// Computed
const totalAmount = computed(() => {
  const itemsTotal = form.items.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);
  return itemsTotal + form.shipping.cost;
});

// Fonctions
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

const addItem = () => {
  form.items.push({ name: "", quantity: 1, price: 0 });
};

const removeItem = (index: number) => {
  form.items.splice(index, 1);
};

const createTestOrder = async () => {
  try {
    loading.value = true;
    error.value = null;
    result.value = null;

    const paymentData = {
      amount: totalAmount.value,
      currency: "XOF",
      customer: form.customer,
      items: form.items,
      shipping: form.shipping,
      target_payment: form.target_payment || "",
    };

    const response = await $fetch("/api/paytech/initiate", {
      method: "POST",
      body: paymentData,
    });

    result.value = response;
  } catch (err: any) {
    error.value =
      err.data?.message ||
      err.message ||
      "Erreur lors de la création de la commande";
  } finally {
    loading.value = false;
  }
};
</script>
