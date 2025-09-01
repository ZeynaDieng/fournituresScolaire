<template>
  <Transition name="slide-fade">
    <div
      v-if="cartStore.isOpen"
      class="fixed inset-0 z-50 flex justify-end"
      @click.self="cartStore.toggleCart"
    >
      <div
        class="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-semibold">Votre Panier</h2>
          <button
            @click="cartStore.toggleCart"
            class="p-2 rounded-full hover:bg-gray-100"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Cart Items -->
        <div
          v-if="cartStore.items.length > 0"
          class="flex-grow overflow-y-auto p-4 space-y-4"
        >
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex items-center space-x-4"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-16 h-16 object-cover rounded-lg"
            />
            <div class="flex-grow">
              <h3 class="font-semibold">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">
                {{ item.price }} CFA x {{ item.quantity }}
              </p>
            </div>
            <div class="font-semibold">
              {{ item.price * item.quantity }} CFA
            </div>
            <button
              @click="cartStore.removeItem(item.id)"
              class="text-red-500 hover:text-red-700"
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty Cart -->
        <div
          v-else
          class="flex-grow flex flex-col items-center justify-center text-center p-4"
        >
          <svg
            class="w-16 h-16 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.5 5M4.5 20.5a.5.5 0 11-1 0 .5.5 0 011 0zm15 0a.5.5 0 11-1 0 .5.5 0 011 0z"
            ></path>
          </svg>
          <p class="text-gray-500">Votre panier est vide.</p>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t">
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-semibold">Total</span>
            <span class="text-xl font-bold">{{ cartStore.total }} CFA</span>
          </div>
          <button
            :disabled="cartStore.items.length === 0"
            @click="handleCheckout"
            class="w-full bg-primary-green text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Valider la commande
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
const cartStore = useCartStore();

// Gérer le clic sur "Valider la commande"
const handleCheckout = () => {
  if (cartStore.items.length === 0) {
    console.warn("❌ Panier vide - impossible de continuer");
    return;
  }

  console.log(
    "✅ Redirection vers /checkout avec",
    cartStore.items.length,
    "articles"
  );

  // Fermer le panier
  cartStore.toggleCart();

  // Rediriger vers checkout
  navigateTo("/checkout");
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
