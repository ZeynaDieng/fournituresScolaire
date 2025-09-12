<template>
  <div
    ref="sectionRef"
    :class="['animated-section', animationClass, { 'animate-in': isVisible }]"
    :style="{ '--delay': delay + 's' }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useAnimations } from "~/composables/useAnimations";

interface Props {
  animation?:
    | "fadeInUp"
    | "fadeInLeft"
    | "fadeInRight"
    | "fadeInScale"
    | "slideInDown"
    | "slideInUp"
    | "bounceIn";
  delay?: number;
  threshold?: number;
  rootMargin?: string;
}

const props = withDefaults(defineProps<Props>(), {
  animation: "fadeInUp",
  delay: 0,
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
});

const sectionRef = ref<HTMLElement>();
const isVisible = ref(false);
const { observeElement } = useAnimations();

const animationClass = computed(() => {
  const baseClass =
    "animate-" + props.animation.replace(/([A-Z])/g, "-$1").toLowerCase();
  return baseClass;
});

onMounted(() => {
  if (sectionRef.value) {
    observeElement(sectionRef.value, () => {
      isVisible.value = true;
    });
  }
});
</script>

<style scoped>
.animated-section {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
  transition-delay: var(--delay, 0s);
}

.animated-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.animate-fade-in-up {
  transform: translateY(30px);
}

.animate-fade-in-left {
  transform: translateX(-30px);
}

.animate-fade-in-right {
  transform: translateX(30px);
}

.animate-fade-in-scale {
  transform: scale(0.8);
}

.animate-slide-in-down {
  transform: translateY(-100%);
}

.animate-slide-in-up {
  transform: translateY(100%);
}

.animate-bounce-in {
  transform: scale(0.3);
}
</style>
