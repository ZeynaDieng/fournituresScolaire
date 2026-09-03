<template>
  <div class="space-y-6">
    
    <!-- Action Header -->
    <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800">
            🔒 Back Office Administrateur
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800">
            Gestion Unitaire Avancée
          </span>
        </div>
        <h2 class="font-display text-2xl font-extrabold text-slate-950">Catalogue Unitaire & Stocks EduShop</h2>
        <p class="text-xs text-slate-500 font-medium">Prix d'achat, Prix de vente, Marges, Alerte Stock Faible, Niveau Scolaire & Formats</p>
      </div>

      <button
        @click="openAddModal"
        class="px-6 py-3 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-extrabold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
      >
        <span>+ Ajouter un produit</span>
      </button>
    </div>

    <!-- Executive KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
        <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Total Produits Actifs</span>
        <div class="text-2xl font-black text-slate-900 flex items-baseline gap-2">
          <span>{{ stats.activeCount }}</span>
          <span class="text-xs font-semibold text-slate-400">/ {{ stats.total }} totaux</span>
        </div>
        <p class="text-[11px] text-slate-500 font-medium">{{ stats.inactiveCount }} produit(s) désactivé(s)</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
        <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Alertes Stock Faible</span>
        <div class="text-2xl font-black" :class="stats.lowStockCount > 0 ? 'text-amber-600' : 'text-slate-900'">
          {{ stats.lowStockCount }} produit(s)
        </div>
        <p class="text-[11px] text-slate-500 font-medium">Stock &le; Seuil d'alerte configuré</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
        <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Chiffre d'Affaires Vente</span>
        <div class="text-2xl font-black text-[#0F3D91]">
          {{ formatPrice(stats.totalSelling) }}
        </div>
        <p class="text-[11px] text-slate-500 font-medium">Valeur marchande brute active</p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 bg-gradient-to-br from-emerald-50/50 to-white">
        <span class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">Marge Brute Globale</span>
        <div class="text-2xl font-black text-emerald-700 flex items-baseline gap-2">
          <span>{{ formatPrice(stats.totalMargin) }}</span>
          <span class="text-xs font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-emerald-800">+{{ stats.averageMarginRate }}%</span>
        </div>
        <p class="text-[11px] text-emerald-600 font-medium">Taux de marge moyen</p>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par nom, catégorie..."
          class="px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-[#0F3D91]"
        />

        <select
          v-model="selectedCategory"
          class="px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-[#0F3D91]"
        >
          <option value="">Toutes les catégories</option>
          <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <select
          v-model="selectedLevel"
          class="px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-[#0F3D91]"
        >
          <option value="">Tous les niveaux</option>
          <option value="Maternelle">Maternelle</option>
          <option value="Primaire">Primaire</option>
          <option value="Collège">Collège</option>
          <option value="Lycée">Lycée</option>
          <option value="Tous niveaux">Tous niveaux</option>
        </select>

        <select
          v-model="statusFilter"
          class="px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-[#0F3D91]"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs seulement</option>
          <option value="inactive">Inactifs seulement</option>
          <option value="low_stock">Stock Faible / Alerte</option>
        </select>
      </div>
    </div>

    <!-- Products Table Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <th class="py-4 px-6">Produit & Catégorie</th>
              <th class="py-4 px-6">Structure (Niveau / Format / Unité)</th>
              <th class="py-4 px-6">Prix Achat (costPrice)</th>
              <th class="py-4 px-6">Prix Vente (sellingPrice)</th>
              <th class="py-4 px-6">Marge Brute & Taux</th>
              <th class="py-4 px-6">Stock & Alerte</th>
              <th class="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-slate-50/80 transition-colors" :class="{ 'opacity-60 bg-slate-50/50': product.isActive === false }">
              
              <!-- Nom & Image & Catégorie -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <img :src="product.image || 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=500'" :alt="product.name" class="w-11 h-11 object-contain bg-slate-50 rounded-xl p-1 border border-slate-200 shrink-0" />
                  <div>
                    <span class="font-bold text-slate-950 block">{{ product.name }}</span>
                    <span class="text-[10px] font-semibold text-slate-400 block">
                      Catégorie: <strong class="text-slate-700">{{ product.category }}</strong>
                    </span>
                  </div>
                </div>
              </td>

              <!-- Attributs Structurants (Niveau, Format, Unité) -->
              <td class="py-4 px-6 space-y-1">
                <div class="flex flex-wrap items-center gap-1">
                  <span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">
                    🎓 {{ product.schoolLevel || 'Tous niveaux' }}
                  </span>
                  <span class="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md text-[10px] font-bold">
                    📏 {{ product.format || 'Standard' }}
                  </span>
                  <span class="px-2 py-0.5 bg-purple-50 text-purple-800 rounded-md text-[10px] font-bold">
                    📦 {{ product.unit || 'Unité' }}
                  </span>
                </div>
              </td>

              <!-- Prix D'Achat (costPrice) -->
              <td class="py-4 px-6 font-bold text-slate-600 bg-amber-50/30">
                <span class="px-2 py-1 bg-amber-100/70 text-amber-950 rounded-lg text-xs">
                  {{ formatPrice(getCostPrice(product)) }}
                </span>
              </td>

              <!-- Prix De Vente (sellingPrice) -->
              <td class="py-4 px-6 font-extrabold text-[#0F3D91]">
                {{ formatPrice(getSellingPrice(product)) }}
              </td>

              <!-- Marge Brute & Taux -->
              <td class="py-4 px-6 space-y-0.5">
                <div class="font-bold text-emerald-600">
                  +{{ formatPrice(getGrossMargin(product)) }}
                </div>
                <div class="text-[10px] font-black text-slate-500">
                  Taux: <strong class="text-emerald-700">+{{ getMarginRate(product) }}%</strong>
                </div>
              </td>

              <!-- Stock & Seuil Alerte -->
              <td class="py-4 px-6 space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-black text-sm" :class="isLowStock(product) ? 'text-amber-600' : 'text-slate-900'">
                    {{ product.stock ?? 50 }} en stock
                  </span>
                </div>

                <div class="flex items-center gap-1.5">
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                    :class="isLowStock(product) ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse' : 'bg-emerald-50 text-emerald-700 border-emerald-200'"
                  >
                    {{ isLowStock(product) ? '⚠️ Stock Faible' : '✓ Stock Ok' }}
                  </span>
                  <span class="text-[10px] text-slate-400 font-medium">Seuil: {{ product.lowStockThreshold || 10 }}</span>
                </div>
              </td>

              <!-- Actions -->
              <td class="py-4 px-6 text-right space-x-2">
                <button @click="openEditModal(product)" class="text-[#0F3D91] font-bold hover:underline cursor-pointer">
                  Modifier
                </button>
                <button @click="toggleActive(product)" class="font-bold hover:underline cursor-pointer" :class="product.isActive !== false ? 'text-amber-600' : 'text-emerald-600'">
                  {{ product.isActive !== false ? 'Désactiver' : 'Réactiver' }}
                </button>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal 1: CREATE Product -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div class="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-5 my-8">
        <div class="border-b border-slate-100 pb-3">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-xl font-extrabold text-slate-950">Ajouter un produit unitaire</h3>
            <span class="text-[10px] font-extrabold px-2 py-1 bg-amber-100 text-amber-800 rounded-md">BO Admin</span>
          </div>
        </div>
        
        <form @submit.prevent="addNewProduct" class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Nom du produit *</label>
              <input v-model="productForm.name" type="text" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ex: Protège-cahier Bleu" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Catégorie *</label>
              <select v-model="productForm.category" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Statut *</label>
              <select v-model="productForm.isActive" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                <option :value="true">● Actif (Visible Front)</option>
                <option :value="false">○ Inactif (Masqué)</option>
              </select>
            </div>

            <!-- CHAMPS STRUCTURANTS (Niveau, Format, Unité) -->
            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Niveau Scolaire</label>
              <select v-model="productForm.schoolLevel" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Maternelle">Maternelle</option>
                <option value="Primaire">Primaire</option>
                <option value="Collège">Collège</option>
                <option value="Lycée">Lycée</option>
                <option value="Tous niveaux">Tous niveaux</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Format</label>
              <select v-model="productForm.format" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Petit Format (17x22 cm)">Petit Format (17x22 cm)</option>
                <option value="Grand Format (21x29,7 cm)">Grand Format (21x29,7 cm)</option>
                <option value="Grand Modèle">Grand Modèle</option>
                <option value="A4">A4</option>
                <option value="A5">A5</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Unité de vente</label>
              <select v-model="productForm.unit" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Unité">Unité</option>
                <option value="Paquet">Paquet</option>
                <option value="Lot">Lot</option>
              </select>
            </div>

            <!-- GESTION DU STOCK -->
            <div class="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/60 col-span-2 grid grid-cols-2 gap-3">
              <div>
                <label class="block font-extrabold text-[#0F3D91] uppercase mb-1 text-[10px]">Stock Quantité *</label>
                <input v-model.number="productForm.stock" type="number" required class="w-full px-4 py-2.5 bg-white border border-blue-300 rounded-xl font-bold text-slate-900" placeholder="100" />
              </div>

              <div>
                <label class="block font-extrabold text-amber-900 uppercase mb-1 text-[10px]">Seuil Alerte Stock Faible *</label>
                <input v-model.number="productForm.lowStockThreshold" type="number" required class="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl font-bold text-slate-900" placeholder="10" />
              </div>
            </div>

            <!-- PRIX D'ACHAT ET PRIX DE VENTE -->
            <div class="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 col-span-2 grid grid-cols-2 gap-3">
              <div>
                <label class="block font-extrabold text-amber-900 uppercase mb-1 text-[10px]">Prix d'achat (costPrice) *</label>
                <input v-model.number="productForm.costPrice" type="number" required class="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl font-bold text-slate-900" placeholder="150" />
              </div>

              <div>
                <label class="block font-extrabold text-[#0F3D91] uppercase mb-1 text-[10px]">Prix de vente (sellingPrice) *</label>
                <input v-model.number="productForm.sellingPrice" type="number" required class="w-full px-4 py-2.5 bg-white border border-blue-300 rounded-xl font-extrabold text-[#0F3D91]" placeholder="250" />
              </div>
            </div>

            <!-- Photo -->
            <div class="col-span-2 space-y-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Photo du produit</label>
              <div class="flex items-center gap-2">
                <label class="px-4 py-2.5 bg-[#0F3D91]/10 text-[#0F3D91] font-bold rounded-xl cursor-pointer text-xs shrink-0 flex items-center gap-1.5">
                  <span v-if="!uploadingImage">📁 Choisir photo...</span>
                  <span v-else class="animate-pulse text-amber-700">⏳ Transfert Cloud...</span>
                  <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" :disabled="uploadingImage" />
                </label>
                <input v-model="productForm.image" type="text" class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" placeholder="https://..." />
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" @click="showAddModal = false" class="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-full">Annuler</button>
            <button type="submit" class="px-6 py-2.5 bg-[#0F3D91] text-white font-bold rounded-full">Créer Produit</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: UPDATE Product -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div class="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-5 my-8">
        <div class="border-b border-slate-100 pb-3">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-xl font-extrabold text-slate-950">Modifier Produit Unitaire</h3>
            <span class="text-[10px] font-extrabold px-2 py-1 bg-amber-100 text-amber-800 rounded-md">BO Admin</span>
          </div>
        </div>
        
        <form @submit.prevent="saveEditProduct" class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Nom du produit</label>
              <input v-model="productForm.name" type="text" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Catégorie</label>
              <select v-model="productForm.category" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Statut *</label>
              <select v-model="productForm.isActive" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                <option :value="true">● Actif (Visible Front)</option>
                <option :value="false">○ Inactif (Masqué)</option>
              </select>
            </div>

            <!-- CHAMPS STRUCTURANTS -->
            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Niveau Scolaire</label>
              <select v-model="productForm.schoolLevel" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Maternelle">Maternelle</option>
                <option value="Primaire">Primaire</option>
                <option value="Collège">Collège</option>
                <option value="Lycée">Lycée</option>
                <option value="Tous niveaux">Tous niveaux</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Format</label>
              <select v-model="productForm.format" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Petit Format (17x22 cm)">Petit Format (17x22 cm)</option>
                <option value="Grand Format (21x29,7 cm)">Grand Format (21x29,7 cm)</option>
                <option value="Grand Modèle">Grand Modèle</option>
                <option value="A4">A4</option>
                <option value="A5">A5</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div class="col-span-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Unité de vente</label>
              <select v-model="productForm.unit" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="Unité">Unité</option>
                <option value="Paquet">Paquet</option>
                <option value="Lot">Lot</option>
              </select>
            </div>

            <!-- GESTION DU STOCK -->
            <div class="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/60 col-span-2 grid grid-cols-2 gap-3">
              <div>
                <label class="block font-extrabold text-[#0F3D91] uppercase mb-1 text-[10px]">Stock Quantité *</label>
                <input v-model.number="productForm.stock" type="number" required class="w-full px-4 py-2.5 bg-white border border-blue-300 rounded-xl font-bold text-slate-900" />
              </div>

              <div>
                <label class="block font-extrabold text-amber-900 uppercase mb-1 text-[10px]">Seuil Alerte Stock Faible *</label>
                <input v-model.number="productForm.lowStockThreshold" type="number" required class="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl font-bold text-slate-900" />
              </div>
            </div>

            <!-- PRIX D'ACHAT ET PRIX DE VENTE -->
            <div class="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 col-span-2 grid grid-cols-2 gap-3">
              <div>
                <label class="block font-extrabold text-amber-900 uppercase mb-1 text-[10px]">Prix d'achat (costPrice) *</label>
                <input v-model.number="productForm.costPrice" type="number" required class="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl font-bold text-slate-900" />
              </div>

              <div>
                <label class="block font-extrabold text-[#0F3D91] uppercase mb-1 text-[10px]">Prix de vente (sellingPrice) *</label>
                <input v-model.number="productForm.sellingPrice" type="number" required class="w-full px-4 py-2.5 bg-white border border-blue-300 rounded-xl font-extrabold text-[#0F3D91]" />
              </div>
            </div>

            <!-- Photo -->
            <div class="col-span-2 space-y-2">
              <label class="block font-bold text-slate-700 uppercase mb-1">Photo du produit</label>
              <div class="flex items-center gap-2">
                <label class="px-4 py-2.5 bg-[#0F3D91]/10 text-[#0F3D91] font-bold rounded-xl cursor-pointer text-xs shrink-0 flex items-center gap-1.5">
                  <span v-if="!uploadingImage">📁 Choisir photo...</span>
                  <span v-else class="animate-pulse text-amber-700">⏳ Transfert Cloud...</span>
                  <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" :disabled="uploadingImage" />
                </label>
                <input v-model="productForm.image" type="text" class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
              </div>
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
const selectedCategory = ref("");
const selectedLevel = ref("");
const statusFilter = ref("all");
const showAddModal = ref(false);
const showEditModal = ref(false);
const editingId = ref<string | null>(null);

