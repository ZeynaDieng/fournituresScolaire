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
          background-image: url('https://i.pinimg.com/736x/8c/4f/b8/8c4fb8bd40f1a67e063ffb2223f4190b.jpg');
        "
      ></div>

      <!-- Overlay for text readability -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/75 to-teal-900/80"
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
              <span class="block">Produits Scolaires</span>
              <span
                class="block bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent"
                >À l'unité</span
              >
            </h1>

            <p
              class="text-xl sm:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
              style="animation-delay: 0.3s"
            >
              Découvrez notre large sélection de fournitures scolaires de
              qualité.
              <br class="hidden sm:block" />
              <span class="font-semibold text-white"
                >Choisissez exactement</span
              >
              ce dont vous avez besoin.
            </p>
          </div>

          <!-- Stats -->
          <div
            class="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in-up"
            style="animation-delay: 0.4s"
          >
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-bold text-white">150+</div>
              <div class="text-emerald-200 text-sm font-medium">
                Produits Disponibles
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-bold text-white">98%</div>
              <div class="text-emerald-200 text-sm font-medium">
                Satisfaction
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-bold text-white">24h</div>
              <div class="text-emerald-200 text-sm font-medium">Expédition</div>
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
      <!-- Categories Filter -->
      <div class="mb-16 animate-fade-in-up" style="animation-delay: 0.5s">
        <div class="text-center mb-8">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Parcourir par catégorie
          </h2>
          <p class="text-slate-600 text-lg">
            Trouvez rapidement ce que vous cherchez
          </p>
        </div>

        <!-- Mobile Dropdown -->
        <div class="block sm:hidden">
          <select
            v-model="currentCategory"
            class="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-lg font-medium focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
          >
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Desktop Pills -->
        <div class="hidden sm:flex flex-wrap justify-center gap-3 lg:gap-4">
          <button
            v-for="(category, index) in categories"
            :key="category"
            @click="filterCategory(category)"
            class="group relative px-6 lg:px-8 py-3 lg:py-4 font-semibold text-lg rounded-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 animate-slide-in-up"
            :style="{ animationDelay: `${0.6 + index * 0.1}s` }"
            :class="{
              'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xl shadow-emerald-200':
                currentCategory === category,
              'bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700':
                currentCategory !== category,
            }"
          >
            <div
              v-if="currentCategory === category"
              class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"
            ></div>
            <span class="relative">{{ category }}</span>
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="space-y-16">
        <div
          v-if="filteredProducts.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <div
            v-for="(product, index) in filteredProducts"
            :key="product.id"
            class="group animate-fade-in-up"
            :style="{ animationDelay: `${0.7 + index * 0.1}s` }"
          >
            <AppProductCard
              :product="product"
              @add-to-cart="addToCart"
              class="transform hover:scale-105 transition-all duration-500 hover:shadow-2xl h-full"
            />
          </div>
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 7h6"
                />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-4">
              Aucun produit trouvé
            </h3>
            <p class="text-slate-600 text-lg mb-8">
              Essayez de changer de catégorie ou revenez plus tard.
            </p>
            <button
              @click="currentCategory = 'Tous'"
              class="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-colors"
            >
              Voir tous les produits
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useProductsStore } from "~/stores/products";
import { useCartStore } from "~/stores/cart";
import AppProductCard from "~/components/AppProductCard.vue";

const productsStore = useProductsStore();
const cartStore = useCartStore();

const currentCategory = ref("Tous");
const loading = ref(true);

// Charger les données au montage du composant
onMounted(async () => {
  try {
    await productsStore.fetchProducts();
    console.log("Produits chargés:", productsStore.products);
  } catch (error) {
    console.error("Erreur lors du chargement des produits:", error);
  } finally {
    loading.value = false;
  }
});

// Calculer les catégories disponibles
const categories = computed(() => {
  const allCategories = productsStore.products.map((p) => p.category);
  const uniqueCategories = [...new Set(allCategories)];
  return ["Tous", ...uniqueCategories];
});

// Filtrer les produits par catégorie
const filteredProducts = computed(() => {
  if (currentCategory.value === "Tous") {
    return productsStore.products;
  }
  return productsStore.products.filter(
    (p) => p.category === currentCategory.value
  );
});

// Sélectionner une catégorie
function filterCategory(cat: string) {
  currentCategory.value = cat;
}

// Ajouter au panier
function addToCart(product: any, quantity = 1) {
  cartStore.addItem(
    {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: "product",
      category: product.category,
      description: product.description,
    },
    quantity
  );
}

// Configuration du head
useHead({
  title: "Produits Scolaires - EduShop",
  meta: [
    {
      name: "description",
      content:
        "Découvrez notre large sélection de fournitures scolaires de qualité. Cahiers, stylos, ardoises et bien plus encore.",
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

/* Focus states accessibles */
button:focus-visible,
select:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Optimisations mobile */
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
</style>
