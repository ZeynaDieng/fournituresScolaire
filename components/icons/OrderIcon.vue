<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M19,7H16V6A3,3,0,0,0,13,3H11A3,3,0,0,0,8,6V7H5A1,1,0,0,0,5,9H6V19a3,3,0,0,0,3,3h6a3,3,0,0,0,3-3V9h1a1,1,0,0,0,0-2ZM10,6a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V7H10Zm6,13a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V9h8Z"
        fill="currentColor"
      />
    </g>
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: [String, Number],
    default: 24,
  },
  className: {
    type: String,
    default: "",
  },
});
</script>
