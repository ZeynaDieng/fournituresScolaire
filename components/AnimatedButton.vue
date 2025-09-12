<template>
  <button
    :class="[
      'animated-button',
      buttonClass,
      {
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
        'btn-outline': variant === 'outline',
        'btn-ghost': variant === 'ghost',
        'animate-pulse': pulse,
        'animate-bounce-in': bounce,
        'animate-shake': shake,
        'animate-wobble': wobble,
        'animate-heartbeat': heartbeat,
        loading: loading,
      },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <span v-else-if="icon" class="button-icon">{{ icon }}</span>
    <span class="button-text">
      <slot />
    </span>
    <span v-if="badge" class="button-badge">{{ badge }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  bounce?: boolean;
  shake?: boolean;
  wobble?: boolean;
  heartbeat?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  badge?: string | number;
  buttonClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  pulse: false,
  bounce: false,
  shake: false,
  wobble: false,
  heartbeat: false,
  loading: false,
  disabled: false,
  buttonClass: "",
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>

<style scoped>
.animated-button {
  @apply relative inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-md hover:shadow-lg;
}

.btn-ghost {
  @apply bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800;
}

/* Sizes */
.animated-button {
  @apply px-6 py-3 text-base;
}

.animated-button.size-sm {
  @apply px-4 py-2 text-sm;
}

.animated-button.size-lg {
  @apply px-8 py-4 text-lg;
}

/* Loading state */
.loading {
  @apply cursor-wait;
}

.loading-spinner {
  @apply w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2;
}

.button-icon {
  @apply mr-2 text-lg;
}

.button-text {
  @apply flex-1;
}

.button-badge {
  @apply ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full;
}

/* Hover effects */
.animated-button:hover:not(:disabled) {
  @apply transform -translate-y-1;
}

.animated-button:active:not(:disabled) {
  @apply transform translate-y-0;
}

/* Animation states */
.animate-pulse {
  animation: pulse 2s infinite ease-in-out;
}

.animate-bounce-in {
  animation: bounceIn 0.8s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-wobble {
  animation: wobble 1s ease-in-out;
}

.animate-heartbeat {
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

@keyframes wobble {
  0% {
    transform: translateX(0%);
  }
  15% {
    transform: translateX(-25%) rotate(-5deg);
  }
  30% {
    transform: translateX(20%) rotate(3deg);
  }
  45% {
    transform: translateX(-15%) rotate(-3deg);
  }
  60% {
    transform: translateX(10%) rotate(2deg);
  }
  75% {
    transform: translateX(-5%) rotate(-1deg);
  }
  100% {
    transform: translateX(0%);
  }
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
}
</style>
