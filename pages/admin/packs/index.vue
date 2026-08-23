<template>
  <div class="space-y-6">
    
    <!-- Action Header -->
    <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-display text-2xl font-extrabold text-slate-950">Catalogue Packs Scolaires & Upload Photo</h2>
        <p class="text-xs text-slate-500 font-medium">Uploadez la photo du pack depuis votre ordinateur ou collez un lien URL</p>
      </div>

      <button
        @click="openAddModal"
        class="px-6 py-3 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-extrabold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
      >
        <span>+ Ajouter un pack</span>
      </button>
    </div>

    <!-- Packs Table Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th class="py-4 px-6">Pack & Badge</th>
              <th class="py-4 px-6">Niveau Assistant</th>
              <th class="py-4 px-6">Prix Promo / Origine</th>
              <th class="py-4 px-6">Contenu du Colis (Fournitures)</th>
              <th class="py-4 px-6">Statut</th>
              <th class="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr v-for="pack in assistantPacks" :key="pack.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <img :src="pack.image || 'https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg'" :alt="pack.name" class="w-11 h-11 object-contain bg-slate-50 rounded-xl p-1 border border-slate-200 shrink-0" />
                  <div>
                    <span class="font-bold text-slate-950 block">{{ pack.name }}</span>
                    <span v-if="pack.badge" class="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full inline-block mt-0.5">
                      {{ pack.badge }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#0F3D91] border border-blue-200">
                  {{ pack.level }}
                </span>
              </td>
              <td class="py-4 px-6 font-extrabold text-[#0F3D91]">
                <div>{{ formatPrice(pack.price) }}</div>
                <div class="text-[10px] text-slate-400 line-through font-normal">
                  {{ formatPrice(pack.originalPrice || pack.price + 5000) }}
                </div>
              </td>
              <td class="py-4 px-6 text-[11px] text-slate-600 max-w-xs truncate">
                {{ formatContentsText(pack.contents) || pack.description || 'Colis complet' }}
              </td>
              <td class="py-4 px-6">
                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ✓ Actif
                </span>
              </td>
              <td class="py-4 px-6 text-right space-x-2">
                <button @click="openEditModal(pack)" class="text-[#0F3D91] font-bold hover:underline cursor-pointer">
                  Modifier
                </button>
                <button @click="deletePack(pack.id)" class="text-rose-600 font-bold hover:underline cursor-pointer">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal 1: CREATE Pack avec Upload Photo Ordinateur -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div class="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-5 my-8">
        <div class="border-b border-slate-100 pb-3">
          <h3 class="font-display text-xl font-extrabold text-slate-950">Créer un Pack Scolaire</h3>
          <p class="text-xs text-slate-400 font-medium">Uploadez une image depuis votre ordinateur ou renseignez une URL</p>
        </div>
        
        <form @submit.prevent="addNewPack" class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Nom du pack *</label>
              <input v-model="packForm.name" type="text" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ex: Pack Primaire Excellence 2026" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Niveau scolaire *</label>
              <select v-model="packForm.level" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Préscolaire (3-5 ans)">Préscolaire (3-5 ans)</option>
                <option value="Primaire (CP-CM2)">Primaire (CP-CM2)</option>
                <option value="Collège (6ème-3ème)">Collège (6ème-3ème)</option>
                <option value="Lycée (2nde-Terminale)">Lycée (2nde-Terminale)</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Badge spécial (Optionnel)</label>
              <input v-model="packForm.badge" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ex: Le + populaire" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Prix Promo FCFA *</label>
              <input v-model.number="packForm.price" type="number" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="21000" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Prix d'Origine (Barré FCFA)</label>
              <input v-model.number="packForm.originalPrice" type="number" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="26000" />
            </div>

            <!-- Upload Photo Pack depuis ordinateur + URL -->
            <div class="col-span-2 space-y-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Photo du pack (Fichier Ordinateur ou URL)</label>
              
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <label class="px-4 py-2.5 bg-[#0F3D91]/10 hover:bg-[#0F3D91]/20 text-[#0F3D91] font-bold rounded-xl cursor-pointer text-xs flex items-center justify-center gap-2 border border-[#0F3D91]/30 transition-all shrink-0">
                  <span>📁 Parcourir mon ordinateur...</span>
                  <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
                </label>

                <span class="text-slate-400 font-bold text-xs text-center">ou URL</span>

                <input v-model="packForm.image" type="text" class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" placeholder="https://..." />
              </div>

              <!-- Miniature Aperçu Photo Pack -->
              <div v-if="packForm.image" class="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <img :src="packForm.image" class="w-12 h-12 object-contain rounded-xl border border-slate-200 bg-white" />
                <span class="text-[10px] text-emerald-700 font-bold">✓ Photo du pack chargée avec succès !</span>
              </div>
            </div>

            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Liste des Fournitures Scolaires Incluses (séparées par des virgules) *</label>
              <textarea v-model="packForm.contentsInput" rows="3" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ex: 5 Cahiers 200p, 1 Trousse garnie BIC, 1 Boîte de crayons Faber-Castell, 1 Ensemble géométrie"></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" @click="showAddModal = false" class="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-full">Annuler</button>
            <button type="submit" class="px-6 py-2.5 bg-[#0F3D91] text-white font-bold rounded-full">Publier Pack</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: UPDATE Pack avec Upload Photo Ordinateur -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div class="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-5 my-8">
        <div class="border-b border-slate-100 pb-3">
          <h3 class="font-display text-xl font-extrabold text-slate-950">Modifier Pack — Choisir Photo Ordinateur</h3>
        </div>
        
        <form @submit.prevent="saveEditPack" class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Nom du pack</label>
              <input v-model="packForm.name" type="text" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Niveau scolaire</label>
              <select v-model="packForm.level" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Préscolaire (3-5 ans)">Préscolaire (3-5 ans)</option>
                <option value="Primaire (CP-CM2)">Primaire (CP-CM2)</option>
                <option value="Collège (6ème-3ème)">Collège (6ème-3ème)</option>
                <option value="Lycée (2nde-Terminale)">Lycée (2nde-Terminale)</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Badge</label>
              <input v-model="packForm.badge" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Prix Promo FCFA</label>
              <input v-model.number="packForm.price" type="number" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Prix Origine FCFA</label>
              <input v-model.number="packForm.originalPrice" type="number" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <!-- Upload Photo Pack depuis ordinateur + URL -->
            <div class="col-span-2 space-y-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Photo du pack (Fichier Ordinateur ou URL)</label>
              
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <label class="px-4 py-2.5 bg-[#0F3D91]/10 hover:bg-[#0F3D91]/20 text-[#0F3D91] font-bold rounded-xl cursor-pointer text-xs flex items-center justify-center gap-2 border border-[#0F3D91]/30 transition-all shrink-0">
                  <span>📁 Choisir une photo sur mon ordinateur...</span>
                  <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
                </label>

                <span class="text-slate-400 font-bold text-xs text-center">ou URL</span>

                <input v-model="packForm.image" type="text" class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
              </div>

              <!-- Miniature Aperçu Photo Pack -->
              <div v-if="packForm.image" class="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <img :src="packForm.image" class="w-12 h-12 object-contain rounded-xl border border-slate-200 bg-white" />
                <span class="text-[10px] text-emerald-700 font-bold">✓ Photo sélectionnée !</span>
              </div>
            </div>

            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Fournitures Scolaires Incluses (séparées par des virgules)</label>
              <textarea v-model="packForm.contentsInput" rows="3" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" @click="showEditModal = false" class="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-full">Annuler</button>
            <button type="submit" class="px-6 py-2.5 bg-[#0F3D91] text-white font-bold rounded-full">Enregistrer les modifications</button>
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
const showAddModal = ref(false);
const showEditModal = ref(false);
const editingId = ref<string | null>(null);

const packForm = ref({
  name: "",
  level: "Primaire (CP-CM2)",
  badge: "Le + populaire",
  price: 21000,
  originalPrice: 26000,
  image: "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
  contentsInput: "5 Cahiers 200p, 1 Trousse garnie BIC, 1 Ensemble géométrie",
});

const assistantDefaultPacks = ref([
  { id: "pack-prescolaire", name: "Pack Préscolaire (Maternelle)", level: "Préscolaire (3-5 ans)", badge: "Offre Maternelle", price: 16500, originalPrice: 19000, description: "Cahiers de dessin, ardoise Velleda, feutres, trousse garnie.", contents: ["2 Cahiers de dessin", "1 Ardoise Velleda + feutres", "1 Boîte de feutres Faber-Castell", "1 Trousse garnie"], image: "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg" },
  { id: "pack-primaire", name: "Pack Primaire Complet (Élémentaire)", level: "Primaire (CP-CM2)", badge: "Le + populaire", price: 21000, originalPrice: 25000, description: "Cahiers grand format, stylos, dictionnaire et sac.", contents: ["5 Cahiers 200p Séyès", "4 Stylos BIC", "1 Ensemble géométrie", "1 Gourde Isotherme"], image: "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg" },
  { id: "pack-college", name: "Pack Collège Complet (6ème à 3ème)", level: "Collège (6ème-3ème)", badge: "Spécial Collège", price: 28000, originalPrice: 34000, description: "Cahiers 200 pages, classeur, calculatrice scientifique.", contents: ["1 Calculatrice Casio FX-92", "6 Cahiers 200p", "1 Classeur A4 + intercalaires", "1 Trousse complète"], image: "https://i.pinimg.com/736x/10/54/a3/1054a36c0ce9460b0a1e2aafa65c9a20.jpg" },
  { id: "pack-lycee", name: "Pack Lycée (2nde à Terminale)", level: "Lycée (2nde-Terminale)", badge: "Recommandé BAC", price: 38500, originalPrice: 45000, description: "Calculatrice graphique, cahiers grands carreaux, trieur.", contents: ["1 Calculatrice Casio Graphique", "8 Cahiers 200p", "1 Trieur 12 positions", "1 Lot de surligneurs"], image: "https://i.pinimg.com/736x/4c/27/58/4c275881308b4ae3956c80856018a375.jpg" },
]);

onMounted(() => {
  if (productsStore.packs.length === 0) {
    productsStore.initializeDemoData();
  }
});

const assistantPacks = computed(() => {
  if (productsStore.packs && productsStore.packs.length > 0) {
    return productsStore.packs;
  }
  return assistantDefaultPacks.value;
});

const formatPrice = (val: number) => {
  return new Intl.NumberFormat("fr-FR").format(val) + " F CFA";
};

const formatContentsText = (contents: any) => {
  if (!contents || !Array.isArray(contents) || contents.length === 0) return "";
  return contents.map((c: any) => {
    if (typeof c === "string") return c;
    if (typeof c === "object" && c !== null) return c.name || c.label || c.title || JSON.stringify(c);
    return String(c);
  }).join(", ");
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        packForm.value.image = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};

const openAddModal = () => {
  editingId.value = null;
  packForm.value = {
    name: "",
    level: "Primaire (CP-CM2)",
    badge: "Offre Rentrée",
    price: 21000,
    originalPrice: 26000,
    image: "",
    contentsInput: "",
  };
  showAddModal.value = true;
};

// CREATE
const addNewPack = () => {
  if (!packForm.value.name) return;
  const list = packForm.value.contentsInput.split(",").map(s => s.trim()).filter(Boolean);
  const created = {
    id: `pack-${Date.now()}`,
    name: packForm.value.name,
    level: packForm.value.level,
    badge: packForm.value.badge,
    price: packForm.value.price,
    originalPrice: packForm.value.originalPrice || packForm.value.price + 5000,
    description: "Colis complet de fournitures scolaires avec sac et accessoires.",
    contents: list,
    inStock: true,
    image: packForm.value.image || "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
  };
  productsStore.packs.unshift(created as any);
  assistantDefaultPacks.value.unshift(created);
  showAddModal.value = false;
  alert("Pack scolaire structuré et publié avec succès !");
};

// UPDATE
const openEditModal = (pack: any) => {
  editingId.value = pack.id;
  packForm.value = {
    name: pack.name,
    level: pack.level,
    badge: pack.badge || "",
    price: pack.price,
    originalPrice: pack.originalPrice || pack.price + 5000,
    image: pack.image || "",
    contentsInput: formatContentsText(pack.contents),
  };
  showEditModal.value = true;
};

const saveEditPack = () => {
  if (!editingId.value) return;
  const list = packForm.value.contentsInput.split(",").map(s => s.trim()).filter(Boolean);
  const updated = {
    id: editingId.value,
    name: packForm.value.name,
    level: packForm.value.level,
    badge: packForm.value.badge,
    price: packForm.value.price,
    originalPrice: packForm.value.originalPrice,
    image: packForm.value.image,
    contents: list,
    description: "Colis complet de fournitures scolaires.",
    inStock: true,
  };

  const idx = assistantDefaultPacks.value.findIndex(p => p.id === editingId.value);
  if (idx !== -1) {
    assistantDefaultPacks.value[idx] = updated;
  }
  const storeIdx = productsStore.packs.findIndex((p: any) => p.id === editingId.value);
  if (storeIdx !== -1) {
    productsStore.packs[storeIdx] = updated as any;
  }
  showEditModal.value = false;
  alert("Pack scolaire mis à jour avec la photo locale !");
};

// DELETE
const deletePack = (id: string) => {
  if (confirm("Voulez-vous vraiment supprimer ce pack ?")) {
    productsStore.packs = productsStore.packs.filter((p: any) => p.id !== id);
    assistantDefaultPacks.value = assistantDefaultPacks.value.filter(p => p.id !== id);
    alert("Pack supprimé.");
  }
};

useHead({
  title: "Upload Photo Pack - Back-Office EduShop",
});
</script>
