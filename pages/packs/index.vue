<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
  >
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <!-- Background Image -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="
          background-image: url('https://i.pinimg.com/1200x/1d/c1/de/1dc1de98d4ae9813ed13b1c17dc3043e.jpg');
        "
      ></div>

      <!-- Overlay for text readability -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-[#0F3D91]/90 via-[#0F3D91]/85 to-[#0b2f70]/90"
      ></div>

      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div
          class="absolute inset-0"
          style="
            background-image: radial-gradient(
              circle at 2px 2px,
              white 1px,
              transparent 0
            );
            background-size: 40px 40px;
          "
        ></div>
      </div>

      <!-- Floating Elements -->
      <div
        class="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"
      ></div>
      <div
        class="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full blur-xl animate-float-delayed"
      ></div>
      <div
        class="absolute bottom-20 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-float-slow"
      ></div>

      <div class="relative px-4 py-16 sm:py-24 lg:py-32 max-w-7xl mx-auto">
        <div class="text-center space-y-8">
          <!-- Title -->
          <div class="space-y-6">
            <h1
              class="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight animate-fade-in-up"
              style="animation-delay: 0.2s"
            >
              <span class="block">Packs Scolaires</span>
              <span
                class="block text-[#F4C542]"
                >Complets & Adaptés</span
              >
            </h1>

            <p
              class="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up font-medium"
              style="animation-delay: 0.3s"
            >
              Des solutions complètes et personnalisées pour chaque niveau scolaire au Sénégal.
              <br class="hidden sm:block" />
              <span class="font-bold text-[#F4C542]"
                >Simplifiez votre rentrée</span
              >
              avec nos packs officiels.
            </p>
          </div>
        </div>
      </div>

      <!-- Wave Bottom -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg
          class="w-full h-12 sm:h-20 text-[#FBFBFA]"
          fill="currentColor"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative -mt-1 px-4 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto">
      <!-- Level Filters -->
      <div class="mb-16 animate-fade-in-up" style="animation-delay: 0.5s">
        <div class="text-center mb-8">
          <h2 class="text-2xl sm:text-3xl font-display font-extrabold text-[#0F3D91] mb-3">
            Choisissez votre niveau
          </h2>
          <p class="text-slate-600 text-base font-medium">
            Filtrez par niveau scolaire pour trouver le pack parfait
          </p>
        </div>

        <!-- Mobile Dropdown -->
        <div class="block sm:hidden">
          <select
            v-model="selectedLevel"
            class="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-base font-bold focus:border-[#0F3D91] focus:ring-4 focus:ring-[#0F3D91]/10 transition-all"
          >
            <option v-for="level in packLevels" :key="level" :value="level">
              {{ level }}
            </option>
          </select>
        </div>

        <!-- Desktop Pills -->
        <div class="hidden sm:flex flex-wrap justify-center gap-3 lg:gap-4">
          <button
            v-for="(level, index) in packLevels"
            :key="level"
            @click="selectLevel(level)"
            class="group relative px-6 lg:px-8 py-3 lg:py-3.5 font-bold text-sm rounded-full transition-all duration-300 transform hover:scale-105"
            :style="{ animationDelay: `${0.6 + index * 0.1}s` }"
            :class="{
              'bg-[#0F3D91] text-white shadow-md':
                selectedLevel === level,
              'bg-white text-slate-700 border-2 border-slate-200/80 hover:border-[#0F3D91] hover:text-[#0F3D91]':
                selectedLevel !== level,
            }"
          >
            <span class="relative">{{ level }}</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        <div v-for="n in 6" :key="n" class="group">
          <div
            class="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse"
          >
            <div
              class="aspect-[4/3] bg-gradient-to-br from-slate-200 to-slate-300"
            ></div>
            <div class="p-6 space-y-4">
              <div class="h-6 bg-slate-200 rounded-xl w-3/4"></div>
              <div class="h-4 bg-slate-200 rounded-lg w-1/2"></div>
              <div class="space-y-2">
                <div class="h-3 bg-slate-200 rounded w-full"></div>
                <div class="h-3 bg-slate-200 rounded w-4/5"></div>
              </div>
              <div class="h-12 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Packs Grid -->
      <div v-else-if="filteredPacks.length > 0" class="space-y-16">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <div
            v-for="(pack, index) in filteredPacks"
            :key="pack.id"
            class="group animate-fade-in-up"
            :style="{ animationDelay: `${0.7 + index * 0.1}s` }"
          >
            <AppPackCard
              :pack="pack"
              @add-to-cart="addToCart"
            />
          </div>
        </div>

        <!-- Comparison Section -->
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 animate-fade-in-up">
        <div class="max-w-md mx-auto">
          <div
            class="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-16 h-16 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mb-4">
            Aucun pack disponible
          </h3>
          <p class="text-slate-600 text-lg mb-8">
            Nous travaillons à enrichir notre sélection. Revenez bientôt !
          </p>
          <button
            @click="selectedLevel = 'Tous'"
            class="px-8 py-3 bg-primary-green text-white font-semibold rounded-2xl hover:bg-green-700 transition-colors"
          >
            Voir tous les niveaux
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "~/stores/cart";
import { useAirtableStore } from "~/stores/airtable";
import { useProductsStore } from "~/stores/products";
import { useFormatter } from "~/composables/useFormatter";
import AppPackCard from "~/components/AppPackCard.vue";

