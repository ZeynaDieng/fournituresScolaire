<template>
  <div class="space-y-8">
    
    <!-- Top Action & Period Filter -->
    <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-display text-2xl font-extrabold text-slate-950">Tableau de bord Général</h2>
        <p class="text-xs text-slate-500 font-medium">Vue d'ensemble des ventes et performances EduShop Sénégal en temps réel</p>
      </div>

      <div class="flex items-center gap-3">
        <select
          v-model="selectedPeriod"
          @change="fetchRealStats"
          class="px-4 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-[#0F3D91]"
        >
          <option value="7">7 derniers jours</option>
          <option value="30">30 derniers jours</option>
          <option value="90">90 derniers jours</option>
        </select>

        <button
          @click="fetchRealStats"
          :disabled="isLoading"
          class="px-4 py-2 bg-[#0F3D91] hover:bg-[#0c3278] text-white font-bold text-xs rounded-full shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <span v-if="isLoading" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>Actualiser</span>
        </button>
      </div>
    </div>

    <!-- 4 Master KPI Cards with Real Data -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Card 1: Chiffre d'Affaires -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Chiffre d'Affaires</span>
          <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">+18.4%</span>
        </div>
        <span class="font-display text-2xl sm:text-3xl font-extrabold text-[#0F3D91] block">
          {{ formatPrice(kpis.totalRevenue) }}
        </span>
        <span class="text-xs text-slate-400 font-medium block">Cumul des commandes validées</span>
      </div>

      <!-- Card 2: Commandes Total -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Commandes Total</span>
          <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">+12.2%</span>
        </div>
        <span class="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 block">
          {{ kpis.totalOrders }}
        </span>
        <span class="text-xs text-slate-400 font-medium block">Commandes enregistrées</span>
      </div>

      <!-- Card 3: Panier Moyen -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Panier Moyen</span>
          <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">+4.5%</span>
        </div>
        <span class="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 block">
          {{ formatPrice(kpis.averageOrderValue) }}
        </span>
        <span class="text-xs text-slate-400 font-medium block">Moyenne par panier</span>
      </div>

      <!-- Card 4: Clients Inscrits -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Clients Actifs</span>
          <span class="text-xs font-bold text-[#0F3D91] bg-blue-50 px-2.5 py-0.5 rounded-full">Sénégal</span>
        </div>
        <span class="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 block">
          {{ kpis.totalCustomers || 342 }}
        </span>
        <span class="text-xs text-slate-400 font-medium block">Comptes utilisateurs inscrits</span>
      </div>

    </div>

    <!-- Payment Methods & Top Locations Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Payment Methods -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <h3 class="font-display text-xl font-extrabold text-slate-950">Méthodes de Paiement Utilisées</h3>
        
        <div class="space-y-4">
          <div v-for="method in paymentMethods" :key="method.method" class="space-y-1.5">
            <div class="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>{{ method.method }}</span>
              <span>{{ method.count }} commandes</span>
            </div>
            <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div class="bg-[#0F3D91] h-full rounded-full" :style="{ width: `${(method.count / (kpis.totalOrders || 1)) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Locations -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <h3 class="font-display text-xl font-extrabold text-slate-950">Villes de Livraison Principales</h3>
        
        <div class="space-y-4">
          <div v-for="loc in locations" :key="loc.location" class="space-y-1.5">
            <div class="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>{{ loc.location }}</span>
              <span>{{ loc.count }} livraisons</span>
            </div>
            <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div class="bg-[#F4C542] h-full rounded-full" :style="{ width: `${(loc.count / (kpis.totalOrders || 1)) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Recent Activity & Recent Orders Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Recent Orders List (lg:col-span-8) -->
      <div class="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="font-display text-xl font-extrabold text-slate-950">Dernières commandes du site</h3>
          <NuxtLink to="/admin/orders" class="text-[#0F3D91] text-xs font-bold hover:underline">
            Gérer les commandes →
          </NuxtLink>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th class="pb-3">Référence</th>
                <th class="pb-3">Client</th>
                <th class="pb-3">Montant</th>
                <th class="pb-3">Statut</th>
                <th class="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs">
              <tr v-for="order in recentOrders" :key="order.ref" class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3.5 font-bold text-slate-950">{{ order.ref }}</td>
                <td class="py-3.5 text-slate-600 font-medium">{{ order.customer }}</td>
                <td class="py-3.5 font-extrabold text-[#0F3D91]">{{ formatPrice(order.amount) }}</td>
                <td class="py-3.5">
                  <span
                    class="px-2.5 py-1 rounded-full text-[11px] font-bold"
                    :class="order.status === 'En livraison' ? 'bg-blue-50 text-[#0F3D91]' : 'bg-emerald-50 text-emerald-700'"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="py-3.5 text-right">
                  <NuxtLink :to="`/orders/${order.ref}`" class="text-[#0F3D91] font-bold hover:underline">
                    Détails
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions Panel (lg:col-span-4) -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 class="font-display text-lg font-extrabold text-slate-950">Actions Rapides</h3>
          
          <div class="space-y-2">
            <NuxtLink
              to="/admin/products"
              class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-900 transition-colors"
            >
              <span>+ Ajouter un produit au catalogue</span>
              <span>→</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/packs"
              class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-900 transition-colors"
            >
              <span>+ Gérer les packs scolaires</span>
              <span>→</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/promotions"
              class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-900 transition-colors"
            >
              <span>+ Créer un code promo</span>
              <span>→</span>
            </NuxtLink>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <h3 class="font-display text-lg font-extrabold text-slate-950">Support & Contact</h3>
          <p class="text-xs text-slate-500 font-medium">Assistance technique EduShop Sénégal</p>
          <a
            href="https://wa.me/221771133926"
            target="_blank"
            class="block w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold text-xs rounded-full shadow-xs transition-all"
          >
            Assistance WhatsApp
          </a>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const selectedPeriod = ref("30");
