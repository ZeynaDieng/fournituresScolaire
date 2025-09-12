<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">
        📝 Gestion des Commandes Airtable
      </h1>
      <button
        @click="refreshOrders"
        :disabled="loading"
        class="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <span v-if="loading" class="inline-block animate-spin mr-2">⟳</span>
        {{ loading ? "Actualisation..." : "🔄 Actualiser" }}
      </button>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-2xl font-bold text-blue-600">{{ orders.length }}</div>
        <div class="text-gray-600">Total Commandes</div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-2xl font-bold text-green-600">{{ pendingCount }}</div>
        <div class="text-gray-600">En Attente</div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-2xl font-bold text-orange-600">{{ paidCount }}</div>
        <div class="text-gray-600">Payées</div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-2xl font-bold text-purple-600">
          {{ totalRevenue }}FCFA
        </div>
        <div class="text-gray-600">Chiffre d'affaires</div>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
    >
      <div class="text-red-800">❌ Erreur: {{ error }}</div>
    </div>

    <!-- Filtres -->
    <div
      class="bg-white rounded-lg shadow-md p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      <div>
        <label class="block text-sm text-gray-600 mb-1">Statut</label>
        <select
          v-model="filters.status"
          class="w-full border rounded px-3 py-2"
        >
          <option value="">Tous</option>
          <option value="Pending">En Attente</option>
          <option value="Paid">Payée</option>
          <option value="Shipped">Expédiée</option>
          <option value="Delivered">Livrée</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-gray-600 mb-1"
          >Recherche (réf/client)</label
        >
        <input
          v-model="filters.query"
          type="text"
          class="w-full border rounded px-3 py-2"
          placeholder="REF, nom, email, téléphone"
        />
      </div>
      <div>
        <label class="block text-sm text-gray-600 mb-1">Du</label>
        <input
          v-model="filters.from"
          type="date"
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label class="block text-sm text-gray-600 mb-1">Au</label>
        <input
          v-model="filters.to"
          type="date"
          class="w-full border rounded px-3 py-2"
        />
      </div>
      <div class="md:col-span-4 flex justify-end gap-2">
        <button
          @click="resetFilters"
          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          Réinitialiser
        </button>
        <button
          @click="exportCsv"
          class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
        >
          Exporter CSV
        </button>
      </div>
    </div>

    <!-- Liste des commandes -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Liste des Commandes</h2>
      </div>

      <div
        v-if="loading && orders.length === 0"
        class="text-center py-8 text-gray-500"
      >
        <div class="inline-block animate-spin text-2xl mb-2">⟳</div>
        <div>Chargement des commandes...</div>
      </div>

      <div
        v-else-if="orders.length === 0"
        class="text-center py-8 text-gray-500"
      >
        <div class="text-4xl mb-4">📋</div>
        <div>Aucune commande trouvée</div>
        <button
          @click="createTestOrder"
          class="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          🧪 Créer une commande de test
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Référence
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Client
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Articles
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Statut
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="order in paginatedOrders"
              :key="order.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ order.orderRef || "N/A" }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  {{ order.customerName || "N/A" }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ order.customerEmail || "N/A" }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ order.customerPhone || "N/A" }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs">
                  <div v-if="order.items" class="whitespace-pre-line">
                    {{ order.items }}
                  </div>
                  <div v-else class="text-gray-400">Aucun article</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">
                  {{ order.totalAmount ? order.totalAmount + "FCFA" : "N/A" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  :value="order.status"
                  @change="
                    updateOrderStatus(order.orderRef, $event.target.value)
                  "
                  :disabled="updatingStatus === order.orderRef"
                  class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{
                    'bg-gray-100': updatingStatus === order.orderRef,
                    'bg-red-50 text-red-800': order.status === 'Pending',
                    'bg-green-50 text-green-800': order.status === 'Paid',
                    'bg-blue-50 text-blue-800': order.status === 'Shipped',
                    'bg-purple-50 text-purple-800':
                      order.status === 'Delivered',
                  }"
                >
                  <option value="Pending">En Attente</option>
                  <option value="Paid">Payée</option>
                  <option value="Shipped">Expédiée</option>
                  <option value="Delivered">Livrée</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="showOrderDetail(order)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  👁️ Voir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de détails de commande -->
    <div
      v-if="selectedOrder"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-800">
              Détails de la Commande
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold text-gray-700 mb-2">
                Informations Client
              </h4>
              <p><strong>Nom:</strong> {{ selectedOrder.customerName }}</p>
              <p><strong>Email:</strong> {{ selectedOrder.customerEmail }}</p>
              <p>
                <strong>Téléphone:</strong> {{ selectedOrder.customerPhone }}
              </p>
            </div>

            <div>
              <h4 class="font-semibold text-gray-700 mb-2">
                Informations Commande
              </h4>
              <p><strong>Référence:</strong> {{ selectedOrder.orderRef }}</p>
              <p><strong>Total:</strong> {{ selectedOrder.totalAmount }}FCFA</p>
              <p><strong>Statut:</strong> {{ selectedOrder.status }}</p>
              <p>
                <strong>Date:</strong> {{ formatDate(selectedOrder.createdAt) }}
              </p>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="font-semibold text-gray-700 mb-2">
              Adresse de Livraison
            </h4>
            <p>{{ selectedOrder.shippingAddress || "Non spécifiée" }}</p>
          </div>

          <div class="mt-6">
            <h4 class="font-semibold text-gray-700 mb-2">Articles Commandés</h4>
            <div class="bg-gray-50 rounded-md p-4">
              <pre class="whitespace-pre-line text-sm">{{
                selectedOrder.items || "Aucun article spécifié"
              }}</pre>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            @click="closeModal"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="mt-4 flex items-center justify-center gap-2"
    >
      <button
        @click="prevPage"
        :disabled="page === 1"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Précédent
      </button>
      <span class="text-sm text-gray-600"
        >Page {{ page }} / {{ totalPages }}</span
      >
      <button
        @click="nextPage"
        :disabled="page === totalPages"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Suivant
      </button>
    </div>

    <!-- Overlay Détail -->
    <OrderDetail
      v-if="showDetail"
      :order="detailOrder"
      @close="showDetail = false"
      @refresh="refreshOrders"
    />
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin", middleware: "admin" });

import OrderDetail from "./orders-airtable/[id].vue";

const orders = ref([]);
const showDetail = ref(false);
const detailOrder = ref(null);
const loading = ref(false);
const error = ref(null);
const selectedOrder = ref(null);
const updatingStatus = ref(null);

// Filtres et pagination
const filters = ref({ status: "", query: "", from: "", to: "" });
const page = ref(1);
const pageSize = 20;

const normalized = (s) => (s || "").toString().toLowerCase();
const toDate = (d) => (d ? new Date(d) : null);

const filteredOrders = computed(() => {
  let list = orders.value.slice();
  if (filters.value.status) {
    list = list.filter((o) => (o.status || "") === filters.value.status);
  }
  if (filters.value.query) {
    const q = normalized(filters.value.query);
    list = list.filter(
      (o) =>
        normalized(o.orderRef).includes(q) ||
        normalized(o.customerName).includes(q) ||
        normalized(o.customerEmail).includes(q) ||
        normalized(o.customerPhone).includes(q)
    );
  }
  const fromD = filters.value.from ? new Date(filters.value.from) : null;
  const toD = filters.value.to ? new Date(filters.value.to) : null;
  if (fromD) list = list.filter((o) => new Date(o.createdAt) >= fromD);
  if (toD) {
    // inclure toute la journée
    const end = new Date(toD);
    end.setHours(23, 59, 59, 999);
    list = list.filter((o) => new Date(o.createdAt) <= end);
  }
  return list;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredOrders.value.length / pageSize))
);
const paginatedOrders = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredOrders.value.slice(start, start + pageSize);
});

