<template>
  <div class="flex justify-center">
    <!-- Bouton pour ouvrir le dialogue -->
    <button
      @click="openDialog"
      class="w-full bg-primary-600 hover:bg-primary-700 text-white border border-primary-600 px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
    >
      <svg
        class="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        ></path>
      </svg>
      Payer
    </button>

    <!-- Dialogue modal avec iframe PayTech -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      @click="closeDialog"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden"
        @click.stop
      >
        <!-- Bouton X pour fermer -->
        <div class="absolute top-4 right-4 z-10">
          <button
            @click="closeDialog"
            class="bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 rounded-full p-2 shadow-lg transition-colors"
          >
            <svg
              class="w-6 h-6"
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
          </button>
        </div>

        <!-- Iframe PayTech -->
        <div class="relative" style="height: 95vh">
          <iframe
            v-if="paytechUrl"
            :src="paytechUrl"
            class="w-full h-full border-0"
            frameborder="0"
            allow="payment; fullscreen; autoplay; microphone; camera"
            sandbox="allow-same-origin allow-scripts allow-forms allow-top-navigation allow-popups allow-popups-to-escape-sandbox"
            @load="onIframeLoad"
            ref="paytechIframe"
          ></iframe>

          <!-- Indicateur de chargement -->
          <div
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center bg-gray-50"
          >
            <div class="text-center">
              <svg
                class="animate-spin h-8 w-8 text-green-600 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p class="text-gray-600">Chargement de PayTech...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { useFormatter } from "~/composables/useFormatter";

interface Props {
  totalAmount: number;
  orderData?: any;
}

const props = defineProps<Props>();
const { formatPrice } = useFormatter();

// État du dialogue
const isOpen = ref(false);
const isLoading = ref(false);
const paytechUrl = ref("");
const paytechIframe = ref<HTMLIFrameElement | null>(null);

// Émettre des événements vers le composant parent
const emit = defineEmits<{
  initiatePayment: [orderData: any];
  proceedToPayment: [orderData: any];
  paymentSuccess: [paymentData: any];
  paymentError: [error: any];
}>();

// Fonction pour ouvrir le dialogue
const openDialog = () => {
  console.log("Ouverture du dialogue PayTech");

  // Utiliser directement l'URL PayTech
  paytechUrl.value = `https://paytech.sn/payment/checkout/eey3kpmfj3h5tb`;

  isLoading.value = true;
  isOpen.value = true;

  // Bloquer le scroll du body
  if (process.client) {
    document.body.style.overflow = "hidden";
  }

  emit("initiatePayment", props.orderData);
};

// Fonction pour fermer le dialogue
const closeDialog = () => {
  console.log("Fermeture du dialogue PayTech");
  isOpen.value = false;
  paytechUrl.value = "";
  isLoading.value = false;

  // Restaurer le scroll du body
  if (process.client) {
    document.body.style.overflow = "";
  }
};

// Fonction appelée quand l'iframe se charge
const onIframeLoad = () => {
  console.log("Iframe PayTech chargée");
  isLoading.value = false;

  // Surveiller les changements d'URL de l'iframe
  if (paytechIframe.value) {
    const iframe = paytechIframe.value;

    // Intercepter les tentatives d'ouverture de nouveaux onglets
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      console.log("Tentative de navigation détectée");
      // Empêcher la navigation si nécessaire
    };

    iframe.addEventListener("beforeunload", handleBeforeUnload);

    // Nettoyer l'événement quand l'iframe se ferme
    const cleanup = () => {
      iframe.removeEventListener("beforeunload", handleBeforeUnload);
    };

    // Nettoyer après 30 secondes ou quand le dialogue se ferme
    setTimeout(cleanup, 30000);
  }
};

// Écouter les messages de l'iframe PayTech
const handleMessage = (event: MessageEvent) => {
  // Vérifier l'origine du message (PayTech)
  if (event.origin !== "https://paytech.sn") {
    return;
  }

  console.log("Message reçu de PayTech:", event.data);

  // Gérer les différents types de messages
  if (event.data.type === "payment_success") {
    console.log("Paiement réussi:", event.data);
    emit("paymentSuccess", event.data);
    closeDialog();
  } else if (event.data.type === "payment_error") {
    console.log("Erreur de paiement:", event.data);
    emit("paymentError", event.data);
  } else if (event.data.type === "payment_cancelled") {
    console.log("Paiement annulé");
    closeDialog();
  }
};

// Intercepter les tentatives d'ouverture de nouveaux onglets
const interceptWindowOpen = () => {
  if (process.client) {
    const originalOpen = window.open;
    window.open = function (url: string, name?: string, specs?: string) {
      console.log("Tentative d'ouverture détectée:", url);

      // Si c'est une URL PayTech, rediriger l'iframe au lieu d'ouvrir un nouvel onglet
      if (url && url.includes("paytech.sn")) {
        if (paytechIframe.value) {
          paytechIframe.value.src = url;
          return window;
        }
      }

      // Pour les autres URLs, utiliser le comportement normal
      return originalOpen.call(this, url, name, specs);
    };
  }
};

// Restaurer window.open quand le composant est détruit
const restoreWindowOpen = () => {
  if (process.client && window.open !== window.open) {
    // Restaurer la fonction originale si elle a été modifiée
    window.open = window.open;
  }
};

// Ajouter l'écouteur de messages au montage
if (process.client) {
  window.addEventListener("message", handleMessage);
  interceptWindowOpen();
}

// Nettoyer au démontage
onUnmounted(() => {
  if (process.client) {
    window.removeEventListener("message", handleMessage);
    restoreWindowOpen();

    // S'assurer que le scroll est restauré
    document.body.style.overflow = "";
  }
});
</script>
