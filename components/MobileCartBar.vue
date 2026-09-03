<!-- components/MobileCartBar.vue -->
<template>
  <Transition name="slide-up">
    <div
      v-if="cartStore.itemCount > 0 && !cartStore.isOpen"
      class="fixed bottom-16 left-3 right-3 z-40 md:hidden"
    >
      <div
        @click="cartStore.toggleCart()"
        class="bg-gradient-to-r from-[#0F3D91] to-[#1E56B7] text-white p-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between cursor-pointer transform active:scale-98 transition-all duration-200"
      >
        <!-- Item count & price info -->
        <div class="flex items-center gap-3">
          <div class="relative bg-white/20 p-2 rounded-xl flex items-center justify-center">
            <span class="text-xl">🛒</span>
            <span
              class="absolute -top-2 -right-2 bg-[#F4C542] text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce"
            >
              {{ cartStore.itemCount }}
            </span>
          </div>

          <div>
            <div class="text-xs font-medium text-blue-100">
              {{ cartStore.itemCount }} article{{ cartStore.itemCount > 1 ? 's' : '' }} dans le panier
            </div>
            <div class="text-base font-black tracking-tight text-white">
              {{ cartStore.total.toLocaleString("fr-FR") }} F CFA
            </div>
          </div>
        </div>

        <!-- Action CTA -->
        <button
          class="bg-[#F4C542] hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl font-extrabold text-xs shadow-md flex items-center gap-1.5 shrink-0"
        >
          <span>Voir panier</span>
          <span class="text-sm">→</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";

const cartStore = useCartStore();
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
