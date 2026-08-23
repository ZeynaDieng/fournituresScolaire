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
          Créer votre compte
        </h2>
        <p class="text-xs text-slate-500 font-medium">
          Inscrivez-vous en 1 minute pour commander facilement
        </p>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Prénom
            </label>
            <input
              v-model="firstName"
              type="text"
              required
              placeholder="Mamadou"
              class="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D91] focus:ring-1 focus:ring-[#0F3D91] transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nom
            </label>
            <input
              v-model="lastName"
              type="text"
              required
              placeholder="Sow"
              class="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D91] focus:ring-1 focus:ring-[#0F3D91] transition-all"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Adresse Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="mamadou.sow@gmail.com"
            class="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D91] focus:ring-1 focus:ring-[#0F3D91] transition-all"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Téléphone (Sénégal)
          </label>
          <input
            v-model="phone"
            type="tel"
            required
            placeholder="+221 77 000 00 00"
            class="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D91] focus:ring-1 focus:ring-[#0F3D91] transition-all"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Mot de passe
          </label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F3D91] focus:ring-1 focus:ring-[#0F3D91] transition-all"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-4 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
        >
          <div v-if="isLoading" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          <span>{{ isLoading ? 'Inscription...' : 'Créer mon compte' }}</span>
        </button>
      </form>

      <!-- Switch to Login -->
      <div class="text-center pt-4 border-t border-slate-100 text-xs font-medium text-slate-600">
        Vous avez déjà un compte ?
        <NuxtLink to="/login" class="font-extrabold text-[#0F3D91] hover:underline ml-1">
          Se connecter
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const phone = ref("");
const password = ref("");
const isLoading = ref(false);

const handleRegister = () => {
  if (!email.value || !password.value || !firstName.value) return;
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;

    if (process.client) {
      const userObj = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phone: phone.value,
        isLoggedIn: true,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
    }

    router.push("/dashboard");
  }, 600);
};

useSeoMeta({
  title: "Créer un compte - EduShop Sénégal",
  description: "Rejoignez EduShop pour commander vos fournitures scolaires au meilleur prix.",
});
</script>
