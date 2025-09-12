<template>
  <div class="floating-particles-container" ref="containerRef">
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="floating-particle"
      :style="{
        left: particle.x + '%',
        top: particle.y + '%',
        animationDelay: particle.delay + 's',
        animationDuration: particle.duration + 's',
        backgroundColor: particle.color,
        width: particle.size + 'px',
        height: particle.size + 'px',
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
}

interface Props {
  count?: number;
  colors?: string[];
  sizes?: number[];
  speed?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 20,
  colors: [
    "rgba(255, 255, 255, 0.6)",
    "rgba(59, 130, 246, 0.4)",
    "rgba(147, 51, 234, 0.4)",
  ],
  sizes: [2, 3, 4, 5],
  speed: 1,
});

const containerRef = ref<HTMLElement>();
const particles = ref<Particle[]>([]);

const generateParticles = () => {
  particles.value = Array.from({ length: props.count }, (_, index) => ({
    id: index,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: (Math.random() * 3 + 2) / props.speed,
    color: props.colors[Math.floor(Math.random() * props.colors.length)],
    size: props.sizes[Math.floor(Math.random() * props.sizes.length)],
  }));
};

onMounted(() => {
  generateParticles();
});
</script>

<style scoped>
.floating-particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.floating-particle {
  position: absolute;
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  opacity: 0.7;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-40px) rotate(180deg);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-20px) rotate(270deg);
    opacity: 1;
  }
}

/* Variantes d'animation */
.floating-particle:nth-child(odd) {
  animation: float-delayed 8s ease-in-out infinite;
}

.floating-particle:nth-child(3n) {
  animation: float-slow 10s ease-in-out infinite;
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.5;
  }
  25% {
    transform: translateY(-15px) rotate(90deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
    opacity: 0.6;
  }
  75% {
    transform: translateY(-15px) rotate(270deg);
    opacity: 0.8;
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.4;
  }
  25% {
    transform: translateY(-10px) rotate(90deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.5;
  }
  75% {
    transform: translateY(-10px) rotate(270deg);
    opacity: 0.7;
  }
}
</style>
