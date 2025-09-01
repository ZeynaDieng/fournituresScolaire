<!-- ProductCard.vue -->
<template>
  <article
    class="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border border-slate-100 overflow-hidden"
  >
    <!-- Background Animation -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
    ></div>

    <!-- Promotion Badge -->
    <div v-if="product.isPromotion" class="absolute top-4 right-4 z-30">
      <div class="relative">
        <div
          class="bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold px-3 py-2 rounded-2xl shadow-xl transform rotate-3 group-hover:rotate-0 transition-transform duration-300"
        >
          <div class="flex items-center gap-1.5">
            <svg
              class="w-4 h-4 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clip-rule="evenodd"
              />
            </svg>
            <span>-{{ discountPercentage }}%</span>
          </div>
        </div>
        <div
          class="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl blur-lg opacity-40 -z-10 animate-pulse"
        ></div>
      </div>
    </div>

    <!-- Wishlist Button -->
    <div class="absolute top-4 left-4 z-30">
      <button
        @click.stop="toggleWishlist"
        class="group/heart w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 hover:bg-white hover:shadow-xl"
        :class="{
          'text-red-500 bg-red-50 opacity-100 scale-100': isWishlisted,
          'text-slate-400': !isWishlisted,
        }"
      >
        <svg
          class="w-5 h-5 transition-transform group-hover/heart:scale-110"
          :fill="isWishlisted ? 'currentColor' : 'none'"
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
      </button>
    </div>

    <!-- Stock Badge -->
    <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
      <div
        class="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-white/20"
      >
        <div class="flex items-center gap-1.5">
          <div
            :class="{
              'w-2 h-2 bg-green-500 rounded-full animate-pulse':
                product.inStock,
              'w-2 h-2 bg-red-500 rounded-full': !product.inStock,
            }"
          ></div>
          <span
            class="text-xs font-semibold"
            :class="{
              'text-green-700': product.inStock,
              'text-red-700': !product.inStock,
            }"
          >
            {{ product.inStock ? "En stock" : "Rupture" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Image Container -->
    <div
      class="relative h-56 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-3xl"
    >
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover p-4 transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        loading="lazy"
      />

      <!-- Image Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      ></div>

      <!-- Quick Actions Overlay -->
      <div
        class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
      >
        <div
          class="flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
        >
          <button
            @click.stop="quickAddToCart"
            :disabled="!product.inStock || isLoading"
            class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            <div v-if="!isLoading" class="flex items-center gap-2">
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"
                />
              </svg>
              <span>Ajout rapide</span>
            </div>
            <div v-else class="flex items-center gap-2">
              <div
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              <span>Ajout...</span>
            </div>
          </button>

          <NuxtLink
            :to="`/products/${product.id}`"
            class="bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-700 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            @click.stop
          >
            <div class="flex items-center gap-2">
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>Voir</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 space-y-4 relative z-10">
      <!-- Category & Reviews -->
      <div class="flex items-center justify-between">
        <span
          class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"
        >
          {{ product.category }}
        </span>
        <div class="flex items-center gap-1">
          <div class="flex items-center gap-0.5">
            <svg
              v-for="i in 5"
              :key="i"
              class="w-3 h-3"
              :class="i <= 4 ? 'text-yellow-400' : 'text-slate-200'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </div>
          <span class="text-xs text-slate-500 font-medium">(4.8)</span>
        </div>
      </div>

      <!-- Title & Description -->
      <div>
        <NuxtLink :to="`/products/${product.id}`" class="block group/title">
          <h3
            class="text-xl font-bold text-slate-900 group-hover/title:text-emerald-700 transition-colors duration-300 line-clamp-2 leading-tight mb-2"
          >
            {{ product.name }}
          </h3>
        </NuxtLink>
        <p class="text-slate-600 text-sm line-clamp-2 leading-relaxed">
          {{ product.description }}
        </p>
      </div>

      <!-- Pricing -->
      <div
        class="bg-gradient-to-r from-slate-50 to-emerald-50/50 rounded-2xl p-4"
      >
        <div class="flex items-end justify-between">
          <div class="flex items-end gap-2">
            <span
              class="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors"
            >
              {{ formatPrice(product.price) }}
            </span>
            <div v-if="product.originalPrice" class="flex flex-col">
              <span class="text-sm text-slate-400 line-through leading-none">
                {{ formatPrice(product.originalPrice) }}
              </span>
              <span class="text-xs font-semibold text-red-600 leading-none">
                Économie:
                {{ formatPrice(product.originalPrice - product.price) }}
              </span>
            </div>
          </div>
          <div class="text-xs text-slate-500">/pièce</div>
        </div>
      </div>

      <!-- Quantity & Add to Cart -->
      <div class="space-y-4">
        <!-- Quantity Selector -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-slate-700">Quantité</span>
          <div
            class="flex items-center bg-slate-100 rounded-xl overflow-hidden"
          >
            <button
              @click="decreaseQuantity"
              :disabled="quantity <= 1"
              class="p-2.5 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
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
                  d="M20 12H4"
                />
              </svg>
            </button>

            <span
              class="px-4 py-2.5 font-semibold text-slate-900 min-w-[3rem] text-center bg-white"
            >
              {{ quantity }}
            </span>

            <button
              @click="increaseQuantity"
              :disabled="quantity >= maxQuantity"
              class="p-2.5 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Add to Cart Button -->
        <button
          @click="onAddToCartClick"
          :disabled="!product.inStock || isLoading"
          class="w-full group/btn relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
          ></div>
          <div class="relative flex items-center justify-center gap-3">
            <div v-if="!isLoading" class="flex items-center gap-3">
              <svg
                class="w-5 h-5 transition-transform group-hover/btn:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"
                />
              </svg>
              <span class="text-lg">Ajouter au panier</span>
            </div>
            <div v-else class="flex items-center gap-3">
              <div
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              <span class="text-lg">Ajout en cours...</span>
            </div>
          </div>
        </button>
      </div>

      <!-- Bulk Options -->
      <div v-if="bulkOptions.length > 0" class="pt-4 border-t border-slate-200">
        <div class="flex items-center gap-2 mb-3">
          <svg
            class="w-4 h-4 text-emerald-600"
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
          <span class="text-sm font-medium text-slate-700"
            >Tarifs dégressifs</span
          >
        </div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="option in bulkOptions"
            :key="option.quantity"
            @click="selectBulkOption(option)"
            class="group/bulk p-3 border-2 border-slate-200 hover:border-emerald-300 text-center rounded-xl transition-all duration-300 hover:bg-emerald-50"
            :class="{
              'border-emerald-500 bg-emerald-50': quantity === option.quantity,
            }"
          >
            <div
              class="text-lg font-bold text-slate-900 group-hover/bulk:text-emerald-700"
            >
              {{ option.quantity }}x
            </div>
            <div class="text-xs text-emerald-600 font-semibold">
              {{ formatPrice(option.unitPrice) }}
            </div>
            <div class="text-xs text-slate-500">-{{ option.discount }}%</div>
          </button>
        </div>
      </div>
    </div>

    <!-- Countdown Timer -->
    <div
      v-if="product.isPromotion && product.promotionEndDate"
      class="px-6 pb-6"
    >
      <AppCountdown
        :end-date="product.promotionEndDate"
        class="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl"
        size="small"
      />
    </div>

    <!-- Shine Effect -->
    <div
      class="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[400%] transition-transform duration-1000 ease-out"
    ></div>
  </article>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import type { Product } from "~/stores/products";

interface Props {
  product: Product;
  showBulkOptions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showBulkOptions: true,
});

