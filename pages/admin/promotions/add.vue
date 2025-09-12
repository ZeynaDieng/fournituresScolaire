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
          Ajouter une promotion
        </h2>
        <form @submit.prevent="submit" class="flex-1 flex flex-col gap-4">
          <input
            v-model="form.Title"
            type="text"
            placeholder="Titre de la promotion"
            class="input"
            required
          />
          <input
            v-model.number="form['Discount %']"
            type="number"
            placeholder="Réduction (%)"
            class="input"
            min="0"
            max="100"
            required
          />
          <select v-model="form.Type" class="input" required>
            <option value="">Sélectionner un type</option>
            <option value="percentage">Pourcentage</option>
            <option value="fixed">Montant fixe</option>
            <option value="bogo">Achetez 1, obtenez 1</option>
          </select>
          <input
            v-model="form['End Date']"
            type="date"
            placeholder="Date de fin"
            class="input"
            required
          />
          <textarea
            v-model="form.Description"
            placeholder="Description"
            class="input"
            rows="3"
          ></textarea>
          <input
            v-model="form.Category"
            type="text"
            placeholder="Catégorie"
            class="input"
          />
          <input
            v-model="form.Icon"
            type="text"
            placeholder="Icône (emoji ou URL)"
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
              v-model="form.Trending"
              type="checkbox"
              class="accent-emerald-600"
            />
            Promotion tendance
          </label>
          <label class="flex items-center gap-2">
            <input
              v-model="form.Featured"
              type="checkbox"
              class="accent-emerald-600"
            />
            Promotion mise en avant
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
  Title: "",
  "Discount %": 0,
  Type: "",
  "End Date": "",
  Description: "",
  Category: "",
  Icon: "",
  "Local ID": "",
  Trending: false,
  Featured: false,
});

async function submit() {
  await $fetch("/api/admin/promotions", { method: "POST", body: form.value });
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
