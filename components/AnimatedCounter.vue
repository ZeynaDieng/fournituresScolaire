<template>
  <span ref="counterRef" class="animated-counter">
    {{ displayValue }}
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2000,
  prefix: "",
  suffix: "",
  decimals: 0,
  separator: ",",
});

const emit = defineEmits<{
  complete: [];
}>();

const counterRef = ref<HTMLElement>();
const displayValue = ref("");
let startTime: number | null = null;
let animationFrame: number | null = null;

const formatNumber = (num: number): string => {
  const formatted = num.toFixed(props.decimals);
  if (props.separator && props.decimals === 0) {
    return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, props.separator);
  }
  return formatted;
};

const animate = (timestamp: number) => {
  if (!startTime) startTime = timestamp;

  const elapsed = timestamp - startTime;
  const progress = Math.min(elapsed / props.duration, 1);

  // Easing function (ease-out)
  const easeOut = 1 - Math.pow(1 - progress, 3);
  const currentValue = props.target * easeOut;

  displayValue.value = props.prefix + formatNumber(currentValue) + props.suffix;

  if (progress < 1) {
    animationFrame = requestAnimationFrame(animate);
  } else {
    displayValue.value =
      props.prefix + formatNumber(props.target) + props.suffix;
    emit("complete");
  }
};

const startAnimation = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  startTime = null;
  animationFrame = requestAnimationFrame(animate);
};

onMounted(() => {
  // Start animation when element comes into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  if (counterRef.value) {
    observer.observe(counterRef.value);
  }
});

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<style scoped>
.animated-counter {
  display: inline-block;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
</style>
