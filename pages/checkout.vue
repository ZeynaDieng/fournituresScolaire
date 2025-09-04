<!-- pages/checkout.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Finaliser votre commande
        </h1>
        <p class="text-gray-600">
          Vérifiez vos articles et procédez au paiement sécurisé
        </p>
      </div>

      <!-- Message si panier vide -->
      <div v-if="cartItems.length === 0" class="text-center py-12">
        <div class="bg-white rounded-lg shadow-sm border p-8 max-w-md mx-auto">
          <svg
            class="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h3m0 0V5a2 2 0 012-2v0a2 2 0 012 2v2m-6 0h6"
            />
          </svg>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Votre panier est vide
          </h2>
          <p class="text-gray-600 mb-4">
            Ajoutez des articles à votre panier pour continuer
          </p>
          <NuxtLink
            to="/"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Continuer vos achats
          </NuxtLink>
        </div>
      </div>

      <!-- Contenu principal -->
      <div v-else class="max-w-5xl mx-auto">
        <!-- Formulaire de commande avec résumé intégré -->
        <CheckoutForm
          :cart-items="cartItems"
          :total-amount="totalAmount"
          @payment-success="handlePaymentSuccess"
          @payment-error="handlePaymentError"
          @payment-canceled="handlePaymentCanceled"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CartIcon from "~/components/icons/CartIcon.vue";
import { formatAmountForDisplay } from "~/utils/paytech";

// Meta
useHead({
  title: "Finaliser votre commande - EduShop",
  meta: [
    {
      name: "description",
      content:
        "Finalisez votre commande de fournitures scolaires en toute sécurité avec PayTech",
    },
  ],
});

// Store (avec fallbacks pour éviter les erreurs)
const cartStore = useCartStore?.() || {
  items: [],
  subtotal: 0,
  discount: 0,
  clearCart: () => {},
};

// Données de test pour le développement
const testCartItems = [
  {
    id: "test-1",
    name: "Cahier Spiral A4",
    price: 2500,
    quantity: 2,
    image: "/images/products/cahier-spiral.jpg",
    type: "product" as const,
    category: "Cahiers",
  },
  {
    id: "test-2",
    name: "Pack CP Complet",
    price: 15000,
    quantity: 1,
    image: "/images/products/pack-cp.jpg",
    type: "pack" as const,
    category: "Packs",
  },
];

const notifications = useNotifications?.() || {
  paymentSuccess: () => {},
  paymentError: () => {},
  paymentCanceled: () => {},
};

// États avec fallbacks sécurisés - utiliser données de test si panier vide
const cartItems = computed(() => {
  const storeItems = cartStore?.items || [];
  // Pour le développement, utiliser les données de test si le panier est vide
  if (storeItems.length === 0 && process.dev) {
    console.log("🧪 Utilisation des données de test pour le checkout");
    return testCartItems;
  }
  return storeItems;
});
const subtotal = computed(() => {
  if (cartItems.value === testCartItems) {
    return testCartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
  return cartStore?.subtotal || 0;
});
const shippingCost = computed(() => 2000); // Frais de livraison
const discount = computed(() => cartStore?.promoDiscount || 0);
const totalAmount = computed(
  () => subtotal.value + shippingCost.value - discount.value
);

// Méthodes
const formatAmount = (amount: number) => {
  return formatAmountForDisplay(amount);
};

const handlePaymentSuccess = (result: any) => {
  console.log("Paiement réussi:", result);

  try {
    if (notifications && notifications.paymentSuccess) {
      notifications.paymentSuccess(
        result.ref_command || "N/A",
        result.amount || totalAmount.value,
        result.payment_method
      );
    }
  } catch (e) {
    console.warn("Erreur notifications:", e);
  }

  // Vider le panier
  try {
    if (cartStore && cartStore.clearCart) {
      cartStore.clearCart();
    }
  } catch (e) {
    console.warn("Erreur clear cart:", e);
  }

  // Redirection vers la page de succès
  navigateTo(
    `/payment/success?ref=${result.ref_command}&amount=${
      result.amount
    }&method=${result.payment_method || ""}`
  );
};

const handlePaymentError = (error: any) => {
  console.error("Erreur de paiement:", error);

  try {
    if (notifications && notifications.paymentError) {
      notifications.paymentError(
        error.message || "Une erreur est survenue lors du paiement"
      );
    }
  } catch (e) {
    console.warn("Erreur notifications:", e);
  }
};

const handlePaymentCanceled = (data: any) => {
  console.log("Paiement annulé:", data);

  try {
    if (notifications && notifications.paymentCanceled) {
      notifications.paymentCanceled(data?.ref_command);
    }
  } catch (e) {
    console.warn("Erreur notifications:", e);
  }
};

// Vérifier l'accès middleware
definePageMeta({
  middleware: "paytech-config",
});
</script>
