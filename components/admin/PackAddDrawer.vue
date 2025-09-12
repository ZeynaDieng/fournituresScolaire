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
        <h2 class="text-2xl font-bold mb-6 text-gray-900">Ajouter un pack</h2>
        <form @submit.prevent="submit" class="flex-1 flex flex-col gap-4">
          <input
            v-model="form.Name"
            type="text"
            placeholder="Nom du pack"
            class="input"
            required
          />
          <select v-model="form.Level" class="input" required>
            <option value="">Sélectionner un niveau</option>
            <option value="CP">CP</option>
            <option value="CE1">CE1</option>
            <option value="CE2">CE2</option>
            <option value="CM1">CM1</option>
            <option value="CM2">CM2</option>
            <option value="6ème">6ème</option>
            <option value="5ème">5ème</option>
            <option value="4ème">4ème</option>
            <option value="3ème">3ème</option>
          </select>
          <input
            v-model.number="form.Price"
            type="number"
            placeholder="Prix (FCFA)"
            class="input"
            required
          />
          <input
            v-model.number="form['Original Price']"
            type="number"
            placeholder="Prix d'origine (FCFA)"
            class="input"
          />
          <input
            v-model="form['Image URL']"
            type="url"
            placeholder="Image principale (URL)"
            class="input"
          />
          <textarea
            v-model="form.Description"
            placeholder="Description"
            class="input"
            rows="2"
          ></textarea>
          <textarea
            v-model="form.Contents"
            placeholder="Contenu du pack (un élément par ligne)"
            class="input"
            rows="4"
          ></textarea>
          <input
            v-model="form['Local ID']"
            type="text"
            placeholder="ID local"
            class="input"
          />
          <input
            v-model="form['Promotion End Date']"
            type="date"
            placeholder="Fin de promo"
            class="input"
          />
          <label class="flex items-center gap-2">
            <input
              v-model="form['Is Promotion']"
              type="checkbox"
              class="accent-emerald-600"
            />
            Pack en promotion
          </label>
          <label class="flex items-center gap-2">
            <input
              v-model="form['In Stock']"
              type="checkbox"
              class="accent-emerald-600"
            />
            En stock
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
  Level: "",
  Price: 0,
  "Original Price": 0,
  Description: "",
  Contents: "",
  "In Stock": true,
  "Is Promotion": false,
  "Promotion End Date": "",
  "Image URL": "",
  "Local ID": "",
});

async function submit() {
  // Transformer Contents en array si c'est une string
  const body = { ...form.value };
  if (body.Contents && typeof body.Contents === "string") {
    body.Contents = body.Contents.split("\n").filter((line) => line.trim());
  }

  await $fetch("/api/admin/packs", { method: "POST", body });
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
