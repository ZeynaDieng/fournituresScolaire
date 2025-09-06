<template>
  <section
    class="relative py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden"
  >
    <!-- Background decoration -->
    <div class="absolute inset-0 opacity-30">
      <div
        class="absolute top-10 left-10 w-32 h-32 bg-green-100 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-10 right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-100 rounded-full blur-2xl"
      ></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          Témoignages clients
        </div>

        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Ce que disent nos
          <span class="text-transparent bg-clip-text bg-green-700">
            clients
          </span>
        </h2>

        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Des milliers de parents satisfaits nous font confiance pour
          accompagner leurs enfants
        </p>
      </div>

      <!-- Testimonials Carousel -->
      <div class="relative max-w-6xl mx-auto">
        <!-- Loading state -->
        <div
          v-if="airtableStore.loading && displayedTestimonials.length === 0"
          class="rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 p-8 shadow-2xl shadow-black/10"
        >
          <div class="animate-pulse">
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                <div class="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              <div class="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div class="flex space-x-1 mt-4">
              <div
                v-for="n in 5"
                :key="n"
                class="w-4 h-4 bg-gray-200 rounded"
              ></div>
            </div>
          </div>
        </div>

        <!-- Main carousel container -->
        <div v-else class="relative overflow-hidden">
          <div
            class="rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 p-1 shadow-2xl shadow-black/10"
          >
            <div
              class="flex transition-all duration-700 ease-out"
              :style="{
                transform: `translateX(-${currentTestimonial * 100}%)`,
              }"
            >
              <TestimonialCard
                v-for="(testimonial, index) in displayedTestimonials"
                :key="testimonial.id || index"
                :testimonial="testimonial"
                class="min-w-full"
              />
            </div>
          </div>
        </div>

        <!-- Carousel indicators -->
        <div
          class="flex justify-center mt-8 gap-3"
          v-if="displayedTestimonials.length > 1"
        >
          <button
            v-for="(_, index) in displayedTestimonials"
            :key="index"
            @click="currentTestimonial = index"
            class="group relative"
          >
            <div
              class="w-3 h-3 rounded-full transition-all duration-300"
              :class="{
                'bg-gradient-to-r from-green-500 to-blue-500 scale-125':
                  currentTestimonial === index,
                'bg-gray-300 hover:bg-gray-400': currentTestimonial !== index,
              }"
            />
            <!-- Progress indicator for active dot -->
            <div
              v-if="currentTestimonial === index"
              class="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 animate-ping opacity-30"
            />
          </button>
        </div>

        <!-- Auto-cycle indicator (optional) -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from "vue";

// Props
const props = defineProps<{
  testimonials?: any[];
  limit?: number;
  autoCycle?: boolean;
  cycleDuration?: number;
}>();

// Stores
const airtableStore = useAirtableStore();

// State
const currentTestimonial = ref(0);
let autoCycleInterval: NodeJS.Timeout | null = null;

// Computed properties
const displayedTestimonials = computed(() => {
  const testimonials = props.testimonials || airtableStore.activeTestimonials;
  if (props.limit && props.limit > 0) {
    return testimonials.slice(0, props.limit);
  }
  return testimonials;
});

// Auto-cycle functionality
const startAutoCycle = () => {
  if (props.autoCycle && displayedTestimonials.value.length > 1) {
    autoCycleInterval = setInterval(() => {
      currentTestimonial.value =
        (currentTestimonial.value + 1) % displayedTestimonials.value.length;
    }, props.cycleDuration || 5000);
  }
};

const stopAutoCycle = () => {
  if (autoCycleInterval) {
    clearInterval(autoCycleInterval);
    autoCycleInterval = null;
  }
};

// Lifecycle
onMounted(() => {
  startAutoCycle();
});

onUnmounted(() => {
  stopAutoCycle();
});

// Watch for changes in testimonials to restart auto-cycle
watch(
  () => displayedTestimonials.value.length,
  (newLength) => {
    if (newLength > 0 && currentTestimonial.value >= newLength) {
      currentTestimonial.value = 0;
    }
    stopAutoCycle();
    startAutoCycle();
  }
);
</script>

<style scoped>
/* Smooth transitions for carousel */
.carousel-enter-active,
.carousel-leave-active {
  transition: all 0.7s ease-out;
}

.carousel-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.carousel-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Custom scrollbar for carousel if needed */
.carousel-container::-webkit-scrollbar {
  display: none;
}

.carousel-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
