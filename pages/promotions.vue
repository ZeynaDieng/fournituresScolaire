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
              <span class="block">Promotions de</span>
              <span
                class="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent"
                >Rentrée</span
              >
            </h1>

            <p
              class="text-xl sm:text-2xl text-red-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
              style="animation-delay: 0.3s"
            >
              Des offres exceptionnelles pour bien démarrer l'année scolaire.
              <br class="hidden sm:block" />
              <span class="font-semibold text-white"
                >Jusqu'à 50% de réduction</span
              >
              sur tous vos produits essentiels.
            </p>
          </div>

          <!-- Stats -->
          <div
            class="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in-up"
            style="animation-delay: 0.4s"
          >
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-bold text-white">50%</div>
              <div class="text-red-200 text-sm font-medium">Réduction Max</div>
            </div>
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-bold text-white">15+</div>
              <div class="text-red-200 text-sm font-medium">Offres Actives</div>
            </div>
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-bold text-white">7j</div>
              <div class="text-red-200 text-sm font-medium">Temps Restant</div>
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
      <!-- Promotions Grid -->
      <div class="space-y-16">
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
        >
          <div
            v-for="(promo, index) in promotions"
            :key="promo.id"
            class="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up"
            :style="{ animationDelay: `${0.5 + index * 0.1}s` }"
            :class="
              promo.featured ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
            "
          >
            <!-- Badge Featured -->
            <div v-if="promo.featured" class="absolute top-4 left-4 z-10">
              <div
                class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse"
              >
                <i class="fas fa-crown mr-1"></i>POPULAIRE
              </div>
            </div>

            <!-- Discount Badge -->
            <div class="absolute top-4 right-4 z-10">
              <div
                class="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold transform rotate-3"
              >
                -{{ promo.discount }}%
              </div>
            </div>

            <!-- Card Content -->
            <div class="p-8">
              <!-- Icon -->
              <div
                class="text-6xl mb-4 text-center transform group-hover:scale-110 transition-transform duration-300"
              >
                {{ promo.icon }}
              </div>

              <!-- Title -->
              <h2 class="text-2xl font-bold text-gray-800 mb-3 text-center">
                {{ promo.title }}
              </h2>

              <!-- Description -->
              <p class="text-gray-600 text-center mb-6 leading-relaxed">
                {{ promo.description }}
              </p>

              <!-- Price Section -->
              <div class="text-center mb-6">
                <div class="flex items-center justify-center space-x-2 mb-2">
                  <span class="text-lg text-gray-400 line-through"
                    >{{ promo.originalPrice }} CFA</span
                  >
                  <span
                    class="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent"
                  >
                    {{ promo.price }} CFA
                  </span>
                </div>
                <div class="text-sm text-green-600 font-medium">
                  <i class="fas fa-tag mr-1"></i>Vous économisez
                  {{ promo.originalPrice - promo.price }} CFA
                </div>
              </div>

              <!-- Countdown -->
              <AppCountdown :endDate="promo.endTime" class="mb-6" />

              <!-- Features List -->
              <div class="space-y-2 mb-6">
                <div
                  v-for="feature in promo.features"
                  :key="feature"
                  class="flex items-center text-sm text-gray-600"
                >
                  <i class="fas fa-check-circle text-green-500 mr-2"></i>
                  {{ feature }}
                </div>
              </div>

              <!-- Action Button -->
              <button
                @click="addToCart(promo.product)"
                class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
              >
                <span class="flex items-center justify-center">
                  <i
                    class="fas fa-shopping-cart mr-2 group-hover:animate-bounce"
                  ></i>
                  Ajouter au panier
                </span>
              </button>
            </div>

            <!-- Decorative Elements -->
            <div
              class="absolute bottom-0 left-0 w-full h-1 bg-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppCountdown from "~/components/AppCountdown.vue";
import { useCartStore } from "~/stores/cart";
import { ref } from "vue";

// Meta tags pour SEO
useSeoMeta({
  title: "Promotions de Rentrée - Fournitures Scolaires",
  ogTitle: "Promotions de Rentrée - Fournitures Scolaires",
  description:
    "Découvrez nos offres exceptionnelles pour la rentrée scolaire. Jusqu'à 50% de réduction sur tous vos produits essentiels.",
  ogDescription:
    "Découvrez nos offres exceptionnelles pour la rentrée scolaire. Jusqu'à 50% de réduction sur tous vos produits essentiels.",
  ogImage: "/og-image.jpg",
  twitterCard: "summary_large_image",
});

