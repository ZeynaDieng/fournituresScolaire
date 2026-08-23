<template>
  <div class="space-y-6">
    
    <!-- Action Header -->
    <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-display text-2xl font-extrabold text-slate-950">Gestion des Codes Promo (CRUD Complet)</h2>
        <p class="text-xs text-slate-500 font-medium">Créez, modifiez, activez ou supprimez les réductions applicables au panier</p>
      </div>

      <button
        @click="showAddModal = true"
        class="px-6 py-3 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-extrabold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
      >
        <span>+ Créer un Code Promo</span>
      </button>
    </div>

    <!-- Promo Table Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th class="py-4 px-6">Code Promo</th>
              <th class="py-4 px-6">Type de réduction</th>
              <th class="py-4 px-6">Valeur</th>
              <th class="py-4 px-6">Statut</th>
              <th class="py-4 px-6 text-right">Actions CRUD</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr v-for="promo in promoList" :key="promo.code" class="hover:bg-slate-50/80 transition-colors">
              <td class="py-4 px-6">
                <span class="font-mono font-extrabold text-[#0F3D91] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 text-xs">
                  {{ promo.code }}
                </span>
              </td>
              <td class="py-4 px-6 font-semibold text-slate-700">{{ promo.type }}</td>
              <td class="py-4 px-6 font-extrabold text-emerald-700">{{ promo.discount }}</td>
              <td class="py-4 px-6">
                <button
                  @click="togglePromoStatus(promo)"
                  class="px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer transition-all"
                  :class="promo.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                >
                  {{ promo.active ? '✓ Actif' : '✕ Inactif' }}
                </button>
              </td>
              <td class="py-4 px-6 text-right space-x-2">
                <button @click="openEditModal(promo)" class="text-[#0F3D91] font-bold hover:underline cursor-pointer">
                  Modifier
                </button>
                <button @click="deletePromo(promo.code)" class="text-rose-600 font-bold hover:underline cursor-pointer">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal 1: CREATE Promo -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <h3 class="font-display text-xl font-extrabold text-slate-950">Nouveau Code Promo</h3>
        
        <form @submit.prevent="addNewPromo" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Code promo (Ex: RENTREE2026)</label>
            <input v-model="newPromo.code" type="text" required class="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Valeur / Réduction</label>
            <input v-model="newPromo.discount" type="text" required class="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ex: -15% ou -3 000 FCFA" />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" @click="showAddModal = false" class="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full">Annuler</button>
            <button type="submit" class="px-6 py-2.5 bg-[#0F3D91] text-white text-xs font-bold rounded-full">Créer Code</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: UPDATE Promo -->
    <div v-if="showEditModal && editPromoForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <h3 class="font-display text-xl font-extrabold text-slate-950">Modifier le code promo</h3>
        
        <form @submit.prevent="saveEditPromo" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Code</label>
            <input v-model="editPromoForm.code" type="text" readonly class="w-full px-4 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl uppercase font-mono font-bold" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Réduction</label>
            <input v-model="editPromoForm.discount" type="text" required class="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl" />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" @click="showEditModal = false" class="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full">Annuler</button>
            <button type="submit" class="px-6 py-2.5 bg-[#0F3D91] text-white text-xs font-bold rounded-full">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const showAddModal = ref(false);
const showEditModal = ref(false);
const editPromoForm = ref<any>(null);

const newPromo = ref({
  code: "",
  type: "Pourcentage",
  discount: "-10%",
  active: true,
});

const promoList = ref([
  { code: "RENTREE2026", type: "Pourcentage", discount: "-15% sur la commande", active: true },
  { code: "FREESHIP", type: "Livraison Offerte", discount: "Frais de port gratuits à Dakar", active: true },
  { code: "PACKBONUS", type: "Montant Fixe", discount: "-5 000 F CFA sur les Packs", active: true },
  { code: "BIENVENUE", type: "Pourcentage", discount: "-10% Premier Achat", active: false },
]);

// CREATE
const addNewPromo = () => {
  if (!newPromo.value.code) return;
  promoList.value.unshift({
    code: newPromo.value.code.toUpperCase(),
    type: newPromo.value.type,
    discount: newPromo.value.discount,
    active: true,
  });
  showAddModal.value = false;
  alert(`Code promo ${newPromo.value.code.toUpperCase()} activé !`);
};

// UPDATE
const openEditModal = (promo: any) => {
  editPromoForm.value = { ...promo };
  showEditModal.value = true;
};

const saveEditPromo = () => {
  if (!editPromoForm.value) return;
  const idx = promoList.value.findIndex(p => p.code === editPromoForm.value.code);
  if (idx !== -1) {
    promoList.value[idx] = { ...editPromoForm.value };
  }
  showEditModal.value = false;
  alert("Code promo mis à jour.");
};

const togglePromoStatus = (promo: any) => {
  promo.active = !promo.active;
};

// DELETE
const deletePromo = (code: string) => {
  if (confirm(`Supprimer définitivement le code promo ${code} ?`)) {
    promoList.value = promoList.value.filter(p => p.code !== code);
    alert("Code promo supprimé.");
  }
};

useHead({
  title: "Gestion des Promotions (CRUD) - Back-Office EduShop",
});
</script>
