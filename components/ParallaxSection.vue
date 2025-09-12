<template>
  <div
    ref="parallaxRef"
    class="parallax-section"
    :style="{ transform: `translateY(${offset}px)` }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  speed?: number;
  direction?: "up" | "down";
}

const props = withDefaults(defineProps<Props>(), {
  speed: 0.5,
  direction: "up",
});

const parallaxRef = ref<HTMLElement>();
const offset = ref(0);

const handleScroll = () => {
  if (!parallaxRef.value) return;

  const rect = parallaxRef.value.getBoundingClientRect();
  const scrolled = window.pageYOffset;
  const rate = scrolled * -props.speed * (props.direction === "up" ? 1 : -1);

  offset.value = rate;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Initial call
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.parallax-section {
  will-change: transform;
  transition: transform 0.1s ease-out;
}
</style>
