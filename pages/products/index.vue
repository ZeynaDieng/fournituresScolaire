<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 pt-4 sm:pt-8 pb-24 relative">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      
      <!-- Header section & Search Bar -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#0F3D91] block">
              CATALOGUE EDUSHOP
            </span>
            <h1 class="font-display text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Toutes vos <span class="text-[#0F3D91]">fournitures scolaires</span>
            </h1>
          </div>

          <!-- Bouton Bascule Vue Grille / Liste (Préféré sauvegardé) -->
          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
            <button
              @click="toggleViewMode('grid')"
              class="p-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              :class="viewMode === 'grid' ? 'bg-[#0F3D91] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'"
              title="Vue Grille (2 colonnes mobile)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="toggleViewMode('list')"
              class="p-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              :class="viewMode === 'list' ? 'bg-[#0F3D91] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'"
              title="Vue Liste Compacte"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Champ de recherche tactile instantané -->
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
            🔍
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un cahier, stylo, pack CP, manuel..."
            class="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3D91]/20 focus:border-[#0F3D91] shadow-xs"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Barre de filtres horizontaux défilante (Carrousel tactile de pilules) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        <button
          v-for="cat in quickFilterCategories"
          :key="cat.key"
          @click="currentCategory = cat.key"
          class="px-4 py-2 rounded-full text-xs font-extrabold shrink-0 transition-all cursor-pointer flex items-center gap-1.5"
          :class="
            currentCategory === cat.key
              ? 'bg-[#0F3D91] text-white shadow-sm scale-102'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
          "
        >
          <span>{{ cat.label }}</span>
          <span
            v-if="cat.key === 'Packs'"
            class="ml-1 px-1.5 py-0.2 bg-[#F4C542] text-slate-950 rounded-full text-[9px] font-black"
          >
            PROMO
          </span>
        </button>
      </div>

      <!-- Main Layout: Sidebar Filtres (Desktop) + Grille/Liste Produits -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        
        <!-- Filtres Sidebar (Affiché uniquement sur Desktop) -->
        <aside class="hidden lg:block lg:col-span-3 space-y-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs sticky top-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-extrabold text-xs uppercase tracking-widest text-slate-900">Filtres</h3>
            <button @click="resetFilters" class="text-[11px] font-bold text-[#0F3D91] hover:underline">
              Réinitialiser
            </button>
          </div>

          <!-- Niveau -->
          <div class="space-y-2">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Niveau Scolaire</label>
            <select
              v-model="currentLevel"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="Tous">Tous les niveaux</option>
              <option value="Préscolaire">Préscolaire (3-5 ans)</option>
              <option value="Primaire">Primaire (CI - CM2)</option>
              <option value="Collège">Collège (6e - 3e)</option>
              <option value="Lycée">Lycée (2nde - Tle)</option>
            </select>
          </div>

          <!-- Trier par -->
          <div class="space-y-2">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Trier par</label>
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="popular">Par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>

          <!-- En Stock seulement -->
          <div class="pt-2">
            <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                v-model="inStockOnly"
                class="w-4 h-4 rounded text-[#0F3D91]"
              />
              <span>En stock uniquement</span>
            </label>
          </div>
        </aside>

        <!-- Zone Produits Réels -->
        <main class="lg:col-span-9 space-y-4">
          <!-- Barre d'état du nombre d'articles -->
          <div class="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <span>{{ filteredProducts.length }} fourniture{{ filteredProducts.length > 1 ? 's' : '' }} trouvée{{ filteredProducts.length > 1 ? 's' : '' }}</span>
            <span v-if="currentCategory !== 'Toutes'" class="bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full text-[10px]">
              {{ currentCategory }}
            </span>
          </div>

          <!-- Grille Vide -->
          <div v-if="filteredProducts.length === 0" class="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <span class="text-4xl block">🔍</span>
            <h3 class="font-bold text-base text-slate-900">Aucun produit ne correspond à votre recherche</h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">Essayez de modifier votre mot-clé ou réinitialisez les filtres.</p>
            <button @click="resetFilters" class="px-5 py-2 bg.0F3D91 bg-[#0F3D91] text-white text-xs font-extrabold rounded-full shadow-xs">
              Réinitialiser les filtres
            </button>
          </div>

          <!-- 1. VUE GRILLE : 2 colonnes sur Mobile, 3 Tablette, 4 à 5 Desktop -->
          <div
            v-else-if="viewMode === 'grid'"
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4"
          >
            <article
              v-for="product in filteredProducts"
              :key="product.id"
              class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-[#0F3D91] shadow-2xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between overflow-hidden h-full"
            >
              <!-- Photo Produit Plein Écran Edge-to-Edge -->
              <NuxtLink :to="`/products/${product.id}`" class="relative aspect-square bg-slate-50 overflow-hidden shrink-0 block cursor-pointer">
                <img
                  :src="product.image"
                  :alt="product.name"
                  @error="onImgError"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </NuxtLink>

              <!-- Informations Épurées (Nom + Prix + Bouton Panier +) -->
              <div class="p-2.5 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
                <NuxtLink :to="`/products/${product.id}`" class="block space-y-1 cursor-pointer">
                  <span class="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#0F3D91] block truncate">
                    {{ product.category }}
                  </span>
                  <h3 class="font-display text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0F3D91] transition-colors leading-snug line-clamp-2 min-h-[2.2rem]">
                    {{ product.name }}
                  </h3>
                </NuxtLink>

                <div class="pt-2 flex items-center justify-between border-t border-slate-100 gap-1">
                  <span class="font-display text-xs sm:text-sm font-black text-[#0F3D91]">
                    {{ product.priceFormatted }}
                  </span>

                  <!-- Bouton Rapide Ajouter au Panier -->
                  <button
                    @click.prevent.stop="quickAddToCart(product)"
                    class="w-7 h-7 sm:w-8 sm:h-8 bg-[#0F3D91] hover:bg-[#0c3278] active:scale-90 text-white font-black text-sm rounded-full shadow-xs transition-all flex items-center justify-center cursor-pointer shrink-0"
                    title="Ajouter au panier"
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- 2. VUE LISTE COMPACTE : Rangées Horizontales Épurées -->
          <div v-else class="space-y-2.5">
            <article
              v-for="product in filteredProducts"
              :key="product.id"
              class="bg-white p-3 rounded-2xl border border-slate-200 hover:border-[#0F3D91] shadow-2xs hover:shadow-sm transition-all flex items-center justify-between gap-3 group"
            >
              <NuxtLink :to="`/products/${product.id}`" class="flex items-center gap-3 min-w-0 flex-1 cursor-pointer">
                <img
                  :src="product.image"
                  :alt="product.name"
                  @error="onImgError"
                  class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 bg-slate-50"
                />
                <div class="min-w-0 flex-1 space-y-0.5">
                  <span class="text-[9px] font-extrabold uppercase tracking-widest text-[#0F3D91] block">
                    {{ product.category }}
                  </span>
                  <h3 class="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-[#0F3D91]">
                    {{ product.name }}
                  </h3>
                  <p class="font-black text-xs text-[#0F3D91]">
                    {{ product.priceFormatted }}
                  </p>
                </div>
              </NuxtLink>

              <button
                @click.prevent.stop="quickAddToCart(product)"
                class="px-3.5 py-2 bg-[#0F3D91] hover:bg-[#0c3278] active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1"
              >
                <span>+ Ajouter</span>
              </button>
            </article>
          </div>
        </main>
      </div>

    </div>

    <!-- BOUTON FLOTTANT DE FILTRES SUR MOBILE (Bottom Right) -->
    <button
      @click="isMobileDrawerOpen = true"
      class="lg:hidden fixed bottom-6 right-5 z-40 bg-[#0F3D91] text-white px-4 py-3 rounded-full shadow-2xl font-black text-xs flex items-center gap-2 border-2 border-white/20 active:scale-95 transition-transform"
    >
      <span>⚙️ Filtrer & Trier</span>
      <span v-if="activeFilterCount > 0" class="bg-[#F4C542] text-slate-950 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
        {{ activeFilterCount }}
      </span>
    </button>

    <!-- TIROIR / DRAWER MODAL DE FILTRES MOBILE (Slide Up) -->
    <Transition name="drawer-slide">
      <div v-if="isMobileDrawerOpen" class="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
        <!-- Backdrop flouté -->
        <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" @click="isMobileDrawerOpen = false"></div>

        <!-- Panneau tiroir -->
        <div class="relative z-50 bg-white rounded-t-3xl p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-display font-extrabold text-base text-slate-900">Filtres du Catalogue</h3>
            <button @click="isMobileDrawerOpen = false" class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
              ✕
            </button>
          </div>

          <!-- Catégorie Mobile -->
          <div class="space-y-2">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Catégorie</label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="cat in sidebarCategories"
                :key="cat.key"
                @click="currentCategory = cat.key"
                class="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                :class="currentCategory === cat.key ? 'bg-[#0F3D91] text-white' : 'bg-slate-100 text-slate-700'"
              >
                {{ cat.label }}
              </button>
            </div>
          </div>

          <!-- Niveau Mobile -->
          <div class="space-y-2">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Niveau Scolaire</label>
            <select
              v-model="currentLevel"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="Tous">Tous les niveaux</option>
              <option value="Préscolaire">Préscolaire (3-5 ans)</option>
              <option value="Primaire">Primaire (CI - CM2)</option>
              <option value="Collège">Collège (6e - 3e)</option>
              <option value="Lycée">Lycée (2nde - Tle)</option>
            </select>
          </div>

          <!-- Tri Mobile -->
          <div class="space-y-2">
            <label class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Trier les prix</label>
            <select
              v-model="sortBy"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="popular">Par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>

          <!-- En Stock -->
          <div>
            <label class="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-800">
              <input type="checkbox" v-model="inStockOnly" class="w-4 h-4 text-[#0F3D91] rounded" />
              <span>Afficher uniquement les articles en stock</span>
            </label>
          </div>

          <!-- Actions Tiroir -->
          <div class="pt-3 flex gap-3">
            <button
              @click="resetFilters(); isMobileDrawerOpen = false"
              class="flex-1 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
            >
              Réinitialiser
            </button>
            <button
              @click="isMobileDrawerOpen = false"
              class="flex-1 py-3 bg-[#0F3D91] text-white text-xs font-extrabold rounded-xl shadow-md"
            >
              Appliquer ({{ filteredProducts.length }})
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useProductsStore } from "~/stores/products";
import { useAirtableStore } from "~/stores/airtable";
import { useCartStore } from "~/stores/cart";
import { useNotifications } from "~/composables/useNotifications";

const productsStore = useProductsStore();
const airtableStore = useAirtableStore();
const cartStore = useCartStore();
const { showSuccess } = useNotifications();

// Préférence mode d'affichage (Grille ou Liste)
const viewMode = ref<"grid" | "list">("grid");

function toggleViewMode(mode: "grid" | "list") {
  viewMode.value = mode;
  if (process.client) {
    localStorage.setItem("edushop_catalog_view_mode", mode);
  }
}

// Tiroir Filtre Mobile
const isMobileDrawerOpen = ref(false);

const quickAddToCart = (product: any) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    type: "product",
    category: product.category,
  }, 1);
  showSuccess(`1 ${product.name} ajouté au panier !`);
};

