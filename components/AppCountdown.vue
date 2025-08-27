<template>
  <div class="text-red-500 font-bold">
    <span>{{ hours }}h : {{ minutes }}m : {{ seconds }}s</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const props = defineProps<{ endTime: Date }>()

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
let interval: any

function updateCountdown() {
  const now = new Date()
  const diff = props.endTime.getTime() - now.getTime()
  if (diff <= 0) { hours.value = minutes.value = seconds.value = 0; clearInterval(interval); return }
  hours.value = Math.floor(diff / 1000 / 60 / 60)
  minutes.value = Math.floor((diff / 1000 / 60) % 60)
  seconds.value = Math.floor((diff / 1000) % 60)
}

onMounted(() => {
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => clearInterval(interval))
</script>