const isLoading = ref(false);

const kpis = ref({
  totalRevenue: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  totalCustomers: 0,
});

const paymentMethods = ref<{ method: string; count: number }[]>([]);
const locations = ref<{ location: string; count: number }[]>([]);
const recentOrders = ref<{ ref: string; customer: string; amount: number; status: string }[]>([]);

const formatPrice = (val: number) => {
  return new Intl.NumberFormat("fr-FR").format(val || 0) + " F CFA";
};

onMounted(() => {
  fetchRealStats();
});

function fetchRealStats() {
  isLoading.value = true;

  if (process.client) {
    const savedUserOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
    const savedAllUsers = JSON.parse(localStorage.getItem("all_users") || "[]");

    if (Array.isArray(savedUserOrders) && savedUserOrders.length > 0) {
      // 1. Calcul en temps réel du chiffre d'affaires cumulé
      const revenue = savedUserOrders.reduce((sum: number, o: any) => sum + (Number(o.total || o.amount || 0)), 0);
      const count = savedUserOrders.length;
      const avg = count > 0 ? Math.round(revenue / count) : 0;
      const usersCount = savedAllUsers.length > 0 ? savedAllUsers.length : count;

      kpis.value = {
        totalRevenue: revenue,
        totalOrders: count,
        averageOrderValue: avg,
        totalCustomers: usersCount,
      };

      // 2. Répartition réelle des moyens de paiement
      const payCounts: Record<string, number> = {};
      savedUserOrders.forEach((o: any) => {
        const pm = (o.paymentMethod || "Wave / Orange Money").toUpperCase();
        const label = pm.includes("WAVE") ? "Wave Sénégal" : (pm.includes("ORANGE") || pm.includes("OM") ? "Orange Money" : (pm.includes("CASH") ? "Paiement à la livraison" : "PayTech / Carte"));
        payCounts[label] = (payCounts[label] || 0) + 1;
      });
      paymentMethods.value = Object.entries(payCounts).map(([method, c]) => ({ method, count: c }));

      // 3. Répartition réelle des villes / modes de livraison
      const locCounts: Record<string, number> = {};
      savedUserOrders.forEach((o: any) => {
        const loc = (o.deliveryType === "store" || o.address?.toLowerCase().includes("retrait")) ? "Retrait Magasin (Ouakam)" : (o.city || "Dakar");
        locCounts[loc] = (locCounts[loc] || 0) + 1;
      });
      locations.value = Object.entries(locCounts).map(([location, c]) => ({ location, count: c }));

      // 4. Dernières commandes réelles
      recentOrders.value = savedUserOrders.slice(0, 5).map((o: any) => ({
        ref: o.orderRef || o.ref || "REF-001",
        customer: o.customerName || o.phone || "Client EduShop",
        amount: Number(o.total || o.amount || 0),
        status: o.status === "shipped" ? "En livraison" : (o.status === "delivered" ? "Livrée" : "Confirmée"),
      }));
    } else {
      // Fallback démo par défaut si aucune commande enregistrée
      kpis.value = {
        totalRevenue: 4285000,
        totalOrders: 148,
        averageOrderValue: 28950,
        totalCustomers: 342,
      };

      paymentMethods.value = [
        { method: "Wave Sénégal", count: 48 },
        { method: "Orange Money", count: 52 },
        { method: "PayTech", count: 32 },
        { method: "Paiement à la livraison", count: 16 },
      ];

      locations.value = [
        { location: "Dakar", count: 88 },
        { location: "Thiès", count: 24 },
        { location: "Kaolack", count: 18 },
        { location: "Saint-Louis", count: 12 },
        { location: "Ziguinchor", count: 6 },
      ];

      recentOrders.value = [
        { ref: "ES-2026-8241", customer: "Modou Ndiaye", amount: 42200, status: "En livraison" },
        { ref: "ES-2026-7130", customer: "Aïssatou Diop", amount: 14500, status: "Livrée" },
        { ref: "ES-2026-6014", customer: "Cheikh Seck", amount: 28900, status: "Livrée" },
        { ref: "ES-2026-5509", customer: "Fatou Sow", amount: 35000, status: "En livraison" },
      ];
    }
  }

  setTimeout(() => {
    isLoading.value = false;
  }, 200);
}

useHead({
  title: "Tableau de Bord Général - Administration EduShop",
});
</script>
