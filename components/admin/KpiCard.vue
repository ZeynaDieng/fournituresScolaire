<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
        <p
          v-if="change"
          class="text-sm"
          :class="changeType === 'positive' ? 'text-green-600' : 'text-red-600'"
        >
          {{ change }}
        </p>
      </div>
      <div class="flex-shrink-0">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center"
          :class="iconBg"
        >
          <component :is="icon" class="w-5 h-5" :class="iconColor" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative";
  icon?: any;
  iconBg?: string;
  iconColor?: string;
}

withDefaults(defineProps<Props>(), {
  changeType: "positive",
  iconBg: "bg-blue-100",
  iconColor: "text-blue-600",
});
</script>
