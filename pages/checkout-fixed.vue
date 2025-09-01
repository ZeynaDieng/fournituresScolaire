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
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulaire de commande -->
        <div class="lg:col-span-2">
          <CheckoutForm
            :cart-items="cartItems"
            :total-amount="totalAmount"
            @payment-success="handlePaymentSuccess"
            @payment-error="handlePaymentError"
            @payment-canceled="handlePaymentCanceled"
          />
        </div>

        <!-- Résumé de la commande -->
        <div class="lg:col-span-1">
          <div class="sticky top-8">
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">
                Résumé de la commande
              </h2>

              <!-- Articles -->
              <div class="space-y-3 mb-4 max-h-60 overflow-y-auto">
                <div
                  v-for="item in cartItems"
                  :key="item.id"
                  class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <img
                        :src="item.image || '/images/placeholder.jpg'"
                        :alt="item.name"
                        class="w-12 h-12 object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-900">
                        {{ item.name }}
                      </h3>
                      <p class="text-sm text-gray-500">
                        Quantité: {{ item.quantity }}
                      </p>
                    </div>
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatAmount(item.price * item.quantity) }}
                  </div>
                </div>
              </div>

              <!-- Totaux -->
              <div class="space-y-2 pt-4 border-t border-gray-200">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Sous-total</span>
                  <span class="text-gray-900">{{
                    formatAmount(subtotal)
                  }}</span>
                </div>

                <div
                  v-if="shippingCost > 0"
                  class="flex justify-between text-sm"
                >
                  <span class="text-gray-600">Livraison</span>
                  <span class="text-gray-900">{{
                    formatAmount(shippingCost)
                  }}</span>
                </div>

                <div
                  v-if="discount > 0"
                  class="flex justify-between text-sm text-green-600"
                >
                  <span>Réduction</span>
                  <span>-{{ formatAmount(discount) }}</span>
                </div>

                <div
                  class="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200"
                >
                  <span>Total</span>
                  <span>{{ formatAmount(totalAmount) }}</span>
                </div>
              </div>

              <!-- Sécurité -->
              <div
                class="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
              >
                <div class="flex items-center">
                  <svg
                    class="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span class="text-sm text-green-800 font-medium">
                    Paiement 100% sécurisé
                  </span>
                </div>
                <p class="text-xs text-green-700 mt-1">
                  Vos données sont protégées par PayTech
                </p>
              </div>

              <!-- Méthodes de paiement acceptées -->
              <div class="mt-4">
                <p class="text-sm font-medium text-gray-900 mb-2">
                  Moyens de paiement acceptés:
                </p>
                <div class="flex items-center space-x-2 text-sm text-gray-600">
                  <span>📱 Mobile Money</span>
                  <span>•</span>
                  <span>💳 Cartes</span>
                  <span>•</span>
                  <span>🌊 Wave</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const notifications = useNotifications?.() || {
  paymentSuccess: () => {},
  paymentError: () => {},
  paymentCanceled: () => {},
};

// États avec fallbacks sécurisés
const cartItems = computed(() => cartStore?.items || []);
const subtotal = computed(() => cartStore?.subtotal || 0);
const shippingCost = computed(() => 0); // Livraison gratuite pour l'instant
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
