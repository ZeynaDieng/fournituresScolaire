<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <form
      @submit.prevent="login"
      class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
    >
      <h1 class="text-2xl font-bold mb-6 text-center">Connexion Admin</h1>
      <input
        v-model="username"
        placeholder="Nom d'utilisateur"
        class="form-input mb-4"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Mot de passe"
        class="form-input mb-4"
        required
      />
      <button type="submit" class="btn btn-primary w-full">Se connecter</button>
      <p v-if="error" class="text-red-600 mt-4 text-center">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
const username = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

async function login() {
  error.value = "";
  const res = await $fetch("/api/admin/login", {
    method: "POST",
    body: { username: username.value, password: password.value },
  });
  if (res.success && "token" in res && typeof res.token === "string") {
    localStorage.setItem("admin_token", res.token);
    router.push("/admin");
  } else if (
    !res.success &&
    "message" in res &&
    typeof res.message === "string"
  ) {
    error.value = res.message;
  } else {
    error.value = "Identifiants invalides";
  }
}
</script>
