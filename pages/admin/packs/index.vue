<template>
  <div>
    <!-- Actions header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-900">
        Gestion des packs scolaires
      </h2>
      <button
        @click="
          () => {
            console.log('Add button clicked');
            showAdd = true;
          }
        "
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

    <!-- Drawer Ajout -->
    <div
      v-if="showAdd"
      class="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40"
    >
      <div
        class="w-full max-w-md bg-white h-full shadow-xl p-8 overflow-y-auto relative flex flex-col"
      >
        <button
          @click="showAdd = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 class="text-2xl font-bold mb-6 text-gray-900">Ajouter un pack</h2>
        <form @submit.prevent="addPack" class="flex-1 flex flex-col gap-4">
          <input
            v-model="newPack.Name"
            type="text"
            placeholder="Nom du pack"
            class="input"
            required
          />
          <select v-model="newPack.Level" class="input" required>
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
            <option value="2nde">2nde</option>
            <option value="1ère">1ère</option>
            <option value="Tle">Tle</option>
            <option value="1ère">1ère</option>
            <option value="Terminale">Terminale</option>
          </select>
          <input
            v-model.number="newPack.Price"
            type="number"
            placeholder="Prix (FCFA)"
            class="input"
            required
          />
          <input
            v-model.number="newPack['Original Price']"
            type="number"
            placeholder="Prix d'origine (FCFA)"
            class="input"
          />
          <input
            v-model="newPack['Image URL']"
            type="url"
            placeholder="Image principale (URL)"
            class="input"
          />
          <textarea
            v-model="newPack.Description"
            placeholder="Description"
            class="input"
            rows="2"
          ></textarea>
          <textarea
            v-model="newPack.Contents"
            placeholder="Contenu du pack (un élément par ligne)"
            class="input"
            rows="4"
          ></textarea>
          <input
            v-model="newPack['Local ID']"
            type="text"
            placeholder="ID local"
            class="input"
          />
          <input
            v-model="newPack['Promotion End Date']"
            type="date"
            placeholder="Fin de promo"
            class="input"
          />
          <label class="flex items-center gap-2">
            <input
              v-model="newPack['Is Promotion']"
              type="checkbox"
              class="accent-emerald-600"
            />
            Pack en promotion
          </label>
          <label class="flex items-center gap-2">
            <input
              v-model="newPack['In Stock']"
              type="checkbox"
              class="accent-emerald-600"
            />
            En stock
          </label>
          <div class="flex gap-2 mt-6">
            <button
              type="button"
              @click="showAdd = false"
              class="flex-1 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="flex-1 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Drawer Edition -->
    <div
      v-if="showEdit"
      class="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40"
    >
      <div
        class="w-full max-w-md bg-white h-full shadow-xl p-8 overflow-y-auto relative flex flex-col"
      >
        <button
          @click="showEdit = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 class="text-2xl font-bold mb-6 text-gray-900">Modifier le pack</h2>
        <form
          @submit.prevent="updatePack"
          class="flex-1 flex flex-col gap-4"
          v-if="editPack"
        >
          <input
            v-model="editPack.Name"
            type="text"
            placeholder="Nom du pack"
            class="input"
            required
          />
          <select v-model="editPack.Level" class="input" required>
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
          <input
            v-model.number="editPack.Price"
            type="number"
            placeholder="Prix (FCFA)"
            class="input"
            required
          />
          <input
            v-model.number="editPack['Original Price']"
            type="number"
            placeholder="Prix d'origine (FCFA)"
            class="input"
          />
          <input
            v-model="editPack['Image URL']"
            type="url"
            placeholder="Image principale (URL)"
            class="input"
          />
          <textarea
            v-model="editPack.Description"
            placeholder="Description"
            class="input"
            rows="2"
          ></textarea>
          <textarea
            v-model="editPack.Contents"
            placeholder="Contenu du pack (un élément par ligne)"
            class="input"
            rows="4"
          ></textarea>
          <input
            v-model="editPack['Local ID']"
            type="text"
            placeholder="ID local"
            class="input"
          />
          <input
            v-model="editPack['Promotion End Date']"
            type="date"
            placeholder="Fin de promo"
            class="input"
          />
          <label class="flex items-center gap-2">
            <input
              v-model="editPack['Is Promotion']"
              type="checkbox"
              class="accent-emerald-600"
            />
            Pack en promotion
          </label>
          <label class="flex items-center gap-2">
            <input
              v-model="editPack['In Stock']"
              type="checkbox"
              class="accent-emerald-600"
            />
            En stock
          </label>
          <div class="flex gap-2 mt-6">
            <button
              type="button"
              @click="showEdit = false"
              class="flex-1 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="flex-1 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Overlay Détail -->
    <div
      v-if="showDetail"
      class="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40"
    >
      <div
        class="w-full max-w-2xl bg-white h-full shadow-xl p-8 overflow-y-auto relative flex flex-col"
      >
        <button
          @click="showDetail = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 class="text-2xl font-bold mb-6 text-gray-900">Détail du pack</h2>
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold text-lg">{{ detailPack?.Name }}</h3>
            <p class="text-gray-600">Niveau: {{ detailPack?.Level }}</p>
            <p class="text-gray-600">Prix: {{ detailPack?.Price }} FCFA</p>
            <p v-if="detailPack?.['Original Price']" class="text-gray-600">
              Prix d'origine: {{ detailPack?.["Original Price"] }} FCFA
            </p>
          </div>
          <div v-if="detailPack?.Description">
            <h4 class="font-semibold">Description:</h4>
            <p class="text-gray-700">{{ detailPack.Description }}</p>
          </div>
          <div v-if="detailPack?.Contents">
            <h4 class="font-semibold">Contenu:</h4>
            <p class="text-gray-700">{{ detailPack.Contents }}</p>
          </div>
        </div>
      </div>
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
                Prix d'origine
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Promo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Remise
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
                      v-if="pack['Image URL']"
                      class="h-12 w-12 rounded-lg object-cover"
                      :src="pack['Image URL']"
                      :alt="pack.Name"
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
                      {{ pack.Name }}
                    </div>
                    <div class="text-xs text-gray-500 truncate max-w-xs">
                      {{ pack.Description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                  >{{ pack.Level }}</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(pack.Price) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 line-through">
                  {{ formatCurrency(pack["Original Price"]) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="pack['Is Promotion']"
                  class="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full"
                  >Promo</span
                >
                <span
                  v-else
                  class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full"
                  >-</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="pack['Discount %'] && pack['Discount %'] > 0"
                  class="text-green-600 font-semibold"
                  >-{{ Math.round(pack["Discount %"] * 100) }}%</span
                >
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="pack['In Stock']"
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                  >En stock</span
                >
                <span
                  v-else
                  class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"
                  >Rupture</span
                >
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-2"
              >
                <button
                  @click="showPackDetail(pack)"
                  class="text-blue-600 hover:text-blue-900 font-medium"
                >
                  Voir
                </button>
                <button
                  @click="edit(pack)"
                  class="text-emerald-600 hover:text-emerald-900 font-medium"
                >
                  Modifier
                </button>
                <button
                  @click="deletePack(pack.id)"
                  class="text-red-600 hover:text-red-900 font-medium"
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
definePageMeta({ layout: "admin", middleware: "admin" });

import { ref, onMounted } from "vue";

// Reactive state pour les packs
const packs = ref<any[]>([]);
const showAdd = ref(false);
const showEdit = ref(false);
const showDetail = ref(false);
const editPack = ref<any>(null);
const detailPack = ref<any>(null);
const newPack = ref({
  Name: "",
  Level: "",
  Price: 0,
  "Original Price": 0,
  Description: "",
  Contents: "",
  "In Stock": true,
  "Is Promotion": false,
  "Promotion End Date": "",
  "Image URL": "",
  "Local ID": "",
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
    // Données de test en cas d'erreur
    packs.value = [
      {
        id: "test1",
        Name: "Pack CP Test",
        Level: "CP",
        Price: 15000,
        "Original Price": 18000,
        Description: "Pack complet pour CP",
        Contents: "Cahier, Stylo, Crayon, Gomme",
        "In Stock": true,
        "Is Promotion": true,
        "Discount %": 0.17,
        "Image URL": "",
        "Local ID": "PACK_CP_001",
      },
      {
        id: "test2",
        Name: "Pack CE1 Test",
        Level: "CE1",
        Price: 20000,
        "Original Price": 20000,
        Description: "Pack complet pour CE1",
        Contents: "Cahier, Stylo, Crayon, Règle",
        "In Stock": true,
        "Is Promotion": false,
        "Discount %": 0,
        "Image URL": "",
        "Local ID": "PACK_CE1_001",
      },
    ];
  }
}

function edit(pack: any) {
  console.log("Edit pack:", pack);
  editPack.value = { ...pack };
  showEdit.value = true;
}

function showPackDetail(pack: any) {
  console.log("Show pack detail:", pack);
  detailPack.value = pack;
  showDetail.value = true;
}

async function addPack() {
  try {
    // Transformer Contents en array si c'est une string
    const body: any = { ...newPack.value };
    if (body.Contents && typeof body.Contents === "string") {
      body.Contents = body.Contents.split("\n").filter((line: string) =>
        line.trim()
      );
    }

    // Nettoyer les champs vides pour Airtable
    if (!body["Promotion End Date"] || body["Promotion End Date"] === "") {
      delete body["Promotion End Date"];
    }
    if (!body["Image URL"] || body["Image URL"] === "") {
      delete body["Image URL"];
    }
    if (!body["Local ID"] || body["Local ID"] === "") {
      delete body["Local ID"];
    }

    await $fetch("/api/admin/packs", { method: "POST", body });

    // Réinitialiser le formulaire
    newPack.value = {
      Name: "",
      Level: "",
      Price: 0,
      "Original Price": 0,
      Description: "",
      Contents: "",
      "In Stock": true,
      "Is Promotion": false,
      "Promotion End Date": "",
      "Image URL": "",
      "Local ID": "",
    };

    showAdd.value = false;
    await fetchPacks();
  } catch (error) {
    console.error("Erreur lors de l'ajout du pack:", error);
  }
}

async function updatePack() {
  try {
    if (!editPack.value) return;
    const body: any = { ...editPack.value };

    // Nettoyer les champs vides pour Airtable
    if (!body["Promotion End Date"] || body["Promotion End Date"] === "") {
      delete body["Promotion End Date"];
    }
    if (!body["Image URL"] || body["Image URL"] === "") {
      delete body["Image URL"];
    }
    if (!body["Local ID"] || body["Local ID"] === "") {
      delete body["Local ID"];
    }

    await $fetch(`/api/admin/packs/${editPack.value.id}`, {
      method: "PUT",
      body,
    });

    showEdit.value = false;
    await fetchPacks();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du pack:", error);
  }
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
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500;
}
</style>
