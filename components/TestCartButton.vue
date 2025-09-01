<!-- components/TestCartButton.vue -->
<template>
  <div
    class="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 space-y-3"
  >
    <h3 class="text-sm font-semibold text-gray-800">🧪 Test du Panier</h3>

    <div class="space-y-2">
      <button
        @click="addTestItems"
        class="w-full px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ➕ Ajouter articles test
      </button>

      <button
        @click="openCart"
        class="w-full px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
      >
        🛒 Ouvrir panier ({{ cartStore.itemCount }})
      </button>

      <button
        @click="clearCart"
        class="w-full px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
      >
        🗑️ Vider panier
      </button>

      <button
        @click="goToCheckout"
        class="w-full px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        ✅ Aller au checkout
      </button>
    </div>

    <div class="text-xs text-gray-600">
      <p>Articles: {{ cartStore.itemCount }}</p>
      <p>Total: {{ cartStore.total }} CFA</p>
    </div>

    <button
      @click="hideTestPanel"
      class="w-full px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
    >
      ❌ Fermer panel
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCartStore } from "~/stores/cart";

const cartStore = useCartStore();
const showPanel = ref(true);

// Ajouter des articles de test
const addTestItems = () => {
  cartStore.addTestItems();
  console.log("✅ Articles de test ajoutés");
};

// Ouvrir le panier
const openCart = () => {
  cartStore.isOpen = true;
  console.log("🛒 Panier ouvert");
};

// Vider le panier
const clearCart = () => {
  cartStore.clearCart();
  console.log("🗑️ Panier vidé");
};

// Aller au checkout directement
const goToCheckout = () => {
  if (cartStore.itemCount === 0) {
    console.warn("❌ Panier vide - impossible d'aller au checkout");
    return;
  }
  console.log("✅ Redirection vers checkout");
  navigateTo("/checkout");
};

// Fermer le panel de test
const hideTestPanel = () => {
  showPanel.value = false;
};
</script>
