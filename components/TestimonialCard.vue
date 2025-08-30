<template>

  <div class="testimonial-card bg-white p-6 rounded-lg shadow-md">
    <div class="flex items-center mb-4">
      <div class="mr-4">
        <img 
          :src="testimonial.avatar" 
          :alt="testimonial.name"
          class="w-12 h-12 rounded-full object-cover"
        >
      </div>
      <div>
        <h4 class="font-medium text-gray-900">{{ testimonial.name }}</h4>
        <p class="text-sm text-gray-500">{{ testimonial.role }}</p>
      </div>
    </div>
    <p class="text-gray-700 italic">"{{ testimonial.comment }}"</p>
    <div class="mt-4 flex text-yellow-400">
      <span v-for="i in 5" :key="i">
        <svg 
          v-if="i <= testimonial.rating" 
          class="w-5 h-5 fill-current" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  testimonial: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      role: '',
      comment: '',
      rating: 5,
      avatar: ''
    })
  }
})
</script>

<style scoped>
.testimonial-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>