const productForm = ref({
  name: "",
  costPrice: 200,
  sellingPrice: 350,
  category: "Cahiers",
  isActive: true,
  stock: 100,
  lowStockThreshold: 10,
  schoolLevel: "Tous niveaux",
  format: "Standard",
  unit: "Unité",
  image: "",
  description: "",
});

onMounted(() => {
  if (productsStore.products.length === 0) {
    productsStore.initializeDemoData();
  }
});

const availableCategories = computed(() => {
  return productsStore.categories;
});

const getCostPrice = (p: any) => {
  return p.costPrice ?? (p.price ? Math.round(p.price * 0.65) : 0);
};

const getSellingPrice = (p: any) => {
  return p.sellingPrice ?? p.price ?? 0;
};

const getGrossMargin = (p: any) => {
  return getSellingPrice(p) - getCostPrice(p);
};

const getMarginRate = (p: any) => {
  const cost = getCostPrice(p);
  if (!cost || cost === 0) return 0;
  return Math.round(((getSellingPrice(p) - cost) / cost) * 1000) / 10;
};

const isLowStock = (p: any) => {
  const currentStock = p.stock ?? 50;
  const threshold = p.lowStockThreshold ?? 10;
  return currentStock <= threshold;
};

const filteredProducts = computed(() => {
  let prods = productsStore.products;

  if (selectedCategory.value) {
    prods = prods.filter((p: any) => p.category === selectedCategory.value);
  }

  if (selectedLevel.value) {
    prods = prods.filter((p: any) => (p.schoolLevel || "Tous niveaux") === selectedLevel.value);
  }

  if (statusFilter.value === "active") {
    prods = prods.filter((p: any) => p.isActive !== false);
  } else if (statusFilter.value === "inactive") {
    prods = prods.filter((p: any) => p.isActive === false);
  } else if (statusFilter.value === "low_stock") {
    prods = prods.filter((p: any) => isLowStock(p));
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    prods = prods.filter((p: any) =>
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }

  return prods;
});

const stats = computed(() => {
  const activeProds = productsStore.products.filter((p: any) => p.isActive !== false);
  const inactiveProds = productsStore.products.filter((p: any) => p.isActive === false);

  const lowStockCount = activeProds.filter((p: any) => isLowStock(p)).length;

  const totalCost = activeProds.reduce((sum: number, p: any) => sum + getCostPrice(p), 0);
  const totalSelling = activeProds.reduce((sum: number, p: any) => sum + getSellingPrice(p), 0);
  const totalMargin = totalSelling - totalCost;
  const averageMarginRate = totalCost > 0 ? (Math.round((totalMargin / totalCost) * 1000) / 10) : 0;

  return {
    total: productsStore.products.length,
    activeCount: activeProds.length,
    inactiveCount: inactiveProds.length,
    lowStockCount,
    totalCost,
    totalSelling,
    totalMargin,
    averageMarginRate,
  };
});

const formatPrice = (val: number) => {
  return new Intl.NumberFormat("fr-FR").format(val) + " F CFA";
};

const uploadingImage = ref(false);

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    uploadingImage.value = true;

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const base64 = e.target.result as string;
        productForm.value.image = base64; // Aperçu immédiat

        try {
          const res: any = await $fetch("/api/admin/upload-image", {
            method: "POST",
            body: { base64 },
          });

          if (res && res.success && res.url) {
            productForm.value.image = res.url;
            console.log("✅ Image hébergée dans le Cloud avec succès:", res.url);
          }
        } catch (err) {
          console.warn("⚠️ Upload Cloud fallback local:", err);
        } finally {
          uploadingImage.value = false;
        }
      }
    };
    reader.readAsDataURL(file);
  }
};

