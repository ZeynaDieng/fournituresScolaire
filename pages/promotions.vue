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
              class="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold text-white leading-tight animate-fade-in-up"
              style="animation-delay: 0.2s"
            >
              <span class="block">Promotions de</span>
              <span
                class="block text-[#F4C542]"
                >Rentrée Zen</span
              >
            </h1>

            <p
              class="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up font-medium"
              style="animation-delay: 0.3s"
            >
              Des offres exceptionnelles pour bien démarrer l'année scolaire au Sénégal.
              <br class="hidden sm:block" />
              <span class="font-bold text-[#F4C542]"
                >Jusqu'à 50% de réduction</span
              >
              sur vos fournitures indispensables.
            </p>
          </div>

          <!-- Stats -->
          <div
            class="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in-up"
            style="animation-delay: 0.4s"
          >
            <div class="text-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
              <div class="text-3xl sm:text-4xl font-display font-extrabold text-[#F4C542]">50%</div>
              <div class="text-white/80 text-xs uppercase font-bold tracking-wider">Réduction Max</div>
            </div>
            <div class="text-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
              <div class="text-3xl sm:text-4xl font-display font-extrabold text-[#F4C542]">15+</div>
              <div class="text-white/80 text-xs uppercase font-bold tracking-wider">Offres Actives</div>
            </div>
            <div class="text-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
              <div class="text-3xl sm:text-4xl font-display font-extrabold text-[#F4C542]">7j</div>
              <div class="text-white/80 text-xs uppercase font-bold tracking-wider">Temps Restant</div>
            </div>
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
      <!-- Promotions Grid -->
      <div class="space-y-16 text-center">
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
        >
          <div
            v-for="(promo, index) in promotions"
            :key="promo.id"
            class="group relative bg-white rounded-3xl border-2 border-slate-200/80 shadow-soft hover:shadow-lift hover:border-[#0F3D91] transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up"
            :style="{ animationDelay: `${0.5 + index * 0.1}s` }"
            :class="
              promo.featured ? 'ring-4 ring-[#F4C542]/50' : ''
            "
          >
            <!-- Badge Featured -->
            <div v-if="promo.featured" class="absolute top-4 left-4 z-10">
              <div
                class="bg-[#0F3D91] text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-sm"
              >
                ⭐ POPULAIRE
              </div>
            </div>

            <!-- Discount Badge -->
            <div class="absolute top-4 right-4 z-10">
              <div
                class="bg-[#F4C542] text-slate-950 px-3 py-1 rounded-full text-xs font-display font-extrabold shadow-sm"
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
              <h2 class="text-2xl font-display font-extrabold text-[#0F3D91] mb-3 text-center">
                {{ promo.title }}
              </h2>

              <!-- Description -->
              <p class="text-slate-600 text-center mb-6 leading-relaxed text-sm">
                {{ promo.description }}
              </p>

              <!-- Price Section -->
              <div class="text-center mb-6">
                <div class="flex items-center justify-center space-x-2 mb-2">
                  <span class="text-base text-slate-400 line-through font-medium"
                    >{{ promo.originalPrice }} CFA</span
                  >
                  <span
                    class="text-3xl font-display font-extrabold text-[#0F3D91]"
                  >
                    {{ promo.price }} CFA
                  </span>
                </div>
                <div class="text-xs text-emerald-600 font-extrabold">
                  Économie : {{ promo.originalPrice - promo.price }} CFA
                </div>
              </div>

              <!-- Countdown -->
              <AppCountdown :endDate="promo.endTime" class="text-center mb-6" />

              <!-- Features List -->
              <div class="text-center space-y-2 mb-6">
                <div
                  v-for="feature in promo.features"
                  :key="feature"
                  class="text-center text-xs font-semibold text-slate-600"
                >
                  ✓ {{ feature }}
                </div>
              </div>

              <!-- Action Button -->
              <button
                @click="addToCart(promo.product)"
                class="w-full bg-[#0F3D91] hover:bg-[#0b2f70] text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
              >
                <span>🛒 Ajouter au panier</span>
              </button>
            </div>

            <!-- Decorative Elements -->
            <div
              class="absolute bottom-0 left-0 w-full h-1 bg-[#F4C542] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
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
const airtableStore = useAirtableStore();

// Charger les promotions au montage de la page
onMounted(async () => {
  if (airtableStore.promotions.length === 0) {
    await airtableStore.fetchPromotions();
  }
});

// Utiliser les promotions dynamiques d'Airtable ou fallback sur les données locales
const promotions = computed(() => {
  const airtablePromotions = airtableStore.activePromotions;

  if (airtablePromotions.length > 0) {
    return airtablePromotions.map((promo: any) => ({
      id: promo.id,
      title: promo.title,
      description: promo.description,
      price:
        promo.currentPrice ||
        (promo.originalPrice
          ? Math.round(promo.originalPrice * (1 - promo.discount / 100))
          : 0),
      originalPrice: promo.originalPrice || 0,
      discount: promo.discount,
      icon: promo.icon || "🏷️",
      featured: promo.featured || false,
      endTime: promo.endDate
        ? new Date(promo.endDate)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      product: {
        id: promo.id,
        name: promo.title,
        price: promo.currentPrice || 0,
      },
      features: promo.features || ["Offre limitée", "Qualité garantie"],
    }));
  }

  // Fallback sur les données locales si Airtable n'est pas disponible
  return fallbackPromotions.value;
});

const fallbackPromotions = ref([
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
