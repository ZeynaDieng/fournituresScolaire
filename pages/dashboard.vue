<!-- /pages/dashboard.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
  >
    <div class="container mx-auto px-4 py-8">
      <!-- Header avec animation -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 animate-pulse"
        >
          <span class="text-2xl">🎒</span>
        </div>
        <h1
          class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
        >
          Dashboard Fournitures Scolaires
        </h1>
        <p class="text-gray-600">
          Gestion complète de vos commandes en temps réel
        </p>
      </div>

      <!-- Actions rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button
          @click="refreshData"
          :disabled="loading"
          class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span v-if="loading" class="animate-spin">⏳</span>
          <span v-else>🔄</span>
          <span>{{ loading ? "Chargement..." : "Actualiser" }}</span>
        </button>

        <button
          @click="createTestOrder"
          class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>🧪</span>
          <span>Commande Test</span>
        </button>

        <button
          @click="downloadExcel"
          class="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>📊</span>
          <span>Excel Maître</span>
        </button>

        <button
          @click="exportCsv"
          class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>📁</span>
          <span>Export CSV</span>
        </button>
      </div>

      <!-- Messages de notification -->
      <div
        v-if="message"
        class="mb-6 p-4 rounded-xl shadow-lg"
        :class="getMessageClass(message.type)"
      >
        <div class="flex items-center space-x-3">
          <span class="text-2xl">{{
            message.type === "success" ? "✅" : "❌"
          }}</span>
          <div>
            <p class="font-semibold">
              {{ message.type === "success" ? "Succès" : "Erreur" }}
            </p>
            <p>{{ message.text }}</p>
          </div>
        </div>
      </div>

      <!-- Statistiques avec cartes modernes -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Commandes -->
        <div
          class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl"
            >
              <span class="text-2xl">📊</span>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-800">
                {{ orders.length }}
              </div>
              <div class="text-sm text-gray-500">Total</div>
            </div>
          </div>
          <div class="text-lg font-semibold text-gray-700">Commandes</div>
          <div class="text-sm text-green-600 font-medium">
            +{{ todayOrders }} aujourd'hui
          </div>
        </div>

        <!-- Chiffre d'Affaires -->
        <div
          class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl"
            >
              <span class="text-2xl">💰</span>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-800">
                {{ formatAmount(totalRevenue) }}
              </div>
              <div class="text-sm text-gray-500">CFA</div>
            </div>
          </div>
          <div class="text-lg font-semibold text-gray-700">
            Chiffre d'Affaires
          </div>
          <div class="text-sm text-green-600 font-medium">
            {{ formatAmount(todayRevenue) }} aujourd'hui
          </div>
        </div>

        <!-- Commandes En Attente -->
        <div
          class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl"
            >
              <span class="text-2xl">⏳</span>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-800">
                {{ pendingOrders }}
              </div>
              <div class="text-sm text-gray-500">En attente</div>
            </div>
          </div>
          <div class="text-lg font-semibold text-gray-700">À traiter</div>
          <div class="text-sm text-orange-600 font-medium">
            Nécessite attention
          </div>
        </div>

        <!-- Panier Moyen -->
        <div
          class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl"
            >
              <span class="text-2xl">🛒</span>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-800">
                {{ formatAmount(averageOrder) }}
              </div>
              <div class="text-sm text-gray-500">CFA</div>
            </div>
          </div>
          <div class="text-lg font-semibold text-gray-700">Panier Moyen</div>
          <div class="text-sm text-blue-600 font-medium">Par commande</div>
        </div>
      </div>

      <!-- Graphique des sources (simulation) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 class="text-xl font-bold text-gray-800 mb-6">
            📱 Sources des Commandes
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span class="font-medium">Site Web</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 rounded-full h-3">
                  <div
                    class="bg-blue-500 h-3 rounded-full"
                    :style="`width: ${webPercentage}%`"
                  ></div>
                </div>
                <span class="font-bold">{{ webOrders }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                <span class="font-medium">WhatsApp</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 rounded-full h-3">
                  <div
                    class="bg-green-500 h-3 rounded-full"
                    :style="`width: ${whatsappPercentage}%`"
                  ></div>
                </div>
                <span class="font-bold">{{ whatsappOrders }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 class="text-xl font-bold text-gray-800 mb-6">📈 Tendances</h3>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 bg-green-50 rounded-xl"
            >
              <div>
                <p class="font-semibold text-green-800">Croissance</p>
                <p class="text-sm text-green-600">Commandes en hausse</p>
              </div>
              <span class="text-2xl">📈</span>
            </div>
            <div
              class="flex items-center justify-between p-4 bg-blue-50 rounded-xl"
            >
              <div>
                <p class="font-semibold text-blue-800">Fichier Excel</p>
                <p class="text-sm text-blue-600">Mis à jour automatiquement</p>
              </div>
              <span class="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des commandes récentes avec design moderne -->
      <div
        class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div
          class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200"
        >
          <h3 class="text-xl font-bold text-gray-800">📋 Commandes Récentes</h3>
          <p class="text-gray-600">Dernières commandes reçues</p>
        </div>

        <div v-if="orders.length > 0" class="divide-y divide-gray-100">
          <div
            v-for="order in orders.slice(0, 10)"
            :key="order.id"
            class="p-6 hover:bg-gray-50 cursor-pointer transition-all duration-200"
            @click="selectedOrder = order"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    :class="getStatusClass(order.status)"
                  >
                    {{ getStatusText(order.status) }}
                  </span>
                </div>
                <div>
                  <p class="text-lg font-semibold text-gray-900">
                    {{ order.ref }}
                  </p>
                  <p class="text-gray-600">{{ order.customer?.name }}</p>
                  <p class="text-sm text-gray-400 flex items-center space-x-2">
                    <span>{{ formatDate(order.timestamp) }}</span>
                    <span>•</span>
                    <span>{{
                      order.source === "whatsapp" ? "📱 WhatsApp" : "🌐 Web"
                    }}</span>
                  </p>
                </div>
              </div>

              <div class="text-right">
                <p class="text-xl font-bold text-green-600">
                  {{ formatAmount(order.amounts?.total || order.total || 0) }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ order.items?.length || 0 }} article(s)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div class="text-6xl mb-4 opacity-50">🎒</div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">
            Aucune commande
          </h3>
          <p class="text-gray-500 mb-6">
            Les commandes apparaîtront ici automatiquement
          </p>
          <button
            @click="createTestOrder"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Créer une commande test
          </button>
        </div>
      </div>
    </div>

    <!-- Modal détail commande avec design moderne -->
    <div
      v-if="selectedOrder"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="selectedOrder = null"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto"
        @click.stop
      >
        <div
          class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-2xl font-bold text-gray-800">
              Commande {{ selectedOrder.ref }}
            </h3>
            <button
              @click="selectedOrder = null"
              class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
            >
              <span class="text-gray-500">✕</span>
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <!-- Client -->
          <div class="bg-blue-50 rounded-2xl p-4">
            <h4
              class="font-bold text-blue-800 mb-3 flex items-center space-x-2"
            >
              <span>👤</span>
              <span>Informations Client</span>
            </h4>
            <div class="space-y-2 text-blue-700">
              <p><strong>Nom:</strong> {{ selectedOrder.customer?.name }}</p>
              <p><strong>Email:</strong> {{ selectedOrder.customer?.email }}</p>
              <p>
                <strong>Téléphone:</strong> {{ selectedOrder.customer?.phone }}
              </p>
            </div>
          </div>

          <!-- Livraison -->
          <div class="bg-purple-50 rounded-2xl p-4">
            <h4
              class="font-bold text-purple-800 mb-3 flex items-center space-x-2"
            >
              <span>📦</span>
              <span>Livraison</span>
            </h4>
            <div class="space-y-2 text-purple-700">
              <p>
                <strong>Adresse:</strong> {{ selectedOrder.shipping?.address }}
              </p>
              <p><strong>Ville:</strong> {{ selectedOrder.shipping?.city }}</p>
              <p>
                <strong>Méthode:</strong> {{ selectedOrder.shipping?.method }}
              </p>
            </div>
          </div>

          <!-- Articles -->
          <div class="bg-green-50 rounded-2xl p-4">
            <h4
              class="font-bold text-green-800 mb-3 flex items-center space-x-2"
            >
              <span>🛒</span>
              <span>Articles</span>
            </h4>
            <div
              v-if="selectedOrder.items && Array.isArray(selectedOrder.items)"
              class="space-y-2"
            >
              <div
                v-for="item in selectedOrder.items"
                :key="item.name"
                class="flex justify-between items-center py-2 px-3 bg-white rounded-lg"
              >
                <span class="font-medium text-green-700"
                  >{{ item.name }} (x{{ item.quantity }})</span
                >
                <span class="font-bold text-green-800">{{
                  formatAmount(item.price * item.quantity)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div
            class="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white"
          >
            <div class="text-center">
              <p class="text-lg font-medium mb-2">Total de la commande</p>
              <p class="text-4xl font-bold">
                {{
                  formatAmount(
                    selectedOrder.amounts?.total || selectedOrder.total || 0
                  )
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Variables réactives
const orders = ref([]);
const loading = ref(false);
const selectedOrder = ref(null);
const message = ref(null);

// Statistiques calculées
const totalRevenue = computed(() => {
  return orders.value.reduce(
    (sum, order) => sum + (order.amounts?.total || order.total || 0),
    0
  );
});

const pendingOrders = computed(() => {
  return orders.value.filter((order) => order.status?.includes("pending"))
    .length;
});

const todayOrders = computed(() => {
  const today = new Date().toISOString().split("T")[0];
  return orders.value.filter(
    (order) => order.timestamp?.split("T")[0] === today
  ).length;
});

const todayRevenue = computed(() => {
  const today = new Date().toISOString().split("T")[0];
  return orders.value
    .filter((order) => order.timestamp?.split("T")[0] === today)
    .reduce(
      (sum, order) => sum + (order.amounts?.total || order.total || 0),
      0
    );
});

const averageOrder = computed(() => {
  return orders.value.length > 0
    ? Math.round(totalRevenue.value / orders.value.length)
    : 0;
});

const webOrders = computed(() => {
  return orders.value.filter((order) => order.source !== "whatsapp").length;
});

const whatsappOrders = computed(() => {
  return orders.value.filter((order) => order.source === "whatsapp").length;
});

const webPercentage = computed(() => {
  return orders.value.length > 0
    ? Math.round((webOrders.value / orders.value.length) * 100)
    : 0;
});

const whatsappPercentage = computed(() => {
  return orders.value.length > 0
    ? Math.round((whatsappOrders.value / orders.value.length) * 100)
    : 0;
});

// Fonctions
const refreshData = async () => {
  loading.value = true;
  message.value = null;

  try {
    const response = await $fetch("/api/admin/orders/list");
    if (response.success) {
      orders.value = response.orders || [];
      showMessage(
        "success",
        `✅ ${orders.value.length} commande(s) chargée(s)`
      );
    } else {
      throw new Error("Échec du chargement");
    }
  } catch (error) {
    console.error("Erreur chargement:", error);
    showMessage("error", "❌ Erreur lors du chargement des commandes");
  } finally {
    loading.value = false;
  }
};

const createTestOrder = async () => {
  try {
    const response = await $fetch("/api/test/create-order", { method: "POST" });
    if (response.success) {
      showMessage("success", `✅ Commande test créée: ${response.orderRef}`);
      await refreshData();
    }
  } catch (error) {
    console.error("Erreur création test:", error);
    showMessage("error", "❌ Erreur lors de la création de la commande test");
  }
};

const downloadExcel = () => {
  showMessage("success", "📊 Téléchargement du fichier Excel maître...");
  // Simuler le téléchargement - dans la vraie version, on créerait un endpoint pour ça
  window.open("/data/COMMANDES_MAITRE.xlsx", "_blank");
};

const exportCsv = async () => {
  try {
    const response = await $fetch("/api/admin/orders/export");
    if (response.success && response.data) {
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `commandes-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage("success", "✅ Export CSV téléchargé");
    }
  } catch (error) {
    console.error("Erreur export:", error);
    showMessage("error", "❌ Erreur lors de l'export CSV");
  }
};

const showMessage = (type, text) => {
  message.value = { type, text };
  setTimeout(() => {
    message.value = null;
  }, 5000);
};

// Fonctions utilitaires
const formatAmount = (amount) => {
  return new Intl.NumberFormat("fr-FR").format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClass = (status) => {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    pending_whatsapp: "bg-blue-100 text-blue-800 border border-blue-200",
    confirmed: "bg-green-100 text-green-800 border border-green-200",
    cancelled: "bg-red-100 text-red-800 border border-red-200",
  };
  return classes[status] || "bg-gray-100 text-gray-800 border border-gray-200";
};

const getStatusText = (status) => {
  const texts = {
    pending: "En attente",
    pending_whatsapp: "WhatsApp",
    confirmed: "Confirmée",
    cancelled: "Annulée",
  };
  return texts[status] || status;
};

const getMessageClass = (type) => {
  return type === "success"
    ? "bg-green-50 text-green-800 border border-green-200"
    : "bg-red-50 text-red-800 border border-red-200";
};

// Charger les données au montage
onMounted(() => {
  refreshData();
});
</script>
