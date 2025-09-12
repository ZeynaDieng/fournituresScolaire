<template>
  <div class="space-y-4">
    <div v-if="!data" class="text-center py-8 text-gray-500">
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
    <div v-else class="space-y-3">
      <!-- Funnel Steps -->
      <div
        v-for="(step, index) in funnelSteps"
        :key="step.key"
        class="relative"
      >
        <!-- Step Bar -->
        <div
          class="flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300"
          :class="step.class"
        >
          <div class="flex items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mr-3"
              :class="step.iconClass"
            >
              {{ index + 1 }}
            </div>
            <div>
              <h4 class="font-medium text-gray-900">{{ step.title }}</h4>
              <p class="text-sm text-gray-600">{{ step.description }}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold" :class="step.valueClass">
              {{ formatNumber(step.value) }}
            </div>
            <div class="text-sm text-gray-500">{{ step.percentage }}%</div>
          </div>
        </div>

        <!-- Conversion Rate -->
        <div
          v-if="index < funnelSteps.length - 1"
          class="flex justify-center mt-2"
        >
          <div
            class="bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-600"
          >
            {{ getConversionRate(index) }}% de conversion
          </div>
        </div>
      </div>

      <!-- Overall Conversion Rate -->
      <div
        class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium text-gray-900">Taux de conversion global</h4>
            <p class="text-sm text-gray-600">Visiteurs → Commandes payées</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-blue-600">
              {{ getOverallConversionRate() }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface FunnelData {
  totalVisitors: number;
  cartAdditions: number;
  checkoutStarted: number;
  ordersCompleted: number;
  ordersPaid: number;
}

interface Props {
  data: FunnelData;
}

const props = defineProps<Props>();

const funnelSteps = computed(() => {
  if (!props.data) return [];

  const steps = [
    {
      key: "visitors",
      title: "Visiteurs",
      description: "Visiteurs uniques sur le site",
      value: props.data.totalVisitors,
      class: "border-blue-200 bg-blue-50",
      iconClass: "bg-blue-500",
      valueClass: "text-blue-600",
    },
    {
      key: "cart",
      title: "Ajouts au panier",
      description: "Produits ajoutés au panier",
      value: props.data.cartAdditions,
      class: "border-green-200 bg-green-50",
      iconClass: "bg-green-500",
      valueClass: "text-green-600",
    },
    {
      key: "checkout",
      title: "Début de commande",
      description: "Processus de commande initié",
      value: props.data.checkoutStarted,
      class: "border-yellow-200 bg-yellow-50",
      iconClass: "bg-yellow-500",
      valueClass: "text-yellow-600",
    },
    {
      key: "orders",
      title: "Commandes complétées",
      description: "Commandes finalisées",
      value: props.data.ordersCompleted,
      class: "border-purple-200 bg-purple-50",
      iconClass: "bg-purple-500",
      valueClass: "text-purple-600",
    },
    {
      key: "paid",
      title: "Commandes payées",
      description: "Commandes avec paiement confirmé",
      value: props.data.ordersPaid,
      class: "border-emerald-200 bg-emerald-50",
      iconClass: "bg-emerald-500",
      valueClass: "text-emerald-600",
    },
  ];

  // Calculate percentages
  const maxValue = Math.max(...steps.map((s) => s.value));
  return steps.map((step) => ({
    ...step,
    percentage: maxValue > 0 ? Math.round((step.value / maxValue) * 100) : 0,
  }));
});

const getConversionRate = (index: number): number => {
  if (!props.data || index >= funnelSteps.value.length - 1) return 0;

  const current = funnelSteps.value[index].value;
  const next = funnelSteps.value[index + 1].value;

  return current > 0 ? Math.round((next / current) * 100) : 0;
};

const getOverallConversionRate = (): number => {
  if (!props.data || props.data.totalVisitors === 0) return 0;
  return Math.round((props.data.ordersPaid / props.data.totalVisitors) * 100);
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};
</script>
