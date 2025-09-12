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
          <h3 class="text-2xl font-bold">Détail de la promotion</h3>
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
              <span class="text-xl font-semibold">{{ promotion.Title }}</span>
              <span
                v-if="promotion.Trending"
                class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold"
                >TENDANCE</span
              >
              <span
                v-if="promotion.Featured"
                class="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold"
                >MISE EN AVANT</span
              >
            </div>
            <div class="text-gray-500 text-sm">Type : {{ promotion.Type }}</div>
            <div class="flex items-center gap-4 mt-2">
              <span class="text-lg font-bold text-emerald-700"
                >-{{ promotion["Discount %"] }}%</span
              >
              <span
                v-if="promotion['End Date']"
                class="ml-4 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs"
              >
                Fin : {{ formatDate(promotion["End Date"]) }}
              </span>
            </div>
          </div>
          <!-- Description -->
          <div
            v-if="promotion.Description"
            class="text-gray-800 whitespace-pre-line"
          >
            {{ promotion.Description }}
          </div>
          <!-- Catégorie -->
          <div v-if="promotion.Category" class="text-sm text-gray-600">
            <strong>Catégorie :</strong> {{ promotion.Category }}
          </div>
          <!-- Icône -->
          <div v-if="promotion.Icon" class="text-2xl">
            <strong>Icône :</strong> {{ promotion.Icon }}
          </div>
          <!-- ID local -->
          <div v-if="promotion['Local ID']" class="text-xs text-gray-400 mt-6">
            ID local : {{ promotion["Local ID"] }}
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  promotion: { type: Object, required: true },
});
const emit = defineEmits(["close"]);
const show = ref(true);

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
}

function handleClose() {
  show.value = false;
  setTimeout(() => emit("close"), 300);
}
// Si la promotion change (changement de fiche), réafficher
watch(
  () => props.promotion,
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
