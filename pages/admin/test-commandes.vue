// /pages/admin/test-commandes.vue
<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4">📋 Test du Système de Commandes</h1>
      <p class="text-gray-600">
        Testez le stockage local et les notifications email
      </p>
    </div>

    <!-- Boutons de test -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <button
        @click="createTestOrder"
        :disabled="loading"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
      >
        {{ loading ? "Création..." : "🧪 Créer Commande Test" }}
      </button>

      <button
        @click="loadOrders"
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
      >
        🔄 Charger Commandes
      </button>

      <button
        @click="exportOrders"
        class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg"
      >
        📁 Exporter CSV
      </button>
    </div>

    <!-- Résultats -->
    <div
      v-if="result"
      class="mb-6 p-4 rounded-lg"
      :class="
        result.success
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      "
    >
      <h3 class="font-bold">
        {{ result.success ? "✅ Succès" : "❌ Erreur" }}
      </h3>
      <p>{{ result.message }}</p>
      <div v-if="result.orderRef" class="mt-2">
        <strong>Référence:</strong> {{ result.orderRef }}
      </div>
      <div v-if="result.emailSent !== undefined" class="mt-2">
        <strong>Email:</strong>
        {{ result.emailSent ? "✅ Envoyé" : "❌ Échoué" }}
        <div v-if="result.emailError" class="text-sm mt-1">
          <strong>Erreur email:</strong> {{ result.emailError }}
        </div>
      </div>
    </div>

    <!-- Statistiques -->
    <div v-if="stats" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-100 p-4 rounded-lg">
        <div class="text-2xl font-bold text-blue-600">{{ stats.total }}</div>
        <div class="text-blue-600">Total Commandes</div>
      </div>
      <div class="bg-green-100 p-4 rounded-lg">
        <div class="text-2xl font-bold text-green-600">
          {{ formatAmount(stats.totalRevenue) }}
        </div>
        <div class="text-green-600">Chiffre d'Affaires</div>
      </div>
      <div class="bg-yellow-100 p-4 rounded-lg">
        <div class="text-2xl font-bold text-yellow-600">
          {{ stats.pending }}
        </div>
        <div class="text-yellow-600">En Attente</div>
      </div>
      <div class="bg-purple-100 p-4 rounded-lg">
        <div class="text-2xl font-bold text-purple-600">{{ stats.today }}</div>
        <div class="text-purple-600">Aujourd'hui</div>
      </div>
    </div>

    <!-- Liste des commandes -->
    <div
      v-if="orders.length > 0"
      class="bg-white shadow rounded-lg overflow-hidden"
    >
      <div class="px-6 py-4 bg-gray-50 border-b">
        <h3 class="text-lg font-medium">
          Commandes récentes ({{ orders.length }})
        </h3>
      </div>

      <div class="divide-y divide-gray-200">
        <div
          v-for="order in orders.slice(0, 10)"
          :key="order.id"
          class="p-6 hover:bg-gray-50"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-900">{{
                  order.ref
                }}</span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(order.status)"
                >
                  {{ order.status }}
                </span>
              </div>
              <div class="mt-1">
                <p class="text-sm text-gray-600">{{ order.customer.name }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(order.timestamp) }}
                </p>
              </div>
            </div>

            <div class="text-right">
              <div class="text-lg font-semibold text-gray-900">
                {{ formatAmount(order.amounts?.total || order.total || 0) }}
              </div>
              <div class="text-sm text-gray-500">
                {{ order.source === "whatsapp" ? "📱 WhatsApp" : "🌐 Web" }}
              </div>
            </div>
          </div>

          <!-- Détails des articles -->
          <div
            v-if="order.items && order.items.length"
            class="mt-3 pt-3 border-t border-gray-200"
          >
            <div class="text-xs text-gray-600">
              <span v-for="(item, index) in order.items" :key="index">
                {{ item.name }} ({{ item.quantity }}){{
                  index < order.items.length - 1 ? ", " : ""
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuration Email -->
    <div class="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h3 class="text-lg font-medium text-yellow-800 mb-4">
        ⚙️ Configuration Email
      </h3>
      <div class="text-sm text-yellow-700 space-y-2">
        <p>
          <strong
            >Pour recevoir les notifications par email, configurez ces variables
            dans votre fichier .env :</strong
          >
        </p>
        <pre class="bg-yellow-100 p-3 rounded text-xs overflow-x-auto">
NOTIFICATION_EMAIL_USER=votre-email@gmail.com
NOTIFICATION_EMAIL_PASSWORD=votre-mot-de-passe-app-gmail
ADMIN_EMAIL=admin@fourniturescolaire.com
FROM_NAME=Fournitures Scolaires</pre
        >

        <div class="mt-4">
          <p><strong>Pour Gmail :</strong></p>
          <ol class="list-decimal list-inside space-y-1 text-xs">
            <li>
              Activer l'authentification à 2 facteurs sur votre compte Gmail
            </li>
            <li>
              Aller dans "Gestion du compte Google" > "Sécurité" > "Mots de
              passe d'application"
            </li>
            <li>Générer un mot de passe d'application pour "Mail"</li>
            <li>Utiliser ce mot de passe dans NOTIFICATION_EMAIL_PASSWORD</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Variables réactives
const orders = ref([]);
const stats = ref(null);
const result = ref(null);
const loading = ref(false);

// Créer une commande test
const createTestOrder = async () => {
  loading.value = true;
  result.value = null;

  try {
    const response = await $fetch("/api/test/create-order", {
      method: "POST",
    });

    result.value = response;

    // Recharger les commandes si succès
    if (response.success) {
      await loadOrders();
    }
  } catch (error) {
    console.error("Erreur création commande test:", error);
    result.value = {
      success: false,
      message: "Erreur lors de la création de la commande test",
    };
  } finally {
    loading.value = false;
  }
};

// Charger les commandes depuis le stockage local
const loadOrders = async () => {
  try {
    // Simuler un appel API local - pour l'instant on charge depuis le localStorage du navigateur
    const response = await $fetch("/api/admin/orders");
    if (response.success) {
      orders.value = response.data.orders || [];
      stats.value = response.data.stats;
    }
  } catch (error) {
    console.error("Erreur chargement commandes:", error);
    // Fallback: essayer de charger directement (simulation)
    const { getAllOrders, getOrdersStats } = await import(
      "~/utils/local-storage"
    );

    try {
      const allOrders = await getAllOrders();
      const orderStats = await getOrdersStats();

      orders.value = allOrders;
      stats.value = orderStats;
    } catch (localError) {
      console.error("Erreur chargement local:", localError);
    }
  }
};

// Exporter les commandes
const exportOrders = async () => {
  try {
    const { exportOrdersToCSV } = await import("~/utils/local-storage");
    const csvContent = await exportOrdersToCSV();

    // Créer un lien de téléchargement
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `commandes-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    result.value = {
      success: true,
      message: "Export CSV téléchargé avec succès",
    };
  } catch (error) {
    console.error("Erreur export:", error);
    result.value = {
      success: false,
      message: "Erreur lors de l'export CSV",
    };
  }
};

// Fonctions utilitaires
const formatAmount = (amount) => {
  return new Intl.NumberFormat("fr-FR").format(amount) + " CFA";
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("fr-FR");
};

const getStatusClass = (status) => {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800",
    pending_whatsapp: "bg-blue-100 text-blue-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

// Charger au montage
onMounted(() => {
  loadOrders();
});
</script>
