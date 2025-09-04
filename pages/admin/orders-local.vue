<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">
        📦 Gestion des Commandes (Stockage Local)
      </h1>
      <div class="space-x-3">
        <button
          @click="refreshOrders"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          :disabled="loading"
        >
          🔄 {{ loading ? "Actualisation..." : "Actualiser" }}
        </button>
        <button
          @click="exportCSV"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          📊 Exporter CSV
        </button>
      </div>
    </div>

    <!-- Statistiques -->
    <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-sm font-medium text-gray-500">Total Commandes</h3>
        <p class="text-2xl font-bold text-blue-600">{{ stats.total }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-sm font-medium text-gray-500">Chiffre d'affaires</h3>
        <p class="text-2xl font-bold text-green-600">
          {{ formatAmount(stats.totalAmount) }} CFA
        </p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-sm font-medium text-gray-500">En attente</h3>
        <p class="text-2xl font-bold text-orange-600">
          {{ stats.byStatus.pending || 0 }}
        </p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-sm font-medium text-gray-500">WhatsApp</h3>
        <p class="text-2xl font-bold text-purple-600">
          {{ stats.bySource.whatsapp || 0 }}
        </p>
      </div>
    </div>

    <!-- Message si aucune commande -->
    <div v-if="!loading && orders.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📭</div>
      <h2 class="text-xl font-semibold text-gray-600 mb-2">
        Aucune commande trouvée
      </h2>
      <p class="text-gray-500">
        Les commandes apparaîtront ici une fois qu'elles seront créées.
      </p>
    </div>

    <!-- Liste des commandes -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex flex-wrap justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">
              {{ order.ref }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ formatDate(order.timestamp) }}
            </p>
          </div>
          <div class="flex space-x-2">
            <span
              :class="getStatusColor(order.status)"
              class="px-3 py-1 rounded-full text-xs font-medium"
            >
              {{ order.status }}
            </span>
            <span
              :class="getPaymentStatusColor(order.paymentStatus)"
              class="px-3 py-1 rounded-full text-xs font-medium"
            >
              {{ order.paymentStatus }}
            </span>
            <span
              :class="getSourceColor(order.source)"
              class="px-3 py-1 rounded-full text-xs font-medium"
            >
              {{ order.source }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <!-- Client -->
          <div>
            <h4 class="font-medium text-gray-800 mb-1">👤 Client</h4>
            <p class="text-sm text-gray-600">{{ order.customer.name }}</p>
            <p class="text-sm text-gray-600">{{ order.customer.email }}</p>
            <p class="text-sm text-gray-600">{{ order.customer.phone }}</p>
          </div>

          <!-- Livraison -->
          <div>
            <h4 class="font-medium text-gray-800 mb-1">🚚 Livraison</h4>
            <p class="text-sm text-gray-600">{{ order.shipping.address }}</p>
            <p class="text-sm text-gray-600">{{ order.shipping.city }}</p>
            <p class="text-sm text-gray-600">{{ order.shipping.method }}</p>
          </div>

          <!-- Montants -->
          <div>
            <h4 class="font-medium text-gray-800 mb-1">💰 Montants</h4>
            <p class="text-sm text-gray-600">
              Sous-total: {{ formatAmount(order.amounts.subtotal) }} CFA
            </p>
            <p class="text-sm text-gray-600">
              Livraison: {{ formatAmount(order.amounts.shipping) }} CFA
            </p>
            <p class="text-sm font-semibold text-gray-800">
              Total: {{ formatAmount(order.amounts.total) }} CFA
            </p>
          </div>
        </div>

        <!-- Articles -->
        <div>
          <h4 class="font-medium text-gray-800 mb-2">🛍️ Articles</h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(item, index) in order.items"
              :key="index"
              class="bg-gray-100 px-3 py-1 rounded-md text-sm"
            >
              {{ item.name }} ({{ item.quantity }}x{{
                formatAmount(item.price)
              }})
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Chargement des commandes...</p>
    </div>
  </div>
</template>

<script setup>
// Configuration de la page
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

// État réactif
const orders = ref([]);
const stats = ref(null);
const loading = ref(false);

// Formatter les montants
const formatAmount = (amount) => {
  return new Intl.NumberFormat("fr-FR").format(amount);
};

// Formatter les dates
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Couleurs pour les statuts
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
    case "pending_whatsapp":
      return "bg-orange-100 text-orange-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPaymentStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "paid":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSourceColor = (source) => {
  switch (source) {
    case "whatsapp":
      return "bg-green-100 text-green-800";
    case "web":
      return "bg-blue-100 text-blue-800";
    case "api":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Charger les commandes
const refreshOrders = async () => {
  loading.value = true;
  try {
    const response = await $fetch("/api/admin/orders/list?stats=true");
    if (response.success) {
      orders.value = response.orders;
      stats.value = response.stats;
      console.log("✅ Commandes chargées:", response.total);
    } else {
      console.error("❌ Erreur:", response.error);
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement:", error);
  } finally {
    loading.value = false;
  }
};

// Exporter en CSV
const exportCSV = async () => {
  try {
    const response = await fetch("/api/admin/orders/export");
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `commandes-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      console.log("✅ Export CSV téléchargé");
    } else {
      console.error("❌ Erreur lors de l'export");
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'export:", error);
  }
};

// Charger au montage
onMounted(() => {
  refreshOrders();
});
</script>