const quickAddPackToCart = (pack: any) => {
  cartStore.addItem({
    id: pack.id,
    name: pack.name || pack.nom,
    price: pack.calculatedSellingPrice || pack.prix_pack || pack.price,
    image: pack.image || pack.coverImage,
    type: "pack",
  }, 1);
  showSuccess(`1 ${pack.name || pack.nom} ajouté au panier !`);
};

const onImgError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&h=600&q=80";
};

function formatPriceVal(val: number) {
  if (!val) return "0 FCFA";
  return new Intl.NumberFormat("fr-FR").format(val) + " F CFA";
}

const searchQuery = ref("");
const currentCategory = ref("Toutes");
const currentLevel = ref("Tous");
const inStockOnly = ref(false);
const sortBy = ref("popular");

const quickFilterCategories = [
  { key: "Toutes", label: "Tout" },
  { key: "Packs", label: "Packs scolaires" },
  { key: "Cahiers", label: "Cahiers" },
  { key: "Stylos", label: "Stylos & Crayon" },
  { key: "Manuels", label: "Manuels" },
  { key: "Fournitures", label: "Fournitures" },
  { key: "Protège-cahiers", label: "Protège-cahiers" },
  { key: "Géométrie", label: "Géométrie" },
];

const sidebarCategories = [
  { key: "Toutes", label: "Toutes les fournitures" },
  { key: "Packs", label: "Packs scolaires" },
  { key: "Cahiers", label: "Cahiers" },
  { key: "Écriture", label: "Stylos & Écriture" },
  { key: "Manuels", label: "Manuels Scolaires" },
  { key: "Fournitures", label: "Fournitures Diverses" },
  { key: "Protège-cahiers", label: "Protège-cahiers" },
  { key: "Géométrie", label: "Géométrie" },
];