const cartStore = useCartStore();
const airtableStore = useAirtableStore();
const productsStore = useProductsStore();
const { formatPrice } = useFormatter();
const route = useRoute();

const packLevels = [
  "Tous",
  "Préscolaire",
  "Primaire",
  "CP",
  "CE1-CE2",
  "Collège",
  "Lycée",
];
const selectedLevel = ref("Tous");

// Données réactives depuis le store
const packs = computed(() => {
  if (airtableStore.packs.length > 0) return airtableStore.packs;
  if (productsStore.packs.length === 0) productsStore.initializeDemoData();
  return productsStore.packs;
});

const loading = computed(() => airtableStore.loading && packs.value.length === 0);

// Charger les données au montage du composant
onMounted(async () => {
  if (productsStore.packs.length === 0) {
    productsStore.initializeDemoData();
  }
  if (airtableStore.packs.length === 0) {
    await airtableStore.fetchPacks();
  }

  // Gérer le paramètre de niveau via l'URL (ex: /packs?level=prescolaire ou /packs?level=Coll%C3%A8ge)
  const urlLevel = route.query.level as string;
  if (urlLevel) {
    const levelMap: Record<string, string> = {
      prescolaire: "Préscolaire",
      primaire: "Primaire",
      college: "Collège",
      lycee: "Lycée",
      cp: "CP",
    };
    if (levelMap[urlLevel.toLowerCase()]) {
      selectedLevel.value = levelMap[urlLevel.toLowerCase()];
    } else {
      selectedLevel.value = urlLevel;
    }
  }
});

// Filtre les packs par niveau
const filteredPacks = computed(() => {
  if (selectedLevel.value === "Tous") {
    return packs.value;
  }
  const target = selectedLevel.value.toLowerCase();
  return packs.value.filter((pack) => {
    if (!pack.level) return true;
    const l = pack.level.toLowerCase();
    return l.includes(target) || target.includes(l);
  });
});

// Sélectionner un niveau avec animation
function selectLevel(level: string) {
  selectedLevel.value = level;
}

// Ajouter au panier
function addToCart(pack: any) {
  cartStore.addItem(
    {
      id: pack.id,
      name: pack.name,
      price: pack.price,
      image: pack.image,
      type: "pack",
    },
    1
  );
}


// Compter les éléments spécifiques dans le contenu
function countItem(items: string[], keyword: string): number {
  if (!items || !Array.isArray(items)) return 0;
  return items.filter((item) =>
    item.toLowerCase().includes(keyword.toLowerCase())
  ).length;
}

// Configuration du head
useHead({
  title: "Packs Scolaires Premium - EduShop",
  meta: [
    {
      name: "description",
      content:
        "Découvrez notre sélection premium de packs scolaires pour tous les niveaux. Solutions complètes pour une rentrée réussie.",
    },
  ],
});
</script>

<style scoped>
/* Animations personnalisées */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.animate-slide-in-up {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
}

/* Transitions fluides */
* {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Scrollbar custom */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .hero-title {
    font-size: 2.5rem;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.125rem;
    line-height: 1.6;
  }
}

/* Hover effects pour les cartes */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Animation au scroll */
@media (prefers-reduced-motion: no-preference) {
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus states accessibles */
button:focus-visible,
select:focus-visible {
  outline: 2px solid #16a34a;
  outline-offset: 2px;
}

/* Couleurs personnalisées avec #16a34a */
.text-primary-green {
  color: #16a34a;
}

.bg-primary-green {
  background-color: #16a34a;
}

.border-primary-green {
  border-color: #16a34a;
}

.hover\:bg-primary-green:hover {
  background-color: #16a34a;
}

.hover\:border-primary-green:hover {
  border-color: #16a34a;
}

.hover\:text-primary-green:hover {
  color: #16a34a;
}

.focus\:border-primary-green:focus {
  border-color: #16a34a;
}

.focus\:ring-primary-green:focus {
  --tw-ring-color: #16a34a;
}

/* States loading améliorés */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
