<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Produits</h2>
      <button
        @click="showAdd = true"
        class="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow transition"
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
        <span>Ajouter</span>
      </button>
    </div>

    <!-- Recherche -->
    <div
      class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom, catégorie..."
        class="w-full md:w-80 border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </div>

    <!-- Table produits -->
    <div class="bg-white rounded-xl shadow border overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              {{ col.label }}
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="product in paginatedProducts"
            :key="product.id"
            class="hover:bg-gray-50 transition"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-6 py-4 whitespace-nowrap"
            >
              <span v-if="col.key === 'Image URL' && product['Image URL']">
                <img
                  :src="product['Image URL']"
                  :alt="product.Name"
                  class="w-10 h-10 object-cover rounded-lg border"
                />
              </span>
              <span v-else>{{ product[col.key] }}</span>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right flex gap-2 justify-end"
            >
              <button
                @click="showProductDetail(product)"
                class="text-blue-600 hover:text-blue-900 font-medium"
              >
                Voir
              </button>
              <button
                @click="edit(product)"
                class="text-emerald-600 hover:text-emerald-900 font-medium"
              >
                Modifier
              </button>
              <button
                @click="deleteProduct(product.id)"
                class="text-red-600 hover:text-red-900 font-medium"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <div class="flex justify-between items-center px-6 py-4">
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
        <div class="text-sm text-gray-500">
          Page {{ page }} / {{ totalPages }}
        </div>
      </div>
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
          <AddDrawer @close="showAdd = false" @refresh="fetchProducts" />
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
            :product="editProduct"
            @close="showEdit = false"
            @refresh="fetchProducts"
          />
        </div>
      </div>
    </Transition>
    <!-- Overlay Détail -->
    <ProductDetail
      v-if="showDetail"
      :product="detailProduct"
      @close="showDetail = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import AddDrawer from "./add.vue";
import EditDrawer from "./edit.vue";
import ProductDetail from "./[id].vue";
definePageMeta({
  layout: "admin",
  middleware: "admin",
});
const products = ref([]);
const showAdd = ref(false);
const showEdit = ref(false);
const showDetail = ref(false);
const editProduct = ref(null);
const detailProduct = ref(null);
const searchQuery = ref("");
const page = ref(1);
const pageSize = 10;
const totalPages = ref(1);

const columns = [
  { key: "Name", label: "Nom" },
  { key: "Price", label: "Prix" },
  { key: "Category", label: "Catégorie" },
  { key: "Image URL", label: "Image" },
  { key: "In Stock", label: "Stock" },
  { key: "Discount Percentage", label: "Promo (%)" },
  { key: "Local ID", label: "ID local" },
];

async function fetchProducts() {
  products.value = await $fetch("/api/admin/products");
}

const paginatedProducts = computed(() => {
  let filtered = products.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.Name && p.Name.toLowerCase().includes(q)) ||
        (p.Category && p.Category.toLowerCase().includes(q))
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

function edit(product) {
  editProduct.value = { ...product };
  showEdit.value = true;
}
function showProductDetail(product) {
  detailProduct.value = product;
  showDetail.value = true;
}
async function deleteProduct(id) {
  if (confirm("Supprimer ce produit ?")) {
    await $fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    await fetchProducts();
  }
}
onMounted(fetchProducts);
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
