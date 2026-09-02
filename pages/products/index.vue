<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 pt-8 pb-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header section -->
      <div class="mb-10">
        <span class="text-[11px] font-extrabold uppercase tracking-widest text-[#0F3D91] block mb-2">
          CATALOGUE UNITAIRE EDUSHOP
        </span>
        <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
          Toutes vos <span class="text-[#0F3D91] font-normal">fournitures scolaires.</span>
        </h1>
        <p class="text-xs text-slate-500 font-medium mt-1">Cahiers, stylos, géométrie, fournitures, protège-cahiers et livres</p>
      </div>

      <!-- Main Layout: Sidebar + Products Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Sidebar Filters -->
        <aside class="lg:col-span-3 space-y-6 bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/80 shadow-xs">
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
                placeholder="Cahiers, stylos, livres..."
                class="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3D91]/20 focus:border-[#0F3D91] transition-all shadow-xs"
              />
            </div>
          </div>

          <!-- Catégorie -->
          <div class="space-y-3">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
              CATÉGORIE
            </label>
            <div class="space-y-1 max-h-60 overflow-y-auto pr-1">
              <button
                v-for="cat in sidebarCategories"
                :key="cat.key"
                @click="currentCategory = cat.key"
                class="w-full text-left px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                :class="
                  currentCategory === cat.key
                    ? 'bg-[#0F3D91] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 font-medium'
                "
              >
                <span>{{ cat.label }}</span>
              </button>
            </div>
          </div>

          <!-- Niveau Scolaire -->
          <div class="space-y-3 pt-4 border-t border-slate-100">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
              NIVEAU SCOLAIRE
            </label>
            <select
              v-model="currentLevel"
              class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0F3D91]"
            >
              <option value="Tous">Tous les niveaux</option>
              <option value="Primaire">Primaire (CI, CP, CE, CM)</option>
              <option value="Collège">Collège (6ème - 3ème)</option>
              <option value="Lycée">Lycée (2nde - Tle)</option>
              <option value="Tous niveaux">Tous niveaux</option>
            </select>
          </div>

          <!-- Disponibilité -->
          <div class="space-y-3 pt-4 border-t border-slate-100">
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

          <button
            @click="resetFilters"
            class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-all cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </aside>

        <!-- Right Main Products Area -->
        <main class="lg:col-span-9 space-y-6">
          <!-- Toolbar (Count + Sort) -->
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold text-slate-500">
              {{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }} disponible{{ filteredProducts.length > 1 ? 's' : '' }}
            </p>

            <div class="flex items-center gap-3">
              <select
                v-model="sortBy"
                class="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0F3D91]"
              >
                <option value="popular">Par défaut</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          <!-- Products Grid (3 Columns) -->
          <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between overflow-hidden h-full"
            >
              <!-- Product Image Container (Full-bleed edge-to-edge) -->
              <NuxtLink :to="`/products/${product.id}`" class="relative aspect-square bg-slate-50 overflow-hidden shrink-0 block cursor-pointer">
                <img
                  :src="product.image"
                  :alt="product.name"
                  @error="onImgError"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-xs z-10"
                  :class="product.inStock ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'"
                >
                  {{ product.inStock ? 'En stock' : 'Rupture' }}
                </span>
              </NuxtLink>

              <!-- Product Details (Clickable to Product Page) -->
              <div class="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <NuxtLink :to="`/products/${product.id}`" class="block space-y-2 cursor-pointer">
                  <div class="flex items-center justify-between gap-1 mb-1.5">
                    <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#0F3D91] block">
                      {{ product.category }}
                    </span>
                  </div>
                  
                  <h3 class="font-display text-sm font-bold text-slate-900 group-hover:text-[#0F3D91] transition-colors leading-snug min-h-[2.5rem] line-clamp-2">
                    {{ product.name }}
                  </h3>
                  
                  <p class="text-xs text-slate-500 line-clamp-2 mt-1 min-h-[2rem]">
                    {{ product.description || 'Fourniture scolaire certifiée EduShop' }}
                  </p>

                </NuxtLink>

                <!-- Price and Buy Action -->
                <div class="pt-3 flex items-center justify-between border-t border-slate-100 gap-2">
                  <div>
                    <span class="text-[10px] font-bold text-slate-400 block uppercase">Prix de vente</span>
                    <span class="font-display text-base font-extrabold text-[#0F3D91]">
                      {{ product.priceFormatted }}
                    </span>
                  </div>
                  
                  <!-- 1-Click Quick Buy Button -->
                  <button
                    @click.prevent.stop="quickAddToCart(product)"
                    class="px-4 py-2 bg-[#0F3D91] hover:bg-[#0c3278] active:scale-95 text-white font-extrabold text-xs rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    title="Ajouter au panier"
                  >
                    <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8">
            <p class="text-slate-500 text-sm font-semibold">Aucun produit ne correspond à ces critères de recherche.</p>
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
import { useProductsStore } from "~/stores/products";
import { useCartStore } from "~/stores/cart";

