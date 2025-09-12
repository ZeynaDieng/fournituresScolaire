<template>
  <div class="animated-progress" :class="variant">
    <div class="progress-container">
      <div
        class="progress-bar"
        :style="{
          width: `${progress}%`,
          backgroundColor: color,
          transition: `width ${duration}ms ease-out`,
        }"
      >
        <div v-if="showGlow" class="progress-glow"></div>
        <div v-if="showStripes" class="progress-stripes"></div>
      </div>
      <div v-if="showLabel" class="progress-label">
        {{ label || `${Math.round(progress)}%` }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  progress: number;
  color?: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  showLabel?: boolean;
  label?: string;
  showGlow?: boolean;
  showStripes?: boolean;
  duration?: number;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
  color: "",
  variant: "default",
  showLabel: true,
  showGlow: false,
  showStripes: false,
  duration: 1000,
  animated: true,
});

const computedColor = computed(() => {
  if (props.color) return props.color;

  const colors = {
    default: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#06b6d4",
  };

  return colors[props.variant];
});

watch(
  () => props.progress,
  (newProgress) => {
    if (props.animated) {
      // Trigger animation
      const progressBar = document.querySelector(".progress-bar");
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.offsetHeight; // Force reflow
        progressBar.style.transition = `width ${props.duration}ms ease-out`;
      }
    }
  }
);
</script>

<style scoped>
.animated-progress {
  width: 100%;
}

.progress-container {
  position: relative;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  height: 8px;
}

.progress-bar {
  height: 100%;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: glow 2s infinite;
}

.progress-stripes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 20px
  );
  animation: stripes 1s linear infinite;
}

.progress-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
}

/* Variants */
.animated-progress.success .progress-container {
  background: #d1fae5;
}

.animated-progress.warning .progress-container {
  background: #fef3c7;
}

.animated-progress.error .progress-container {
  background: #fee2e2;
}

.animated-progress.info .progress-container {
  background: #cffafe;
}

/* Animations */
@keyframes glow {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes stripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 0;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .progress-container {
    height: 6px;
  }

  .progress-label {
    font-size: 10px;
  }
}
</style>
