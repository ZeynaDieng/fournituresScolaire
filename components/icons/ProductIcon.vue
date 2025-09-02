<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
  >
    <circle cx="9" cy="9" r="2" />
    <path d="M13 19c0-2.4-2-4.4-4.4-4.4S4.2 16.6 4.2 19" />
    <path
      d="M20 12c0-.6-.4-1-1-1h-2c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-7z"
    />
    <path d="M20 8v4" />
    <path d="M16 8v4" />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: [String, Number],
    default: 24,
  },
  strokeWidth: {
    type: [String, Number],
    default: 2,
  },
  className: {
    type: String,
    default: "",
  },
});
</script>
