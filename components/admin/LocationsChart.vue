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
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <p>Aucune donnée géographique</p>
    </div>
    <div v-else>
      <!-- Location Bars -->
      <div class="space-y-3">
        <div
          v-for="(location, index) in data"
          :key="location.location"
          class="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <div class="flex items-center flex-1">
            <!-- Location Icon -->
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3"
              :class="getLocationColor(index)"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <!-- Location Info -->
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 truncate">
                {{ location.location }}
              </p>
              <p class="text-sm text-gray-500">
                {{ location.count }} commande{{ location.count > 1 ? "s" : "" }}
              </p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="flex items-center ml-4">
            <div class="w-24 bg-gray-200 rounded-full h-2 mr-3">
              <div
                class="h-2 rounded-full transition-all duration-300"
                :class="getProgressColor(index)"
                :style="{ width: `${getProgressWidth(location.count)}%` }"
              ></div>
            </div>
            <span class="text-sm font-medium text-gray-900 w-12 text-right">
              {{ location.count }}
            </span>
          </div>
        </div>
      </div>

      <!-- Map Visualization (Simple) -->
      <div
        class="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
      >
        <h4 class="font-medium text-gray-900 mb-3">Répartition géographique</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div
            v-for="(location, index) in data.slice(0, 4)"
            :key="location.location"
            class="flex items-center"
          >
            <div
              class="w-3 h-3 rounded-full mr-2"
              :class="
                getProgressColor(index)
                  .replace('bg-', 'bg-')
                  .replace('-500', '-400')
              "
            ></div>
            <span class="text-gray-700">{{ location.location }}</span>
            <span class="ml-auto text-gray-500"
              >{{ getPercentage(location.count) }}%</span
            >
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="mt-4 grid grid-cols-2 gap-4">
        <div class="p-3 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-600">Total commandes</div>
          <div class="text-lg font-semibold text-gray-900">
            {{ totalOrders }}
          </div>
        </div>
        <div class="p-3 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-600">Zones couvertes</div>
          <div class="text-lg font-semibold text-gray-900">
            {{ data.length }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface LocationData {
  location: string;
  count: number;
}

interface Props {
  data: LocationData[];
}

const props = defineProps<Props>();

const totalOrders = computed(() => {
  return props.data?.reduce((sum, item) => sum + item.count, 0) || 0;
});

const maxCount = computed(() => {
  if (!props.data || props.data.length === 0) return 1;
  return Math.max(...props.data.map((l) => l.count));
});

const getProgressWidth = (count: number): number => {
  return (count / maxCount.value) * 100;
};

const getLocationColor = (index: number): string => {
  const colors = [
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
    "bg-orange-100 text-orange-600",
    "bg-pink-100 text-pink-600",
    "bg-indigo-100 text-indigo-600",
    "bg-yellow-100 text-yellow-600",
    "bg-red-100 text-red-600",
  ];
  return colors[index % colors.length];
};

const getProgressColor = (index: number): string => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-red-500",
  ];
  return colors[index % colors.length];
};

const getPercentage = (count: number): number => {
  return totalOrders.value > 0
    ? Math.round((count / totalOrders.value) * 100)
    : 0;
};
</script>