onMounted(async () => {
  if (process.client) {
    const savedMode = localStorage.getItem("edushop_catalog_view_mode");
    if (savedMode === "grid" || savedMode === "list") {
      viewMode.value = savedMode;
    }
  }
  if (productsStore.products.length === 0) {
    productsStore.initializeDemoData();
  }
  await airtableStore.initialize();
});

// Packs Scolaires en Vedette
const featuredPacks = computed(() => {
  const packs = (airtableStore.packs && airtableStore.packs.length > 0)
    ? airtableStore.packs
    : productsStore.packs;
  return packs.slice(0, 3);
});

// Tous les produits (avec fusion dynamique des données du Backoffice)
const allProducts = computed(() => {
  const map = new Map<string, any>();
  if (airtableStore.products && airtableStore.products.length > 0) {
    airtableStore.products.forEach((p: any) => map.set(p.id, p));
  }
  if (productsStore.products && productsStore.products.length > 0) {
    productsStore.products.forEach((p: any) => map.set(p.id, { ...(map.get(p.id) || {}), ...p }));
  }

  const combined = Array.from(map.values());
  const activeProds = combined.filter((p: any) => p.isActive !== false);

  return activeProds.map((p) => {
    const priceVal = p.sellingPrice ?? p.price ?? 300;
    return {
      id: p.id,
      name: p.name || p.Name,
      category: p.category || p.Category || "Fournitures",
      schoolLevel: p.schoolLevel || p.SchoolLevel || "Tous niveaux",
      format: p.format || "Standard",
      unit: p.unit || "Unité",
      price: priceVal,
      priceFormatted: `${priceVal.toLocaleString("fr-FR")} F CFA`,
      inStock: p.inStock !== false && (p.stock ?? 50) > 0,
      image: p.image || p["Image URL"] || "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&h=600&q=80",
      description: p.description || "",
    };
  });
});

