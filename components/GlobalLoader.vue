<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
    >
      <!-- Overlay avec pattern -->
      <div class="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

      <!-- Container principal -->
      <div class="relative z-10 flex flex-col items-center justify-center">
        <!-- Logo ou icône de l'application -->
        <div class="mb-8">
          <div
            class="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-logo-glow"
          >
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
          </div>
        </div>

        <!-- Spinner moderne -->
        <div class="relative mb-8">
          <!-- Particules flottantes -->
          <div
            class="absolute -top-4 -left-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"
            style="animation-delay: 0s"
          ></div>
          <div
            class="absolute -top-2 -right-6 w-2 h-2 bg-blue-400 rounded-full animate-pulse"
            style="animation-delay: 0.5s"
          ></div>
          <div
            class="absolute -bottom-4 -left-2 w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse"
            style="animation-delay: 1s"
          ></div>
          <div
            class="absolute -bottom-2 -right-4 w-3 h-3 bg-orange-400 rounded-full animate-pulse"
            style="animation-delay: 1.5s"
          ></div>

          <!-- Spinner principal -->
          <div class="relative">
            <!-- Spinner externe -->
            <div
              class="w-20 h-20 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"
            ></div>
            <!-- Spinner interne -->
            <div
              class="absolute top-2 left-2 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"
              style="animation-direction: reverse; animation-duration: 1.5s"
            ></div>
            <!-- Spinner central -->
            <div
              class="absolute top-4 left-4 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
              style="animation-duration: 2s"
            ></div>
            <!-- Point central -->
            <div
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"
            ></div>
          </div>
        </div>

        <!-- Texte de chargement -->
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-2 animate-pulse">
            {{ title }}
          </h2>
          <p class="text-sm text-gray-600 mb-6">
            {{ subtitle }}
          </p>

          <!-- Barre de progression dynamique -->
          <div class="w-80 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500 ease-out"
              :style="{ width: progress + '%' }"
            ></div>
          </div>

          <!-- Message de chargement dynamique -->
          <p class="text-xs text-gray-500 mt-4 transition-all duration-300">
            {{ message }}
          </p>

          <!-- Pourcentage -->
          <p class="text-xs text-gray-400 mt-2 font-mono">{{ progress }}%</p>
        </div>
      </div>

      <!-- Particules de fond -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute top-1/4 left-1/4 w-2 h-2 bg-green-300 rounded-full animate-float opacity-30"
          style="animation-delay: 0s"
        ></div>
        <div
          class="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float opacity-30"
          style="animation-delay: 1s"
        ></div>
        <div
          class="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-purple-300 rounded-full animate-float opacity-30"
          style="animation-delay: 2s"
        ></div>
        <div
          class="absolute bottom-1/4 left-1/3 w-1 h-1 bg-orange-300 rounded-full animate-float opacity-30"
          style="animation-delay: 0.5s"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  isLoading: boolean;
  title?: string;
  subtitle?: string;
  message?: string;
  progress?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Fournitures Scolaires",
  subtitle: "Préparation de votre expérience d'achat...",
  message: "Chargement...",
  progress: 0,
});
</script>

<style scoped>
/* Animation de fade améliorée */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Animation pour les particules */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Animation pour le logo */
@keyframes logoGlow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.6);
  }
}

.animate-logo-glow {
  animation: logoGlow 2s ease-in-out infinite;
}
</style>
