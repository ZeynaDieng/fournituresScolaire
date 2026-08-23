<template>
  <div class="min-h-screen bg-[#0F3D91] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl">
      <div class="text-center space-y-3">
        <!-- Logo -->
        <NuxtLink to="/" class="inline-block">
          <img
            src="~/assets/images/edushop-official-logo-transparent.png"
            alt="EduShop Logo"
            class="h-14 w-auto mx-auto object-contain"
          />
        </NuxtLink>
        <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Portail Administration
        </h2>
        <p class="text-xs text-slate-500 font-medium">
          Accès sécurisé réservé aux administrateurs EduShop
        </p>
      </div>

      <form @submit.prevent="login" class="space-y-5">
        <div>
          <label for="username" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Identifiant / Email
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D91] focus:ring-1 focus:ring-[#0F3D91] transition-all"
            placeholder="admin@edushop.sn"
          />
        </div>

        <div>
          <label for="password" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Mot de passe
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D91] focus:ring-1 focus:ring-[#0F3D91] transition-all"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs font-bold text-rose-700 flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <div v-if="loading" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          <span>{{ loading ? 'Connexion...' : 'Accéder au Back-Office' }}</span>
        </button>
      </form>

      <div class="text-center pt-2 text-xs font-medium text-slate-400">
        EduShop Sénégal · Système Administrateur v2.0
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("admin@edushop.sn");
const password = ref("admin123");
const error = ref("");
const loading = ref(false);

const login = () => {
  if (!username.value || !password.value) return;
  loading.value = true;
  error.value = "";

  setTimeout(() => {
    loading.value = false;

    if (process.client) {
      localStorage.setItem("admin_token", "edushop_admin_valid_token_2026");
      localStorage.setItem("admin_authenticated", "true");
      localStorage.setItem("admin_user", JSON.stringify({ name: "Administrateur EduShop", role: "SuperAdmin" }));
      document.cookie = "admin_token=edushop_admin_valid_token_2026; path=/; max-age=86400";
    }

    router.push("/admin/dashboard");
  }, 500);
};

definePageMeta({
  layout: false,
});

useHead({
  title: "Connexion Administration - EduShop",
});
</script>
