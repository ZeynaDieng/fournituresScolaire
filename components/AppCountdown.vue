<!-- components/Countdown.vue -->
<template>
  <div 
    class="countdown"
    :class="{
      'countdown-small': size === 'small',
      'countdown-large': size === 'large'
    }"
  >
    <!-- Header -->
    <div v-if="showHeader" class="countdown-header">
      <span class="countdown-label">{{ label }}</span>
    </div>

    <!-- Timer Display -->
    <div class="countdown-timer" v-if="!isExpired">
      <div class="time-unit" v-if="showDays">
        <span class="time-value">{{ formatTime(timeLeft.days) }}</span>
        <span class="time-label">{{ timeLeft.days > 1 ? 'Jours' : 'Jour' }}</span>
      </div>
      
      <div class="time-separator" v-if="showDays && (showHours || showMinutes)">:</div>
      
      <div class="time-unit" v-if="showHours">
        <span class="time-value">{{ formatTime(timeLeft.hours) }}</span>
        <span class="time-label">{{ timeLeft.hours > 1 ? 'Heures' : 'Heure' }}</span>
      </div>
      
      <div class="time-separator" v-if="showHours && showMinutes">:</div>
      
      <div class="time-unit" v-if="showMinutes">
        <span class="time-value">{{ formatTime(timeLeft.minutes) }}</span>
        <span class="time-label">{{ timeLeft.minutes > 1 ? 'Min' : 'Min' }}</span>
      </div>
      
      <div class="time-separator" v-if="showMinutes && showSeconds">:</div>
      
      <div class="time-unit" v-if="showSeconds">
        <span class="time-value">{{ formatTime(timeLeft.seconds) }}</span>
        <span class="time-label">{{ timeLeft.seconds > 1 ? 'Sec' : 'Sec' }}</span>
      </div>
    </div>

    <!-- Expired Message -->
    <div v-else class="countdown-expired">
      <span class="expired-icon">⏰</span>
      <span class="expired-text">{{ expiredMessage }}</span>
    </div>

    <!-- Progress Bar (optional) -->
    <div v-if="showProgress && !isExpired" class="countdown-progress">
      <div 
        class="progress-bar"
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  endDate: Date | string
  size?: 'small' | 'medium' | 'large'
  showDays?: boolean
  showHours?: boolean
  showMinutes?: boolean
  showSeconds?: boolean
  showProgress?: boolean
  showHeader?: boolean
  label?: string
  expiredMessage?: string
  autoHide?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  showDays: true,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  showProgress: false,
  showHeader: true,
  label: 'Se termine dans :',
  expiredMessage: 'Promotion expirée',
  autoHide: true
})

// Emit
const emit = defineEmits<{
  expired: []
  tick: [timeLeft: TimeLeft]
}>()

// Types
interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

// State
const timeLeft = ref<TimeLeft>({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  total: 0
})

const isExpired = ref(false)
let interval: NodeJS.Timeout | null = null

// Computed
const endDateTime = computed(() => {
  return new Date(props.endDate)
})

const progressPercentage = computed(() => {
  // Supposons une durée de promotion de 30 jours pour le calcul du pourcentage
  const promotionDuration = 30 * 24 * 60 * 60 * 1000 // 30 jours en millisecondes
  const elapsed = promotionDuration - timeLeft.value.total
  return Math.min(Math.max((elapsed / promotionDuration) * 100, 0), 100)
})

// Methods
const calculateTimeLeft = (): TimeLeft => {
  const now = new Date().getTime()
  const endTime = endDateTime.value.getTime()
  const difference = endTime - now

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0
    }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    total: difference
  }
}

const updateTimer = () => {
  timeLeft.value = calculateTimeLeft()
  
  if (timeLeft.value.total <= 0) {
    isExpired.value = true
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    emit('expired')
  } else {
    emit('tick', timeLeft.value)
  }
}

const formatTime = (time: number): string => {
  return time.toString().padStart(2, '0')
}

const startTimer = () => {
  updateTimer()
  
  if (!isExpired.value) {
    interval = setInterval(updateTimer, 1000)
  }
}

const stopTimer = () => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

// Lifecycle
onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})

// Watch for prop changes
watch(() => props.endDate, () => {
  stopTimer()
  isExpired.value = false
  startTimer()
})
</script>

<style scoped>
.countdown {
  @apply inline-block;
}

.countdown-header {
  @apply text-center mb-2;
}

.countdown-label {
  @apply text-sm font-medium text-gray-600 uppercase tracking-wide;
}

.countdown-timer {
  @apply flex items-center justify-center space-x-1;
}

.time-unit {
  @apply flex flex-col items-center bg-white rounded-lg shadow-md p-2 min-w-[50px];
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.time-value {
  @apply text-2xl font-bold text-primary-green;
  font-variant-numeric: tabular-nums;
  animation: countdownPulse 1s ease-in-out infinite;
}

.time-label {
  @apply text-xs font-medium text-gray-500 uppercase;
}

.time-separator {
  @apply text-2xl font-bold text-gray-400 mx-1;
  animation: blink 1s infinite;
}

/* Size variations */
.countdown-small .time-unit {
  @apply p-1 min-w-[40px];
}

.countdown-small .time-value {
  @apply text-lg;
}

.countdown-small .time-label {
  @apply text-xs;
}

.countdown-large .time-unit {
  @apply p-4 min-w-[80px];
}

.countdown-large .time-value {
  @apply text-4xl;
}

.countdown-large .time-label {
  @apply text-sm;
}

/* Expired state */
.countdown-expired {
  @apply flex items-center justify-center space-x-2 bg-gray-100 rounded-lg p-4 text-gray-500;
}

.expired-icon {
  @apply text-2xl;
}

.expired-text {
  @apply font-medium;
}

/* Progress bar */
.countdown-progress {
  @apply w-full bg-gray-200 rounded-full h-2 mt-3 overflow-hidden;
}

.progress-bar {
  @apply h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300;
  animation: progressPulse 2s ease-in-out infinite;
}

/* Animations */
@keyframes countdownPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0.3;
  }
}

@keyframes progressPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Responsive */
@media (max-width: 480px) {
  .countdown-timer {
    @apply space-x-0.5;
  }
  
  .time-unit {
    @apply min-w-[35px] p-1;
  }
  
  .time-value {
    @apply text-lg;
  }
  
  .time-label {
    @apply text-xs;
  }
  
  .time-separator {
    @apply text-lg mx-0.5;
  }
}

/* Urgent state (less than 24 hours) */
.countdown.urgent .time-unit {
  @apply border-red-300 bg-red-50;
}

.countdown.urgent .time-value {
  @apply text-red-600;
  animation: urgentPulse 0.5s ease-in-out infinite;
}

.countdown.urgent .countdown-label {
  @apply text-red-600;
}

@keyframes urgentPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Very urgent state (less than 1 hour) */
.countdown.very-urgent .time-unit {
  @apply border-red-500 bg-red-100;
}

.countdown.very-urgent .time-value {
  @apply text-red-700;
  animation: veryUrgentPulse 0.3s ease-in-out infinite;
}

@keyframes veryUrgentPulse {
  0%, 100% {
    transform: scale(1);
    color: #b91c1c;
  }
  50% {
    transform: scale(1.15);
    color: #dc2626;
  }
}
</style>