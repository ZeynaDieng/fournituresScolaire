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

    <!-- Formulaire d'ajout -->
    <div
      v-if="showAdd"
      class="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Nouvelle promotion
      </h3>
      <form @submit.prevent="addPromotion" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Titre</label
            >
            <input
              v-model="newPromotion.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ex: Rentrée scolaire -20%"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Réduction (%)</label
            >
            <input
              v-model.number="newPromotion.discount"
              type="number"
              required
              min="0"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="20"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Type</label
            >
            <select
              v-model="newPromotion.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Sélectionner un type</option>
              <option value="percentage">Pourcentage</option>
              <option value="fixed">Montant fixe</option>
              <option value="bogo">Achetez 1, obtenez 1</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Date de fin</label
            >
            <input
              v-model="newPromotion.endDate"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Description</label
          >
          <textarea
            v-model="newPromotion.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Description de la promotion..."
          />
        </div>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showAdd = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
    <!-- Formulaire d'édition -->
    <div
      v-if="showEdit"
      class="mb-8 bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 p-6"
    >
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg
          class="w-5 h-5 mr-2 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Modifier la promotion
      </h3>
      <form @submit.prevent="updatePromotion" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Titre</label
            >
            <input
              v-model="editPromotion.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Réduction (%)</label
            >
            <input
              v-model.number="editPromotion.discount"
              type="number"
              required
              min="0"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Type</label
            >
            <select
              v-model="editPromotion.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="percentage">Pourcentage</option>
              <option value="fixed">Montant fixe</option>
              <option value="bogo">Achetez 1, obtenez 1</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Date de fin</label
            >
            <input
              v-model="editPromotion.endDate"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Description</label
          >
          <textarea
            v-model="editPromotion.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="cancelEdit"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Mettre à jour
          </button>
        </div>
      </form>
    </div>

    <!-- Liste des promotions -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          Promotions actives ({{ promotions.length }})
        </h3>
      </div>

      <div v-if="promotions.length === 0" class="p-8 text-center">
        <svg
          class="w-16 h-16 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <p class="text-gray-500 text-lg">Aucune promotion</p>
        <p class="text-gray-400 text-sm">
          Créez votre première promotion pour commencer
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Promotion
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Réduction
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
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
              v-for="promo in promotions"
              :key="promo.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ promo.title }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ promo.description }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-2xl font-bold text-emerald-600"
                  >{{ promo.discount }}%</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getTypeColor(promo.type)"
                >
                  {{ getTypeLabel(promo.type) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(promo.endDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="
                    isExpired(promo.endDate)
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  "
                >
                  {{ isExpired(promo.endDate) ? "Expirée" : "Active" }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex justify-end space-x-2">
                  <button
                    @click="edit(promo)"
                    class="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Modifier"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    @click="deletePromotion(promo.id)"
                    class="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// Layout et middleware
definePageMeta({
  middleware: "admin",
  layout: "admin",
});

const promotions = ref<any[]>([]);
const showAdd = ref(false);
const showEdit = ref(false);
const newPromotion = ref({
  title: "",
  discount: 0,
  type: "",
  endDate: "",
  description: "",
});
const editPromotion = ref({
  id: null,
  title: "",
  discount: 0,
  type: "",
  endDate: "",
  description: "",
});

// Fonctions utilitaires
const getTypeColor = (type: string) => {
  const colors = {
    percentage: "bg-blue-100 text-blue-800",
    fixed: "bg-green-100 text-green-800",
    bogo: "bg-purple-100 text-purple-800",
  };
  return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const getTypeLabel = (type: string) => {
  const labels = {
    percentage: "Pourcentage",
    fixed: "Montant fixe",
    bogo: "Achetez 1, obtenez 1",
  };
  return labels[type as keyof typeof labels] || type;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const isExpired = (endDate: string) => {
  return new Date(endDate) < new Date();
};

// Fonctions CRUD
async function fetchPromotions() {
  try {
    promotions.value = (await $fetch("/api/admin/promotions")) as any;
  } catch (error) {
    console.error("Erreur lors du chargement des promotions:", error);
    promotions.value = [];
  }
}

onMounted(fetchPromotions);

async function addPromotion() {
  try {
    await $fetch("/api/admin/promotions", {
      method: "POST",
      body: newPromotion.value,
    });
    showAdd.value = false;
    newPromotion.value = {
      title: "",
      discount: 0,
      type: "",
      endDate: "",
      description: "",
    };
    await fetchPromotions();
  } catch (error) {
    console.error("Erreur lors de l'ajout de la promotion:", error);
  }
}

function edit(promo: any) {
  editPromotion.value = { ...promo };
  showEdit.value = true;
}

async function updatePromotion() {
  try {
    await $fetch(`/api/admin/promotions/${editPromotion.value.id}`, {
      method: "PUT",
      body: editPromotion.value,
    });
    showEdit.value = false;
    editPromotion.value = {
      id: null,
      title: "",
      discount: 0,
      type: "",
      endDate: "",
      description: "",
    };
    await fetchPromotions();
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la promotion:", error);
  }
}

function cancelEdit() {
  showEdit.value = false;
  editPromotion.value = {
    id: null,
    title: "",
    discount: 0,
    type: "",
    endDate: "",
    description: "",
  };
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
</script>
