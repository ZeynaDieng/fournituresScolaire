<template>
  <div class="rounded-lg p-4 shadow bg-white">
    <h3 class="font-semibold mb-2">{{ title }}</h3>
    <slot />
  </div>
</template>
<script setup lang="ts">
defineProps<{ title: string }>();
</script>