const cartStore = useCartStore();

// State
const quantity = ref(1);
const isLoading = ref(false);
const isWishlisted = ref(false);
const maxQuantity = ref(50);

// Computed
const discountPercentage = computed(() => {
  if (props.product.originalPrice && props.product.price) {
    return Math.round(
      ((props.product.originalPrice - props.product.price) /
        props.product.originalPrice) *
        100
    );
  }
  return 0;
});

const bulkOptions = computed(() => {
  if (!props.showBulkOptions) return [];

  const options: { quantity: number; unitPrice: number; discount: number }[] =
    [];

  switch (props.product.category.toLowerCase()) {
    case "cahiers":
      options.push(
        { quantity: 5, unitPrice: props.product.price * 0.95, discount: 5 },
        { quantity: 10, unitPrice: props.product.price * 0.9, discount: 10 },
        { quantity: 20, unitPrice: props.product.price * 0.85, discount: 15 }
      );
      break;
    case "stylos":
      options.push(
        { quantity: 5, unitPrice: props.product.price * 0.9, discount: 10 },
        { quantity: 10, unitPrice: props.product.price * 0.8, discount: 20 }
      );
      break;
    default:
      if (props.product.price < 1000) {
        options.push(
          { quantity: 3, unitPrice: props.product.price * 0.95, discount: 5 },
          { quantity: 5, unitPrice: props.product.price * 0.9, discount: 10 }
        );
      }
  }

  return options;
});

const { formatPrice } = useFormatter();

// Methods
const increaseQuantity = () => {
  if (quantity.value < maxQuantity.value) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const quickAddToCart = async () => {
  await addToCart(1);
};

const addToCart = async (customQuantity?: number) => {
  if (!props.product.inStock || isLoading.value) return;

  isLoading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    cartStore.addItem(
      {
        id: props.product.id,
        name: props.product.name,
        price: props.product.price,
        image: props.product.image,
        type: "product",
        category: props.product.category,
        description: props.product.description,
      },
      customQuantity || quantity.value
    );
    if (!customQuantity) {
      quantity.value = 1;
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
  } finally {
    isLoading.value = false;
  }
};

// Fix: Vue expects a click handler with (event: MouseEvent) => void
const onAddToCartClick = (event: MouseEvent) => {
  addToCart();
};

const selectBulkOption = (option: { quantity: number; unitPrice: number }) => {
  quantity.value = option.quantity;
};

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value;

  if (process.client) {
    const wishlist = JSON.parse(
      localStorage.getItem("eduShopWishlist") || "[]"
    );
    if (isWishlisted.value) {
      wishlist.push(props.product.id);
    } else {
      const index = wishlist.indexOf(props.product.id);
      if (index > -1) wishlist.splice(index, 1);
    }
    localStorage.setItem("eduShopWishlist", JSON.stringify(wishlist));
  }
};

onMounted(() => {
  if (process.client) {
    const wishlist = JSON.parse(
      localStorage.getItem("eduShopWishlist") || "[]"
    );
    isWishlisted.value = wishlist.includes(props.product.id);
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Focus states */
button:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .h-56 {
    height: 12rem;
  }

  .p-6 {
    padding: 1rem;
  }

  .text-2xl {
    font-size: 1.5rem;
  }

  .grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .group:hover .group-hover\:scale-110,
  .group:hover .group-hover\:rotate-1,
  .transform,
  .transition-all {
    transform: none !important;
    transition: none !important;
  }

  .animate-pulse,
  .animate-spin {
    animation: none !important;
  }
}
</style>
