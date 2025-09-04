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
              >Nom du produit</label
            >
            <input
              v-model="newProduct.name"
              type="text"
              placeholder="Ex: Stylo plume"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Prix (CFA)</label
            >
            <input
              v-model.number="newProduct.price"
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
              v-model="newProduct.category"
              type="text"
              placeholder="Ex: Stylos"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Image (URL)</label
            >
            <input
              v-model="newProduct.image"
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
            v-model="newProduct.description"
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
              >Nom du produit</label
            >
            <input
              v-model="editProduct.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Prix (CFA)</label
            >
            <input
              v-model.number="editProduct.price"
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
              v-model="editProduct.category"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Image (URL)</label
            >
            <input
              v-model="editProduct.image"
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
            v-model="editProduct.description"
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

    <!-- Tableau des produits -->
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
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="product in products"
              :key="product.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="product.image"
                      class="h-10 w-10 rounded-lg object-cover"
                      :src="product.image"
                      :alt="product.name"
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
                      {{ product.name }}
                    </div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">
                      {{ product.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(product.price) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                >
                  {{ product.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                >
                  En stock
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
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
import { ref, onMounted } from "vue";

// Protection par middleware - Utilise le layout admin uniquement
definePageMeta({
  middleware: "admin",
  layout: "admin",
});

// Reactive state pour les produits
const products = ref([]);
const showAdd = ref(false);
const showEdit = ref(false);
const newProduct = ref({
  name: "",
  price: 0,
  category: "",
  image: "",
  description: "",
});
const editProduct = ref({
  id: null,
  name: "",
  price: 0,
  category: "",
  image: "",
  description: "",
});

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
      name: "",
      price: 0,
      category: "",
      image: "",
      description: "",
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
      name: "",
      price: 0,
      category: "",
      image: "",
      description: "",
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
    name: "",
    price: 0,
    category: "",
    image: "",
    description: "",
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

// Charger les produits au montage
onMounted(fetchProducts);
</script>
