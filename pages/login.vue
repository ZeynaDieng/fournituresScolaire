<template>
  <div class="min-h-screen bg-[#FBFBFA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md">
      
      <!-- Header with EduShop Official Logo -->
      <div class="text-center space-y-3">
        <NuxtLink to="/" class="inline-block">
          <img
            src="~/assets/images/edushop-official-logo-transparent.png"
            alt="EduShop Logo"
            class="h-12 w-auto mx-auto object-contain"
          />
        </NuxtLink>
        <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Connexion à votre compte
        </h2>
        <p class="text-xs text-slate-500 font-medium">
          Accédez à vos commandes, favoris et offres exclusives
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Adresse Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="exemple@email.com"
            class="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D91] focus:ring-1 focus:ring-[#0F3D91] transition-all"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Mot de passe
            </label>
            <a href="#" class="text-xs font-bold text-[#0F3D91] hover:underline">
              Oublié ?
            </a>
          </div>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D91] focus:ring-1 focus:ring-[#0F3D91] transition-all"
          />
        </div>

        <div class="flex items-center justify-between text-xs">
          <label class="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="w-4 h-4 text-[#0F3D91] rounded border-slate-300 focus:ring-[#0F3D91]"
            />
            <span>Se souvenir de moi</span>
          </label>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-4 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <div v-if="isLoading" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          <span>{{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}</span>
        </button>
      </form>

      <!-- Switch to Register -->
      <div class="text-center pt-4 border-t border-slate-100 text-xs font-medium text-slate-600">
        Pas encore de compte ?
        <NuxtLink to="/register" class="font-extrabold text-[#0F3D91] hover:underline ml-1">
          Créer un compte gratuitement
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const rememberMe = ref(true);
const isLoading = ref(false);

const handleLogin = () => {
  if (!email.value || !password.value) return;
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;

    // Set user session in localStorage
    if (process.client) {
      const userObj = {
        firstName: email.value.split("@")[0] || "Client",
        lastName: "EduShop",
        email: email.value,
        isLoggedIn: true,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
    }

    router.push("/dashboard");
  }, 600);
};

useSeoMeta({
  title: "Connexion - EduShop Sénégal",
  description: "Connectez-vous à votre espace client EduShop.",
});
</script>
