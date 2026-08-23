<template>
  <section class="relative my-16 bottom-16 bg-[#FBFBFA]">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-24 -right-24 w-96 h-96 bg-[#0F3D91]/10 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute -bottom-32 -left-32 w-80 h-80 bg-[#0F3D91]/10 rounded-full blur-3xl animate-pulse delay-1000"
      ></div>
      <div
        class="absolute top-1/2 left-1/3 w-64 h-64 bg-[#F4C542]/20 rounded-full blur-2xl animate-bounce-slow"
      ></div>
    </div>

    <div class="container relative z-10">
      <!-- Enhanced Header -->
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-[#0F3D91] text-[#F4C542] rounded-2xl mb-6 shadow-2xl animate-bounce-gentle"
        >
          <svg
            class="w-10 h-10 text-[#F4C542]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        </div>

        <h2
          class="text-4xl md:text-5xl font-display font-extrabold mb-4 text-[#0F3D91] animate-fade-in"
        >
          Promotions <span class="text-[#F4C542]">Limitées</span>
        </h2>

        <p
          class="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8"
        >
          Profitez de nos offres
          <span class="font-bold text-[#0F3D91]">exceptionnelles</span> avant
          qu'il ne soit trop tard !
        </p>

        <!-- Live Stats -->
      </div>

      <!-- Ultra Modern Promotions Grid -->
      <!-- Grille des cartes de promotion -->
      <div
        v-if="activePromotions.length > 0"
        class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
      >
        <!-- Boucle pour afficher chaque promotion -->
        <div
          v-for="(promo, index) in activePromotions"
          :key="promo.id"
          class="group relative bg-white rounded-3xl border-2 border-slate-200/80 shadow-soft p-8 hover:shadow-lift hover:border-[#0F3D91] transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
          :style="{ animationDelay: `${index * 200}ms` }"
        >
          <!-- Badge de réduction (coin supérieur droit) -->
          <div class="absolute -top-4 -right-4 z-20">
            <div class="relative">
              <!-- Cercle principal avec le pourcentage de réduction -->
              <div
                class="w-20 h-20 bg-[#F4C542] rounded-full flex items-center justify-center shadow-lg border-2 border-white"
              >
                <div class="text-slate-950 font-display font-extrabold text-base">
                  -{{ promo.discount }}%
                </div>
              </div>
            </div>
          </div>

          <!-- Badge "TENDANCE" (côté gauche, si la promotion est trending) -->
          <div
            v-if="promo.trending"
            class="absolute top-0 bottom-8 left-4 z-10"
          >
            <div
              class="bg-[#0F3D91] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center shadow-sm"
            >
              <!-- Icône de flamme pour "TENDANCE" -->
              <svg class="w-3 h-3 mr-1 text-[#F4C542]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                  clip-rule="evenodd"
                />
              </svg>
              TENDANCE
            </div>
          </div>

          <!-- Contenu principal de la carte -->
          <div class="relative z-10">
            <!-- En-tête avec titre et informations -->
            <div class="flex items-center mb-6">
              <div class="flex-1">
                <!-- Titre de la promotion -->
                <h3
                  class="text-2xl font-display font-extrabold text-[#0F3D91] mb-1 group-hover:text-[#0F3D91] transition-colors"
                >
                  {{ promo.title }}
                </h3>
                <!-- Tags et évaluation -->
                <div class="flex items-center space-x-2">
                  <!-- Badge de catégorie -->
                  <span
                    class="text-xs bg-[#0F3D91]/10 text-[#0F3D91] px-3 py-1 rounded-full font-bold uppercase tracking-wider"
                  >
                    {{ promo.category || "Offre spéciale" }}
                  </span>
                  <!-- Étoiles de notation (si disponible) -->
                  <div
                    class="flex items-center text-[#F4C542]"
                    v-if="promo.rating"
                  >
                    <svg
                      v-for="i in 5"
                      :key="i"
                      class="w-4 h-4"
                      :class="
                        i <= promo.rating ? 'text-[#F4C542]' : 'text-slate-300'
                      "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description et caractéristiques principales -->
            <div class="space-y-4 mb-6">
              <!-- Description de la promotion -->
              <p class="text-slate-600 text-base leading-relaxed">
                {{ promo.description }}
              </p>

              <!-- Liste des caractéristiques clés (si disponibles) -->
              <div class="grid grid-cols-2 gap-3" v-if="promo.features">
                <div
                  v-for="feature in promo.features"
                  :key="feature"
                  class="flex items-center text-xs font-semibold text-slate-700"
                >
                  <!-- Icône de validation -->
                  <svg
                    class="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ feature }}
                </div>
              </div>
            </div>

            <!-- Section des prix (si prix disponible) -->
            <div
              class="flex items-center justify-between mb-6"
              v-if="promo.originalPrice"
            >
              <div class="space-y-1">
                <!-- Prix barré et prix actuel -->
                <div class="flex items-center space-x-3">
                  <!-- Prix original barré -->
                  <span class="text-base text-slate-400 line-through font-semibold"
                    >{{ promo.originalPrice }} CFA</span
                  >
                  <!-- Prix promotionnel en grand -->
                  <span
                    class="text-3xl font-display font-extrabold text-[#0F3D91]"
                  >
                    {{
                      promo.currentPrice !== undefined ? promo.currentPrice : ""
                    }}
                    CFA
                  </span>
                </div>
                <!-- Montant économisé -->
                <div class="text-xs text-emerald-600 font-bold">
                  Économie:
                  <template
                    v-if="
                      promo.originalPrice !== undefined &&
                      promo.currentPrice !== undefined
                    "
                  >
                    {{ promo.originalPrice - promo.currentPrice }} CFA
                  </template>
                  <template v-else> — </template>
                </div>
              </div>
            </div>

            <!-- Section countdown (temps restant) -->
            <div
              class="bg-[#0F3D91]/5 rounded-2xl p-4 mb-6 border border-[#0F3D91]/10"
            >
              <!-- En-tête du countdown -->
              <div class="flex items-center mb-1">
                <!-- Icône d'horloge animée -->
                <svg
                  class="w-4 h-4 text-[#0F3D91] mr-2 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-xs font-bold text-[#0F3D91]"
                  >Offre limitée dans le temps</span
                >
              </div>
              <!-- Affichage du temps restant -->
              <div class="text-xs text-slate-600">
                <div class="font-bold text-[#0F3D91]">⏰ Rentrée scolaire</div>
                <div class="text-xs font-medium text-slate-500">
                  Expire dans {{ getTimeRemaining(promo.endDate) }}
                </div>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="space-y-3">
              <!-- Bouton principal "Profiter de l'offre" -->
              <button
                @click="handlePromoClick(promo)"
                class="group/btn w-full bg-[#0F3D91] hover:bg-[#0b2f70] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden flex items-center justify-center space-x-2"
              >
                <!-- Contenu du bouton -->
                <svg
                  class="w-5 h-5 text-[#F4C542]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Profiter de l'offre maintenant</span>
                <svg
                  class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
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
              </button>

              <!-- Bouton secondaire de partage -->
              <button
                @click="sharePromo(promo)"
                class="w-full bg-white border-2 border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl font-bold text-xs hover:border-[#0F3D91] hover:text-[#0F3D91] transition-colors flex items-center justify-center space-x-2"
              >
                <!-- Icône de partage -->
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                <span>Partager cette offre</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Message d'état vide (si aucune promotion) -->
      <div v-if="activePromotions.length === 0" class="text-center py-16">
        <div
          class="bg-white rounded-3xl p-12 shadow-soft border border-slate-200"
        >
          <div class="w-16 h-16 mx-auto mb-6 bg-[#0F3D91]/10 text-[#0F3D91] rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-display font-extrabold text-[#0F3D91] mb-4">
            Aucune promotion disponible
          </h3>
          <p class="text-base text-slate-600 max-w-2xl mx-auto">
            Revenez bientôt pour découvrir nos offres exceptionnelles !
          </p>
        </div>
      </div>

      <!-- Enhanced View All Section -->
      <div class="text-center relative my-16">
        <div
          class="relative bg-white rounded-3xl p-10 shadow-soft border border-slate-200/80"
        >
          <div class="mb-6">
            <h3 class="text-3xl font-display font-extrabold text-[#0F3D91] mb-3">
              Encore plus d'offres vous attendent !
            </h3>
            <p class="text-base text-slate-600 max-w-2xl mx-auto">
              Découvrez notre collection complète de promotions exclusives et d'offres limitées.
            </p>
          </div>

          <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <NuxtLink
              to="/promotions"
              class="group bg-[#0F3D91] text-white px-8 py-3.5 rounded-2xl font-bold text-base shadow-md hover:bg-[#0b2f70] transition-all transform hover:scale-105 flex items-center space-x-3"
            >
              <svg
                class="w-5 h-5 text-[#F4C542]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span>Voir toutes les promotions</span>
              <svg
                class="w-5 h-5 group-hover:translate-x-2 transition-transform"
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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { navigateTo } from "nuxt/app";
// AppCountdown remplacé par une fonction countdown simple

// Props
const props = defineProps<{
  promotions?: any[];
}>();

// Types
interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  endDate: Date | string;
  products: string[];
  type: "fixed" | "percentage" | "bogo";
  trending?: boolean;
  icon?: string;
  category?: string;
  rating?: number;
  features?: string[];
  originalPrice?: number;
  currentPrice?: number;
}

// Données de démonstration (remplace les stores et API calls)
const demoPromotions = ref([
  {
    id: "1",
    title: "Pack Rentrée CP - Offre Spéciale",
    description: "Tout le nécessaire pour une rentrée réussie en CP",
    discount: 25,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    products: ["Cahiers", "Crayons", "Gommes"],
    type: "percentage" as const,
    trending: true,
    icon: "🎒",
    category: "Rentrée",
    rating: 4.8,
    features: [
      "Matériel de qualité",
      "Livraison gratuite",
      "Garantie satisfaction",
    ],
    originalPrice: 15000,
    currentPrice: 11250,
  },
  {
    id: "2",
    title: "Pack Rentrée CE1 - Super Promo",
    description: "Équipement complet pour le CE1",
    discount: 30,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 jours
    products: ["Livres", "Fournitures", "Accessoires"],
    type: "percentage" as const,
    trending: false,
    icon: "📚",
    category: "Rentrée",
    rating: 4.9,
    features: ["Économies garanties", "Qualité premium", "Support client"],
    originalPrice: 20000,
    currentPrice: 14000,
  },
]);

// Utiliser uniquement les données de démonstration (version autonome)
const activePromotions = computed(() => {
  return demoPromotions.value;
});

// Computed properties pour les stats
const activePromosCount = computed(() => activePromotions.value.length);
const totalSavings = computed(() => {
  const savings = activePromotions.value.map((p) => p.discount);
  return savings.length
    ? Math.round(savings.reduce((a, b) => a + b, 0) / savings.length)
    : 0;
});

const averageRating = computed(() => 4.8);

// Méthodes
// Fonction countdown simple
const getTimeRemaining = (endDate: Date | string) => {
  if (typeof window === "undefined") return "Calcul...";

  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  const difference = end - now;

  if (difference < 0) return "Expiré";

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}j ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

function handlePromoClick(promo: any) {
  console.log("Promo clicked:", promo);

  // Vérification côté client
  if (typeof window === "undefined") return;

  // Si la promotion a un prix et peut être considérée comme un produit
  if (promo.currentPrice && promo.originalPrice) {
    // Créer un objet produit à partir de la promotion
    const productToAdd = {
      id: promo.id,
      name: promo.title,
      price: promo.currentPrice,
      originalPrice: promo.originalPrice,
      image: promo.image, // Image par défaut
      type: "promotion" as const,
      category: promo.category || "Promotion",
      description: promo.description,
      discount: promo.discount,
      features: promo.features || [],
    };

    // Ajouter au panier (version simplifiée)
    console.log("Ajout au panier:", productToAdd);
  } else {
    // Si la promotion n'est pas directement achetable, rediriger vers les produits liés
    if (promo.products && promo.products.length > 0) {
      // Rediriger vers le premier produit de la promotion
      navigateTo(`/products/${promo.products[0]}`);
      showNotification(`Redirection vers le produit...`, "success");
    } else {
      // Rediriger vers la page promotions pour plus de détails
      navigateTo("/promotions");
      showNotification(
        `Découvrez plus d'offres sur notre page promotions`,
        "success"
      );
    }
  }
}

// Fonction de partage
async function sharePromo(promo: any) {
  const shareData = {
    title: promo.title,
    text: `Découvrez cette offre exceptionnelle : ${promo.description}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      await navigator.clipboard.writeText(
        `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
      );
      showNotification("Lien copié dans le presse-papiers !", "success");
    }
  } catch (err) {
    console.error("Erreur lors du partage:", err);
    showNotification("Erreur lors du partage", "error");
  }
}

function showNotification(
  message: string,
  type: "success" | "error" = "success"
) {
  // Implémentation d'une notification toast moderne
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-2xl transition-all duration-300 transform translate-x-full`;
  notification.className +=
    type === "success" ? " bg-green-500 text-white" : " bg-red-500 text-white";

  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      <span class="font-medium">${message}</span>
    </div>
  `;

  document.body.appendChild(notification);

  // Animation d'entrée
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Animation de sortie et suppression
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
</script>

<style scoped>
/* Animations personnalisées */
@keyframes bounce-gentle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-bounce-gentle {
  animation: bounce-gentle 3s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 8s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 10s linear infinite;
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}

/* Ombres personnalisées */
.shadow-4xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .text-5xl {
    font-size: 2.5rem;
  }

  .text-6xl {
    font-size: 3rem;
  }
}

/* Hover effects pour les cards */
.group:hover .group-hover-animate-bounce {
  animation: bounce 1s infinite;
}

/* Effets de brillance */
.group-btn:hover::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.7s;
}
</style>
