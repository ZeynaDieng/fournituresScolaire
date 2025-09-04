<!-- pages/index.vue -->
<template>
  <div>
    <!-- Hero Section with Optimized Background -->
    <AppHeroSection />
    <!-- Popular Packs Section with Optimized Loading -->
    <section class="section bg-gray-50" id="packs-populaires">
      <div class="container px-4">
        <div class="text-center mb-12">
          <h2
            class="section-title transform transition-all duration-1000 ease-out translate-y-6 opacity-0 animate-fade-in-up"
            style="--delay: 0.1s"
          >
            Packs Scolaires Populaires
          </h2>
          <p
            class="text-xl text-gray-600 max-w-2xl mx-auto transform transition-all duration-1000 ease-out translate-y-6 opacity-0 animate-fade-in-up"
            style="--delay: 0.2s"
          >
            Nos packs les plus demandés pour chaque niveau scolaire
          </p>
        </div>

        <!-- Loading State with Better Skeleton -->
        <div v-if="productsStore.loading" class="pack-grid">
          <div
            v-for="n in 4"
            :key="n"
            class="bg-white rounded-2xl shadow-md overflow-hidden transition-shadow duration-300 h-full flex flex-col"
          >
            <div
              class="relative w-full aspect-[4/3] bg-gray-200 animate-pulse"
            ></div>
            <div class="p-6 flex-1 flex flex-col">
              <div class="h-4 w-24 bg-gray-200 rounded-full mb-4"></div>
              <div class="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div class="space-y-2 mb-6 flex-grow">
                <div class="h-3 bg-gray-100 rounded w-full"></div>
                <div class="h-3 bg-gray-100 rounded w-5/6"></div>
              </div>
              <div class="flex items-center justify-between">
                <div class="h-8 w-24 bg-gray-200 rounded"></div>
                <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Popular Packs Grid with Staggered Animation -->
        <div v-else class="pack-grid">
          <AppPackCard
            v-for="(pack, index) in productsStore.popularPacks"
            :key="pack.id"
            :pack="pack"
            class="transform transition-all duration-300 ease-out"
            :style="{
              '--delay': `${index * 0.1}s`,
              animation: `fadeInUp 0.6s ease-out forwards ${index * 0.1}s`,
            }"
            @mouseenter="
              $event.currentTarget.style.transform = 'translateY(-8px)'
            "
            @mouseleave="$event.currentTarget.style.transform = 'translateY(0)'"
          />
        </div>

        <!-- View All Button with Animation -->
        <div
          class="text-center mt-12 transform transition-all duration-1000 ease-out translate-y-6 opacity-0 animate-fade-in-up"
          style="--delay: 0.5s"
        >
          <NuxtLink
            to="/packs"
            class="btn-primary inline-flex items-center space-x-2 mx-auto group relative overflow-hidden px-8 py-3 rounded-full font-medium bg-gradient-to-r from-primary-green to-primary-dark-green text-white hover:shadow-lg hover:shadow-primary-green/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Découvrir tous nos packs</span>

            <span
              class="absolute inset-0 bg-white/10 group-hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Products Section -->
    <section class="section bg-white">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="section-title">Derniers Articles</h2>

          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos nouveaux produits et articles populaires
          </p>
        </div>

        <!-- Categories Filter -->
        <div class="flex flex-wrap justify-center gap-4 mb-12">
          <button
            v-for="category in ['Tous', ...productsStore.categories]"
            :key="category"
            @click="selectedCategory = category"
            class="px-4 py-2 rounded-full font-medium transition-all"
            :class="{
              'bg-primary-green text-white': selectedCategory === category,
              'bg-gray-100 text-gray-700 hover:bg-primary-light-green':
                selectedCategory !== category,
            }"
          >
            {{ category }}
          </button>
        </div>

        <!-- Products Grid -->
        <div class="product-grid">
          <AppProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            class="fade-in"
          />
        </div>

        <!-- View All Button -->
        <div class="text-center mt-12">
          <NuxtLink
            to="/products"
            class="btn-primary inline-flex items-center space-x-2"
          >
            <span>Voir tous les articles</span>
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Promotions Section -->

    <AppPromotionCard />

    <!-- Testimonials Section -->
    <section class="section bg-white">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="section-title">Ce que disent nos clients</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Des milliers de parents satisfaits nous font confiance
          </p>
        </div>

        <!-- Testimonials Carousel -->
        <div class="relative">
          <div class="overflow-hidden rounded-2xl">
            <div
              class="flex transition-transform duration-500 ease-in-out"
              :style="{
                transform: `translateX(-${currentTestimonial * 100}%)`,
              }"
            >
              <TestimonialCard
                v-for="(testimonial, index) in testimonials"
                :key="index"
                :testimonial="testimonial"
              />
            </div>
          </div>

          <!-- Carousel Navigation -->
          <div class="flex justify-center mt-8 space-x-2">
            <button
              v-for="(_, index) in testimonials"
              :key="index"
              @click="currentTestimonial = index"
              class="w-3 h-3 rounded-full transition-colors"
              :class="{
                'bg-primary-green': currentTestimonial === index,
                'bg-gray-300': currentTestimonial !== index,
              }"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Panel de test du panier (mode développement) -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useProductsStore } from "~/stores/products";