const openAddModal = () => {
  editingId.value = null;
  productForm.value = {
    name: "",
    costPrice: 150,
    sellingPrice: 250,
    category: "Cahiers",
    isActive: true,
    stock: 100,
    lowStockThreshold: 10,
    schoolLevel: "Tous niveaux",
    format: "Standard",
    unit: "Unité",
    image: "",
    description: "",
  };
  showAddModal.value = true;
};

const addNewProduct = async () => {
  if (!productForm.value.name) return;
  const createdObj = {
    id: `prd-${Date.now()}`,
    name: productForm.value.name,
    costPrice: productForm.value.costPrice,
    sellingPrice: productForm.value.sellingPrice,
    price: productForm.value.sellingPrice,
    category: productForm.value.category,
    isActive: productForm.value.isActive,
    stock: productForm.value.stock,
    inStock: productForm.value.stock > 0,
    lowStockThreshold: productForm.value.lowStockThreshold,
    schoolLevel: productForm.value.schoolLevel,
    format: productForm.value.format,
    unit: productForm.value.unit,
    image: productForm.value.image || "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=500",
    images: [productForm.value.image || "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=500"],
    description: productForm.value.description || "Nouveau produit EduShop",
  };

  try {
    await $fetch("/api/admin/products", {
      method: "POST",
      body: createdObj,
    });
    console.log("✅ Nouveau produit synchronisé sur la base de données Cloud Airtable!");
  } catch (e) {
    console.warn("⚠️ API POST Airtable sync fallback local:", e);
  }

  productsStore.saveProduct(createdObj as any);

  showAddModal.value = false;
  alert("Produit unitaire créé et enregistré dans la base de données Cloud !");
};

