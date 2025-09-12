<template>
  <div>
    <!-- Actions header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Gestion des produits</h2>
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
        <span>Ajouter un produit</span>
      </button>
    </div>

    <!-- Formulaire d'ajout -->
    <div v-if="showAdd" class="mb-6 bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Nouveau produit</h3>
      <form @submit.prevent="addProduct" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Nom</label
            >
            <input
              v-model="newProduct.Name"
              type="text"
              placeholder="Ex: Stylo plume"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Prix</label
            >
            <input
              v-model.number="newProduct.Price"
              type="number"
              step="0.01"
              placeholder="Ex: 5000"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Catégorie</label
            >
            <input
              v-model="newProduct.Category"
              type="text"
              placeholder="Ex: Stylos"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Image URL</label
            >
            <input
              v-model="newProduct['Image URL']"
              type="url"
              placeholder="Ex: https://example.com/image.jpg"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Description</label
          >
          <textarea
            v-model="newProduct.Description"
            rows="3"
            placeholder="Description détaillée du produit..."
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
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Modifier le produit
      </h3>
      <form @submit.prevent="updateProduct" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Nom</label
            >
            <input
              v-model="editProduct.Name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Prix</label
            >
            <input
              v-model.number="editProduct.Price"
              type="number"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Catégorie</label
            >
            <input
              v-model="editProduct.Category"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Image URL</label
            >
            <input
              v-model="editProduct['Image URL']"
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
            v-model="editProduct.Description"
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

    <!-- Barre de recherche et pagination -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4"
    >
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom, catégorie..."
        class="w-full md:w-80 border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
      <div class="flex items-center gap-2">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Précédent
        </button>
        <span class="text-sm">Page {{ page }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>

    <!-- Overlay fiche détail produit -->
    <div
      v-if="showDetail"
      class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
        <button
          @click="showDetail = false"
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
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
        <h2 class="text-2xl font-bold mb-4">Détail du produit</h2>
        <div v-if="detailProduct">
          <div class="flex gap-6 mb-4">
            <img
              v-if="detailProduct.image"
              :src="detailProduct.image"
              :alt="detailProduct.name"
              class="w-40 h-40 object-cover rounded-xl border shadow"
            />
            <div class="flex-1 flex flex-col gap-2">
              <div class="text-lg font-semibold text-gray-900">
                {{ detailProduct.name }}
              </div>
              <div class="text-base text-gray-700">
                {{ detailProduct.description }}
              </div>
              <div class="flex gap-2 mt-2">
                <span
                  class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                  >{{ detailProduct.category }}</span
                >
                <span
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                  >En stock</span
                >
              </div>
              <div class="text-2xl font-bold text-emerald-700 mt-2">
                {{ formatCurrency(detailProduct.price) }}
              </div>
            </div>
          </div>
          <div class="flex gap-2 mt-6">
            <button
              @click="copyProductId(detailProduct.id)"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8 16h8M8 12h8m-8-4h8M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Copier l'ID
            </button>
            <button
              @click="downloadProductPDF(detailProduct)"
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center gap-2"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des produits adapté CRUD Airtable -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Liste des produits</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Produit
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Prix
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Catégorie
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Promo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID local
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
              v-for="product in paginatedProducts"
              :key="product.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="product['Image URL']"
                      class="h-10 w-10 rounded-lg object-cover"
                      :src="product['Image URL']"
                      :alt="product.Name"
                    />
                    <div
                      v-else
                      class="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center"
                    >
                      <svg
                        class="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ product.Name }}
                    </div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">
                      {{ product.Description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(product.Price) }}
                </div>
                <div
                  v-if="
                    product['Original Price'] &&
                    product['Original Price'] > product.Price
                  "
                  class="text-xs text-gray-400 line-through"
                >
                  {{ formatCurrency(product["Original Price"]) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                >
                  {{ product.Category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="product['In Stock']"
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                >
                  En stock
                </span>
                <span
                  v-else
                  class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"
                >
                  Rupture
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="
                    product['Discount Percentage'] &&
                    product['Discount Percentage'] > 0
                  "
                  class="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full"
                >
                  -{{ Math.round(product["Discount Percentage"]) }}%
                </span>
                <span
                  v-else
                  class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full"
                >
                  -
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                >
                  {{ product["Local ID"] }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="showProductDetail(product)"
                  class="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                >
                  Voir
                </button>
                <button
                  @click="edit(product)"
                  class="text-emerald-600 hover:text-emerald-900 mr-3 transition-colors"
                >
                  Modifier
                </button>
                <button
                  @click="deleteProduct(product.id)"
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

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

import { ref, onMounted, computed, watch } from "vue";
import { useClipboard } from "@vueuse/core";

// Reactive state pour les produits
const products = ref([]);
const showAdd = ref(false);
const showEdit = ref(false);
const newProduct = ref({
  Name: "",
  Category: "",
  Price: 0,
  "Original Price": 0,
  Description: "",
  Features: "[]",
  Specs: "[]",
  "Bulk Options": "[]",
  "In Stock": true,
  "Discount Percentage": 0,
  "Promotion End Date": "",
  "Stock Alert": "",
  "Image URL": "",
  Images: "",
  "Local ID": "",
  Reviews: "[]",
  "Short Product Summary": { state: "empty", value: null, isStale: true },
  "Product Feature Tags": {
    state: "error",
    errorType: "emptyDependency",
    value: null,
    isStale: false,
  },
});
const editProduct = ref({
  id: null,
  Name: "",
  Category: "",
  Price: 0,
  "Original Price": 0,
  Description: "",
  Features: "[]",
  Specs: "[]",
  "Bulk Options": "[]",
  "In Stock": true,
  "Discount Percentage": 0,
  "Promotion End Date": "",
  "Stock Alert": "",
  "Image URL": "",
  Images: "",
  "Local ID": "",
  Reviews: "[]",
  "Short Product Summary": { state: "empty", value: null, isStale: true },
  "Product Feature Tags": {
    state: "error",
    errorType: "emptyDependency",
    value: null,
    isStale: false,
  },
});
const searchQuery = ref("");
const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);
const showDetail = ref(false);
const detailProduct = ref(null);

// Fonction utilitaire pour formater le prix
const formatCurrency = (amount) => {
  return (
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount) + " CFA"
  );
};

// Fonctions de gestion des produits
async function fetchProducts() {
  try {
    products.value = await $fetch("/api/admin/products");
  } catch (error) {
    console.error("Erreur lors du chargement des produits:", error);
  }
}

async function addProduct() {
  try {
    await $fetch("/api/admin/products", {
      method: "POST",
      body: newProduct.value,
    });

    showAdd.value = false;
    newProduct.value = {
      Name: "",
      Category: "",
      Price: 0,
      "Original Price": 0,
      Description: "",
      Features: "[]",
      Specs: "[]",
      "Bulk Options": "[]",
      "In Stock": true,
      "Discount Percentage": 0,
      "Promotion End Date": "",
      "Stock Alert": "",
      "Image URL": "",
      Images: "",
      "Local ID": "",
      Reviews: "[]",
      "Short Product Summary": { state: "empty", value: null, isStale: true },
      "Product Feature Tags": {
        state: "error",
        errorType: "emptyDependency",
        value: null,
        isStale: false,
      },
    };

    await fetchProducts();
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error);
  }
}

function edit(product) {
  editProduct.value = { ...product };
  showEdit.value = true;
  showAdd.value = false;
}

async function updateProduct() {
  try {
    await $fetch(`/api/admin/products/${editProduct.value.id}`, {
      method: "PUT",
      body: editProduct.value,
    });

    showEdit.value = false;
    editProduct.value = {
      id: null,
      Name: "",
      Category: "",
      Price: 0,
      "Original Price": 0,
      Description: "",
      Features: "[]",
      Specs: "[]",
      "Bulk Options": "[]",
      "In Stock": true,
      "Discount Percentage": 0,
      "Promotion End Date": "",
      "Stock Alert": "",
      "Image URL": "",
      Images: "",
      "Local ID": "",
      Reviews: "[]",
      "Short Product Summary": { state: "empty", value: null, isStale: true },
      "Product Feature Tags": {
        state: "error",
        errorType: "emptyDependency",
        value: null,
        isStale: false,
      },
    };

    await fetchProducts();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
  }
}

function cancelEdit() {
  showEdit.value = false;
  editProduct.value = {
    id: null,
    Name: "",
    Category: "",
    Price: 0,
    "Original Price": 0,
    Description: "",
    Features: "[]",
    Specs: "[]",
    "Bulk Options": "[]",
    "In Stock": true,
    "Discount Percentage": 0,
    "Promotion End Date": "",
    "Stock Alert": "",
    "Image URL": "",
    Images: "",
    "Local ID": "",
    Reviews: "[]",
    "Short Product Summary": { state: "empty", value: null, isStale: true },
    "Product Feature Tags": {
      state: "error",
      errorType: "emptyDependency",
      value: null,
      isStale: false,
    },
  };
}

async function deleteProduct(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
    try {
      await $fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      await fetchProducts();
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
    }
  }
}

// Computed properties et pagination
const paginatedProducts = computed(() => {
  let filtered = products.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        (product.name && product.name.toLowerCase().includes(q)) ||
        (product.category && product.category.toLowerCase().includes(q))
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
watch([products, searchQuery], () => {
  page.value = 1;
});
const showProductDetail = (product) => {
  detailProduct.value = product;
  showDetail.value = true;
};
const copyProductId = (id) => {
  useClipboard().copy(id + "");
  alert("ID du produit copié !");
};
const downloadProductPDF = (product) => {
  alert("Fonction de téléchargement PDF à implémenter.");
};

// Charger les produits au montage
onMounted(fetchProducts);
</script>
