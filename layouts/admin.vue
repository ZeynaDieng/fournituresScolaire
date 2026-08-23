<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900">
    <!-- Sidebar -->
    <AdminSidebar
      :sidebar-open="sidebarOpen"
      @toggle-sidebar="toggleSidebar"
      @close-sidebar="closeSidebar"
    />

    <!-- Overlay Mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
      @click="closeSidebar"
    />

    <!-- Main Content wrapper with sidebar margin -->
    <div class="lg:ml-64">
      <!-- Admin Top Header -->
      <header class="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center gap-4">
            <button
              @click="toggleSidebar"
              class="text-slate-600 hover:text-[#0F3D91] lg:hidden p-2 rounded-lg"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div>
              <h1 class="font-display text-xl font-extrabold text-slate-950">
                Administration EduShop
              </h1>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Sync Indicator -->
            <span class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              En ligne
            </span>

            <!-- Admin Profile Badge -->
            <div class="flex items-center gap-2">
              <div class="w-9 h-9 bg-[#0F3D91] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
                A
              </div>
              <div class="hidden sm:block text-left leading-tight">
                <span class="text-xs font-extrabold text-slate-900 block">Administrateur</span>
                <span class="text-[10px] text-slate-400 font-semibold block">admin@edushop.sn</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6 sm:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AdminSidebar from "../components/AdminSidebar.vue";

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};
</script>
