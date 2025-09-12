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
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
      <p>Aucune donnée de paiement</p>
    </div>
    <div v-else>
      <!-- Pie Chart SVG -->
      <div class="flex items-center justify-center mb-6">
        <div class="relative w-48 h-48">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <!-- Pie slices -->
            <g v-for="(slice, index) in pieSlices" :key="index">
              <path
                :d="slice.path"
                :fill="slice.color"
                :stroke="'white'"
                stroke-width="2"
                class="transition-all duration-300 hover:opacity-80 cursor-pointer"
                @mouseenter="hoveredIndex = index"
                @mouseleave="hoveredIndex = -1"
              />
            </g>
          </svg>

          <!-- Center text -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900">
                {{ totalOrders }}
              </div>
              <div class="text-xs text-gray-500">Commandes</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="space-y-2">
        <div
          v-for="(item, index) in data"
          :key="item.method"
          class="flex items-center justify-between p-3 rounded-lg transition-all duration-200"
          :class="hoveredIndex === index ? 'bg-gray-50' : 'hover:bg-gray-50'"
        >
          <div class="flex items-center">
            <div
              class="w-4 h-4 rounded-full mr-3"
              :style="{ backgroundColor: getColor(index) }"
            ></div>
            <div>
              <p class="font-medium text-gray-900">
                {{ getMethodName(item.method) }}
              </p>
              <p class="text-sm text-gray-500">
                {{ item.count }} commande{{ item.count > 1 ? "s" : "" }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium text-gray-900">
              {{ getPercentage(item.count) }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="mt-4 p-3 bg-gray-50 rounded-lg">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Total des commandes:</span>
          <span class="font-medium text-gray-900">{{ totalOrders }}</span>
        </div>
        <div class="flex justify-between text-sm mt-1">
          <span class="text-gray-600">Méthode principale:</span>
          <span class="font-medium text-gray-900">{{ getMainMethod() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

interface PaymentMethodData {
  method: string;
  count: number;
}

interface Props {
  data: PaymentMethodData[];
}

const props = defineProps<Props>();

const hoveredIndex = ref(-1);

const totalOrders = computed(() => {
  return props.data?.reduce((sum, item) => sum + item.count, 0) || 0;
});

const pieSlices = computed(() => {
  if (!props.data || props.data.length === 0) return [];

  let cumulativePercentage = 0;
  const radius = 40;
  const centerX = 50;
  const centerY = 50;

  return props.data.map((item, index) => {
    const percentage = (item.count / totalOrders.value) * 100;
    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360;

    cumulativePercentage += percentage;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = percentage > 50 ? 1 : 0;

    const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return {
      path,
      color: getColor(index),
      percentage: Math.round(percentage),
    };
  });
});

const getColor = (index: number): string => {
  const colors = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
  ];
  return colors[index % colors.length];
};

const getMethodName = (method: string): string => {
  const methodNames: Record<string, string> = {
    PayTech: "PayTech",
    "Orange Money": "Orange Money",
    "Free Money": "Free Money",
    Wave: "Wave",
    Visa: "Visa/Mastercard",
    mobile_money: "Mobile Money",
    card: "Carte bancaire",
  };
  return methodNames[method] || method;
};

const getPercentage = (count: number): number => {
  return totalOrders.value > 0
    ? Math.round((count / totalOrders.value) * 100)
    : 0;
};

const getMainMethod = (): string => {
  if (!props.data || props.data.length === 0) return "N/A";
  const mainMethod = props.data.reduce((prev, current) =>
    prev.count > current.count ? prev : current
  );
  return getMethodName(mainMethod.method);
};
</script>
