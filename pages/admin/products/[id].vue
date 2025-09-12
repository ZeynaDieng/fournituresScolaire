<template>
  <Transition name="drawer-slide" appear>
    <div v-if="show" class="fixed inset-0 z-50 flex">
      <div
        class="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
        @click="handleClose"
      ></div>
      <div
        class="ml-auto w-full max-w-2xl h-full bg-white shadow-2xl relative z-50 flex flex-col transition-transform duration-300 overflow-y-auto"
      >
        <div class="flex items-center justify-between px-8 py-6 border-b">
          <h3 class="text-2xl font-bold">Détail du produit</h3>
          <button
            @click="handleClose"
            class="text-gray-400 hover:text-gray-700 text-3xl leading-none"
          >
            &times;
          </button>
        </div>
        <div class="px-8 py-6 space-y-6">
          <!-- Images -->
          <div class="flex gap-6 flex-col md:flex-row">
            <img
              v-if="parsedProduct['Image URL']"
              :src="parsedProduct['Image URL']"
              :alt="parsedProduct.Name"
              class="w-40 h-40 object-cover rounded-xl border"
            />
            <div class="flex flex-wrap gap-2">
              <img
                v-for="img in parsedProduct.Images || []"
                :key="img"
                :src="img"
                class="w-16 h-16 object-cover rounded border"
              />
            </div>
          </div>
          <!-- Infos principales -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xl font-semibold">{{
                parsedProduct.Name
              }}</span>
              <span
                v-if="parsedProduct['Discount Percentage']"
                class="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold"
                >-{{ parsedProduct["Discount Percentage"] }}%</span
              >
            </div>
            <div class="text-gray-500 text-sm">
              Catégorie : {{ parsedProduct.Category }}
            </div>
            <div class="flex items-center gap-4 mt-2">
              <span class="text-lg font-bold text-emerald-700"
                >{{ parsedProduct.Price }} FCFA</span
              >
              <span
                v-if="parsedProduct['Original Price']"
                class="line-through text-gray-400"
                >{{ parsedProduct["Original Price"] }} FCFA</span
              >
              <span
                v-if="parsedProduct['In Stock']"
                class="ml-4 px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                >En stock</span
              >
              <span
                v-else
                class="ml-4 px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                >Rupture</span
              >
            </div>
          </div>
          <!-- Description -->
          <div
            v-if="parsedProduct.Description"
            class="text-gray-800 whitespace-pre-line"
          >
            {{ parsedProduct.Description }}
          </div>
          <!-- Caractéristiques -->
          <div
            v-if="
              parsedProduct.Features &&
              Array.isArray(parsedProduct.Features) &&
              parsedProduct.Features.length
            "
            class="mt-4"
          >
            <h4 class="font-semibold mb-2">Caractéristiques</h4>
            <ul class="list-disc list-inside text-gray-700 text-sm">
              <li
                v-for="feature in parsedProduct.Features"
                :key="feature.label"
              >
                <span class="font-medium">{{ feature.label }}:</span>
                {{ feature.value }}
              </li>
            </ul>
          </div>
          <!-- Spécifications -->
          <div
            v-if="
              parsedProduct.Specs &&
              Array.isArray(parsedProduct.Specs) &&
              parsedProduct.Specs.length
            "
            class="mt-4"
          >
            <h4 class="font-semibold mb-2">Spécifications</h4>
            <ul class="list-disc list-inside text-gray-700 text-sm">
              <li v-for="spec in parsedProduct.Specs" :key="spec.label">
                <span class="font-medium">{{ spec.label }}:</span>
                {{ spec.value }}
              </li>
            </ul>
          </div>
          <!-- Options de lot -->
          <div
            v-if="
              parsedProduct['Bulk Options'] &&
              Array.isArray(parsedProduct['Bulk Options']) &&
              parsedProduct['Bulk Options'].length
            "
            class="mt-4"
          >
            <h4 class="font-semibold mb-2">Options de lot</h4>
            <ul class="list-disc list-inside text-gray-700 text-sm">
              <li v-for="opt in parsedProduct['Bulk Options']" :key="opt.qty">
                <span class="font-medium">{{ opt.qty }}x</span> à
                {{ opt.price }} FCFA
              </li>
            </ul>
          </div>
          <!-- Avis -->
          <div
            v-if="
              parsedProduct.Reviews &&
              Array.isArray(parsedProduct.Reviews) &&
              parsedProduct.Reviews.length
            "
            class="mt-4"
          >
            <h4 class="font-semibold mb-2">Avis</h4>
            <div class="space-y-2">
              <div
                v-for="(rev, i) in parsedProduct.Reviews"
                :key="i"
                class="bg-gray-50 rounded p-3"
              >
                <div class="font-medium text-gray-800">
                  {{ rev.author || "Anonyme" }}
                </div>
                <div class="text-gray-600 text-sm mt-1">{{ rev.text }}</div>
              </div>
            </div>
          </div>
          <!-- ID local -->
          <div
            v-if="parsedProduct['Local ID']"
            class="text-xs text-gray-400 mt-6"
          >
            ID local : {{ parsedProduct["Local ID"] }}
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from "vue";
const props = defineProps({
  product: { type: Object, required: true },
});
const emit = defineEmits(["close"]);
const show = ref(true);

// Parser les champs JSON
const parsedProduct = computed(() => {
  const p = { ...props.product };

  // Parser Features
  if (p.Features && typeof p.Features === "string") {
    try {
      p.Features = JSON.parse(p.Features);
    } catch {
      p.Features = {};
    }
  }

  // Parser Specs
  if (p.Specs && typeof p.Specs === "string") {
    try {
      p.Specs = JSON.parse(p.Specs);
    } catch {
      p.Specs = {};
    }
  }

  // Parser Bulk Options
  if (p["Bulk Options"] && typeof p["Bulk Options"] === "string") {
    try {
      p["Bulk Options"] = JSON.parse(p["Bulk Options"]);
    } catch {
      p["Bulk Options"] = [];
    }
  }

  // Parser Reviews
  if (p.Reviews && typeof p.Reviews === "string") {
    try {
      p.Reviews = JSON.parse(p.Reviews);
    } catch {
      p.Reviews = [];
    }
  }

  // Parser Images
  if (p.Images && typeof p.Images === "string") {
    p.Images = p.Images.split(",")
      .map((img) => img.trim())
      .filter(Boolean);
  }

  return p;
});

function handleClose() {
  show.value = false;
  setTimeout(() => emit("close"), 300);
}
// Si le produit change (changement de fiche), réafficher
watch(
  () => props.product,
  () => {
    show.value = true;
  }
);
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
