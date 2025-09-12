<template>
  <div
    :class="[
      'animated-card',
      cardClass,
      {
        'hover-lift': hoverLift,
        'hover-scale': hoverScale,
        'hover-glow': hoverGlow,
        'animate-glow': glow,
      },
    ]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div v-if="loading" class="skeleton-loader h-full">
      <div class="skeleton-shimmer"></div>
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  hoverLift?: boolean;
  hoverScale?: boolean;
  hoverGlow?: boolean;
  glow?: boolean;
  loading?: boolean;
  cardClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  hoverLift: true,
  hoverScale: false,
  hoverGlow: false,
  glow: false,
  loading: false,
  cardClass:
    "bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300",
});

const emit = defineEmits<{
  mouseenter: [];
  mouseleave: [];
}>();

const onMouseEnter = () => {
  emit("mouseenter");
};

const onMouseLeave = () => {
  emit("mouseleave");
};
</script>

<style scoped>
.animated-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
}

.animated-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8),
      0 0 30px rgba(59, 130, 246, 0.6);
  }
}
</style>
