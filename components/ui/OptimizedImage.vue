<template>
  <div class="image-container" :class="{ 'skeleton': loading }">
    <img
      :src="src"
      :alt="alt"
      :loading="lazy ? 'lazy' : 'eager'"
      :class="['image', { 'loaded': !loading }]"
      :style="{
        'object-fit': cover ? 'cover' : 'contain',
        'object-position': position
      }"
      @load="handleLoad"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  cover: {
    type: Boolean,
    default: true
  },
  position: {
    type: String,
    default: 'center'
  },
  lazy: {
    type: Boolean,
    default: true
  },
  aspectRatio: {
    type: String,
    default: '16/9'
  }
})

const loading = ref(true)

const handleLoad = () => {
  loading.value = false
}
</script>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  padding-bottom: calc(100% / (var(--aspect-ratio, 16/9)));
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 0.5rem;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.image.loaded {
  opacity: 1;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
