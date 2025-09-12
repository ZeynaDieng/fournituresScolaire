<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div
            :class="iconClasses"
            class="w-8 h-8 rounded-md flex items-center justify-center"
          >
            <component :is="iconComponent" class="w-5 h-5" />
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ title }}
            </dt>
            <dd class="flex items-baseline">
              <div class="text-2xl font-semibold text-gray-900">
                {{ value }}
              </div>
              <div
                v-if="change !== undefined"
                class="ml-2 flex items-baseline text-sm font-semibold"
                :class="changeColor"
              >
                <component
                  :is="changeIcon"
                  class="self-center flex-shrink-0 h-4 w-4"
                />
                <span class="sr-only"
                  >{{ change >= 0 ? "Augmentation" : "Diminution" }} de</span
                >
                {{ Math.abs(change) }}%
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  title: string;
  value: string | number;
  change?: number;
  icon: "orders" | "revenue" | "conversion" | "cart" | "users" | "products";
  color: "blue" | "green" | "purple" | "orange" | "red" | "yellow";
}

const props = defineProps<Props>();

const iconClasses = computed(() => {
  const colorMap = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    purple: "bg-purple-500 text-white",
    orange: "bg-orange-500 text-white",
    red: "bg-red-500 text-white",
    yellow: "bg-yellow-500 text-white",
  };
  return colorMap[props.color];
});

const changeColor = computed(() => {
  if (props.change === undefined) return "";
  return props.change >= 0 ? "text-green-600" : "text-red-600";
});

const changeIcon = computed(() => {
  if (props.change === undefined) return "div";
  return props.change >= 0 ? "ChevronUpIcon" : "ChevronDownIcon";
});

const iconComponent = computed(() => {
  const iconMap = {
    orders: "ShoppingBagIcon",
    revenue: "CurrencyDollarIcon",
    conversion: "ChartBarIcon",
    cart: "ShoppingCartIcon",
    users: "UsersIcon",
    products: "CubeIcon",
  };
  return iconMap[props.icon] || "ChartBarIcon";
});
</script>
