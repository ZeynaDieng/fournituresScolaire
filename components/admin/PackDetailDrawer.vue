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
          <h3 class="text-2xl font-bold">Détail du pack</h3>
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
              v-if="parsedPack['Image URL']"
              :src="parsedPack['Image URL']"
              :alt="parsedPack.Name"
              class="w-40 h-40 object-cover rounded-xl border"
            />
          </div>
          <!-- Infos principales -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xl font-semibold">{{ parsedPack.Name }}</span>
              <span
                v-if="parsedPack['Is Promotion']"
                class="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold"
                >PROMO</span
              >
            </div>
            <div class="text-gray-500 text-sm">
              Niveau : {{ parsedPack.Level }}
            </div>
            <div class="flex items-center gap-4 mt-2">
              <span class="text-lg font-bold text-emerald-700"
                >{{ parsedPack.Price }} FCFA</span
              >
              <span
                v-if="parsedPack['Original Price']"
                class="line-through text-gray-400"
                >{{ parsedPack["Original Price"] }} FCFA</span
              >
              <span
                v-if="parsedPack['In Stock']"
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
            v-if="parsedPack.Description"
            class="text-gray-800 whitespace-pre-line"
          >
            {{ parsedPack.Description }}
          </div>
          <!-- Contenu du pack -->
          <div
            v-if="
              parsedPack.Contents &&
              Array.isArray(parsedPack.Contents) &&
              parsedPack.Contents.length
            "
            class="mt-4"
          >
            <h4 class="font-semibold mb-2">Contenu du pack</h4>
            <ul class="list-disc list-inside text-gray-700 text-sm space-y-1">
              <li v-for="(item, index) in parsedPack.Contents" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
          <!-- Fin de promotion -->
          <div
            v-if="parsedPack['Promotion End Date']"
            class="text-sm text-orange-600"
          >
            <strong>Fin de promotion :</strong>
            {{ formatDate(parsedPack["Promotion End Date"]) }}
          </div>
          <!-- ID local -->
          <div v-if="parsedPack['Local ID']" class="text-xs text-gray-400 mt-6">
            ID local : {{ parsedPack["Local ID"] }}
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from "vue";
const props = defineProps({
  pack: { type: Object, required: true },
});
const emit = defineEmits(["close"]);
const show = ref(true);

// Parser les champs du pack
const parsedPack = computed(() => {
  const p = { ...props.pack };

  // Parser Contents
  if (p.Contents && typeof p.Contents === "string") {
    try {
      p.Contents = JSON.parse(p.Contents);
    } catch {
      // Si ce n'est pas du JSON, traiter comme une string séparée par des virgules ou retours à la ligne
      p.Contents = p.Contents.split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return p;
});

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
}

function handleClose() {
  show.value = false;
  setTimeout(() => emit("close"), 300);
}
// Si le pack change (changement de fiche), réafficher
watch(
  () => props.pack,
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
