<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 pt-8 pb-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header section (Screenshot exact match) -->
      <div class="mb-10">
        <span class="text-[11px] font-extrabold uppercase tracking-widest text-[#0F3D91] block mb-2">
          CATALOGUE
        </span>
        <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
          Toutes vos <span class="text-[#0F3D91] font-normal">fournitures.</span>
        </h1>
      </div>

      <!-- Main Layout: Sidebar + Products Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Sidebar Filters (Screenshot exact match) -->
        <aside class="lg:col-span-3 space-y-8 bg-white/70 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/80">
          <!-- Recherche -->
          <div class="space-y-2">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
              RECHERCHE
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                🔍
              </span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cahiers, stylos..."
                class="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3D91]/20 focus:border-[#0F3D91] transition-all shadow-sm"
              />
            </div>
          </div>

          <!-- Catégorie -->
          <div class="space-y-3">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
              CATÉGORIE
            </label>
            <div class="space-y-1">
              <button
                v-for="cat in sidebarCategories"
                :key="cat.key"
                @click="currentCategory = cat.key"
                class="w-full text-left px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-between"
                :class="
                  currentCategory === cat.key
                    ? 'bg-[#0F3D91] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 font-medium'
                "
              >
                <span>{{ cat.label }}</span>
              </button>
            </div>
          </div>

          <!-- Disponibilité -->
          <div class="space-y-3 pt-2 border-t border-slate-100">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
              DISPONIBILITÉ
            </label>
            <label class="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                v-model="inStockOnly"
                class="w-4 h-4 rounded border-slate-300 text-[#0F3D91] focus:ring-[#0F3D91]"
              />
              <span>En stock seulement</span>
            </label>
          </div>
        </aside>

        <!-- Right Main Products Area -->
        <main class="lg:col-span-9 space-y-6">
          <!-- Toolbar (Count + Sort & View Toggle) -->
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold text-slate-500">
              {{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }}
            </p>

            <div class="flex items-center gap-3">
              <select
                v-model="sortBy"
                class="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0F3D91]"
              >
                <option value="popular">Populaires</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>

              <div class="hidden sm:flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-full text-xs text-slate-500">
                <button class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-900 font-bold">::</button>
                <button class="px-2.5 py-1 rounded-full hover:bg-slate-50">=</button>
              </div>
            </div>
          </div>

          <!-- Products Grid (3 Columns) -->
          <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
              v-for="product in filteredProducts"
              :key="product.id"
              :to="`/products/${product.id}`"
              class="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between overflow-hidden"
            >
              <!-- Product Image Container -->
              <div class="relative aspect-square bg-[#F7F5EF] p-6 flex items-center justify-center overflow-hidden">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="max-h-full max-w-full object-contain mix-blend-multiply transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <!-- Product Details -->
              <div class="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                    {{ product.brand }}
                  </span>
                  <h3 class="font-display text-sm font-bold text-slate-900 group-hover:text-[#0F3D91] transition-colors leading-snug line-clamp-2">
                    {{ product.name }}
                  </h3>
                </div>

                <div class="pt-3 flex items-center justify-between border-t border-slate-100 gap-2">
                  <span class="font-display text-sm font-extrabold text-slate-950">
                    {{ product.priceFormatted }}
                  </span>
                  
                  <!-- 1-Click Quick Buy Button -->
                  <button
                    @click.prevent.stop="quickAddToCart(product)"
                    class="px-4 py-2 bg-[#0F3D91] hover:bg-[#0c3278] active:scale-95 text-white font-extrabold text-xs rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    title="Acheter en 1-clic"
                  >
                    <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8">
            <p class="text-slate-500 text-sm font-semibold">Aucun produit trouvé pour ce filtre.</p>
            <button
              @click="resetFilters"
              class="mt-4 px-6 py-2.5 bg-[#0F3D91] text-white rounded-full text-xs font-bold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAirtableStore } from "~/stores/airtable";
import { useProductsStore } from "~/stores/products";
import { useCartStore } from "~/stores/cart";

const airtableStore = useAirtableStore();
const productsStore = useProductsStore();
const cartStore = useCartStore();

const quickAddToCart = (product: any) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: typeof product.price === "number" ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 350,
    image: product.image,
    type: "product",
    category: product.category,
  }, 1);
};

const searchQuery = ref("");
const currentCategory = ref("Toutes");
const inStockOnly = ref(true);
const sortBy = ref("popular");

const sidebarCategories = [
  { key: "Toutes", label: "Toutes" },
  { key: "Bagagerie", label: "Bagagerie" },
  { key: "Cahiers", label: "Cahiers" },
  { key: "Calculatrices", label: "Calculatrices" },
  { key: "Arts plastiques", label: "Arts plastiques" },
];

