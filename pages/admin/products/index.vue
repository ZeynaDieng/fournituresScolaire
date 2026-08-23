<template>
  <div class="space-y-6">
    
    <!-- Action Header -->
    <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-display text-2xl font-extrabold text-slate-950">Catalogue Produits & Upload d'Images Local</h2>
        <p class="text-xs text-slate-500 font-medium">Téléchargez des photos directement depuis votre ordinateur ou collez une URL</p>
      </div>

      <button
        @click="openAddModal"
        class="px-6 py-3 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-extrabold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
      >
        <span>+ Ajouter un produit</span>
      </button>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom, marque, catégorie..."
        class="w-full sm:w-80 px-4 py-3 text-xs font-semibold bg-white border border-slate-200 rounded-full focus:outline-none focus:border-[#0F3D91]"
      />
      <span class="text-xs font-bold text-slate-500">
        {{ filteredProducts.length }} produit(s) dans le catalogue
      </span>
    </div>

    <!-- Products Table Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th class="py-4 px-6">Produit & Marque</th>
              <th class="py-4 px-6">Prix Vente / Origine</th>
              <th class="py-4 px-6">Catégorie</th>
              <th class="py-4 px-6">Caractéristiques</th>
              <th class="py-4 px-6">Stock</th>
              <th class="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <img :src="product.image || 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=500'" :alt="product.name" class="w-11 h-11 object-contain bg-slate-50 rounded-xl p-1 border border-slate-200 shrink-0" />
                  <div>
                    <span class="font-bold text-slate-950 block">{{ product.name }}</span>
                    <span class="text-[10px] text-slate-400 font-medium block">
                      Marque: <strong class="text-slate-600">{{ product.brand || 'EduShop' }}</strong> · REF: {{ product.id }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 font-extrabold text-[#0F3D91]">
                <div>{{ formatPrice(product.price) }}</div>
                <div v-if="product.originalPrice" class="text-[10px] text-slate-400 line-through font-normal">
                  {{ formatPrice(product.originalPrice) }}
                </div>
              </td>
              <td class="py-4 px-6 font-semibold text-slate-700">{{ product.category }}</td>
              <td class="py-4 px-6 text-[11px] text-slate-600 max-w-xs truncate">
                {{ formatFeaturesText(product.features) || product.description || 'Fourniture conforme' }}
              </td>
              <td class="py-4 px-6">
                <button
                  @click="toggleStock(product)"
                  class="px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer"
                  :class="product.inStock !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                >
                  {{ product.inStock !== false ? '✓ En Stock' : '✕ Rupture' }}
                </button>
              </td>
              <td class="py-4 px-6 text-right space-x-2">
                <button @click="openEditModal(product)" class="text-[#0F3D91] font-bold hover:underline cursor-pointer">
                  Modifier
                </button>
                <button @click="deleteProduct(product.id)" class="text-rose-600 font-bold hover:underline cursor-pointer">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal 1: CREATE Product avec Upload Fichier Ordinateur -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div class="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-5 my-8">
        <div class="border-b border-slate-100 pb-3">
          <h3 class="font-display text-xl font-extrabold text-slate-950">Ajouter un nouveau produit</h3>
          <p class="text-xs text-slate-400 font-medium">Uploadez une image depuis votre ordinateur ou renseignez une URL</p>
        </div>
        
        <form @submit.prevent="addNewProduct" class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Nom du produit *</label>
              <input v-model="productForm.name" type="text" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ex: Cahier 32 pages Séyès" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Prix Vente FCFA *</label>
              <input v-model.number="productForm.price" type="number" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="300" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Prix Origine FCFA</label>
              <input v-model.number="productForm.originalPrice" type="number" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="400" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Marque *</label>
              <input v-model="productForm.brand" type="text" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ex: EduShop, Clairefontaine, BIC" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Catégorie *</label>
              <select v-model="productForm.category" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Calculatrices">Calculatrices</option>
                <option value="Cahiers">Cahiers</option>
                <option value="Arts plastiques">Arts plastiques</option>
                <option value="Écriture & Traçage">Écriture & Traçage</option>
                <option value="Maroquinerie">Maroquinerie</option>
                <option value="Accessoires">Accessoires</option>
              </select>
            </div>

            <!-- Upload Photo depuis ordinateur + URL -->
            <div class="col-span-2 space-y-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Photo du produit (Fichier Ordinateur ou URL)</label>
              
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <label class="px-4 py-2.5 bg-[#0F3D91]/10 hover:bg-[#0F3D91]/20 text-[#0F3D91] font-bold rounded-xl cursor-pointer text-xs flex items-center justify-center gap-2 border border-[#0F3D91]/30 transition-all shrink-0">
                  <span>📁 Parcourir mon ordinateur...</span>
                  <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
                </label>

                <span class="text-slate-400 font-bold text-xs text-center">ou URL</span>

                <input v-model="productForm.image" type="text" class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" placeholder="https://..." />
              </div>

              <!-- Miniature Aperçu Image -->
              <div v-if="productForm.image" class="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <img :src="productForm.image" class="w-12 h-12 object-contain rounded-xl border border-slate-200 bg-white" />
                <span class="text-[10px] text-emerald-700 font-bold">✓ Photo chargée avec succès !</span>
              </div>
            </div>

            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Description Détaillée</label>
              <textarea v-model="productForm.description" rows="2" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Descriptif du produit..."></textarea>
            </div>

            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Caractéristiques (séparées par des virgules)</label>
              <input v-model="productForm.featuresInput" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ex: 32 pages, Grands carreaux, Reliure pique" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" @click="showAddModal = false" class="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-full">Annuler</button>
            <button type="submit" class="px-6 py-2.5 bg-[#0F3D91] text-white font-bold rounded-full">Publier Produit</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: UPDATE Product avec Upload Fichier Ordinateur -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div class="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-5 my-8">
        <div class="border-b border-slate-100 pb-3">
          <h3 class="font-display text-xl font-extrabold text-slate-950">Modifier Produit — Choisir Photo Ordinateur</h3>
        </div>
        
        <form @submit.prevent="saveEditProduct" class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Nom du produit</label>
              <input v-model="productForm.name" type="text" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Prix Vente FCFA</label>
              <input v-model.number="productForm.price" type="number" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Prix Origine FCFA</label>
              <input v-model.number="productForm.originalPrice" type="number" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Marque</label>
              <input v-model="productForm.brand" type="text" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Catégorie</label>
              <select v-model="productForm.category" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Calculatrices">Calculatrices</option>
                <option value="Cahiers">Cahiers</option>
                <option value="Arts plastiques">Arts plastiques</option>
                <option value="Écriture & Traçage">Écriture & Traçage</option>
                <option value="Maroquinerie">Maroquinerie</option>
                <option value="Accessoires">Accessoires</option>
              </select>
            </div>

            <!-- Upload Photo depuis ordinateur + URL -->
            <div class="col-span-2 space-y-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Photo du produit (Fichier Ordinateur ou URL)</label>
              
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <label class="px-4 py-2.5 bg-[#0F3D91]/10 hover:bg-[#0F3D91]/20 text-[#0F3D91] font-bold rounded-xl cursor-pointer text-xs flex items-center justify-center gap-2 border border-[#0F3D91]/30 transition-all shrink-0">
                  <span>📁 Choisir une photo sur mon ordinateur...</span>
                  <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
                </label>

                <span class="text-slate-400 font-bold text-xs text-center">ou URL</span>

                <input v-model="productForm.image" type="text" class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
              </div>

              <!-- Aperçu miniature image -->
              <div v-if="productForm.image" class="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <img :src="productForm.image" class="w-12 h-12 object-contain rounded-xl border border-slate-200 bg-white" />
                <span class="text-[10px] text-emerald-700 font-bold">✓ Photo sélectionnée !</span>
              </div>
            </div>

            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Description Détaillée</label>
              <textarea v-model="productForm.description" rows="2" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"></textarea>
            </div>

            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Caractéristiques (séparées par des virgules)</label>
              <input v-model="productForm.featuresInput" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" @click="showEditModal = false" class="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-full">Annuler</button>
            <button type="submit" class="px-6 py-2.5 bg-[#0F3D91] text-white font-bold rounded-full">Mettre à jour</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useProductsStore } from "~/stores/products";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const productsStore = useProductsStore();

const searchQuery = ref("");
const showAddModal = ref(false);
const showEditModal = ref(false);
const editingId = ref<string | null>(null);

const productForm = ref({
  name: "",
  price: 300,
  originalPrice: 400,
  brand: "EduShop",
  category: "Cahiers",
  image: "https://i.pinimg.com/736x/fd/f9/0b/fdf90bf685ccedf53d0297c5133f3678.jpg",
  description: "Petit cahier de 32 pages.",
  featuresInput: "32 pages, Grands carreaux Séyès",
});

const siteProducts = ref([
  { id: "cahier-32p", name: "Cahier 32 pages", brand: "EduShop", category: "Cahiers", price: 300, originalPrice: 400, inStock: true, description: "Petit cahier de 32 pages.", features: ["32 pages", "Grands carreaux Séyès"], image: "https://i.pinimg.com/736x/fd/f9/0b/fdf90bf685ccedf53d0297c5133f3678.jpg" },
  { id: "calculatrice-fx-92", name: "Calculatrice scientifique FX-92 Casio", brand: "Casio", category: "Calculatrices", price: 14500, originalPrice: 18000, inStock: true, description: "Calculatrice officielle collège/lycée conforme au programme.", features: ["Écran HD", "Fonctions trigonométriques", "Garantie 2 ans"], image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=500" },
  { id: "crayons-couleur-24", name: "Crayons de couleur — Lot de 24 Faber-Castell", brand: "Faber-Castell", category: "Arts plastiques", price: 4200, originalPrice: 5000, inStock: true, description: "Mines incassables haute pigmention pour le dessin artistique.", features: ["24 couleurs vibrantes", "Bois certifié FSC"], image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=500" },
  { id: "stylo-bille-bleu", name: "Stylo Bille Bleu (Lot de 4) BIC", brand: "BIC", category: "Écriture & Traçage", price: 500, originalPrice: 700, inStock: true, description: "Stylos bille classiques pointe moyenne 1.0mm.", features: ["Séchage rapide", "Encre bleue fluide"], image: "https://i.pinimg.com/736x/f3/c3/96/f3c396b6166cb46d61cafa6656cce35c.jpg" },
]);

onMounted(() => {
  if (productsStore.products.length === 0) {
    productsStore.initializeDemoData();
  }
});

const filteredProducts = computed(() => {
  const storeProds = productsStore.products.length > 0 ? productsStore.products : siteProducts.value;
  if (!searchQuery.value.trim()) return storeProds;
  const q = searchQuery.value.toLowerCase();
  return storeProds.filter((p: any) => p.name.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)) || (p.category && p.category.toLowerCase().includes(q)));
});

const formatPrice = (val: number) => {
  return new Intl.NumberFormat("fr-FR").format(val) + " F CFA";
};

const formatFeaturesText = (features: any) => {
  if (!features || !Array.isArray(features) || features.length === 0) return "";
  return features.map((f: any) => {
    if (typeof f === "string") return f;
    if (typeof f === "object" && f !== null) return f.label || f.name || f.value || JSON.stringify(f);
    return String(f);
  }).join(", ");
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        productForm.value.image = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};

const openAddModal = () => {
  editingId.value = null;
  productForm.value = {
    name: "",
    price: 500,
    originalPrice: 700,
    brand: "EduShop",
    category: "Cahiers",
    image: "",
    description: "",
    featuresInput: "",
  };
  showAddModal.value = true;
};

// CREATE
const addNewProduct = () => {
  if (!productForm.value.name) return;
  const featArray = productForm.value.featuresInput.split(",").map(s => s.trim()).filter(Boolean);
  const createdObj = {
    id: `prd-${Date.now()}`,
    name: productForm.value.name,
    price: productForm.value.price,
    originalPrice: productForm.value.originalPrice || undefined,
    brand: productForm.value.brand,
    category: productForm.value.category,
    image: productForm.value.image || "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=500",
    images: [productForm.value.image || "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=500"],
    description: productForm.value.description,
    features: featArray,
    inStock: true,
  };
  productsStore.products.unshift(createdObj as any);
  siteProducts.value.unshift(createdObj);

  if (process.client) {
    const existing = JSON.parse(localStorage.getItem("custom_products") || "[]");
    existing.unshift(createdObj);
    localStorage.setItem("custom_products", JSON.stringify(existing));
  }

  showAddModal.value = false;
  alert("Produit créé et publié en direct sur l'ensemble du site !");
};

// UPDATE
const openEditModal = (product: any) => {
  editingId.value = product.id;
  productForm.value = {
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice || product.price + 200,
    brand: product.brand || "EduShop",
    category: product.category || "Cahiers",
    image: product.image || "",
    description: product.description || "",
    featuresInput: formatFeaturesText(product.features),
  };
  showEditModal.value = true;
};

const saveEditProduct = () => {
  if (!editingId.value) return;
  const featArray = productForm.value.featuresInput.split(",").map(s => s.trim()).filter(Boolean);
  const updated = {
    id: editingId.value,
    name: productForm.value.name,
    price: productForm.value.price,
    originalPrice: productForm.value.originalPrice || undefined,
    brand: productForm.value.brand,
    category: productForm.value.category,
    image: productForm.value.image,
    images: [productForm.value.image],
    description: productForm.value.description,
    features: featArray,
    inStock: true,
  };

  const idx = siteProducts.value.findIndex(p => p.id === editingId.value);
  if (idx !== -1) {
    siteProducts.value[idx] = updated;
  }
  const storeIdx = productsStore.products.findIndex((p: any) => p.id === editingId.value);
  if (storeIdx !== -1) {
    productsStore.products[storeIdx] = updated as any;
  }

  if (process.client) {
    const existing = JSON.parse(localStorage.getItem("custom_products") || "[]");
    const foundIdx = existing.findIndex((p: any) => p.id === editingId.value);
    if (foundIdx !== -1) {
      existing[foundIdx] = updated;
    } else {
      existing.unshift(updated);
    }
    localStorage.setItem("custom_products", JSON.stringify(existing));
  }

  showEditModal.value = false;
  alert("Produit mis à jour et synchronisé avec le site !");
};

const toggleStock = (product: any) => {
  product.inStock = !product.inStock;
};

// DELETE
const deleteProduct = (id: string) => {
  if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
    productsStore.products = productsStore.products.filter((p: any) => p.id !== id);
    siteProducts.value = siteProducts.value.filter(p => p.id !== id);
    if (process.client) {
      const existing = JSON.parse(localStorage.getItem("custom_products") || "[]");
      const filtered = existing.filter((p: any) => p.id !== id);
      localStorage.setItem("custom_products", JSON.stringify(filtered));
    }
    alert("Produit supprimé.");
  }
};

useHead({
  title: "Upload Image Ordinateur - Back-Office EduShop",
});
</script>
