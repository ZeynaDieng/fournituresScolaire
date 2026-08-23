<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:block border-r border-slate-200/80 flex flex-col justify-between h-full"
    :class="{
      '-translate-x-full': !sidebarOpen,
      'translate-x-0': sidebarOpen,
      hidden: !sidebarOpen,
      'lg:flex': true,
    }"
  >
    <div>
      <!-- Header sidebar with EduShop Brand -->
      <div class="flex items-center justify-between h-20 px-6 bg-[#0F3D91] border-b border-blue-900">
        <NuxtLink to="/admin/dashboard" class="flex items-center gap-2.5">
          <img
            src="~/assets/images/edushop-official-logo-transparent.png"
            alt="EduShop Logo"
            class="h-10 w-auto object-contain"
          />
          <span class="text-[9px] font-extrabold uppercase tracking-widest text-[#F4C542] bg-white/10 px-2 py-1 rounded-full border border-white/15 shrink-0">
            BACK-OFFICE
          </span>
        </NuxtLink>
        <button @click="toggleSidebar" class="text-white lg:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="mt-6 px-3 space-y-1">
        <!-- Dashboard -->
        <NuxtLink
          to="/admin/dashboard"
          class="flex items-center px-4 py-3 text-xs font-bold rounded-xl transition-all"
          :class="
            $route.path === '/admin/dashboard' || $route.path === '/admin'
              ? 'bg-blue-50 text-[#0F3D91] shadow-xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          "
          @click="closeSidebarOnMobile"
        >
          <svg class="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
          <span>Tableau de bord</span>
        </NuxtLink>

        <div class="pt-4 pb-2 px-3">
          <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">GESTION BOUTIQUE</span>
        </div>

        <!-- Produits -->
        <NuxtLink
          to="/admin/products"
          class="flex items-center px-4 py-3 text-xs font-bold rounded-xl transition-all"
          :class="
            $route.path.includes('/admin/products')
              ? 'bg-blue-50 text-[#0F3D91] shadow-xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          "
          @click="closeSidebarOnMobile"
        >
          <svg class="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
          </svg>
          <span>Produits</span>
        </NuxtLink>

        <!-- Packs -->
        <NuxtLink
          to="/admin/packs"
          class="flex items-center px-4 py-3 text-xs font-bold rounded-xl transition-all"
          :class="
            $route.path.includes('/admin/packs')
              ? 'bg-blue-50 text-[#0F3D91] shadow-xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          "
          @click="closeSidebarOnMobile"
        >
          <svg class="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          <span>Packs Scolaires</span>
        </NuxtLink>

        <!-- Promotions -->
        <NuxtLink
          to="/admin/promotions"
          class="flex items-center px-4 py-3 text-xs font-bold rounded-xl transition-all"
          :class="
            $route.path.includes('/admin/promotions')
              ? 'bg-blue-50 text-[#0F3D91] shadow-xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          "
          @click="closeSidebarOnMobile"
        >
          <svg class="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
          <span>Promotions</span>
        </NuxtLink>

        <!-- Commandes -->
        <NuxtLink
          to="/admin/orders"
          class="flex items-center px-4 py-3 text-xs font-bold rounded-xl transition-all"
          :class="
            $route.path.includes('/admin/orders') || $route.path.includes('/admin/commandes')
              ? 'bg-blue-50 text-[#0F3D91] shadow-xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          "
          @click="closeSidebarOnMobile"
        >
          <svg class="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <span>Commandes</span>
        </NuxtLink>

        <!-- Utilisateurs / Clients -->
        <NuxtLink
          to="/admin/users"
          class="flex items-center px-4 py-3 text-xs font-bold rounded-xl transition-all"
          :class="
            $route.path.includes('/admin/users')
              ? 'bg-blue-50 text-[#0F3D91] shadow-xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          "
          @click="closeSidebarOnMobile"
        >
          <svg class="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <span>Clients</span>
        </NuxtLink>
      </nav>
    </div>

    <!-- Dynamic Quick Stats Footer Box -->
    <div class="p-3 m-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
      <span class="text-[10px] font-extrabold uppercase text-slate-400 block">CHIFFRE D'AFFAIRES CUMULÉ</span>
      <span class="font-display text-base font-extrabold text-[#0F3D91] block">
        {{ formatPrice(liveRevenue) }}
      </span>
      <span class="text-[10px] text-emerald-700 font-bold flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
        <span>Base de données live</span>
      </span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps({
  sidebarOpen: Boolean,
});

const emit = defineEmits(["toggle-sidebar", "close-sidebar"]);

const toggleSidebar = () => emit("toggle-sidebar");
const closeSidebarOnMobile = () => emit("close-sidebar");

const liveRevenue = ref(4285000);

const formatPrice = (val: number) => {
  return new Intl.NumberFormat("fr-FR").format(val || 0) + " F CFA";
};

onMounted(() => {
  if (process.client) {
    const savedUserOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
    if (Array.isArray(savedUserOrders) && savedUserOrders.length > 0) {
      liveRevenue.value = savedUserOrders.reduce((sum: number, o: any) => sum + (Number(o.total || o.amount || 0)), 0);
    }
  }
});
</script>
