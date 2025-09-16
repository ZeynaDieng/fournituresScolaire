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
        class="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/75 to-green-900/80"
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
              class="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight animate-fade-in-up"
              style="animation-delay: 0.2s"
            >
              <span class="block">Packs Scolaires</span>
              <span
                class="block bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent"
                >Premium</span
              >
            </h1>

            <p
              class="text-xl sm:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
              style="animation-delay: 0.3s"
            >
              Des solutions complètes et personnalisées pour chaque niveau
              scolaire.
              <br class="hidden sm:block" />
              <span class="font-semibold text-white"
                >Simplifiez votre rentrée</span
              >
              avec nos packs expertement conçus.
            </p>
          </div>

          <!-- Stats -->
          <div
            class="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in-up"
            style="animation-delay: 0.4s"
          >
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-bold text-white">15+</div>
              <div class="text-green-200 text-sm font-medium">
                Packs Disponibles
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-bold text-white">98%</div>
              <div class="text-green-200 text-sm font-medium">Satisfaction</div>
            </div>
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-bold text-white">24h</div>
              <div class="text-green-200 text-sm font-medium">Expédition</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wave Bottom -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg
          class="w-full h-12 sm:h-20 text-slate-50"
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
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Choisissez votre niveau
          </h2>
          <p class="text-slate-600 text-lg">
            Filtrez par niveau scolaire pour trouver le pack parfait
          </p>
        </div>

        <!-- Mobile Dropdown -->
        <div class="block sm:hidden">
          <select
            v-model="selectedLevel"
            class="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-lg font-medium focus:border-primary-green focus:ring-4 focus:ring-green-100 transition-all"
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
            class="group relative px-6 lg:px-8 py-3 lg:py-4 font-semibold text-lg rounded-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 animate-slide-in-up"
            :style="{ animationDelay: `${0.6 + index * 0.1}s` }"
            :class="{
              'bg-primary-green text-white shadow-xl shadow-green-200':
                selectedLevel === level,
              'bg-white text-slate-700 border-2 border-slate-200 hover:border-primary-green hover:bg-green-50 hover:text-primary-green':
                selectedLevel !== level,
            }"
          >
            <div
              v-if="selectedLevel === level"
              class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"
            ></div>
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
              class="transform hover:scale-105 transition-all duration-500 hover:shadow-2xl"
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
import { useCartStore } from "../stores/cart";
import { useFormatter } from "../composables/useFormatter";
import AppPackCard from "../components/AppPackCard.vue";

const cartStore = useCartStore();
const { formatPrice } = useFormatter();

const packLevels = ["Tous", "CP", "CE1-CE2", "Collège", "Lycée"];
const selectedLevel = ref("Tous");
const loading = ref(true);
const packs = ref<any[]>([]);

// Charger les données directement depuis l'API Airtable
async function fetchPacks() {
  try {
    loading.value = true;
    const response = (await $fetch("/api/airtable/packs")) as any;

    if (response.success && response.data) {
      // Les données sont déjà transformées par l'API
      packs.value = response.data.map((pack: any) => ({
        id: pack.id,
        name: pack.name,
        level: pack.level,
        price: pack.price,
        originalPrice: pack.originalPrice,
        description: pack.description,
        contents: pack.contents || [],
        isPopular: pack.isPopular,
        inStock: pack.inStock,
        image: pack.image,
        isPromotion: pack.isPromotion,
        promotionEndDate: pack.promotionEndDate,
      }));

      console.log("Packs chargés depuis Airtable:", packs.value);
    } else {
      console.error("Erreur dans la réponse de l'API:", response);
      packs.value = [];
    }
  } catch (error) {
    console.error("Erreur lors du chargement des packs:", error);
    // Fallback vers des données de démonstration en cas d'erreur
    packs.value = [];
  } finally {
    loading.value = false;
  }
}

// Charger les données au montage du composant
onMounted(fetchPacks);

// Filtre les packs par niveau
const filteredPacks = computed(() => {
  if (selectedLevel.value === "Tous") {
    return packs.value;
  }
  return packs.value.filter((pack) => pack.level === selectedLevel.value);
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
