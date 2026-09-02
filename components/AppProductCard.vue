<template>
  <article
    class="group bg-white rounded-3xl border-2 border-slate-200/90 hover:border-[#0F3D91] overflow-hidden shadow-soft hover:shadow-lift transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between h-full"
  >
    <!-- Promotion Badge -->
    <div v-if="product.isPromotion" class="absolute top-3 right-3 z-10">
      <span class="bg-[#F4C542] text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
        -{{ discountPercentage }}%
      </span>
    </div>

    <!-- Image Container (Full-bleed) -->
    <NuxtLink :to="`/products/${product.id}`" class="relative aspect-[4/3] overflow-hidden bg-[#F7F5EF] block cursor-pointer">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </NuxtLink>

    <!-- Content -->
    <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0F3D91]/10 text-[#0F3D91]">
            {{ product.category }}
          </span>
          <div class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-[#F4C542]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span class="text-xs font-bold text-slate-700">4.8</span>
          </div>
        </div>

        <NuxtLink :to="`/products/${product.id}`" class="block">
          <h3 class="font-display text-lg font-extrabold text-[#0F3D91] leading-tight line-clamp-2">
            {{ product.name }}
          </h3>
        </NuxtLink>
        <p class="text-slate-600 text-xs line-clamp-2 leading-relaxed font-medium">
          {{ product.description }}
        </p>
      </div>

      <!-- Pricing & Actions -->
      <div class="space-y-3 pt-3 border-t border-slate-100">
        <div class="flex items-center justify-between">
          <span class="font-display text-xl font-extrabold text-[#0F3D91]">
            {{ formatPrice(product.price) }}
          </span>
          <span v-if="product.originalPrice" class="text-xs text-slate-400 line-through">
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex items-center bg-slate-100 rounded-full border border-slate-200 p-1">
            <button
              @click="decreaseQuantity"
              :disabled="quantity <= 1"
              class="w-6 h-6 rounded-full flex items-center justify-center text-slate-700 font-bold hover:bg-white text-xs"
            >
              -
            </button>
            <span class="px-2 text-xs font-bold text-slate-900">{{ quantity }}</span>
            <button
              @click="increaseQuantity"
              class="w-6 h-6 rounded-full flex items-center justify-center text-slate-700 font-bold hover:bg-white text-xs"
            >
              +
            </button>
          </div>

          <button
            @click="onAddToCartClick"
            :disabled="!product.inStock || isLoading"
            class="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-bold text-xs py-2.5 rounded-full shadow-sm hover:shadow transition-all transform hover:scale-105 active:scale-95"
          >
            <ShoppingCartIcon :width="14" :height="14" fill="currentColor" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCartStore } from "~/stores/cart";
import type { Product } from "~/stores/products";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon.vue";

interface Props {
  product: Product;
}

const props = defineProps<Props>();
const cartStore = useCartStore();

const quantity = ref(1);
const isLoading = ref(false);

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

const { formatPrice } = useFormatter();

const increaseQuantity = () => quantity.value++;
const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

const onAddToCartClick = () => {
  if (!props.product.inStock || isLoading.value) return;

  isLoading.value = true;
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
    quantity.value
  );
  setTimeout(() => {
    isLoading.value = false;
    quantity.value = 1;
  }, 300);
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
