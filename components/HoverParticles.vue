<template>
  <div
    ref="containerRef"
    class="hover-particles-container"
    @mouseenter="createParticles"
    @mousemove="updateParticles"
    @mouseleave="clearParticles"
  >
    <slot />
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="hover-particle"
      :style="{
        left: particle.x + 'px',
        top: particle.y + 'px',
        backgroundColor: particle.color,
        width: particle.size + 'px',
        height: particle.size + 'px',
        animationDelay: particle.delay + 's',
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
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  delay: number;
}

interface Props {
  count?: number;
  colors?: string[];
  sizes?: number[];
  speed?: number;
  life?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 10,
  colors: ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"],
  sizes: [2, 3, 4, 5],
  speed: 2,
  life: 1000,
});

const containerRef = ref<HTMLElement>();
const particles = ref<Particle[]>([]);
let animationFrame: number | null = null;

const createParticle = (x: number, y: number): Particle => ({
  id: Math.random(),
  x,
  y,
  vx: (Math.random() - 0.5) * props.speed,
  vy: (Math.random() - 0.5) * props.speed,
  life: props.life,
  maxLife: props.life,
  size: props.sizes[Math.floor(Math.random() * props.sizes.length)],
  color: props.colors[Math.floor(Math.random() * props.colors.length)],
  delay: Math.random() * 0.5,
});

const createParticles = (event: MouseEvent) => {
  if (!containerRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  for (let i = 0; i < props.count; i++) {
    particles.value.push(createParticle(x, y));
  }
};

const updateParticles = (event: MouseEvent) => {
  if (!containerRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Add new particles on mouse move
  if (Math.random() < 0.3) {
    particles.value.push(createParticle(x, y));
  }
};

const clearParticles = () => {
  particles.value = [];
};

const animate = () => {
  particles.value = particles.value.filter((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= 16;

    // Apply gravity
    particle.vy += 0.1;

    // Apply friction
    particle.vx *= 0.98;
    particle.vy *= 0.98;

    return particle.life > 0;
  });

  animationFrame = requestAnimationFrame(animate);
};

onMounted(() => {
  animate();
});

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<style scoped>
.hover-particles-container {
  position: relative;
  overflow: hidden;
}

.hover-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  animation: particle-fade 1s ease-out forwards;
  z-index: 1;
}

@keyframes particle-fade {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}
</style>
