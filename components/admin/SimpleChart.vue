<template>
  <div class="h-64 relative">
    <div
      v-if="!data || data.length === 0"
      class="h-full flex items-center justify-center text-gray-500"
    >
      <div class="text-center">
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p>Aucune donnée disponible</p>
      </div>
    </div>

    <div v-else class="h-full">
      <!-- SVG Chart -->
      <svg class="w-full h-full" viewBox="0 0 400 200">
        <!-- Grid lines -->
        <defs>
          <pattern
            id="grid"
            width="40"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 20"
              fill="none"
              stroke="#f3f4f6"
              stroke-width="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- Chart area -->
        <g transform="translate(40, 20)">
          <!-- Data points and lines -->
          <g v-for="(point, index) in chartData" :key="index">
            <!-- Line to next point -->
            <line
              v-if="index < chartData.length - 1"
              :x1="point.x"
              :y1="point.y"
              :x2="chartData[index + 1].x"
              :y2="chartData[index + 1].y"
              stroke="#3b82f6"
              stroke-width="2"
              fill="none"
            />

            <!-- Data point -->
            <circle
              :cx="point.x"
              :cy="point.y"
              r="4"
              fill="#3b82f6"
              stroke="white"
              stroke-width="2"
            />

            <!-- Value label -->
            <text
              :x="point.x"
              :y="point.y - 10"
              text-anchor="middle"
              class="text-xs fill-gray-600"
            >
              {{ formatValue(point.value) }}
            </text>
          </g>

          <!-- X-axis labels -->
          <g v-for="(point, index) in chartData" :key="`label-${index}`">
            <text
              :x="point.x"
              :y="180"
              text-anchor="middle"
              class="text-xs fill-gray-500"
            >
              {{ formatDate(point.date) }}
            </text>
          </g>
        </g>
      </svg>

      <!-- Legend -->
      <div
        class="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs"
      >
        <div class="flex items-center">
          <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>{{ title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface ChartData {
  date: string;
  value: number;
}

interface Props {
  data: ChartData[];
  title: string;
  valueType?: "number" | "currency";
}

const props = withDefaults(defineProps<Props>(), {
  valueType: "number",
});

const chartWidth = 320;
const chartHeight = 160;

const chartData = computed(() => {
  if (!props.data || props.data.length === 0) return [];

  const maxValue = Math.max(...props.data.map((d) => d.value));
  const stepX = chartWidth / (props.data.length - 1);

  return props.data.map((item, index) => ({
    ...item,
    x: index * stepX,
    y: chartHeight - (item.value / maxValue) * chartHeight,
  }));
});

const formatValue = (value: number): string => {
  if (props.valueType === "currency") {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toString();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
};
</script>
