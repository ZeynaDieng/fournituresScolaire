<!-- components/BottomNav.vue -->
<template>
  <nav class="bottom-nav">
    <div class="flex justify-around items-center h-16">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item flex-1"
        :class="{
          'text-primary-green': $route.path === item.path,
          'text-gray-500': $route.path !== item.path,
        }"
      >
        <component :is="item.icon" class="w-6 h-6 mx-auto mb-1" />
        <span class="text-xs font-medium">{{ item.name }}</span>
      </NuxtLink>

      <!-- Cart with counter -->
      <button
        @click="cartStore.toggleCart()"
        class="nav-item flex-1 relative"
        :class="{
          'text-primary-green': cartStore.isOpen,
          'text-gray-500': !cartStore.isOpen,
        }"
      >
        <div class="relative mx-auto w-6 h-6 mb-1">
          <ShoppingCartIcon :width="24" :height="24" fill="currentColor" />

          <!-- Counter Badge -->
          <span
            v-if="cartStore.itemCount > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold animate-pulse"
          >
            {{ cartStore.itemCount > 99 ? "99+" : cartStore.itemCount }}
          </span>
        </div>
        <span class="text-xs font-medium">Panier</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import { useNavigation } from "~/composables/useNavigation";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon.vue";

const cartStore = useCartStore();

// Navigation items for mobile
const { navItems } = useNavigation();
</script>

<style scoped>
.bottom-nav {
  @apply fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 py-1;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.nav-item {
  @apply flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200;
  min-height: 60px;
}

.nav-item.router-link-active {
  @apply text-primary-green;
}

/* Animation pour le badge du panier */
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.3s ease-out;
}

/* Responsive adjustments */
@media (max-width: 375px) {
  .nav-item {
    @apply p-1;
  }

  .nav-item span {
    @apply text-[10px];
  }
}
</style>
