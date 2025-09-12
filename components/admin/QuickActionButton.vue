<template>
  <button
    @click="$emit('click')"
    class="group relative p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    :class="hoverClasses"
  >
    <div class="flex flex-col items-center text-center">
      <!-- Icon -->
      <div
        class="w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors duration-200"
        :class="iconClasses"
      >
        <component :is="iconComponent" class="w-6 h-6" />
      </div>

      <!-- Title -->
      <h3
        class="text-sm font-medium text-gray-900 mb-1 group-hover:text-gray-700"
      >
        {{ title }}
      </h3>

      <!-- Description -->
      <p class="text-xs text-gray-500 group-hover:text-gray-600">
        {{ description }}
      </p>
    </div>

    <!-- Hover effect -->
    <div
      class="absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-200"
      :class="gradientClass"
    ></div>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  title: string;
  description: string;
  icon:
    | "plus"
    | "package"
    | "orders"
    | "tag"
    | "users"
    | "settings"
    | "chart"
    | "download";
  color:
    | "blue"
    | "green"
    | "purple"
    | "orange"
    | "red"
    | "yellow"
    | "indigo"
    | "pink";
}

const props = defineProps<Props>();

defineEmits<{
  click: [];
}>();

const iconClasses = computed(() => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-200",
    green: "bg-green-100 text-green-600 group-hover:bg-green-200",
    purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-200",
    orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-200",
    red: "bg-red-100 text-red-600 group-hover:bg-red-200",
    yellow: "bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200",
    indigo: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200",
    pink: "bg-pink-100 text-pink-600 group-hover:bg-pink-200",
  };
  return colorMap[props.color];
});

const hoverClasses = computed(() => {
  const colorMap = {
    blue: "hover:bg-blue-50",
    green: "hover:bg-green-50",
    purple: "hover:bg-purple-50",
    orange: "hover:bg-orange-50",
    red: "hover:bg-red-50",
    yellow: "hover:bg-yellow-50",
    indigo: "hover:bg-indigo-50",
    pink: "hover:bg-pink-50",
  };
  return colorMap[props.color];
});

const gradientClass = computed(() => {
  const colorMap = {
    blue: "from-blue-400 to-blue-600",
    green: "from-green-400 to-green-600",
    purple: "from-purple-400 to-purple-600",
    orange: "from-orange-400 to-orange-600",
    red: "from-red-400 to-red-600",
    yellow: "from-yellow-400 to-yellow-600",
    indigo: "from-indigo-400 to-indigo-600",
    pink: "from-pink-400 to-pink-600",
  };
  return colorMap[props.color];
});

const iconComponent = computed(() => {
  const iconMap = {
    plus: "PlusIcon",
    package: "CubeIcon",
    orders: "ShoppingBagIcon",
    tag: "TagIcon",
    users: "UsersIcon",
    settings: "CogIcon",
    chart: "ChartBarIcon",
    download: "DownloadIcon",
  };
  return iconMap[props.icon] || "PlusIcon";
});
</script>
