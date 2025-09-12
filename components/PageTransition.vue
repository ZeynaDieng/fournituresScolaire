<template>
  <div
    v-if="isVisible"
    :class="[
      'page-transition',
      `page-transition-${direction}`,
      { 'page-transition-complete': isComplete },
    ]"
  >
    <div class="transition-content">
      <div v-if="showLoader" class="loader">
        <div class="loader-spinner"></div>
        <div v-if="loadingText" class="loader-text">{{ loadingText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

interface Props {
  direction?: "in" | "out";
  showLoader?: boolean;
  loadingText?: string;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  direction: "in",
  showLoader: true,
  loadingText: "Chargement...",
  duration: 500,
});

const emit = defineEmits<{
  complete: [];
}>();

const isVisible = ref(false);
const isComplete = ref(false);

const startTransition = () => {
  isVisible.value = true;

  setTimeout(() => {
    isComplete.value = true;
  }, 100);

  setTimeout(() => {
    isVisible.value = false;
    isComplete.value = false;
    emit("complete");
  }, props.duration);
};

onMounted(() => {
  if (props.direction === "in") {
    startTransition();
  }
});

watch(
  () => props.direction,
  (newDirection) => {
    if (newDirection === "out") {
      startTransition();
    }
  }
);
</script>

<style scoped>
.page-transition {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-transition-in {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleY(0);
  transform-origin: bottom;
}

.page-transition-out {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleY(1);
  transform-origin: top;
}

.page-transition-complete {
  transform: scaleY(1);
  transition: transform 0.5s ease-in-out;
}

.transition-content {
  color: white;
  text-align: center;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loader-text {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.9;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Variantes de transition */
.page-transition-in.slide {
  transform: translateX(-100%);
  transform-origin: left;
}

.page-transition-out.slide {
  transform: translateX(0);
  transform-origin: right;
}

.page-transition-in.fade {
  opacity: 0;
  transform: scale(1);
}

.page-transition-out.fade {
  opacity: 1;
  transform: scale(1);
}

.page-transition-complete.fade {
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}
</style>
