<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 px-4"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header avec breadcrumb -->
      <div class="mb-12">
        <nav class="flex items-center space-x-2 text-sm text-slate-500 mb-6">
          <span>Accueil</span>
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Packs</span>
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
            <div v-if="pack?.isPromotion" class="absolute -top-4 -left-4 z-20">
              <div class="relative">
                <div
                  class="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-2xl shadow-xl transform -rotate-3"
                >
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="font-bold text-sm">PROMOTION</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Image principale -->
            <div
              class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 aspect-[4/3] shadow-2xl"
            >
              <transition name="image-fade" mode="out-in">
                <img
                  :key="pack?.image"
                  :src="pack?.image"
                  :alt="pack?.name"
                  class="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-110"
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
        </div>

        <!-- Informations produit -->
        <div class="lg:col-span-5 lg:pl-8">
          <div class="sticky top-8">
            <!-- En-tête -->
            <div class="mb-8">
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                >
                  Pack Éducatif
                </div>
                <div class="flex items-center gap-1">
                  <span class="text-sm text-slate-500">SKU:</span>
                  <span class="text-sm font-mono text-slate-600">{{
                    pack?.id
                  }}</span>
                </div>
              </div>

              <h1
                class="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6"
              >
                {{ pack?.name }}
              </h1>

              <p class="text-xl text-slate-600 leading-relaxed">
                {{ pack?.description }}
              </p>
            </div>

            <!-- Pricing -->
            <div
              class="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 mb-8"
            >
              <div class="flex items-end gap-4 mb-4">
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-bold text-slate-900">
                    {{ formatPrice(pack?.price ?? 0) }}
                  </span>
                  <span class="text-lg text-slate-500">TTC</span>
                </div>

                <div v-if="pack?.originalPrice" class="flex flex-col items-end">
                  <span class="text-sm text-slate-400 line-through">
                    {{ formatPrice(pack?.originalPrice ?? 0) }}
                  </span>
                  <span class="text-sm font-semibold text-red-600">
                    -{{
                      pack?.price && pack?.originalPrice
                        ? Math.round(
                            (1 - pack.price / pack.originalPrice) * 100
                          )
                        : 0
                    }}%
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2 text-sm text-slate-500">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Garantie satisfait ou remboursé 30 jours</span>
              </div>
            </div>

            <!-- Contenu du pack -->
            <div class="mb-8">
              <h3
                class="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3"
              >
                <div
                  class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                    />
                  </svg>
                </div>
                Contenu du pack
              </h3>

              <div class="space-y-4">
                <div
                  v-for="(item, index) in pack?.contents"
                  :key="index"
                  class="group flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-300"
                >
                  <div
                    class="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mt-0.5"
                  >
                    <svg
                      class="w-3.5 h-3.5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span
                    class="text-slate-700 font-medium group-hover:text-emerald-800 transition-colors"
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
                class="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <div class="relative flex items-center justify-center gap-3">
                  <CartIcon :size="20" />
                  <span class="text-lg">Ajouter au panier</span>
                </div>
              </button>

              <div class="grid grid-cols-2 gap-3">
                <button
                  class="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 font-medium rounded-xl transition-all duration-300 hover:bg-emerald-50"
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>Favoris</span>
                </button>

                <button
                  @click="sharePack"
                  class="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 font-medium rounded-xl transition-all duration-300 hover:bg-emerald-50"
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
            </div>

            <!-- Informations supplémentaires -->
            <div
              class="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200"
            >
              <h4 class="font-semibold text-slate-900 mb-4">Informations</h4>
              <div class="space-y-3 text-sm text-slate-600">
                <div class="flex items-center gap-3">
                  <svg
                    class="w-4 h-4 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>Livraison gratuite a partir de 5packs</span>
                </div>
                <div class="flex items-center gap-3">
                  <svg
                    class="w-4 h-4 text-emerald-600"
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
                    class="w-4 h-4 text-emerald-600"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import { useProductsStore } from "~/stores/products";
import { useAirtableStore } from "~/stores/airtable";
import { useCartStore } from "~/stores/cart";
import { useFormatter } from "~/composables/useFormatter";
import { useNotification } from "~/composables/useNotification";

const route = useRoute();
const productsStore = useProductsStore();
const airtableStore = useAirtableStore();
const cartStore = useCartStore();
const { formatPrice } = useFormatter();
const {
  success: showSuccess,
  error: showError,
  info: showInfo,
} = useNotification();

// Charger les données Airtable si pas encore fait
onMounted(async () => {
  console.log("🔄 Chargement des données pour la page pack détail...");

  if (airtableStore.packs.length === 0) {
    console.log("📡 Chargement des packs depuis Airtable...");
    await airtableStore.fetchPacks();
  }

  // Fallback sur les données locales si pas de données Airtable
  if (productsStore.packs.length === 0) {
    console.log("📦 Chargement des packs locaux...");
    productsStore.fetchProducts();
  }

  console.log("📊 Packs Airtable:", airtableStore.packs.length);
  console.log("📦 Packs locaux:", productsStore.packs.length);
});

// Chercher d'abord dans Airtable, puis dans le store local
const pack = computed(() => {
  const packId = route.params.id;
  console.log("🔍 Recherche du pack avec ID:", packId);

  // Essayer d'abord dans Airtable
  let foundPack = airtableStore.packs.find((p) => p.id === packId);
  console.log("📡 Pack trouvé dans Airtable:", !!foundPack);

  // Fallback sur les données locales
  if (!foundPack) {
    foundPack = productsStore.packs.find((p) => p.id === packId);
    console.log("📦 Pack trouvé dans store local:", !!foundPack);
  }

  if (!foundPack) {
    console.warn("⚠️  Aucun pack trouvé avec l'ID:", packId);
    console.log(
      "Available Airtable pack IDs:",
      airtableStore.packs.map((p) => p.id)
    );
    console.log(
      "Available local pack IDs:",
      productsStore.packs.map((p) => p.id)
    );
  }

  return foundPack;
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
  title: pack.value ? `${pack.value.name} - EduShop` : "Pack - EduShop",
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
