<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 pt-20 pb-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Top Welcome Banner -->
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-[11px] font-extrabold uppercase tracking-widest text-[#0F3D91] block mb-1">
            ESPACE CLIENT EDUSHOP
          </span>
          <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-slate-950">
            Bonjour<span v-if="user.firstName">, {{ user.firstName }}</span>.
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <span class="px-4 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-full">
            {{ user.loyaltyRank || 'Membre Client' }}
          </span>
        </div>
      </div>

      <!-- Main Layout with Navigation Tabs -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Sidebar Navigation with SVG Icon Library -->
        <aside class="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm space-y-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            :class="activeTab === tab.id ? 'bg-[#0F3D91] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
          >
            <div class="flex items-center gap-3">
              <!-- SVG Icons -->
              <svg v-if="tab.id === 'profile'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>

              <svg v-else-if="tab.id === 'orders'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>

              <svg v-else-if="tab.id === 'addresses'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>

              <svg v-else-if="tab.id === 'invoices'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>

              <span>{{ tab.name }}</span>
            </div>

            <span v-if="tab.badge" class="px-2 py-0.5 rounded-full text-[10px] font-extrabold" :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'">
              {{ tab.badge }}
            </span>
          </button>

          <div class="pt-4 border-t border-slate-100">
            <button
              @click="logout"
              class="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        <!-- Right Main Content Area -->
        <main class="lg:col-span-9 space-y-6">

          <!-- TAB 1: PROFIL CLIENT REEL -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <!-- Stats overview -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
                <span class="text-xs text-slate-400 font-bold uppercase">Commandes passées</span>
                <span class="font-display text-3xl font-extrabold text-slate-950 block">{{ userOrders.length }}</span>
              </div>

              <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
                <span class="text-xs text-slate-400 font-bold uppercase">Total Dépensé</span>
                <span class="font-display text-2xl sm:text-3xl font-extrabold text-[#0F3D91] block">{{ formatPrice(totalSpent) }}</span>
              </div>

              <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
                <span class="text-xs text-slate-400 font-bold uppercase">Statut Compte</span>
                <span class="font-display text-xl font-extrabold text-emerald-600 block">Compte Vérifié</span>
              </div>
            </div>

            <!-- Profile Form -->
            <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h2 class="font-display text-xl font-extrabold text-slate-950">Informations personnelles</h2>

              <form @submit.prevent="saveProfile" class="space-y-4 text-xs">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Prénom *</label>
                    <input v-model="user.firstName" type="text" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold" placeholder="Votre prénom" />
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Nom *</label>
                    <input v-model="user.lastName" type="text" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold" placeholder="Votre nom" />
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Adresse Email</label>
                    <input v-model="user.email" type="email" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold" placeholder="votre.email@exemple.sn" />
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 uppercase mb-1">Téléphone (WhatsApp) *</label>
                    <input v-model="user.phone" type="tel" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold" placeholder="+221 77 000 00 00" />
                  </div>

                  <div class="sm:col-span-2">
                    <label class="block font-bold text-slate-700 uppercase mb-1">Adresse de livraison habituelle</label>
                    <input v-model="user.address" type="text" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold" placeholder="Quartier, Rue, Numéro de villa (Dakar)" />
                  </div>
                </div>

                <div class="pt-4 flex items-center gap-4">
                  <button type="submit" class="px-8 py-3.5 bg-[#0F3D91] hover:bg-[#0c3278] text-white font-extrabold text-xs rounded-full shadow-md transition-all cursor-pointer">
                    Enregistrer mes modifications
                  </button>

                  <span v-if="profileSaved" class="text-emerald-600 font-bold text-xs">
                    ✓ Profil mis à jour avec succès !
                  </span>
                </div>
              </form>
            </div>
          </div>

          <!-- TAB 2: MES COMMANDES REELLES -->
          <div v-else-if="activeTab === 'orders'" class="space-y-6">
            <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h2 class="font-display text-xl font-extrabold text-slate-950">Historique de mes commandes</h2>

              <div v-if="userOrders.length === 0" class="py-12 text-center space-y-3">
                <svg class="w-12 h-12 text-slate-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p class="text-slate-500 font-semibold text-xs">Vous n'avez pas encore passé de commande.</p>
                <NuxtLink to="/products" class="inline-block px-6 py-2.5 bg-[#0F3D91] text-white font-bold text-xs rounded-full">
                  Découvrir le catalogue
                </NuxtLink>
              </div>

              <div v-else class="space-y-4">
                <div v-for="ord in userOrders" :key="ord.ref" class="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="space-y-1 text-xs">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-950">Commande #{{ ord.ref }}</span>
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-[#0F3D91]">
                        {{ ord.status || 'Confirmée' }}
                      </span>
                    </div>
                    <p class="text-slate-500 font-medium">Date: {{ ord.date || 'Récemment' }}</p>
                    <p class="font-extrabold text-[#0F3D91] text-sm">{{ formatPrice(ord.total) }}</p>
                  </div>

                  <button
                    @click="downloadInvoice(ord.ref)"
                    class="px-5 py-2.5 bg-[#0F3D91] hover:bg-[#0c3278] text-white font-bold text-xs rounded-full transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Imprimer ma Facture PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: ADRESSES -->
          <div v-else-if="activeTab === 'addresses'" class="space-y-6">
            <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h2 class="font-display text-xl font-extrabold text-slate-950">Adresse de livraison</h2>
              <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs space-y-2">
                <p><strong>Destinataire :</strong> {{ user.firstName }} {{ user.lastName }}</p>
                <p><strong>Téléphone :</strong> {{ user.phone }}</p>
                <p><strong>Adresse :</strong> {{ user.address || 'Non renseignée' }}</p>
              </div>
            </div>
          </div>

          <!-- TAB 4: FACTURES -->
          <div v-else-if="activeTab === 'invoices'" class="space-y-6">
            <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h2 class="font-display text-xl font-extrabold text-slate-950">Mes factures certifiées</h2>
              <div v-for="ord in userOrders" :key="ord.ref" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span class="font-bold text-slate-950 block">Facture #FAC-{{ ord.ref }}</span>
                  <span class="text-slate-500">Total : {{ formatPrice(ord.total) }}</span>
                </div>
                <button @click="downloadInvoice(ord.ref)" class="px-4 py-2 bg-[#0F3D91] text-white font-bold text-xs rounded-full">
                  Télécharger PDF
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { printOfficialInvoice } from "~/utils/invoice-generator";

const router = useRouter();
const activeTab = ref("profile");
const profileSaved = ref(false);

const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  loyaltyRank: "Client Membre",
});

