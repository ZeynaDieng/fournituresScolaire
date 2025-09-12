<template>
  <div class="space-y-4">
    <div
      v-if="!data || data.length === 0"
      class="text-center py-8 text-gray-500"
    >
      <svg
        class="w-12 h-12 mx-auto mb-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
      <p>Aucun produit vendu</p>
    </div>
    <div v-else>
      <div
        v-for="(product, index) in data.slice(0, 8)"
        :key="product.name"
        class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
      >
        <div class="flex items-center flex-1">
          <!-- Rank -->
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3"
            :class="getRankColor(index)"
          >
            {{ index + 1 }}
          </div>

          <!-- Product info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ product.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ product.quantity }} unité{{
                product.quantity > 1 ? "s" : ""
              }}
              vendue{{ product.quantity > 1 ? "s" : "" }}
            </p>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="flex items-center ml-4">
          <div class="w-20 bg-gray-200 rounded-full h-2 mr-3">
            <div
              class="h-2 rounded-full transition-all duration-300"
              :class="getProgressColor(index)"
              :style="{ width: `${getProgressWidth(product.quantity)}%` }"
            ></div>
          </div>
          <span class="text-sm font-medium text-gray-900 w-12 text-right">
            {{ product.quantity }}
          </span>
        </div>
      </div>

      <!-- Show more button if there are more products -->
      <div v-if="data.length > 8" class="mt-4 text-center">
        <button
          class="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Voir tous les produits ({{ data.length }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface ProductData {
  name: string;
  quantity: number;
}

interface Props {
  data: ProductData[];
}

const props = defineProps<Props>();

const maxQuantity = computed(() => {
  if (!props.data || props.data.length === 0) return 1;
  return Math.max(...props.data.map((p) => p.quantity));
});

const getProgressWidth = (quantity: number): number => {
  return (quantity / maxQuantity.value) * 100;
};

const getRankColor = (index: number): string => {
  const colors = [
    "bg-yellow-100 text-yellow-800", // 1st
    "bg-gray-100 text-gray-800", // 2nd
    "bg-orange-100 text-orange-800", // 3rd
    "bg-blue-100 text-blue-800", // 4th
    "bg-green-100 text-green-800", // 5th
    "bg-purple-100 text-purple-800", // 6th
    "bg-pink-100 text-pink-800", // 7th
    "bg-indigo-100 text-indigo-800", // 8th
  ];
  return colors[index] || "bg-gray-100 text-gray-800";
};

const getProgressColor = (index: number): string => {
  const colors = [
    "bg-yellow-500", // 1st
    "bg-gray-500", // 2nd
    "bg-orange-500", // 3rd
    "bg-blue-500", // 4th
    "bg-green-500", // 5th
    "bg-purple-500", // 6th
    "bg-pink-500", // 7th
    "bg-indigo-500", // 8th
  ];
  return colors[index] || "bg-gray-500";
};
</script>
