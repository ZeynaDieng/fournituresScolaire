<template>
  <ul>
    <li
      v-for="alert in alerts"
      :key="alert.id"
      class="mb-2 p-2 rounded bg-red-100 text-red-700"
    >
      {{ alert.message }}
    </li>
  </ul>
</template>
<script setup lang="ts">
defineProps<{ alerts: Array<any> }>();
</script>