const userOrders = ref<any[]>([]);

const tabs = computed(() => [
  { id: "profile", name: "Profil" },
  { id: "orders", name: "Commandes", badge: userOrders.value.length },
  { id: "addresses", name: "Adresse" },
  { id: "invoices", name: "Factures", badge: userOrders.value.length },
]);

const totalSpent = computed(() => {
  return userOrders.value.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
});

const formatPrice = (val: number) => {
  return new Intl.NumberFormat("fr-FR").format(val) + " F CFA";
};

onMounted(() => {
  if (process.client) {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        user.value = {
          firstName: u.firstName || u.name?.split(" ")[0] || "",
          lastName: u.lastName || u.name?.split(" ").slice(1).join(" ") || "",
          email: u.email || "",
          phone: u.phone || "",
          address: u.address || "",
          loyaltyRank: "Client Membre",
        };
      } catch (e) {}
    }

    const savedUserOrders = localStorage.getItem("user_orders");
    if (savedUserOrders) {
      try {
        userOrders.value = JSON.parse(savedUserOrders);
      } catch (e) {}
    } else {
      const savedLastOrder = localStorage.getItem("last_order");
      if (savedLastOrder) {
        try {
          const lo = JSON.parse(savedLastOrder);
          userOrders.value = [{
            ref: lo.orderRef || "REF-805678",
            date: new Date().toLocaleDateString("fr-FR"),
            total: Number(lo.total || lo.amount || 0),
            status: "Confirmée",
            items: lo.items || [],
          }];
        } catch (e) {}
      }
    }
  }
});

const saveProfile = () => {
  if (process.client) {
    const updated = {
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      name: `${user.value.firstName} ${user.value.lastName}`.trim(),
      email: user.value.email,
      phone: user.value.phone,
      address: user.value.address,
    };
    localStorage.setItem("user", JSON.stringify(updated));
    profileSaved.value = true;
    setTimeout(() => (profileSaved.value = false), 3000);
  }
};

const downloadInvoice = (refCode: string) => {
  const foundOrder = userOrders.value.find((o) => o.ref === refCode) || userOrders.value[0];
  printOfficialInvoice({
    ref: refCode,
    customerName: `${user.value.firstName} ${user.value.lastName}`.trim() || "Client EduShop",
    phone: user.value.phone || "+221 77 000 00 00",
    email: user.value.email || "client@edushop.sn",
    city: "Dakar",
    address: user.value.address || "Dakar",
    total: foundOrder ? foundOrder.total : 14500,
    paymentMethod: "Wave / Orange Money",
    createdAt: foundOrder ? foundOrder.date : new Date().toLocaleDateString("fr-FR"),
    items: (foundOrder && foundOrder.items && foundOrder.items.length > 0) ? foundOrder.items : [
      { name: "Fournitures Scolaires Officielles", quantity: 1, price: foundOrder ? foundOrder.total : 14500 }
    ],
  });
};

function logout() {
  if (process.client) {
    localStorage.removeItem("user");
    router.push("/login");
  }
}

useHead({
  title: "Mon Espace Client - EduShop Sénégal",
});
</script>
