<!-- components/AppHeader.vue - Lovable Cloned Exact Mobile & Desktop Header -->
<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/80 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        
        <!-- Logo EduShop Officiel HD 3D -->
        <NuxtLink
          to="/"
          @click="scrollToTop"
          class="flex items-center hover:opacity-90 transition-opacity cursor-pointer shrink-0 py-1"
        >
          <img
            :src="logoImg"
            alt="EduShop — Tout pour réussir"
            class="h-10 sm:h-12 md:h-14 w-auto object-contain"
          />
        </NuxtLink>

        <!-- Navigation (Desktop) -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.path"
            class="text-slate-600 hover:text-[#0F3D91] transition-colors text-sm font-semibold"
            :class="{ 'text-[#0F3D91] font-extrabold': $route.path === item.path }"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- Desktop Right Header Actions -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Search Icon Button -->
          <button
            @click="searchStore.toggleSearch()"
            class="p-2.5 text-slate-600 hover:text-[#0F3D91] transition-colors rounded-full hover:bg-slate-100 cursor-pointer"
            aria-label="Rechercher"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Simple & Clean Account Link (Desktop) -->
          <NuxtLink
            :to="isUserLoggedIn ? '/dashboard' : '/login'"
            class="px-5 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-900 font-bold text-xs rounded-full transition-all flex items-center shadow-2xs"
          >
            <span>{{ isUserLoggedIn ? 'Mon Compte' : 'Compte' }}</span>
          </NuxtLink>

          <!-- Cart Button -->
          <button
            @click="cartStore.toggleCart()"
            class="inline-flex items-center gap-2 bg-[#0F3D91] hover:bg-[#0c3278] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <span>Panier</span>
            <span
              v-if="cartStore.itemCount > 0"
              class="bg-white/20 text-white text-[11px] rounded-full px-1.5 py-0.5 font-extrabold ml-1"
            >
              {{ cartStore.itemCount }}
            </span>
          </button>
        </div>

        <!-- Mobile Single Hamburger Menu Toggle (Screenshot exact match) -->
        <div class="flex items-center gap-2 md:hidden">
          <button
            @click="toggleMobileMenu"
            class="p-2 text-slate-900 hover:text-[#0F3D91] focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Navigation Drawer (Screenshot exact match) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="bg-white/98 backdrop-blur-xl border-b border-slate-200/80 px-6 pt-4 pb-8 md:hidden shadow-2xl space-y-6"
      >
        <!-- Nav Links List -->
        <nav class="flex flex-col space-y-4 pt-2">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.path"
            @click="isMobileMenuOpen = false"
            class="text-slate-800 hover:text-[#0F3D91] text-base font-semibold transition-colors"
            :class="{ 'text-[#0F3D91] font-extrabold': $route.path === item.path }"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- Bottom Action Pill Buttons (Compte | Panier) -->
        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <NuxtLink
            :to="isUserLoggedIn ? '/dashboard' : '/login'"
            @click="isMobileMenuOpen = false"
            class="py-3.5 px-4 text-center border-2 border-slate-200/90 text-slate-900 font-extrabold text-sm rounded-3xl bg-white shadow-xs active:scale-95 transition-all block"
          >
            {{ isUserLoggedIn ? 'Mon Compte' : 'Compte' }}
          </NuxtLink>

          <button
            @click="openCartFromMobile"
            class="py-3.5 px-4 text-center bg-[#0F3D91] text-white font-extrabold text-sm rounded-3xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Panier</span>
            <span v-if="cartStore.itemCount > 0" class="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
              {{ cartStore.itemCount }}
            </span>
          </button>
        </div>

      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "~/stores/cart";
import { useSearchStore } from "~/stores/search";
import { useRoute } from "vue-router";
import logoImg from "~/assets/images/edushop-official-logo-transparent.png";

const cartStore = useCartStore();
const searchStore = useSearchStore();
const route = useRoute();

const isMobileMenuOpen = ref(false);
const isUserLoggedIn = ref(false);
const userFirstName = ref("");

const navigation = [
  { name: "Assistant", path: "/configurator" },
  { name: "Packs", path: "/packs" },
  { name: "Produits", path: "/products" },
  { name: "Blog", path: "/blog" },
  { name: "À propos", path: "/about" },
];

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        isUserLoggedIn.value = true;
        userFirstName.value = u.firstName || u.name?.split(" ")[0] || "";
      } catch (e) {
        isUserLoggedIn.value = true;
      }
    }
  }
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const openCartFromMobile = () => {
  isMobileMenuOpen.value = false;
  cartStore.toggleCart();
};

const scrollToTop = () => {
  if (process.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
</script>