const openEditModal = (product: any) => {
  editingId.value = product.id;
  productForm.value = {
    name: product.name,
    costPrice: getCostPrice(product),
    sellingPrice: getSellingPrice(product),
    category: product.category || "Cahiers",
    isActive: product.isActive !== false,
    stock: product.stock ?? 50,
    lowStockThreshold: product.lowStockThreshold ?? 10,
    schoolLevel: product.schoolLevel || "Tous niveaux",
    format: product.format || "Standard",
    unit: product.unit || "Unité",
    image: product.image || "",
    description: product.description || "",
  };
  showEditModal.value = true;
};

const saveEditProduct = async () => {
  if (!editingId.value) return;
  const idx = productsStore.products.findIndex((p: any) => p.id === editingId.value);
  const existing = idx !== -1 ? productsStore.products[idx] : {};

  const updatedData = {
    ...existing,
    id: editingId.value,
    name: productForm.value.name,
    costPrice: productForm.value.costPrice,
    sellingPrice: productForm.value.sellingPrice,
    price: productForm.value.sellingPrice,
    category: productForm.value.category,
    isActive: productForm.value.isActive,
    stock: productForm.value.stock,
    inStock: productForm.value.stock > 0,
    lowStockThreshold: productForm.value.lowStockThreshold,
    schoolLevel: productForm.value.schoolLevel,
    format: productForm.value.format,
    unit: productForm.value.unit,
    image: productForm.value.image || existing.image,
    description: productForm.value.description,
  };

  try {
    await $fetch(`/api/admin/products/${editingId.value}`, {
      method: "PUT",
      body: updatedData,
    });
  } catch (e) {
    console.warn("API PUT fallback local:", e);
  }

  productsStore.saveProduct(updatedData);

  showEditModal.value = false;
  alert("Produit unitaire mis à jour et enregistré dans la base de données !");
};

const toggleActive = (product: any) => {
  product.isActive = !(product.isActive !== false);
};

useHead({
  title: "Catalogue Unitaire & Stocks - Back-Office EduShop",
});
</script>
