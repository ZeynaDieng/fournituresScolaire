<template>
  <div
    class="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <!-- Logo -->
        <div
          class="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <svg
            class="w-8 h-8 text-emerald-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-white">Administration</h2>
        <p class="mt-2 text-emerald-100">
          Connectez-vous à votre espace d'administration
        </p>
      </div>

      <form
        @submit.prevent="login"
        class="bg-white rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <div>
          <label
            for="username"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Nom d'utilisateur
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Entrez votre nom d'utilisateur"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Mot de passe
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Entrez votre mot de passe"
          />
        </div>

        <div
          v-if="error"
          class="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Connexion en cours...
          </span>
          <span v-else>Se connecter</span>
        </button>

        <div class="text-center">
          <NuxtLink
            to="/"
            class="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
          >
            ← Retour au site
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

// Utiliser le layout d'authentification admin (sans header/footer publics)
definePageMeta({
  layout: "admin-auth",
});

const username = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const router = useRouter();

async function login() {
  error.value = "";
  loading.value = true;

  try {
    const res = await $fetch("/api/admin/login", {
      method: "POST",
      body: { username: username.value, password: password.value },
    });

    if (res.success && "token" in res && typeof res.token === "string") {
      localStorage.setItem("admin_token", res.token);
      document.cookie = `admin_token=${res.token}; path=/; SameSite=Lax;`;
      router.push("/admin/dashboard");
      setTimeout(() => window.location.reload(), 100);
    } else if (
      !res.success &&
      "message" in res &&
      typeof res.message === "string"
    ) {
      error.value = res.message;
    } else {
      error.value = "Erreur de connexion";
    }
  } catch (err) {
    error.value = "Erreur de connexion au serveur";
  } finally {
    loading.value = false;
  }
}
</script>
