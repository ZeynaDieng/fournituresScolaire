<template>
  <NuxtLink :to="`/packs/${pack.id}`" class="block group">
    <article
      class="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border border-slate-100"
    >
      <!-- Background Gradient Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      ></div>

      <!-- Promotion Badge -->
      <div v-if="pack.isPromotion" class="absolute top-4 left-4 z-20">
        <div class="relative">
          <div
            class="bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-300"
          >
            <div class="flex items-center gap-2">
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
              <span>PROMO</span>
            </div>
          </div>
          <!-- Badge shadow effect -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-full blur-md opacity-50 -z-10 animate-pulse"
          ></div>
        </div>
      </div>

      <!-- Rating Badge -->
      <div class="absolute top-4 right-4 z-20">
        <div
          class="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-white/20"
        >
          <div class="flex items-center gap-1.5">
            <svg
              class="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
            <span class="text-sm font-semibold text-slate-700">4.9</span>
          </div>
        </div>
      </div>

      <!-- Image Container -->
      <div
        class="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 aspect-[4/3]"
      >
        <img
          :src="pack.image"
          :alt="pack.name"
          class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          loading="lazy"
        />

        <!-- Image Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>

        <!-- Quick Actions -->
        <div
          class="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
        >
          <button
            class="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
            @click.prevent="toggleFavorite"
          >
            <svg
              class="w-5 h-5 text-slate-600 hover:text-red-500 transition-colors"
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
          </button>
          <button
            class="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
            @click.prevent="quickView"
          >
            <svg
              class="w-5 h-5 text-slate-600 hover:text-emerald-600 transition-colors"
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
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-4 relative z-10">
        <!-- Category & Level -->
        <div class="flex items-center justify-between">
          <span
            class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
          >
            {{ pack.level || "Pack Éducatif" }}
          </span>
          <div class="flex items-center gap-1 text-xs text-slate-500">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span>En stock</span>
          </div>
        </div>

        <!-- Title -->
        <div>
          <h3
            class="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-300 line-clamp-2 leading-tight"
          >
            {{ pack.name }}
          </h3>
          <p class="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed">
            {{ pack.description }}
          </p>
        </div>

        <!-- Features Preview -->
        <div
          v-if="pack.contents && pack.contents.length > 0"
          class="flex flex-wrap gap-1"
        >
          <span
            v-for="(item, index) in pack.contents.slice(0, 3)"
            :key="index"
            class="inline-flex items-center px-2 py-1 rounded-md text-xs bg-slate-100 text-slate-700"
          >
            {{ item.substring(0, 15) }}{{ item.length > 15 ? "..." : "" }}
          </span>
          <span
            v-if="pack.contents.length > 3"
            class="inline-flex items-center px-2 py-1 rounded-md text-xs bg-slate-200 text-slate-600 font-medium"
          >
            +{{ pack.contents.length - 3 }}
          </span>
        </div>

        <!-- Pricing -->
        <div class="flex items-center justify-between pt-2">
          <div class="flex items-end gap-2">
            <span
              class="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors"
            >
              {{ formatPrice(pack.price) }}
            </span>
            <div v-if="pack.originalPrice" class="flex flex-col items-start">
              <span class="text-sm text-slate-400 line-through leading-none">
                {{ formatPrice(pack.originalPrice) }}
              </span>
              <span class="text-xs font-semibold text-red-600 leading-none">
                -{{ Math.round((1 - pack.price / pack.originalPrice) * 100) }}%
              </span>
            </div>
          </div>

          <!-- Quick Add Button -->
          <button
            @click.prevent="addToCart"
            class="group/btn relative overflow-hidden bg-green-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="relative flex items-center gap-2">
              <ShoppingCartIcon
                :width="16"
                :height="16"
                class="transition-transform group-hover/btn:scale-110"
                fill="currentColor"
              />
              <span class="text-sm">Ajouter</span>
            </div>
          </button>
        </div>

        <!-- Progress Indicator -->
        <div class="pt-2">
          <div
            class="flex items-center justify-between text-xs text-slate-500 mb-1"
          >
            <span>Popularité</span>
            <span>85%</span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-1.5">
            <div
              class="bg-green-600 h-1.5 rounded-full transition-all duration-1000 group-hover:w-[85%]"
              style="width: 75%"
            ></div>
          </div>
        </div>
      </div>

      <!-- Shine Effect -->
      <div
        class="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[400%] transition-transform duration-1000 ease-out"
      ></div>
    </article>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useFormatter } from "~/composables/useFormatter";
import type { Pack } from "~/stores/products";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon.vue";

const props = defineProps<{
  pack: Pack;
}>();

const emit = defineEmits<{
  "add-to-cart": [pack: Pack];
  "toggle-favorite": [pack: Pack];
  "quick-view": [pack: Pack];
}>();

const { formatPrice } = useFormatter();

function addToCart() {
  emit("add-to-cart", props.pack);
}

function toggleFavorite() {
  emit("toggle-favorite", props.pack);
}

function quickView() {
  emit("quick-view", props.pack);
}
</script>

<style scoped>
/* Animations personnalisées */
@keyframes shimmer {
  0% {
    transform: translateX(-100%) skewX(-12deg);
  }
  100% {
    transform: translateX(400%) skewX(-12deg);
  }
}

.group:hover .animate-shimmer {
  animation: shimmer 1s ease-out;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Gradient animation */
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
  background: linear-gradient(-45deg, #059669, #047857, #065f46);
  background-size: 300% 300%;
  animation: gradient-shift 3s ease infinite;
}

/* Hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:rotate-1 {
  transform: rotate(1deg) scale(1.1);
}

/* Focus states */
button:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

a:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
  border-radius: 1.5rem;
}

/* Smooth transitions */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Loading state for images */
img {
  background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .aspect-\[4\/3\] {
    aspect-ratio: 1;
  }

  .p-6 {
    padding: 1rem;
  }

  .text-2xl {
    font-size: 1.5rem;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .group:hover .group-hover\:scale-110,
  .group:hover .group-hover\:rotate-1,
  .transform,
  .transition-all {
    transform: none !important;
    transition: none !important;
  }

  .animate-pulse,
  .animate-shimmer {
    animation: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-white {
    border: 2px solid #000;
  }

  .text-slate-600 {
    color: #000;
  }

  .bg-gradient-to-r {
    background: #000 !important;
  }
}
</style>