import type { Product } from "~/stores/products";

// Since AppPackCard, AppProductCard etc. are in components/, Nuxt 3 auto-imports them.
// We just need to define the props they might expect if not done inside the components themselves.

const productsStore = useProductsStore();

// Fetch data on component mount
onMounted(() => {
  if (productsStore.products.length === 0) {
    productsStore.fetchProducts();
  }
});

// Latest Products Section
const selectedCategory = ref("Tous");
const filteredProducts = computed(() => {
  const products = productsStore.products as Product[];
  if (selectedCategory.value === "Tous") {
    return products.slice(0, 9); // Limit to 8 latest products
  }
  return products
    .filter((p) => p.category === selectedCategory.value)
    .slice(0, 8);
});

// Testimonials Section
const testimonials = ref([
  {
    id: 1,
    name: "Awa Diop",
    role: "Maman d'élève en CM2",
    avatar: "https://i.pravatar.cc/150?img=1",
    text: "Un service incroyable ! J'ai commandé le pack scolaire complet pour mon fils et tout était parfait. La livraison a été rapide et les fournitures sont de très bonne qualité. Fini le stress de la rentrée !",
  },
  {
    id: 2,
    name: "Moussa Fall",
    role: "Papa de deux collégiens",
    avatar: "https://i.pravatar.cc/150?img=2",
    text: "Je recommande vivement. Le site est facile à utiliser et les packs sont très bien pensés. Un gain de temps énorme pour les parents.",
  },
  {
    id: 3,
    name: "Fatima Ndiaye",
    role: "Enseignante en primaire",
    avatar: "https://i.pravatar.cc/150?img=3",
    text: "Enfin une solution simple et efficace pour les fournitures scolaires au Sénégal. La qualité est au rendez-vous. Je le conseille à tous les parents de mes élèves.",
  },
]);
const currentTestimonial = ref(0);

// Quick Order
const quickOrder = (level: string) => {
  // Implement quick order logic, e.g., redirect to a pre-filled cart or a specific pack page
  alert(`Commande rapide pour le niveau : ${level}`);
  // Example: router.push(`/packs?level=${level}`)
};
</script>

<style scoped>
/* Keyframes for animations */
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

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-10px) translateX(10px);
  }
}

@keyframes float-medium {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-15px) translateX(-10px);
  }
}

/* Animation Classes */
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: var(--delay, 0s);
  animation-delay: var(--delay, 0s);
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 10s ease-in-out infinite;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Button Styles */
.btn-primary {
  @apply bg-primary-green hover:bg-primary-dark-green text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5;
}

.btn-secondary {
  @apply bg-white text-gray-800 border-2 border-gray-200 hover:border-primary-green font-semibold rounded-xl transition-all duration-300 hover:bg-gray-50;
}

/* Section Styles */
.section {
  @apply py-16 md:py-24;
}

.section-title {
  @apply text-3xl md:text-4xl font-bold text-primary-dark-green mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-green to-primary-dark-green;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(
      90deg,
      var(--primary-green),
      var(--primary-dark-green)
    );
    border-radius: 3px;
  }
}

.pack-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8;
}

.product-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6;
}

/* Grid Pattern */
.grid-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  background-size: 60px 60px;
}

.btn-primary {
  @apply bg-primary-green text-white font-bold rounded-full shadow-lg hover:bg-primary-dark-green transition-all duration-300 transform hover:-translate-y-1;
}

.btn-secondary {
  @apply bg-white text-primary-green font-bold rounded-full shadow-md hover:shadow-xl border border-primary-light-green hover:border-primary-green transition-all duration-300 transform hover:-translate-y-1;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes pulse-cta {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse-cta {
  animation: pulse-cta 2s infinite ease-in-out;
}

.animation-delay-200 {
  animation-delay: 200ms;
}
.animation-delay-400 {
  animation-delay: 400ms;
}
.animation-delay-600 {
  animation-delay: 600ms;
}
</style>