watch(filteredOrders, () => {
  page.value = 1;
});

function resetFilters() {
  filters.value = { status: "", query: "", from: "", to: "" };
}
function nextPage() {
  if (page.value < totalPages.value) page.value++;
}
function prevPage() {
  if (page.value > 1) page.value--;
}

// Statistiques calculées
const pendingCount = computed(
  () => orders.value.filter((o) => o.status === "Pending").length
);
const paidCount = computed(
  () => orders.value.filter((o) => o.status === "Paid").length
);
const totalRevenue = computed(() =>
  orders.value
    .filter((o) => o.status === "Paid" && o.totalAmount)
    .reduce((sum, o) => sum + o.totalAmount, 0)
    .toFixed(2)
);

// Charger les commandes au montage
onMounted(() => {
  refreshOrders();
});

// Actualiser les commandes
async function refreshOrders() {
  loading.value = true;
  error.value = null;

  try {
    const response = await $fetch("/api/airtable/orders");
    orders.value = response.data || [];
  } catch (err) {
    error.value = err.message || "Erreur lors du chargement des commandes";
    console.error("Erreur chargement commandes:", err);
  } finally {
    loading.value = false;
  }
}

// Mettre à jour le statut d'une commande
async function updateOrderStatus(orderRef, newStatus) {
  if (!orderRef) return;

  updatingStatus.value = orderRef;

  try {
    await $fetch(`/api/airtable/orders/${orderRef}/status`, {
      method: "PATCH",
      body: { status: newStatus },
    });

    // Mettre à jour localement
    const order = orders.value.find((o) => o.orderRef === orderRef);
    if (order) {
      order.status = newStatus;
    }

    // Notification de succès
    console.log(`✅ Statut mis à jour: ${orderRef} -> ${newStatus}`);
  } catch (err) {
    error.value = `Erreur mise à jour statut: ${err.message}`;
    console.error("Erreur mise à jour statut:", err);
  } finally {
    updatingStatus.value = null;
  }
}

// Créer une commande de test
async function createTestOrder() {
  try {
    const response = await $fetch("/api/airtable/orders/create", {
      method: "POST",
      body: {
        name: "Test Client",
        email: "test@example.com",
        phone: "0123456789",
        address: "123 Rue Test",
        city: "Dakar",
        ref: `TEST-${Date.now()}`,
        items: [{ name: "Article Test", quantity: 1, price: 10 }],
        total: 10,
        subtotal: 10,
      },
    });

    console.log("✅ Commande de test créée:", response.orderRef);
    await refreshOrders();
  } catch (err) {
    error.value = `Erreur création commande test: ${err.message}`;
    console.error("Erreur création test:", err);
  }
}

// Afficher les détails d'une commande
function showOrderDetail(order) {
  detailOrder.value = order;
  showDetail.value = true;
}

// Fermer le modal
function closeModal() {
  selectedOrder.value = null;
}

// Formater une date
function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Export CSV
function exportCsv() {
  const rows = filteredOrders.value;
  const headers = [
    "orderRef",
    "customerName",
    "customerEmail",
    "customerPhone",
    "totalAmount",
    "status",
    "createdAt",
  ];
  const csv = [headers.join(",")]
    .concat(
      rows.map((o) => headers.map((h) => JSON.stringify(o[h] ?? "")).join(","))
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Titre de la page
useHead({
  title: "Gestion des Commandes Airtable - Admin",
});
</script>
