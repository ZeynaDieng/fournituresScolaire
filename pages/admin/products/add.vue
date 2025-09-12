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
          Ajouter un produit
        </h2>
        <form @submit.prevent="submit" class="flex-1 flex flex-col gap-4">
          <input
            v-model="form.name"
            type="text"
            placeholder="Nom du produit"
            class="input"
            required
          />
          <select v-model="form.category" class="input" required>
            <option value="">Sélectionner une catégorie</option>
            <option value="Cahiers">Cahiers</option>
            <option value="Stylos">Stylos</option>
            <option value="Crayons">Crayons</option>
            <option value="Fournitures diverses">Fournitures diverses</option>
            <option value="Feutres et Surligneurs">
              Feutres et Surligneurs
            </option>
            <option value="Calculatrices">Calculatrices</option>
            <option value="Sacs">Sacs</option>
            <option value="Ardoises">Ardoises</option>
            <option value="Géométrie">Géométrie</option>
            <option value="Autres">Autres</option>
          </select>
          <input
            v-model.number="form.price"
            type="number"
            placeholder="Prix"
            class="input"
            required
          />
          <input
            v-model.number="form.originalPrice"
            type="number"
            placeholder="Prix d'origine"
            class="input"
          />
          <input
            v-model="form.image"
            type="url"
            placeholder="Image principale (URL)"
            class="input"
          />
          <input
            v-model="form.imagesCsv"
            type="text"
            placeholder="Images (URLs séparées par des virgules)"
            class="input"
          />
          <textarea
            v-model="form.description"
            placeholder="Description"
            class="input"
            rows="2"
          ></textarea>
          <textarea
            v-model="form.featuresJson"
            placeholder='Caractéristiques (JSON: [{"label":"","value":""}])'
            class="input"
            rows="2"
          ></textarea>
          <textarea
            v-model="form.specsJson"
            placeholder='Spécifications (JSON: [{"label":"","value":""}])'
            class="input"
            rows="2"
          ></textarea>
          <textarea
            v-model="form.bulkOptionsJson"
            placeholder='Options de lot (JSON: [{"qty":10,"price":5}])'
            class="input"
            rows="2"
          ></textarea>
          <input
            v-model="form.localId"
            type="text"
            placeholder="ID local"
            class="input"
          />
          <input
            v-model="form.promotionEndDate"
            type="date"
            placeholder="Fin de promo"
            class="input"
          />
          <label class="flex items-center gap-2"
            ><input
              v-model="form.inStock"
              type="checkbox"
              class="accent-emerald-600"
            />En stock</label
          >
          <textarea
            v-model="form.reviewsJson"
            placeholder='Avis (JSON: [{"author":"","text":""}])'
            class="input"
            rows="2"
          ></textarea>
          <!-- Champs objets complexes -->

          <!-- Discount Percentage (champ calculé, masqué à l'ajout) -->
          <!--
          <div>
            <label class="block text-sm font-medium mb-1">Promo (%)</label>
            <input v-model="form['Discount Percentage']" type="number" min="0" max="100" class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200" disabled />
          </div>
          -->
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
  name: "",
  category: "",
  price: 0,
  originalPrice: 0,
  description: "",
  featuresJson: "",
  specsJson: "",
  bulkOptionsJson: "",
  inStock: true,
  promotionEndDate: "",
  image: "",
  imagesCsv: "",
  localId: "",
  reviewsJson: "",
});

function parseJson(s) {
  if (!s) return undefined;
  try {
    return JSON.parse(s);
  } catch {
    return undefined;
  }
}

async function submit() {
  // map vers champs Airtable
  const body = {
    Name: form.value.name,
    Category: form.value.category,
    Price: Number(form.value.price) || 0,
    "Original Price": form.value.originalPrice || undefined,
    Description: form.value.description || "",
    Features: form.value.featuresJson || "",
    Specs: form.value.specsJson || "",
    "Bulk Options": form.value.bulkOptionsJson || "",
    "In Stock": Boolean(form.value.inStock),
    "Promotion End Date": form.value.promotionEndDate || "",
    "Image URL": form.value.image || "",
    Images: form.value.imagesCsv || "",
    "Local ID": form.value.localId || "",
    Reviews: form.value.reviewsJson || "",
  };

  await $fetch("/api/admin/products", { method: "POST", body });
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