const cartStore = useCartStore();

const promotions = ref([
  {
    id: 1,
    title: "Pack Cahiers Premium",
    description:
      "Lot de 10 cahiers grand format avec couverture rigide et papier de qualité supérieure",
    price: 4000,
    originalPrice: 5000,
    discount: 20,
    icon: "📚",
    featured: true,
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    product: { id: 101, name: "10 Cahiers Premium", price: 4000 },
    features: [
      "Couverture rigide résistante",
      "Papier 90g de qualité",
      "Reliure spirale renforcée",
      "Format A4 - 200 pages",
    ],
  },
  {
    id: 2,
    title: "Pack Lycée Complet",
    description:
      "Tout le nécessaire pour le lycée : cahiers, classeurs, trousse garnie, calculatrice",
    price: 15000,
    originalPrice: 20000,
    discount: 25,
    icon: "🎒",
    featured: false,
    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    product: { id: 4, name: "Pack Lycée Complet", price: 15000 },
    features: [
      "Livraison gratuite incluse",
      "15 cahiers assortis",
      "Trousse garnie complète",
      "Calculatrice scientifique",
    ],
  },
  {
    id: 3,
    title: "Kit Géométrie Pro",
    description:
      "Set complet pour les cours de mathématiques : compas, équerre, rapporteur, règles",
    price: 2500,
    originalPrice: 3500,
    discount: 30,
    icon: "📐",
    featured: false,
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    product: { id: 102, name: "Kit Géométrie Pro", price: 2500 },
    features: [
      "Compas de précision",
      "Règles graduées 20cm et 30cm",
      "Équerre et rapporteur",
      "Étui de rangement inclus",
    ],
  },
  {
    id: 4,
    title: "Pack Art & Créativité",
    description:
      "Tout pour les cours d'arts plastiques : crayons, feutres, peinture, pinceaux",
    price: 6000,
    originalPrice: 8500,
    discount: 35,
    icon: "🎨",
    featured: false,
    endTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    product: { id: 103, name: "Pack Art & Créativité", price: 6000 },
    features: [
      "24 crayons de couleur",
      "12 feutres fins",
      "Set de peinture acrylique",
      "Pinceaux assortis",
    ],
  },
  {
    id: 5,
    title: "Bundle Étudiant",
    description:
      "L'essentiel pour l'université : classeurs, intercalaires, bloc-notes, stylos",
    price: 8500,
    originalPrice: 12000,
    discount: 30,
    icon: "🎓",
    featured: true,
    endTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    product: { id: 104, name: "Bundle Étudiant", price: 8500 },
    features: [
      "5 classeurs A4 résistants",
      "Intercalaires colorés",
      "10 bloc-notes 80 pages",
      "Pack de 20 stylos",
    ],
  },
  {
    id: 6,
    title: "Mega Pack Primaire",
    description:
      "Idéal pour l'école primaire : cahiers, crayons, gommes, taille-crayons",
    price: 3200,
    originalPrice: 4500,
    discount: 28,
    icon: "✏️",
    featured: false,
    endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    product: { id: 105, name: "Mega Pack Primaire", price: 3200 },
    features: [
      "8 cahiers petit format",
      "12 crayons de couleur",
      "Gommes et taille-crayons",
      "Étiquettes personnalisables",
    ],
  },
]);

function addToCart(product: any) {
  cartStore.addItem(product);

  // Notification toast améliorée
  const toast = document.createElement("div");
  toast.className =
    "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce";
  toast.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-check-circle mr-2"></i>
      <span>${product.name} ajouté au panier !</span>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
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

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
}

/* Hover effects avancés */
.group:hover .animate-bounce {
  animation: bounce 1s infinite;
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
button:focus-visible {
  outline: 2px solid #ef4444;
  outline-offset: 2px;
}

/* Responsive design amélioré */
@media (max-width: 768px) {
  .text-4xl {
    font-size: 2rem;
  }

  .text-6xl {
    font-size: 3rem;
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
