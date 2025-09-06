<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- En-tête -->
    <AppHeader />

    <!-- Contenu principal -->
    <main class="flex-grow pt-16 md:pt-20">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>

    <!-- Panier latéral -->
    <CartSidebar />

    <!-- Notifications -->
    <NotificationContainer />

    <!-- Chargement global -->
    <Transition name="fade">
      <div
        v-if="isLoading"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="p-6 bg-white rounded-lg shadow-xl">
          <div class="flex items-center space-x-3">
            <div
              class="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"
            ></div>
            <span>Chargement...</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onErrorCaptured } from "vue";
import { useRoute } from "vue-router";

// État de chargement global
const isLoading = ref(true);
const route = useRoute();

// Initialisation de l'application
onMounted(() => {
  // Simuler un chargement initial
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);

  // Suivre les changements de route
  watch(
    () => route.path,
    () => {
      window.scrollTo(0, 0);
    }
  );
});

// Gestion des erreurs globales
onErrorCaptured((err) => {
  console.error("Erreur capturée:", err);
  // Ici, vous pourriez ajouter une notification d'erreur à l'utilisateur
  return false; // Empêche la propagation de l'erreur
});

// Configuration du head
useHead({
  htmlAttrs: {
    lang: "fr",
    class: "scroll-smooth",
  },
  bodyAttrs: {
    class: "antialiased text-gray-800 bg-gray-50",
  },
});
</script>

<style>
/* Transitions de page */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Animation de fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