function isSameCategory(pCat: string = "", filterCat: string = ""): boolean {
  if (!filterCat || filterCat === "Toutes" || filterCat === "Packs") return true;
  const p = (pCat || "").toLowerCase().trim();
  const f = (filterCat || "").toLowerCase().trim();

  if (p === f) return true;

  if (f.includes("fourniture") && p.includes("fourniture")) return true;
  if ((f.includes("écriture") || f.includes("stylo")) && (p.includes("écriture") || p.includes("stylo") || p.includes("crayon") || p.includes("feutre"))) return true;
  if ((f.includes("manuel") || f.includes("livre")) && (p.includes("manuel") || p.includes("livre"))) return true;
  if (f.includes("protège") && p.includes("protège")) return true;
  if (f.includes("géométrie") && (p.includes("géométrie") || p.includes("règle") || p.includes("compas") || p.includes("équerre") || p.includes("rapporteur"))) return true;
  if (f.includes("ardoise") && p.includes("ardoise")) return true;
  if (f.includes("papier") && p.includes("papier")) return true;

  return false;
}

const filteredProducts = computed(() => {
  console.log(`📡 [Client Audit] total allProducts en mémoire: ${allProducts.value.length}`);

  let list = allProducts.value.filter((p) => {
    // Filtre catégorie
    if (!isSameCategory(p.category, currentCategory.value)) {
      return false;
    }
    // Filtre niveau
    if (currentLevel.value !== "Tous") {
      const targetLvl = currentLevel.value.toLowerCase();
      const pLvl = (p.schoolLevel || "tous niveaux").toLowerCase();
      if (pLvl !== "tous niveaux" && !pLvl.includes(targetLvl) && !targetLvl.includes(pLvl)) {
        return false;
      }
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

  console.log(`✅ [Client Audit] Produit(s) filtré(s) affiché(s) pour (${currentCategory.value} / ${currentLevel.value}): ${list.length}`);

  if (sortBy.value === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  }
  return list;
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (currentCategory.value !== "Toutes") count++;
  if (currentLevel.value !== "Tous") count++;
  if (inStockOnly.value) count++;
  if (sortBy.value !== "popular") count++;
  return count;
});

function resetFilters() {
  searchQuery.value = "";
  currentCategory.value = "Toutes";
  currentLevel.value = "Tous";
  inStockOnly.value = false;
  sortBy.value = "popular";
}

useHead({
  title: "Catalogue Mobil-Optimisé Fournitures Scolaires - EduShop",
  meta: [
    {
      name: "description",
      content: "Achetez facilement vos fournitures scolaires sur mobile au Sénégal sur EduShop.",
    },
  ],
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
