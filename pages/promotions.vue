<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
  >
    <!-- Hero Section -->
    <div
      class="relative overflow-hidden bg-gradient-to-r from-primary-green to-green-500 text-white"
    >
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative max-w-7xl mx-auto px-4 py-16">
        <div class="text-center">
          <h1
            class="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"
          >
            Promotions de Rentrée
          </h1>
          <p class="text-xl md:text-2xl text-purple-100 mb-8">
            Des offres exceptionnelles pour bien démarrer l'année scolaire
          </p>
          <div
            class="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm"
          >
            <i class="fas fa-clock mr-2"></i>
            Offres limitées dans le temps !
          </div>
        </div>
      </div>
      <!-- Floating elements -->
      <div
        class="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-32 h-32 bg-pink-400/20 rounded-full blur-xl animate-pulse delay-1000"
      ></div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- Stats Section -->

      <!-- Promotions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div
          v-for="promo in promotions"
          :key="promo.id"
          class="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
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
              class="w-full bg-primary-green hover:from-green-700 hover:to-green-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
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
            class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          ></div>
        </div>
      </div>

      <!-- Trust Section -->
      <div
        class="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8"
      >
        <div class="text-center mb-8">
          <h3 class="text-3xl font-bold text-gray-800 mb-4">
            Pourquoi nous choisir ?
          </h3>
          <p class="text-gray-600 text-lg">
            Des milliers d'étudiants nous font confiance
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div
              class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="fas fa-shipping-fast text-white text-2xl"></i>
            </div>
            <h4 class="font-bold text-lg text-gray-800 mb-2">
              Livraison Rapide
            </h4>
            <p class="text-gray-600">Livraison en 24h partout à Dakar</p>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="fas fa-shield-alt text-white text-2xl"></i>
            </div>
            <h4 class="font-bold text-lg text-gray-800 mb-2">
              Qualité Garantie
            </h4>
            <p class="text-gray-600">Produits authentiques et de qualité</p>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="fas fa-headset text-white text-2xl"></i>
            </div>
            <h4 class="font-bold text-lg text-gray-800 mb-2">Support 24/7</h4>
            <p class="text-gray-600">Une équipe dédiée à votre service</p>
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
  animation: fadeIn 0.6s ease-out;
}

/* Hover effects avancés */
.group:hover .animate-bounce {
  animation: bounce 1s infinite;
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
</style>
