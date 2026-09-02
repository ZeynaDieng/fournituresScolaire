<template>
  <div
    class="min-h-screen bg-[#FBFBFA] py-12 px-4"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header avec breadcrumb -->
      <div class="mb-12">
        <nav class="flex items-center space-x-2 text-sm text-slate-500 mb-6 font-medium">
          <NuxtLink to="/" class="hover:text-[#0F3D91] transition-colors">Accueil</NuxtLink>
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <NuxtLink to="/packs" class="hover:text-[#0F3D91] transition-colors">Packs</NuxtLink>
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-slate-900 font-medium">{{ pack?.name }}</span>
        </nav>
      </div>

      <!-- Contenu principal -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <!-- Galerie d'images -->
        <div class="lg:col-span-7">
          <div class="relative">
            <!-- Badge promo -->
            <div v-if="pack?.isPromotion" class="absolute top-4 left-4 z-20">
              <span class="bg-[#F4C542] text-slate-950 font-extrabold text-xs px-4 py-2 rounded-full shadow-md">
                PROMOTION
              </span>
            </div>

            <!-- Image principale (Full-bleed) -->
            <div
              class="group relative overflow-hidden rounded-3xl bg-[#F8F6F0] aspect-[4/3] shadow-sm border border-slate-200/80"
            >
              <transition name="image-fade" mode="out-in">
                <div
                  v-if="!pack?.image && !imageError"
                  class="w-full h-full flex items-center justify-center bg-slate-200"
                >
                  <svg
                    class="w-24 h-24 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>

                <img
                  v-else
                  :key="pack?.image"
                  :src="pack?.image"
                  :alt="pack?.name || 'Pack éducatif'"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  @error="handleImageError"
                  @load="
                    console.log('✅ Image chargée avec succès:', pack?.image)
                  "
                />
              </transition>

              <!-- Overlay gradient -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              ></div>
            </div>

            <!-- Indicateurs de qualité -->
            <div class="absolute bottom-6 left-6 flex gap-3">
              <div
                class="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  ></div>
                  <span class="text-sm font-medium text-slate-700"
                    >Qualité Premium</span
                  >
                </div>
              </div>
              <div
                class="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
              >
                <div class="flex items-center gap-2">
                  <svg
                    class="w-4 h-4 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <span class="text-sm font-medium text-slate-700">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 mt-4 gap-3">
            <button
              @click="sharePack"
              class="flex items-center justify-center gap-2 py-3.5 px-4 border-2 shadow-xs border-slate-200 hover:border-[#0F3D91] text-slate-700 hover:text-[#0F3D91] font-bold text-sm rounded-full transition-all hover:bg-[#0F3D91]/5 cursor-pointer"
            >
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              <span>Partager</span>
            </button>
          </div>
          <!-- Informations supplémentaires -->
          <div class="mt-8 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <h4 class="font-bold text-slate-900 mb-4">Informations</h4>
            <div class="space-y-3 text-sm text-slate-600 font-medium">
              <div class="flex items-center gap-3">
                <svg
                  class="w-4 h-4 text-[#0F3D91]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Livraison gratuite à partir de 5 packs</span>
              </div>
              <div class="flex items-center gap-3">
                <svg
                  class="w-4 h-4 text-[#0F3D91]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Expédition sous 24-48h</span>
              </div>
              <div class="flex items-center gap-3">
                <svg
                  class="w-4 h-4 text-[#0F3D91]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Support client 7j/7</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations produit -->
        <div class="lg:col-span-5 lg:pl-8">
          <div class="sticky top-8">
              <!-- En-tête -->
              <div class="mb-8">
                <h1
                  class="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F3D91] leading-tight mb-4"
                >
                  {{ pack?.name }}
                </h1>

              <p class="text-xl text-slate-600 leading-relaxed">
                {{ pack?.description }}
              </p>
                     <!-- Pricing -->
            <div
              class="bg-white border-2 border-slate-200/80 rounded-3xl p-6 mb-8 shadow-xs space-y-4"
            >
              <div class="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span class="font-display text-3xl sm:text-4xl font-extrabold text-[#0F3D91] tracking-tight">
                  {{ formatPrice(pack?.price ?? 0) }}
                </span>
                
                <span v-if="pack?.originalPrice" class="text-lg text-slate-400 line-through font-semibold">
                  {{ formatPrice(pack?.originalPrice ?? 0) }}
                </span>

                <span v-if="pack?.originalPrice" class="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100/80">
                  -{{
                    pack?.price && pack?.originalPrice
                      ? Math.round((1 - pack.price / pack.originalPrice) * 100)
                      : 0
                  }}% DE RÉDUCTION
                </span>
              </div>

              <div class="flex items-center justify-between text-xs pt-3 border-t border-slate-100 font-semibold text-slate-600">
                <span>Livraison rapide à Dakar & régions</span>
                <span class="text-emerald-700 font-bold flex items-center gap-1.5">
                  <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  En stock
                </span>
              </div>
            </div>      </div>

            <!-- Contenu du pack -->
            <div class="mb-8">
              <h3
                class="font-display text-xl sm:text-2xl font-extrabold text-[#0F3D91] mb-6"
              >
                Contenu du pack
              </h3>

              <div class="space-y-4">
                <div
                  v-for="(item, index) in pack?.contents"
                  :key="index"
                  class="group flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-[#0F3D91]/30 bg-white transition-all duration-300"
                >
                  <div
                    class="flex-shrink-0 w-6 h-6 bg-[#0F3D91] text-white rounded-full flex items-center justify-center mt-0.5 font-bold text-xs shadow-xs"
                  >
                    ✓
                  </div>
                  <span
                    class="text-slate-700 font-medium group-hover:text-[#0F3D91] transition-colors"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="space-y-4">
              <button
                @click="addToCart(pack)"
                class="w-full bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-bold text-base py-4 px-6 rounded-full shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <span>Ajouter ce pack au panier</span>
              </button>
            </div>

            <!-- Informations supplémentaires -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "#imports";

import { useAirtableStore } from "~/stores/airtable";
import { useCartStore } from "~/stores/cart";
import { useFormatter } from "~/composables/useFormatter";
import { useNotification } from "~/composables/useNotification";


const route = useRoute();
const airtableStore = useAirtableStore();
const cartStore = useCartStore();

const { formatPrice } = useFormatter();
const {
  success: showSuccess,
  error: showError,
  info: showInfo,
} = useNotification();

// État pour gérer les erreurs d'images
const imageError = ref(false);

// Gestion des erreurs d'images
const handleImageError = (event: Event) => {
  console.log("❌ Erreur de chargement d'image pour:", pack.value?.image);
  imageError.value = true;

  // Optionnel : remplacer par une image par défaut
};

// État pour stocker le pack
const pack = ref<any>(null);

// Charger les données au montage du composant

onMounted(async () => {
  try {
    const packId = route.params.id as string;
    console.log("🔄 Chargement du pack via Smart Cache:", packId);

    const foundPack = await airtableStore.fetchPackById(packId);

    if (foundPack) {
      pack.value = foundPack;
      console.log(`✅ Pack récupéré:`, pack.value.name);
    } else {
      console.error("❌ Pack introuvable");
      pack.value = null;
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement du pack:", error);
    pack.value = null;
  }
});


function addToCart(pack: any) {
  if (!pack) return;
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

  showSuccess(`${pack.name} a été ajouté à votre panier`);
}

const sharePack = async () => {
  const shareData = {
    title: pack.value?.name || "Pack Éducatif",
    text: `Découvrez ce pack éducatif: ${pack.value?.name || ""}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      showInfo("Le lien a été copié dans le presse-papier");
    }
  } catch (err) {
    console.error("Error sharing:", err);
  }
};

useHead({
  title: computed(() => (pack.value ? `${pack.value.name} - EduShop` : "Pack Éducatif - EduShop")),
  meta: [
    { name: "description", content: computed(() => pack.value?.description || "Pack scolaire complet au meilleur prix au Sénégal.") },
    { property: "og:title", content: computed(() => (pack.value ? `${pack.value.name} | EduShop Sénégal` : "Pack Éducatif EduShop")) },
    { property: "og:description", content: computed(() => pack.value?.description || "Découvrez nos packs scolaires complets pour une rentrée réussie.") },
    { property: "og:image", content: computed(() => pack.value?.image || "https://www.e-du.shop/og-image.jpg") },
    { property: "og:type", content: "product" },
  ],
});
</script>


<style scoped>
.image-fade-enter-active,
.image-fade-leave-active {
  transition: opacity 0.7s ease-in-out;
}

.image-fade-enter-from,
.image-fade-leave-to {
  opacity: 0;
}

/* Animation pour les éléments de contenu */
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

.animate-slide-in-up {
  animation: slideInUp 0.6s ease-out;
}

/* Effet de hover sur les cartes */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Gradient animé pour le bouton principal */
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.bg-gradient-animated {
  background: linear-gradient(-45deg, #059669, #047857, #065f46, #064e3b);
  background-size: 400% 400%;
  animation: gradient-shift 3s ease infinite;
}
</style>
