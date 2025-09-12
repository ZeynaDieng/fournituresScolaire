<template>
  <Transition name="drawer-slide" appear>
    <div v-if="show" class="fixed inset-0 z-50 flex">
      <div
        class="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
        @click="handleClose"
      ></div>
      <div
        class="ml-auto w-full max-w-2xl h-full bg-white shadow-2xl relative z-50 flex flex-col transition-transform duration-300 overflow-y-auto"
      >
        <div class="flex items-center justify-between px-8 py-6 border-b">
          <h3 class="text-2xl font-bold">Détail de l'utilisateur</h3>
          <button
            @click="handleClose"
            class="text-gray-400 hover:text-gray-700 text-3xl leading-none"
          >
            &times;
          </button>
        </div>
        <div class="px-8 py-6 space-y-6">
          <!-- Infos principales -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xl font-semibold">{{ user.Name }}</span>
              <span
                v-if="user.Active"
                class="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold"
                >ACTIF</span
              >
              <span
                v-else
                class="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold"
                >INACTIF</span
              >
            </div>
            <div class="text-gray-500 text-sm">Rôle : {{ user.Role }}</div>
            <div class="flex items-center gap-4 mt-2">
              <span class="text-sm text-gray-600">
                Membre depuis : {{ formatDate(user["Created At"]) }}
              </span>
            </div>
          </div>

          <!-- Informations de contact -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">
              Informations de contact
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="text-sm">
                  <strong>Email:</strong> {{ user.Email }}
                </div>
                <div class="text-sm">
                  <strong>Téléphone:</strong>
                  {{ user.Phone || "Non renseigné" }}
                </div>
              </div>
            </div>
          </div>

          <!-- Adresse -->
          <div v-if="user.Address || user.City || user.Country">
            <h4 class="font-semibold text-gray-900 mb-3">Adresse</h4>
            <div class="text-sm text-gray-700">
              <div v-if="user.Address">{{ user.Address }}</div>
              <div v-if="user.City">{{ user.City }}</div>
              <div v-if="user.Country">{{ user.Country }}</div>
            </div>
          </div>

          <!-- Statistiques -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Statistiques</h4>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-sm text-gray-600">Commandes</div>
                <div class="text-lg font-semibold">
                  {{ user["Total Orders"] || 0 }}
                </div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-sm text-gray-600">Montant total</div>
                <div class="text-lg font-semibold">
                  {{ formatCurrency(user["Total Spent"] || 0) }}
                </div>
              </div>
            </div>
          </div>

          <!-- ID local -->
          <div v-if="user['Local ID']" class="text-xs text-gray-400 mt-6">
            ID local : {{ user["Local ID"] }}
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  user: { type: Object, required: true },
});
const emit = defineEmits(["close"]);
const show = ref(true);

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

function handleClose() {
  show.value = false;
  setTimeout(() => emit("close"), 300);
}

// Si l'utilisateur change, réafficher
watch(
  () => props.user,
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
