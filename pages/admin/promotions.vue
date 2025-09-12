<template>
  <div>
    <!-- Actions header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-900">
        Gestion des promotions
      </h2>
      <button
        @click="showAdd = !showAdd"
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>Ajouter une promotion</span>
      </button>
    </div>

    <!-- Drawer Ajout -->
    <Transition name="drawer-slide" appear>
      <div v-if="showAdd" class="fixed inset-0 z-40 flex">
        <div
          class="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
          @click="showAdd = false"
        ></div>
        <div
          class="ml-auto w-full max-w-md h-full bg-white shadow-xl relative z-50 transition-transform duration-300"
        >
          <AddDrawer @close="showAdd = false" @refresh="fetchPromotions" />
        </div>
      </div>
    </Transition>
    <!-- Drawer Edition -->
    <Transition name="drawer-slide" appear>
      <div v-if="showEdit" class="fixed inset-0 z-40 flex">
        <div
          class="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
          @click="showEdit = false"
        ></div>
        <div
          class="ml-auto w-full max-w-md h-full bg-white shadow-xl relative z-50 transition-transform duration-300"
        >
          <EditDrawer
            :promotion="editPromotion"
            @close="showEdit = false"
            @refresh="fetchPromotions"
          />
        </div>
      </div>
    </Transition>
    <!-- Overlay Détail -->
    <PromotionDetail
      v-if="showDetail"
      :promotion="detailPromotion"
      @close="showDetail = false"
    />

    <!-- Barre de recherche et pagination -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4"
    >
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par titre, type..."
        class="w-full md:w-80 border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>

    <!-- Tableau des promotions -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Liste des promotions</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Titre
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Réduction
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date de fin
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Statut
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
              v-for="promotion in paginatedPromotions"
              :key="promotion.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center"
                    >
                      <span class="text-emerald-600 font-bold text-sm">
                        {{ promotion.Icon || "🎯" }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ promotion.Title }}
                    </div>
                    <div class="text-xs text-gray-500 truncate max-w-xs">
                      {{ promotion.Description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                  >{{ promotion.Type }}</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  -{{ promotion["Discount %"] }}%
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ formatDate(promotion["End Date"]) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="isActive(promotion['End Date'])"
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                  >Active</span
                >
                <span
                  v-else
                  class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"
                  >Expirée</span
                >
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-2"
              >
                <button
                  @click="showPromotionDetail(promotion)"
                  class="text-blue-600 hover:text-blue-900 font-medium"
                >
                  Voir
                </button>
                <button
                  @click="edit(promotion)"
                  class="text-emerald-600 hover:text-emerald-900 font-medium"
                >
                  Modifier
                </button>
                <button
                  @click="deletePromotion(promotion.id)"
                  class="text-red-600 hover:text-red-900 font-medium"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="flex justify-between items-center px-6 py-4">
        <div class="text-sm text-gray-500">
          Page {{ page }} / {{ totalPages }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });

import { ref, computed, onMounted } from "vue";
import AddDrawer from "./promotions/add.vue";
import EditDrawer from "./promotions/edit.vue";
import PromotionDetail from "./promotions/[id].vue";

// Reactive state pour les promotions
const promotions = ref<any[]>([]);
const showAdd = ref(false);
const showEdit = ref(false);
const showDetail = ref(false);
const editPromotion = ref(null);
const detailPromotion = ref(null);
const searchQuery = ref("");
const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);

// Fonction utilitaire pour formater la date
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
};

// Fonction pour vérifier si une promotion est active
const isActive = (endDate: string) => {
  if (!endDate) return false;
  return new Date(endDate) > new Date();
};

// Fonctions de gestion des promotions
async function fetchPromotions() {
  try {
    promotions.value = await $fetch("/api/admin/promotions");
  } catch (error) {
    console.error("Erreur lors du chargement des promotions:", error);
  }
}

const paginatedPromotions = computed(() => {
  let filtered = promotions.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.Title && p.Title.toLowerCase().includes(q)) ||
        (p.Type && p.Type.toLowerCase().includes(q))
    );
  }
  totalPages.value = Math.max(1, Math.ceil(filtered.length / pageSize));
  return filtered.slice((page.value - 1) * pageSize, page.value * pageSize);
});

const nextPage = () => {
  if (page.value < totalPages.value) page.value++;
};

const prevPage = () => {
  if (page.value > 1) page.value--;
};

function edit(promotion: any) {
  editPromotion.value = { ...promotion };
  showEdit.value = true;
}

function showPromotionDetail(promotion: any) {
  detailPromotion.value = promotion;
  showDetail.value = true;
}

async function deletePromotion(id: number) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette promotion ?")) {
    try {
      await $fetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
      await fetchPromotions();
    } catch (error) {
      console.error("Erreur lors de la suppression de la promotion:", error);
    }
  }
}

// Charger les promotions au montage
onMounted(fetchPromotions);
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