// Produits de base (Matching Lovable Screenshot 100%)
const defaultProducts = [
  {
    id: "sac-a-dos-navigateur",
    brand: "EduShop",
    name: "Sac à dos Navigateur",
    category: "Bagagerie",
    price: 12500,
    priceFormatted: "12 500 F CFA",
    rating: "4.7",
    inStock: true,
    image: "https://i.pinimg.com/736x/8c/4f/b8/8c4fb8bd40f1a67e063ffb2223f4190b.jpg",
  },
  {
    id: "cahiers-96p-lot-6",
    brand: "Clairefontaine",
    name: "Cahiers 96 pages — Lot de 6",
    category: "Cahiers",
    price: 3600,
    priceFormatted: "3 600 F CFA",
    rating: "4.9",
    inStock: true,
    image: "https://i.pinimg.com/1200x/4e/99/18/4e991885818a6f5d75c158915c667798.jpg",
  },
  {
    id: "calculatrice-fx-92",
    brand: "Casio",
    name: "Calculatrice scientifique FX-92",
    category: "Calculatrices",
    price: 14500,
    priceFormatted: "14 500 F CFA",
    rating: "4.8",
    inStock: true,
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: "crayons-couleur-24",
    brand: "Faber-Castell",
    name: "Crayons de couleur — Lot de 24",
    category: "Arts plastiques",
    price: 4200,
    priceFormatted: "4 200 F CFA",
    rating: "4.9",
    inStock: true,
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=500",
  },
  {
    id: "cahier-120p",
    brand: "Clairefontaine",
    name: "Cahier 200 pages grand format",
    category: "Cahiers",
    price: 600,
    priceFormatted: "600 F CFA",
    rating: "4.9",
    inStock: true,
    image: "https://i.pinimg.com/736x/fd/f9/0b/fdf90bf685ccedf53d0297c5133f3678.jpg",
  },
  {
    id: "stylo-bille-bleu",
    brand: "BIC",
    name: "Stylo Bille Bleu (Lot de 4)",
    category: "Arts plastiques",
    price: 500,
    priceFormatted: "500 F CFA",
    rating: "4.8",
    inStock: true,
    image: "https://i.pinimg.com/736x/f3/c3/96/f3c396b6166cb46d61cafa6656cce35c.jpg",
  },
];

onMounted(async () => {
  if (productsStore.products.length === 0) {
    productsStore.initializeDemoData();
  }
  if (process.client) {
    const custom = JSON.parse(localStorage.getItem("custom_products") || "[]");
    custom.forEach((cProd: any) => {
      if (!productsStore.products.some((p: any) => p.id === cProd.id)) {
        productsStore.products.unshift(cProd as any);
      }
    });
  }
  if (airtableStore.products.length === 0) {
    await airtableStore.fetchProducts();
  }
});

// Formater et filtrer les produits
const allProducts = computed(() => {
  let customProds: any[] = [];
  if (process.client) {
    customProds = JSON.parse(localStorage.getItem("custom_products") || "[]");
  }
  const storeProds = [...customProds, ...productsStore.products];
  if (storeProds.length > 0) {
    return storeProds.map((p) => {
      let brand = "EDUSHOP";
      if (p.name.toLowerCase().includes("casio")) brand = "Casio";
      else if (p.name.toLowerCase().includes("claire")) brand = "Clairefontaine";
      else if (p.name.toLowerCase().includes("faber")) brand = "Faber-Castell";
      else if (p.name.toLowerCase().includes("bic")) brand = "BIC";
      else if (p.category) brand = p.category;

      let category = "Cahiers";
      if (p.category === "Sacs" || p.name.toLowerCase().includes("sac") || p.name.toLowerCase().includes("trousse")) category = "Bagagerie";
      else if (p.category === "Calculatrices" || p.name.toLowerCase().includes("calculatrice")) category = "Calculatrices";
      else if (p.category === "Stylos" || p.category === "Crayons" || p.category === "Gommes" || p.name.toLowerCase().includes("couleur")) category = "Arts plastiques";

      return {
        id: p.id,
        brand: brand,
        name: p.name,
        category: category,
        price: p.price,
        priceFormatted: `${p.price.toLocaleString("fr-FR")} F CFA`,
        rating: "4.8",
        inStock: p.inStock !== false,
        image: p.image,
      };
    });
  }
  return defaultProducts;
});

const filteredProducts = computed(() => {
  return allProducts.value.filter((p) => {
    // Filtre catégorie
    if (currentCategory.value !== "Toutes" && p.category !== currentCategory.value) {
      return false;
    }
    // Filtre recherche
    if (searchQuery.value.trim() !== "") {
      const q = searchQuery.value.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      if (!matchName && !matchBrand) return false;
    }
    // Stock
    if (inStockOnly.value && !p.inStock) {
      return false;
    }
    return true;
  });
});

function resetFilters() {
  searchQuery.value = "";
  currentCategory.value = "Toutes";
  inStockOnly.value = false;
}

useHead({
  title: "Toutes vos fournitures - EduShop",
  meta: [
    {
      name: "description",
      content: "Découvrez notre catalogue de fournitures scolaires au Sénégal.",
    },
  ],
});
</script>
