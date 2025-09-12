<template>
  <section
    class="relative mt-20 flex items-center justify-center min-h-[600px] bg-gradient-to-br from-primary-600/10 to-accent-400/10 overflow-hidden"
  >
    <!-- Background with overlay -->
    <div class="absolute inset-0">
      <div
        class="absolute inset-0 bg-[url('@/assets/images/fournitureBanniere.png')] bg-cover bg-center"
      ></div>
      <div class="absolute inset-0 bg-black opacity-50"></div>
    </div>

    <!-- Floating circles with wave-like animation -->
    <div
      class="absolute top-10 left-10 w-40 h-40 bg-primary-600/10 rounded-full animate-wave-float-1"
    ></div>
    <div
      class="absolute top-32 right-20 w-32 h-32 bg-accent-400/10 rounded-full animate-wave-float-2"
    ></div>
    <div
      class="absolute bottom-20 left-1/4 w-24 h-24 bg-primary-600/10 rounded-full animate-wave-float-3"
    ></div>
    <div
      class="absolute bottom-32 right-1/3 w-48 h-48 bg-accent-400/10 rounded-full animate-wave-float-4"
    ></div>
    <div
      class="absolute top-1/2 left-1/2 w-20 h-20 bg-white/5 rounded-full animate-wave-float-5"
    ></div>
    <div
      class="absolute top-20 right-1/2 w-16 h-16 bg-primary-600/5 rounded-full animate-wave-float-6"
    ></div>

    <!-- Content -->
    <div class="container relative z-10 text-center mt-20 px-6">
      <h1
        class="text-4xl md:text-6xl font-bold mt-20 text-white drop-shadow-lg mb-6 typewriter-text"
      >
        <span class="typewriter-content">Préparez la rentrée sans stress</span>
        <span class="typewriter-cursor">|</span>
      </h1>

      <p
        class="text-lg md:text-2xl mb-10 text-white opacity-0 animate-fade-in-up max-w-3xl mx-auto"
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
          class="hero-btn-primary text-lg px-8 py-4 inline-flex rounded-full items-center justify-center gap-2 hover:scale-105 transform transition-all duration-300"
        >
          <span>Acheter un pack</span>
        </NuxtLink>

        <NuxtLink
          to="/products"
          class="hero-btn-secondary text-lg px-8 py-4 inline-flex rounded-full items-center justify-center gap-2 transition-all duration-300"
        >
          <span>Articles à l'unité</span>
        </NuxtLink>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg
        class="w-full h-12 sm:h-20 text-slate-50"
        fill="currentColor"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
      </svg>
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

/* Wave-like floating animations */
@keyframes wave-float-1 {
  0%,
  100% {
    transform: translateY(0) translateX(0) scale(1);
  }
  25% {
    transform: translateY(-20px) translateX(15px) scale(1.1);
  }
  50% {
    transform: translateY(-10px) translateX(-10px) scale(0.9);
  }
  75% {
    transform: translateY(-25px) translateX(5px) scale(1.05);
  }
}

@keyframes wave-float-2 {
  0%,
  100% {
    transform: translateY(0) translateX(0) scale(1);
  }
  33% {
    transform: translateY(-15px) translateX(-20px) scale(1.2);
  }
  66% {
    transform: translateY(-30px) translateX(10px) scale(0.8);
  }
}

@keyframes wave-float-3 {
  0%,
  100% {
    transform: translateY(0) translateX(0) scale(1);
  }
  20% {
    transform: translateY(-12px) translateX(8px) scale(1.15);
  }
  40% {
    transform: translateY(-8px) translateX(-12px) scale(0.85);
  }
  60% {
    transform: translateY(-18px) translateX(6px) scale(1.1);
  }
  80% {
    transform: translateY(-5px) translateX(-8px) scale(0.95);
  }
}

@keyframes wave-float-4 {
  0%,
  100% {
    transform: translateY(0) translateX(0) scale(1);
  }
  30% {
    transform: translateY(-25px) translateX(-15px) scale(1.3);
  }
  60% {
    transform: translateY(-15px) translateX(20px) scale(0.7);
  }
  90% {
    transform: translateY(-35px) translateX(-5px) scale(1.1);
  }
}

@keyframes wave-float-5 {
  0%,
  100% {
    transform: translateY(0) translateX(0) scale(1);
  }
  25% {
    transform: translateY(-8px) translateX(12px) scale(1.2);
  }
  50% {
    transform: translateY(-16px) translateX(-8px) scale(0.8);
  }
  75% {
    transform: translateY(-12px) translateX(6px) scale(1.1);
  }
}

@keyframes wave-float-6 {
  0%,
  100% {
    transform: translateY(0) translateX(0) scale(1);
  }
  40% {
    transform: translateY(-10px) translateX(-15px) scale(1.25);
  }
  80% {
    transform: translateY(-20px) translateX(10px) scale(0.75);
  }
}

/* Animation Classes */
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: var(--delay, 0s);
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 10s ease-in-out infinite;
}

/* Wave-like floating animation classes */
.animate-wave-float-1 {
  animation: wave-float-1 12s ease-in-out infinite;
}

.animate-wave-float-2 {
  animation: wave-float-2 10s ease-in-out infinite;
}

.animate-wave-float-3 {
  animation: wave-float-3 14s ease-in-out infinite;
}

.animate-wave-float-4 {
  animation: wave-float-4 16s ease-in-out infinite;
}

.animate-wave-float-5 {
  animation: wave-float-5 8s ease-in-out infinite;
}

.animate-wave-float-6 {
  animation: wave-float-6 11s ease-in-out infinite;
}

/* Typewriter effect */
.typewriter-text {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid transparent;
}

.typewriter-content {
  display: inline-block;
  animation: typewriter 3s steps(30, end) forwards;
  width: 0;
  overflow: hidden;
}

.typewriter-cursor {
  display: inline-block;
  animation: blink-cursor 1s infinite;
  color: #06610d;
  font-weight: normal;
  animation-iteration-count: infinite;
}

@keyframes typewriter {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

@keyframes blink-cursor {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
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

/* Additional utility classes for delays */
.animation-delay-200 {
  animation-delay: 200ms;
}
.animation-delay-400 {
  animation-delay: 400ms;
}
.animation-delay-600 {
  animation-delay: 600ms;
}

/* Force button colors to override any global styles */
.hero-btn-primary {
  background-color: #16a34a !important;
  color: white !important;
  border: none !important;
}

.hero-btn-primary:hover {
  background-color: #15803d !important;
  color: white !important;
  border: none !important;
}

.hero-btn-secondary {
  background-color: white !important;
  color: #374151 !important;
  border: 2px solid #e5e7eb !important;
}

.hero-btn-secondary:hover {
  background-color: #f9fafb !important;
  color: #374151 !important;
  border: 2px solid #16a34a !important;
}
</style>
