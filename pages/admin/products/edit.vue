<template>
  <Transition name="drawer-slide" appear>
    <div v-if="show" class="fixed inset-0 z-50 flex">
      <div
        class="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
        @click="handleClose"
      ></div>
      <div
        class="ml-auto w-full max-w-md h-full bg-white shadow-xl relative z-50 flex flex-col transition-transform duration-300"
      >
        <div class="flex items-center justify-between px-6 py-4 border-b">
          <h3 class="text-lg font-semibold">Modifier le produit</h3>
          <button
            @click="handleClose"
            class="text-gray-400 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <form
          @submit.prevent="onSubmit"
          class="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        >
          <div>
            <label class="block text-sm font-medium mb-1">Nom</label>
            <input
              v-model="form.Name"
              type="text"
              class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Catégorie</label>
            <input
              v-model="form.Category"
              type="text"
              class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              required
            />
          </div>
          <div class="flex gap-2">
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1">Prix</label>
              <input
                v-model.number="form.Price"
                type="number"
                min="0"
                step="0.01"
                class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1"
                >Prix d'origine</label
              >
              <input
                v-model.number="form['Original Price']"
                type="number"
                min="0"
                step="0.01"
                class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea
              v-model="form.Description"
              class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              rows="2"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Résumé court</label>
            <input
              v-model="form['Short Product Summary']"
              type="text"
              class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1"
              >Tags (séparés par virgule)</label
            >
            <input
              v-model="form['Product Feature Tags']"
              type="text"
              class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1"
              >Image principale (URL)</label
            >
            <input
              v-model="form['Image URL']"
              type="text"
              class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <img
              v-if="form['Image URL']"
              :src="form['Image URL']"
              class="w-20 h-20 object-cover rounded mt-2 border"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1"
              >Images (URLs, séparées par virgule)</label
            >
            <input
              v-model="imagesString"
              type="text"
              class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <div class="flex gap-2 mt-2">
              <img
                v-for="img in imagesArray"
                :key="img"
                :src="img"
                class="w-12 h-12 object-cover rounded border"
              />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1">Stock</label>
              <input
                v-model.number="form['In Stock']"
                type="number"
                min="0"
                class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1">Alerte stock</label>
              <input
                v-model.number="form['Stock Alert']"
                type="number"
                min="0"
                class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>
          <!-- Discount Percentage (champ calculé, masqué à l'édition) -->
          <!--
          <div>
            <label class="block text-sm font-medium mb-1">Promo (%)</label>
            <input v-model="form['Discount Percentage']" type="number" min="0" max="100" class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200" disabled />
          </div>
          -->
          <div>
            <label class="block text-sm font-medium mb-1">ID local</label>
            <input
              v-model="form['Local ID']"
              type="text"
              class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1"
              >Caractéristiques (JSON)</label
            >
            <textarea
              v-model="featuresString"
              class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              rows="2"
              placeholder='{"clé":"valeur"}'
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1"
              >Spécifications (JSON)</label
            >
            <textarea
              v-model="specsString"
              class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              rows="2"
              placeholder='{"clé":"valeur"}'
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1"
              >Options de lot (JSON)</label
            >
            <textarea
              v-model="bulkOptionsString"
              class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              rows="2"
              placeholder='[{"qty":10,"price":5}]'
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Avis (JSON)</label>
            <textarea
              v-model="reviewsString"
              class="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              rows="2"
              placeholder='[{"author":"","text":""}]'
            ></textarea>
          </div>
          <div class="flex justify-end mt-6">
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow transition flex items-center gap-2"
            >
              <span
                v-if="loading"
                class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              ></span>
              <span>Sauvegarder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useToast } from "vue-toastification";

const props = defineProps({ product: { type: Object, required: true } });
const emit = defineEmits(["close", "refresh"]);

const show = ref(true);
const loading = ref(false);
const toast = useToast ? useToast() : null;

// Initialisation du form
const form = ref({});
watch(
  () => props.product,
  (val) => {
    if (val) form.value = { ...val };
  },
  { immediate: true }
);

onMounted(() => {
  console.log("Produit reçu :", props.product);
});

// Champs complexes sécurisés
const imagesString = ref("");
watch(
  form,
  (val) => {
    imagesString.value = (val.Images ?? []).join(", ");
  },
  { immediate: true }
);

const imagesArray = computed(() =>
  imagesString.value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);
watch(imagesString, () => {
  form.value.Images = imagesArray.value;
});

function handleClose() {
  show.value = false;
  setTimeout(() => emit("close"), 300);
}

async function onSubmit() {
  loading.value = true;
  try {
    const body = { ...form.value };
    delete body["Discount Percentage"];
    await $fetch(`/api/admin/products/${form.value.id}`, {
      method: "PUT",
      body,
    });
    emit("refresh");
    toast?.success("Produit modifié avec succès");
    handleClose();
  } catch (e) {
    toast?.error("Erreur lors de la modification");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.drawer-slide-enter-to,
.drawer-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
