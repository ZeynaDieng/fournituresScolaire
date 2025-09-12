<template>
  <div
    ref="shapeRef"
    class="morphing-shape"
    :style="{
      clipPath: currentShape,
      background: gradient,
    }"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  shapes?: string[];
  duration?: number;
  gradient?: string;
  size?: string;
}

const props = withDefaults(defineProps<Props>(), {
  shapes: [
    "circle(50% at 50% 50%)",
    "polygon(50% 0%, 0% 100%, 100% 100%)",
    "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
    "ellipse(50% 50% at 50% 50%)",
    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
  ],
  duration: 3000,
  gradient: "linear-gradient(45deg, #667eea, #764ba2)",
  size: "200px",
});

const shapeRef = ref<HTMLElement>();
const currentShape = ref(props.shapes[0]);
let currentIndex = 0;
let timer: NodeJS.Timeout | null = null;

const morphToNext = () => {
  currentIndex = (currentIndex + 1) % props.shapes.length;
  currentShape.value = props.shapes[currentIndex];
};

const startMorphing = () => {
  timer = setInterval(morphToNext, props.duration);
};

const stopMorphing = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

onMounted(() => {
  startMorphing();
});

onUnmounted(() => {
  stopMorphing();
});
</script>

<style scoped>
.morphing-shape {
  width: v-bind(size);
  height: v-bind(size);
  transition: clip-path 1s ease-in-out;
  will-change: clip-path;
}
</style>
