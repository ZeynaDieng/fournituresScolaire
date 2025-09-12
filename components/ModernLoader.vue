<template>
  <div class="flex flex-col items-center justify-center py-20">
    <!-- Container avec particules flottantes -->
    <div class="relative">
      <!-- Particules flottantes -->
      <div
        v-for="(particle, index) in particles"
        :key="index"
        class="absolute rounded-full animate-pulse"
        :class="particle.class"
        :style="particle.style"
      ></div>

      <!-- Spinner principal -->
      <div class="relative">
        <!-- Spinner externe -->
        <div
          class="w-20 h-20 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"
        ></div>
        <!-- Spinner interne -->
        <div
          class="absolute top-2 left-2 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"
          style="animation-direction: reverse; animation-duration: 1.5s"
        ></div>
        <!-- Spinner central -->
        <div
          class="absolute top-4 left-4 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
          style="animation-duration: 2s"
        ></div>
        <!-- Point central -->
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"
        ></div>
      </div>
    </div>

    <!-- Texte de chargement -->
    <div class="mt-8 text-center">
      <h3 class="text-xl font-bold text-gray-800 mb-2 animate-pulse">
        {{ title }}
      </h3>
      <p class="text-sm text-gray-600 mb-4">{{ subtitle }}</p>
      <!-- Barre de progression -->
      <div class="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  subtitle?: string;
  progress?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Chargement...",
  subtitle: "Préparation en cours",
  progress: 70,
});

// Particules flottantes
const particles = [
  {
    class: "w-3 h-3 bg-green-400",
    style: "top: -16px; left: -16px; animation-delay: 0s;",
  },
  {
    class: "w-2 h-2 bg-blue-400",
    style: "top: -8px; right: -24px; animation-delay: 0.5s;",
  },
  {
    class: "w-2.5 h-2.5 bg-purple-400",
    style: "bottom: -16px; left: -8px; animation-delay: 1s;",
  },
  {
    class: "w-3 h-3 bg-orange-400",
    style: "bottom: -8px; right: -16px; animation-delay: 1.5s;",
  },
  {
    class: "w-2 h-2 bg-pink-400",
    style: "top: 8px; left: -32px; animation-delay: 2s;",
  },
  {
    class: "w-2.5 h-2.5 bg-indigo-400",
    style: "top: 16px; right: -8px; animation-delay: 2.5s;",
  },
];
</script>
