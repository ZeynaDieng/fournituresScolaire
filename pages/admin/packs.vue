<template>
  <div>
    <!-- Actions header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-900">
        Gestion des packs scolaires
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
        <span>Ajouter un pack</span>
      </button>
    </div>

    <!-- Formulaire d'ajout -->
    <div v-if="showAdd" class="mb-6 bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Nouveau pack scolaire
      </h3>
      <form @submit.prevent="addPack" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Nom du pack</label
            >
            <input
              v-model="newPack.name"
              type="text"
              placeholder="Ex: Pack CP complet"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Niveau scolaire</label
            >
            <select
              v-model="newPack.level"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">Sélectionner un niveau</option>
              <option value="CP">CP</option>
              <option value="CE1">CE1</option>
              <option value="CE2">CE2</option>
              <option value="CM1">CM1</option>
              <option value="CM2">CM2</option>
              <option value="6ème">6ème</option>
              <option value="5ème">5ème</option>
              <option value="4ème">4ème</option>
              <option value="3ème">3ème</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Prix (CFA)</label
            >
            <input
              v-model.number="newPack.price"
              type="number"
              step="0.01"
              placeholder="Ex: 25000"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Image (URL)</label
            >
            <input
              v-model="newPack.image"
              type="url"
              placeholder="Ex: https://example.com/pack-cp.jpg"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Description</label
          >
          <textarea
            v-model="newPack.description"
            rows="3"
            placeholder="Description détaillée du pack scolaire..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showAdd = false"
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>

    <!-- Formulaire d'édition -->
    <div v-if="showEdit" class="mb-6 bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Modifier le pack</h3>
      <form @submit.prevent="updatePack" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Nom du pack</label
            >
            <input
              v-model="editPack.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Niveau scolaire</label
            >
            <select
              v-model="editPack.level"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">Sélectionner un niveau</option>
              <option value="CP">CP</option>
              <option value="CE1">CE1</option>
              <option value="CE2">CE2</option>
              <option value="CM1">CM1</option>
              <option value="CM2">CM2</option>
              <option value="6ème">6ème</option>
              <option value="5ème">5ème</option>
              <option value="4ème">4ème</option>
              <option value="3ème">3ème</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Prix (CFA)</label
            >
            <input
              v-model.number="editPack.price"
              type="number"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Image (URL)</label
            >
            <input
              v-model="editPack.image"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Description</label
          >
          <textarea
            v-model="editPack.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
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

    <!-- Tableau des packs -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          Liste des packs scolaires
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Pack
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Niveau
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Prix
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
            <tr v-for="pack in packs" :key="pack.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12">
                    <img
                      v-if="pack.image"
                      class="h-12 w-12 rounded-lg object-cover"
                      :src="pack.image"
                      :alt="pack.name"
                    />
                    <div
                      v-else
                      class="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center"
                    >
                      <svg
                        class="w-6 h-6 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ pack.name }}
                    </div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">
                      {{ pack.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {{ pack.level }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(pack.price) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                >
                  Disponible
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="edit(pack)"
                  class="text-emerald-600 hover:text-emerald-900 mr-3 transition-colors"
                >
                  Modifier
                </button>
                <button
                  @click="deletePack(pack.id)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                >
                  Supprimer
                </button>
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

// Protection par middleware
definePageMeta({
  middleware: "admin",
  layout: "admin",
});

// Reactive state pour les packs
const packs = ref<any[]>([]);
const showAdd = ref(false);
const showEdit = ref(false);
const newPack = ref({
  name: "",
  level: "",
  price: 0,
  image: "",
  description: "",
});
const editPack = ref({
  id: null,
  name: "",
  level: "",
  price: 0,
  image: "",
  description: "",
});

// Fonction utilitaire pour formater le prix
const formatCurrency = (amount: number) => {
  return (
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount) + " CFA"
  );
};

// Fonctions de gestion des packs
async function fetchPacks() {
  try {
    packs.value = await $fetch("/api/admin/packs");
  } catch (error) {
    console.error("Erreur lors du chargement des packs:", error);
  }
}

async function addPack() {
  try {
    await $fetch("/api/admin/packs", {
      method: "POST",
      body: newPack.value,
    });

    showAdd.value = false;
    newPack.value = {
      name: "",
      level: "",
      price: 0,
      image: "",
      description: "",
    };

    await fetchPacks();
  } catch (error) {
    console.error("Erreur lors de l'ajout du pack:", error);
  }
}

function edit(pack: any) {
  editPack.value = { ...pack };
  showEdit.value = true;
  showAdd.value = false;
}

async function updatePack() {
  try {
    await $fetch(`/api/admin/packs/${editPack.value.id}`, {
      method: "PUT",
      body: editPack.value,
    });

    showEdit.value = false;
    editPack.value = {
      id: null,
      name: "",
      level: "",
      price: 0,
      image: "",
      description: "",
    };

    await fetchPacks();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du pack:", error);
  }
}

function cancelEdit() {
  showEdit.value = false;
  editPack.value = {
    id: null,
    name: "",
    level: "",
    price: 0,
    image: "",
    description: "",
  };
}

async function deletePack(id: number) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce pack ?")) {
    try {
      await $fetch(`/api/admin/packs/${id}`, { method: "DELETE" });
      await fetchPacks();
    } catch (error) {
      console.error("Erreur lors de la suppression du pack:", error);
    }
  }
}

// Charger les packs au montage
onMounted(fetchPacks);
</script>
