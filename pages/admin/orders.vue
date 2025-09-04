<template>
  <div>
    <!-- Actions header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Gestion des commandes</h2>
      <div class="flex space-x-3">
        <button
          @click="refreshOrders"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Actualiser</span>
        </button>
      </div>
    </div>

    <!-- Filtres et statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <div class="text-sm font-medium text-gray-500">Total des commandes</div>
        <div class="text-2xl font-bold text-gray-900">{{ orders.length }}</div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <div class="text-sm font-medium text-gray-500">En attente</div>
        <div class="text-2xl font-bold text-orange-600">
          {{ getPendingOrdersCount() }}
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <div class="text-sm font-medium text-gray-500">Confirmées</div>
        <div class="text-2xl font-bold text-green-600">
          {{ getConfirmedOrdersCount() }}
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <div class="text-sm font-medium text-gray-500">Chiffre d'affaires</div>
        <div class="text-2xl font-bold text-emerald-600">
          {{ formatCurrency(getTotalRevenue()) }}
        </div>
      </div>
    </div>

    <!-- Formulaire de modification -->
    <div v-if="showEdit" class="mb-6 bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Modifier la commande #{{ editOrder.ref }}
      </h3>
      <form @submit.prevent="updateOrder" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Statut de la commande</label
          >
          <select
            v-model="editOrder.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="cancelEdit"
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
          >
            Mettre à jour
          </button>
        </div>
      </form>
    </div>

    <!-- Tableau des commandes -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Liste des commandes</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
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
                Date de création
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="order in orders"
              :key="order.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  #{{ order.ref }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div
                      class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">
                      {{ order.user?.email || "Client anonyme" }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(order.total) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(order.createdAt) }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="edit(order)"
                  class="text-emerald-600 hover:text-emerald-900 mr-3 transition-colors"
                >
                  Modifier
                </button>
                <button
                  @click="deleteOrder(order.id)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Message si aucune commande -->
        <div v-if="orders.length === 0" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            Aucune commande
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Aucune commande n'a encore été passée.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// Protection par middleware
definePageMeta({
  middleware: "admin",
  layout: "admin",
});

// ✅ Typage des données
interface User {
  id: number;
  email: string;
}

interface Order {
  id: number;
  ref: string;
  total: number;
  status: string;
  createdAt: string;
  user?: User;
}

// ✅ States
const orders = ref<Order[]>([]);
const showEdit = ref(false);
const editOrder = ref<{ id: number | null; status: string; ref?: string }>({
  id: null,
  status: "",
  ref: "",
});

// Fonctions utilitaires pour le formatage
const formatCurrency = (amount: number) => {
  return (
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount) + " CFA"
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmée",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending:
      "px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full",
    confirmed:
      "px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full",
    shipped:
      "px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full",
    delivered:
      "px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full",
    cancelled:
      "px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full",
  };
  return (
    classes[status] ||
    "px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
  );
};

// Fonctions de statistiques
const getPendingOrdersCount = () => {
  return orders.value.filter((order) => order.status === "pending").length;
};

const getConfirmedOrdersCount = () => {
  return orders.value.filter((order) =>
    ["confirmed", "shipped", "delivered"].includes(order.status)
  ).length;
};

const getTotalRevenue = () => {
  return orders.value
    .filter((order) =>
      ["confirmed", "shipped", "delivered"].includes(order.status)
    )
    .reduce((total, order) => total + order.total, 0);
};

// ✅ Récupérer les commandes
async function fetchOrders() {
  try {
    orders.value = await $fetch<Order[]>("/api/admin/orders");
  } catch (error) {
    console.error("Erreur lors du chargement des commandes:", error);
  }
}

// Fonction pour actualiser les commandes
const refreshOrders = async () => {
  await fetchOrders();
};

// ✅ Modifier une commande
function edit(order: Order) {
  editOrder.value = {
    id: order.id,
    status: order.status,
    ref: order.ref,
  };
  showEdit.value = true;
}

// ✅ Mettre à jour une commande
async function updateOrder() {
  if (!editOrder.value.id) return;

  try {
    await $fetch(`/api/admin/orders/${editOrder.value.id}`, {
      method: "PUT",
      body: { status: editOrder.value.status },
    });

    showEdit.value = false;
    editOrder.value = { id: null, status: "", ref: "" };
    await fetchOrders();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
  }
}

// ✅ Annuler l'édition
function cancelEdit() {
  showEdit.value = false;
  editOrder.value = { id: null, status: "", ref: "" };
}

// ✅ Supprimer une commande
async function deleteOrder(id: number) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
    try {
      await $fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      await fetchOrders();
    } catch (error) {
      console.error("Erreur lors de la suppression de la commande:", error);
    }
  }
}

// Charger les commandes au montage
onMounted(fetchOrders);
</script>
