<template>
  <Transition name="drawer-slide" appear>
    <div v-if="show" class="fixed inset-0 z-50 flex">
      <div
        class="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
        @click="handleClose"
      ></div>
      <div
        class="ml-auto w-full max-w-4xl h-full bg-white shadow-2xl relative z-50 flex flex-col transition-transform duration-300 overflow-y-auto"
      >
        <div class="flex items-center justify-between px-8 py-6 border-b">
          <h3 class="text-2xl font-bold">Détail de la commande</h3>
          <button
            @click="handleClose"
            class="text-gray-400 hover:text-gray-700 text-3xl leading-none"
          >
            &times;
          </button>
        </div>
        <div class="px-8 py-6 space-y-6">
          <!-- Infos principales -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">
                  Informations de la commande
                </h4>
                <div class="space-y-2 text-sm">
                  <div><strong>Référence:</strong> {{ order.Reference }}</div>
                  <div>
                    <strong>Date:</strong> {{ formatDate(order["Order Date"]) }}
                  </div>
                  <div>
                    <strong>Statut:</strong>
                    <span
                      :class="getStatusClass(order.Status)"
                      class="px-2 py-1 rounded text-xs font-medium"
                    >
                      {{ order.Status }}
                    </span>
                  </div>
                  <div>
                    <strong>Total:</strong> {{ formatCurrency(order.Total) }}
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Client</h4>
                <div class="space-y-2 text-sm">
                  <div><strong>Nom:</strong> {{ order["Customer Name"] }}</div>
                  <div>
                    <strong>Email:</strong> {{ order["Customer Email"] }}
                  </div>
                  <div>
                    <strong>Téléphone:</strong> {{ order["Customer Phone"] }}
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">
                  Adresse de livraison
                </h4>
                <div class="text-sm text-gray-700 whitespace-pre-line">
                  {{ order["Shipping Address"] }}
                </div>
              </div>

              <div>
                <h4 class="font-semibold text-gray-900 mb-2">
                  Méthode de paiement
                </h4>
                <div class="text-sm">
                  <div>
                    <strong>Type:</strong> {{ order["Payment Method"] }}
                  </div>
                  <div v-if="order['Payment Status']">
                    <strong>Statut:</strong> {{ order["Payment Status"] }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Articles de la commande -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Articles commandés</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <div v-if="parsedItems && parsedItems.length" class="space-y-3">
                <div
                  v-for="(item, index) in parsedItems"
                  :key="index"
                  class="flex items-center justify-between p-3 bg-white rounded border"
                >
                  <div class="flex-1">
                    <div class="font-medium">
                      {{ item.name || item.product || "Produit" }}
                    </div>
                    <div class="text-sm text-gray-600">
                      Quantité: {{ item.quantity || 1 }}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-medium">
                      {{ formatCurrency(item.price || 0) }}
                    </div>
                    <div class="text-sm text-gray-600">
                      Total:
                      {{
                        formatCurrency((item.price || 0) * (item.quantity || 1))
                      }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-gray-500 text-sm">
                Aucun détail d'article disponible
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4 pt-4 border-t">
            <button
              @click="updateStatus('Paid')"
              v-if="order.Status === 'Pending'"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Marquer comme payée
            </button>
            <button
              @click="updateStatus('Shipped')"
              v-if="order.Status === 'Paid'"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Marquer comme expédiée
            </button>
            <button
              @click="updateStatus('Delivered')"
              v-if="order.Status === 'Shipped'"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Marquer comme livrée
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from "vue";
const props = defineProps({
  order: { type: Object, required: true },
});
const emit = defineEmits(["close", "refresh"]);
const show = ref(true);

// Parser les articles de la commande
const parsedItems = computed(() => {
  if (!props.order.Items) return [];

  try {
    // Essayer de parser comme JSON
    if (typeof props.order.Items === "string") {
      return JSON.parse(props.order.Items);
    }
    return props.order.Items;
  } catch {
    // Si ce n'est pas du JSON valide, traiter comme une string simple
    return [{ name: props.order.Items, quantity: 1, price: 0 }];
  }
});

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount || 0);
}

function getStatusClass(status) {
  const classes = {
    Pending: "bg-yellow-100 text-yellow-800",
    Paid: "bg-green-100 text-green-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-purple-100 text-purple-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
}

async function updateStatus(newStatus) {
  try {
    await $fetch(`/api/admin/orders/update-status`, {
      method: "POST",
      body: {
        id: props.order.id,
        status: newStatus,
      },
    });
    emit("refresh");
    handleClose();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    alert("Erreur lors de la mise à jour du statut");
  }
}

function handleClose() {
  show.value = false;
  setTimeout(() => emit("close"), 300);
}

// Si la commande change, réafficher
watch(
  () => props.order,
  () => {
    show.value = true;
  }
);
</script>

<style scoped>
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.drawer-slide-enter-to,
.drawer-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