const productsStore = useProductsStore();
const cartStore = useCartStore();

const quickAddToCart = (product: any) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    type: "product",
    category: product.category,
  }, 1);
};

const onImgError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&h=600&q=80";
};

const searchQuery = ref("");
const currentCategory = ref("Toutes");
const currentLevel = ref("Tous");
const inStockOnly = ref(false);
const sortBy = ref("popular");

const sidebarCategories = [
  { key: "Toutes", label: "Toutes les fournitures" },
  { key: "Cahiers", label: "Cahiers" },
  { key: "Écriture", label: "Écriture" },
  { key: "Géométrie", label: "Géométrie" },
  { key: "Fournitures", label: "Fournitures" },
  { key: "Protège-cahiers", label: "Protège-cahiers" },
  { key: "Livres", label: "Livres" },
];

onMounted(() => {
  if (productsStore.products.length === 0) {
    productsStore.initializeDemoData();
  }
});

// Front Office: Produits actifs uniquement avec sellingPrice
const allProducts = computed(() => {
  const activeProds = productsStore.products.filter((p: any) => p.isActive !== false);

  return activeProds.map((p) => {
    const priceVal = p.sellingPrice ?? p.price ?? 300;
    return {
      id: p.id,
      name: p.name,
      category: p.category || "Fournitures",
      schoolLevel: p.schoolLevel || "Tous niveaux",
      format: p.format || "Standard",
      unit: p.unit || "Unité",
      price: priceVal,
      priceFormatted: `${priceVal.toLocaleString("fr-FR")} F CFA`,
      inStock: p.inStock !== false && (p.stock ?? 50) > 0,
      image: p.image || "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=500",
      description: p.description || "",
    };
  });
});

const filteredProducts = computed(() => {
  let list = allProducts.value.filter((p) => {
    // Filtre catégorie
    if (currentCategory.value !== "Toutes" && p.category !== currentCategory.value) {
      return false;
    }
    // Filtre niveau
    if (currentLevel.value !== "Tous" && p.schoolLevel !== currentLevel.value && p.schoolLevel !== "Tous niveaux") {
      return false;
    }
    // Filtre recherche
    if (searchQuery.value.trim() !== "") {
      const q = searchQuery.value.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      if (!matchName && !matchCategory) return false;
    }
    // Stock
    if (inStockOnly.value && !p.inStock) {
      return false;
    }
    return true;
  });

  if (sortBy.value === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  }

  return list;
});

function resetFilters() {
  searchQuery.value = "";
  currentCategory.value = "Toutes";
  currentLevel.value = "Tous";
  inStockOnly.value = false;
  sortBy.value = "popular";
}

useHead({
  title: "Catalogue Unitaire Fournitures Scolaires - EduShop",
  meta: [
    {
      name: "description",
      content: "Achetez l'ensemble de vos fournitures scolaires à l'unité au Sénégal sur EduShop.",
    },
  ],
});
</script>
