<!-- /pages/commandes-simple.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">📦 Commandes Reçues</h1>
        <p class="text-gray-600 mt-2">
          Toutes les commandes stockées localement
        </p>
      </div>

      <!-- Actions -->
      <div class="mb-6 flex space-x-4">
        <button
          @click="refreshOrders"
          :disabled="loading"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {{ loading ? "⏳ Chargement..." : "🔄 Actualiser" }}
        </button>

        <button
          @click="createTestOrder"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          🧪 Créer Commande Test
        </button>

        <button
          @click="exportCsv"
          class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          📁 Exporter CSV
        </button>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 rounded-lg bg-blue-100">📊</div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ orders.length }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 rounded-lg bg-green-100">💰</div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">
                Chiffre d'Affaires
              </p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ formatAmount(totalRevenue) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 rounded-lg bg-yellow-100">⏳</div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">En Attente</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ pendingOrders }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 rounded-lg bg-purple-100">📅</div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Aujourd'hui</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ todayOrders }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div
        v-if="message"
        class="mb-6 p-4 rounded-lg"
        :class="
          message.type === 'success'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        "
      >
        {{ message.text }}
      </div>

      <!-- Liste des commandes -->
      <div
        v-if="!loading && orders.length > 0"
        class="bg-white shadow overflow-hidden rounded-lg"
      >
        <div class="px-6 py-4 bg-gray-50 border-b">
          <h3 class="text-lg font-medium">Commandes ({{ orders.length }})</h3>
        </div>

        <div class="divide-y divide-gray-200">
          <div
            v-for="order in orders"
            :key="order.id"
            class="p-6 hover:bg-gray-50 cursor-pointer"
            @click="selectedOrder = order"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusClass(order.status)"
                  >
                    {{ getStatusText(order.status) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ order.ref }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ order.customer?.name }}
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ formatDate(order.timestamp) }}
                  </p>
                </div>
              </div>

              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">
                  {{ formatAmount(order.amounts?.total || order.total || 0) }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ order.source === "whatsapp" ? "📱 WhatsApp" : "🌐 Web" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div
        v-else-if="!loading && orders.length === 0"
        class="text-center py-12"
      >
        <div class="text-gray-400 text-6xl mb-4">📦</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
        <p class="text-gray-500">
          Les commandes apparaîtront ici automatiquement
        </p>
      </div>

      <!-- Loading -->
      <div v-else class="text-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
        ></div>
      </div>
    </div>

    <!-- Modal détail commande -->
    <div
      v-if="selectedOrder"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="selectedOrder = null"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Commande {{ selectedOrder.ref }}</h3>
          <button
            @click="selectedOrder = null"
            class="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <!-- Client -->
          <div class="border rounded-lg p-4">
            <h4 class="font-medium mb-2">👤 Client</h4>
            <p><strong>Nom:</strong> {{ selectedOrder.customer?.name }}</p>
            <p><strong>Email:</strong> {{ selectedOrder.customer?.email }}</p>
            <p>
              <strong>Téléphone:</strong> {{ selectedOrder.customer?.phone }}
            </p>
          </div>

          <!-- Livraison -->
          <div class="border rounded-lg p-4">
            <h4 class="font-medium mb-2">📦 Livraison</h4>
            <p>
              <strong>Adresse:</strong> {{ selectedOrder.shipping?.address }}
            </p>
            <p><strong>Ville:</strong> {{ selectedOrder.shipping?.city }}</p>
          </div>

          <!-- Articles -->
          <div class="border rounded-lg p-4">
            <h4 class="font-medium mb-2">🛒 Articles</h4>
            <div
              v-if="selectedOrder.items && Array.isArray(selectedOrder.items)"
            >
              <div
                v-for="item in selectedOrder.items"
                :key="item.name"
                class="flex justify-between py-1"
              >
                <span>{{ item.name }} (x{{ item.quantity }})</span>
                <span>{{ formatAmount(item.price * item.quantity) }}</span>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="border rounded-lg p-4">
            <h4 class="font-medium mb-2">💰 Total</h4>
            <div class="text-xl font-bold text-green-600">
              {{
                formatAmount(
                  selectedOrder.amounts?.total || selectedOrder.total || 0
                )
              }}
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

// Charger les commandes
const refreshOrders = async () => {
  loading.value = true;
  message.value = null;

  try {
    const response = await $fetch("/api/admin/orders/list");
    if (response.success) {
      orders.value = response.orders || [];
      message.value = {
        type: "success",
        text: `✅ ${orders.value.length} commande(s) chargée(s)`,
      };
    } else {
      throw new Error("Échec du chargement");
    }
  } catch (error) {
    console.error("Erreur chargement commandes:", error);
    message.value = {
      type: "error",
      text: "❌ Erreur lors du chargement des commandes",
    };
  } finally {
    loading.value = false;
  }
};

// Créer commande test
const createTestOrder = async () => {
  try {
    const response = await $fetch("/api/test/create-order", { method: "POST" });
    if (response.success) {
      message.value = {
        type: "success",
        text: `✅ Commande test créée: ${response.orderRef}`,
      };
      await refreshOrders();
    }
  } catch (error) {
    console.error("Erreur création commande test:", error);
    message.value = {
      type: "error",
      text: "❌ Erreur lors de la création de la commande test",
    };
  }
};

// Exporter CSV
const exportCsv = async () => {
  try {
    const response = await $fetch("/api/admin/orders/export");
    if (response.success && response.data) {
      // Créer et télécharger le fichier
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `commandes-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      message.value = {
        type: "success",
        text: "✅ Export CSV téléchargé",
      };
    }
  } catch (error) {
    console.error("Erreur export:", error);
    message.value = {
      type: "error",
      text: "❌ Erreur lors de l'export CSV",
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

const getStatusText = (status) => {
  const texts = {
    pending: "En attente",
    pending_whatsapp: "WhatsApp",
    confirmed: "Confirmée",
    cancelled: "Annulée",
  };
  return texts[status] || status;
};

// Charger au montage et effacer le message après 5s
onMounted(() => {
  refreshOrders();
});

watch(message, (newMessage) => {
  if (newMessage) {
    setTimeout(() => {
      message.value = null;
    }, 5000);
  }
});
</script>
