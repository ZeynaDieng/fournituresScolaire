<!-- components/PaymentAlert.vue -->
<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-to-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
  >
    <div
      v-if="show"
      :class="[
        'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden',
        alertClass,
      ]"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <!-- Icône de succès -->
            <svg
              v-if="type === 'success'"
              class="h-5 w-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>

            <!-- Icône d'erreur -->
            <svg
              v-else-if="type === 'error'"
              class="h-5 w-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>

            <!-- Icône d'avertissement -->
            <svg
              v-else-if="type === 'warning'"
              class="h-5 w-5 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>

            <!-- Icône d'info -->
            <svg
              v-else
              class="h-5 w-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium" :class="titleClass">
              {{ title }}
            </p>
            <p v-if="message" class="mt-1 text-sm" :class="messageClass">
              {{ message }}
            </p>
          </div>

          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="close"
              :class="[
                'rounded-md inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2',
                closeButtonClass,
              ]"
            >
              <span class="sr-only">Fermer</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  type?: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: "info",
  autoClose: true,
  duration: 5000,
});

const emit = defineEmits<{
  close: [];
}>();

// État
const show = ref(true);

// Auto fermeture
if (props.autoClose) {
  setTimeout(() => {
    close();
  }, props.duration);
}

// Méthodes
const close = () => {
  show.value = false;
  setTimeout(() => {
    emit("close");
  }, 300);
};

// Styles calculés
const alertClass = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-green-50 border border-green-200";
    case "error":
      return "bg-red-50 border border-red-200";
    case "warning":
      return "bg-yellow-50 border border-yellow-200";
    default:
      return "bg-blue-50 border border-blue-200";
  }
});

const titleClass = computed(() => {
  switch (props.type) {
    case "success":
      return "text-green-900";
    case "error":
      return "text-red-900";
    case "warning":
      return "text-yellow-900";
    default:
      return "text-blue-900";
  }
});

const messageClass = computed(() => {
  switch (props.type) {
    case "success":
      return "text-green-700";
    case "error":
      return "text-red-700";
    case "warning":
      return "text-yellow-700";
    default:
      return "text-blue-700";
  }
});

const closeButtonClass = computed(() => {
  switch (props.type) {
    case "success":
      return "text-green-400 hover:text-green-500 focus:ring-green-500";
    case "error":
      return "text-red-400 hover:text-red-500 focus:ring-red-500";
    case "warning":
      return "text-yellow-400 hover:text-yellow-500 focus:ring-yellow-500";
    default:
      return "text-blue-400 hover:text-blue-500 focus:ring-blue-500";
  }
});
</script>
