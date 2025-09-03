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
        d="M10,2V8a1,1,0,0,0,1,1h6V19a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V4A1,1,0,0,1,8,3h2ZM12,3V8h5ZM9,11H15a1,1,0,0,1,0,2H9a1,1,0,0,1,0-2Zm0,4h6a1,1,0,0,1,0,2H9a1,1,0,0,1,0-2Z"
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
