<template>
  <transition name="slide-right">
    <div class="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40">
      <div
        class="w-full max-w-md bg-white h-full shadow-xl p-8 overflow-y-auto relative flex flex-col"
      >
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 class="text-2xl font-bold mb-6 text-gray-900">
          Ajouter un utilisateur
        </h2>
        <form @submit.prevent="submit" class="flex-1 flex flex-col gap-4">
          <input
            v-model="form.Name"
            type="text"
            placeholder="Nom complet"
            class="input"
            required
          />
          <input
            v-model="form.Email"
            type="email"
            placeholder="Email"
            class="input"
            required
          />
          <input
            v-model="form.Phone"
            type="text"
            placeholder="Téléphone"
            class="input"
          />
          <select v-model="form.Role" class="input" required>
            <option value="">Sélectionner un rôle</option>
            <option value="customer">Client</option>
            <option value="admin">Administrateur</option>
            <option value="moderator">Modérateur</option>
          </select>
          <input
            v-model="form.Address"
            type="text"
            placeholder="Adresse"
            class="input"
          />
          <input
            v-model="form.City"
            type="text"
            placeholder="Ville"
            class="input"
          />
          <input
            v-model="form.Country"
            type="text"
            placeholder="Pays"
            class="input"
          />
          <input
            v-model="form['Local ID']"
            type="text"
            placeholder="ID local"
            class="input"
          />
          <label class="flex items-center gap-2">
            <input
              v-model="form.Active"
              type="checkbox"
              class="accent-emerald-600"
            />
            Utilisateur actif
          </label>
          <div class="flex gap-2 mt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="flex-1 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";
const emit = defineEmits(["close", "refresh"]);
const form = ref({
  Name: "",
  Email: "",
  Phone: "",
  Role: "",
  Address: "",
  City: "",
  Country: "",
  "Local ID": "",
  Active: true,
});

async function submit() {
  await $fetch("/api/admin/users", { method: "POST", body: form.value });
  emit("refresh");
  emit("close");
}
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500;
}
</style>
