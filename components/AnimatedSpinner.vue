<template>
  <div class="animated-spinner" :class="[variant, size]">
    <div v-if="variant === 'dots'" class="spinner-dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>

    <div v-else-if="variant === 'pulse'" class="spinner-pulse">
      <div class="pulse"></div>
    </div>

    <div v-else-if="variant === 'wave'" class="spinner-wave">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>

    <div v-else-if="variant === 'bounce'" class="spinner-bounce">
      <div class="bounce"></div>
      <div class="bounce"></div>
      <div class="bounce"></div>
    </div>

    <div v-else-if="variant === 'ring'" class="spinner-ring">
      <div class="ring"></div>
    </div>

    <div v-else-if="variant === 'bars'" class="spinner-bars">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>

    <div v-else class="spinner-default">
      <div class="spinner"></div>
    </div>

    <div v-if="text" class="spinner-text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: "default" | "dots" | "pulse" | "wave" | "bounce" | "ring" | "bars";
  size?: "sm" | "md" | "lg";
  color?: string;
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  size: "md",
  color: "#3b82f6",
  text: "",
});
</script>

<style scoped>
.animated-spinner {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner-text {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* Sizes */
.animated-spinner.sm {
  font-size: 12px;
}

.animated-spinner.md {
  font-size: 16px;
}

.animated-spinner.lg {
  font-size: 20px;
}

/* Default Spinner */
.spinner {
  width: 1em;
  height: 1em;
  border: 2px solid #e5e7eb;
  border-top: 2px solid v-bind(color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Dots Spinner */
.spinner-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 0.5em;
  height: 0.5em;
  background-color: v-bind(color);
  border-radius: 50%;
  animation: dots 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}
.dot:nth-child(2) {
  animation-delay: -0.16s;
}

/* Pulse Spinner */
.pulse {
  width: 1em;
  height: 1em;
  background-color: v-bind(color);
  border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
}

/* Wave Spinner */
.spinner-wave {
  display: flex;
  gap: 2px;
  align-items: end;
}

.wave {
  width: 0.2em;
  height: 0.5em;
  background-color: v-bind(color);
  border-radius: 2px;
  animation: wave 1.2s ease-in-out infinite;
}

.wave:nth-child(1) {
  animation-delay: -1.1s;
}
.wave:nth-child(2) {
  animation-delay: -1s;
}
.wave:nth-child(3) {
  animation-delay: -0.9s;
}
.wave:nth-child(4) {
  animation-delay: -0.8s;
}
.wave:nth-child(5) {
  animation-delay: -0.7s;
}

/* Bounce Spinner */
.spinner-bounce {
  display: flex;
  gap: 2px;
}

.bounce {
  width: 0.3em;
  height: 0.3em;
  background-color: v-bind(color);
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.bounce:nth-child(1) {
  animation-delay: -0.32s;
}
.bounce:nth-child(2) {
  animation-delay: -0.16s;
}

/* Ring Spinner */
.ring {
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top: 2px solid v-bind(color);
  border-right: 2px solid v-bind(color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Bars Spinner */
.spinner-bars {
  display: flex;
  gap: 2px;
  align-items: end;
}

.bar {
  width: 0.2em;
  height: 0.5em;
  background-color: v-bind(color);
  border-radius: 2px;
  animation: bars 1.2s ease-in-out infinite;
}

.bar:nth-child(1) {
  animation-delay: -1.1s;
}
.bar:nth-child(2) {
  animation-delay: -1s;
}
.bar:nth-child(3) {
  animation-delay: -0.9s;
}
.bar:nth-child(4) {
  animation-delay: -0.8s;
}

/* Animations */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dots {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes wave {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes bars {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}
</style>
