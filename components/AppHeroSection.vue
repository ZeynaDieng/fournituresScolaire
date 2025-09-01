<template>
  <section
    class="relative flex items-center justify-center min-h-[600px] bg-gradient-to-br from-primary-green/10 to-primary-yellow/10 overflow-hidden"
  >
    <!-- Background with overlay -->
    <div class="absolute inset-0">
      <div
        class="absolute inset-0 bg-[url('@/assets/images/fournitureBanniere.png')] bg-cover bg-center"
      ></div>
      <div class="absolute inset-0 bg-black opacity-50"></div>
    </div>

    <!-- Floating circles -->
    <div
      class="absolute top-10 left-10 w-40 h-40 bg-primary-green/10 rounded-full animate-float-slow"
    ></div>
    <div
      class="absolute top-32 right-20 w-32 h-32 bg-primary-yellow/10 rounded-full animate-float-medium"
    ></div>
    <div
      class="absolute bottom-20 left-1/4 w-24 h-24 bg-primary-green/10 rounded-full animate-float-slow"
    ></div>
    <div
      class="absolute bottom-32 right-1/3 w-48 h-48 bg-primary-yellow/10 rounded-full animate-float-medium"
    ></div>

    <!-- Content -->
    <div class="container relative z-10 text-center px-6">
      <h1
        class="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-6 opacity-0 animate-fade-in-up"
        style="--delay: 0.1s"
      >
        Préparez la rentrée sans stress
      </h1>

      <p
        class="text-lg md:text-2xl text-white mb-10 opacity-0 animate-fade-in-up max-w-3xl mx-auto"
        style="--delay: 0.3s"
      >
        Tous vos packs scolaires et fournitures livrés à domicile partout à
        Dakar
      </p>

      <!-- CTA Buttons -->
      <div
        class="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-fade-in-up"
        style="--delay: 0.5s"
      >
        <NuxtLink
          to="/packs"
          class="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 hover:scale-105 transform transition-all duration-300"
        >
          <span>🎯</span>
          <span>Acheter un pack</span>
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </NuxtLink>

        <NuxtLink
          to="/products"
          class="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors duration-300"
        >
          <span>📝</span>
          <span>Articles à l'unité</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Keyframes for animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-10px) translateX(10px);
  }
}

@keyframes float-medium {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-15px) translateX(-10px);
  }
}

/* Animation Classes */
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: var(--delay, 0s);
  animation-delay: var(--delay, 0s);
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 10s ease-in-out infinite;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Button Styles */
.btn-primary {
  @apply bg-primary-green hover:bg-primary-dark-green text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5;
}

.btn-secondary {
  @apply bg-white text-gray-800 border-2 border-gray-200 hover:border-primary-green font-semibold rounded-xl transition-all duration-300 hover:bg-gray-50;
}

/* Section Styles */
.section {
  @apply py-16 md:py-24;
}

.section-title {
  @apply text-3xl md:text-4xl font-bold text-primary-dark-green mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-green to-primary-dark-green;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(
      90deg,
      var(--primary-green),
      var(--primary-dark-green)
    );
    border-radius: 3px;
  }
}

.pack-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8;
}

.product-grid {
  @apply grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6;
}

/* Grid Pattern */
.grid-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  background-size: 60px 60px;
}

.btn-primary {
  @apply bg-primary-green text-white font-bold rounded-full shadow-lg hover:bg-primary-dark-green transition-all duration-300 transform hover:-translate-y-1;
}

.btn-secondary {
  @apply bg-white text-primary-green font-bold rounded-full shadow-md hover:shadow-xl border border-primary-light-green hover:border-primary-green transition-all duration-300 transform hover:-translate-y-1;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes pulse-cta {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse-cta {
  animation: pulse-cta 2s infinite ease-in-out;
}

.animation-delay-200 {
  animation-delay: 200ms;
}
.animation-delay-400 {
  animation-delay: 400ms;
}
.animation-delay-600 {
  animation-delay: 600ms;
}
</style>
