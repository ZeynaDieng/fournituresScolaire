<template>
  <NuxtLink :to="`/packs/${pack.id}`" class="block group h-full">
    <article
      class="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-[#0F3D91] overflow-hidden shadow-soft hover:shadow-lift transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col h-full justify-between isolate"
      style="-webkit-mask-image: -webkit-radial-gradient(white, black);"
    >
      <!-- Promotion & Level Badges & Image (Full-bleed) -->
      <div class="relative overflow-hidden bg-[#F7F5EF] aspect-[4/3] w-full block">
        <img
          :src="pack.image"
          :alt="pack.name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div v-if="pack.isPromotion" class="absolute top-3 left-3 z-10">
          <span class="bg-[#F4C542] text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
            PROMO
          </span>
        </div>

        <div class="absolute top-3 right-3 z-10">
          <span class="bg-[#0F3D91] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {{ pack.level || "Pack" }}
          </span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <h3 class="font-display text-lg sm:text-xl font-extrabold text-[#0F3D91] leading-tight line-clamp-2 break-words">
            {{ pack.name }}
          </h3>
          <p class="text-slate-600 text-xs leading-relaxed line-clamp-2 font-medium">
            {{ pack.description }}
          </p>
        </div>

        <!-- Contents tags -->
        <div v-if="pack.contents && pack.contents.length > 0" class="flex flex-wrap gap-1.5 pt-1">
          <span
            v-for="(item, index) in pack.contents.slice(0, 2)"
            :key="index"
            class="px-2.5 py-1 rounded-lg text-[11px] bg-slate-100 text-slate-700 font-semibold"
          >
            {{ item.substring(0, 20) }}
          </span>
          <span v-if="pack.contents.length > 2" class="px-2 py-1 rounded-lg text-[11px] bg-slate-200 text-slate-800 font-bold">
            +{{ pack.contents.length - 2 }}
          </span>
        </div>

        <!-- Footer Pricing & CTA -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
          <div>
            <span class="font-display text-lg sm:text-xl font-extrabold text-[#0F3D91]">
              {{ formatPrice(pack.price) }}
            </span>
            <span v-if="pack.originalPrice" class="text-xs text-slate-400 line-through block text-[11px]">
              {{ formatPrice(pack.originalPrice) }}
            </span>
          </div>

          <button
            @click.prevent="addToCart"
            class="inline-flex items-center gap-1.5 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-bold text-xs px-4 py-2.5 rounded-full transition-all shadow-sm transform hover:scale-105 active:scale-95 shrink-0"
          >
            <ShoppingCartIcon :width="14" :height="14" fill="currentColor" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </article>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useFormatter } from "~/composables/useFormatter";
import type { Pack } from "~/stores/products";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon.vue";

const props = defineProps<{ pack: Pack }>();
const emit = defineEmits<{ "add-to-cart": [pack: Pack] }>();
const { formatPrice } = useFormatter();

function addToCart() {
  emit("add-to-cart", props.pack);
}
</script>
