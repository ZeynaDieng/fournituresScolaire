<!-- pages/cart.vue - Mon Panier Rentrée Zen Pro -->
<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 font-sans pt-20 pb-28">
    <section class="container-edu pt-8 pb-6">
      <span class="eyebrow">Mon Panier</span>
      <h1 class="mt-3 font-display text-4xl md:text-5xl font-extrabold text-[#0F3D91]">
        Votre commande scolaires
      </h1>
    </section>

    <div class="container-edu grid gap-10 lg:grid-cols-12">
      <!-- Cart Items List -->
      <div class="lg:col-span-8 space-y-6">
        <div v-if="cartStore.items.length === 0" class="bg-white rounded-3xl p-12 text-center border-2 border-slate-200 shadow-soft">
          <span class="text-6xl">🎒</span>
          <h2 class="mt-4 font-display text-2xl font-bold text-[#0F3D91]">Votre panier est vide</h2>
          <p class="mt-2 text-slate-500 text-sm">Utilisez notre assistant pour composer la rentrée de votre enfant en 2 minutes.</p>
          <NuxtLink
            to="/configurator"
            class="mt-6 inline-flex items-center gap-2 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition-all"
          >
            <span>Lancer l'assistant rentrée →</span>
          </NuxtLink>
        </div>

        <ul v-else class="divide-y divide-slate-200 border-y border-slate-200 bg-white rounded-3xl p-6 shadow-soft">
          <li v-for="item in cartStore.items" :key="item.id" class="py-5 flex gap-4 items-center">
            <img :src="item.image" :alt="item.name" class="h-20 w-20 rounded-2xl object-cover bg-slate-100 shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="font-bold text-[#0F3D91] text-base truncate">{{ item.name }}</p>
              <p class="text-xs text-slate-500 mt-0.5">{{ formatPrice(item.price) }} / unité</p>
            </div>

            <!-- Quantity Counter -->
            <div class="inline-flex items-center border-2 border-slate-200 rounded-full p-1 bg-slate-50">
              <button
                @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-slate-700 font-bold text-xs"
              >
                -
              </button>
              <span class="w-8 text-center text-xs font-extrabold text-slate-900">{{ item.quantity }}</span>
              <button
                @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-slate-700 font-bold text-xs"
              >
                +
              </button>
            </div>

            <p class="font-display font-extrabold text-[#0F3D91] text-lg w-28 text-right shrink-0">
              {{ formatPrice(item.price * item.quantity) }}
            </p>

            <button
              @click="cartStore.removeItem(item.id)"
              class="w-9 h-9 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
              title="Supprimer"
            >
              ✕
            </button>
          </li>
        </ul>
      </div>

      <!-- Order Summary -->
      <div v-if="cartStore.items.length > 0" class="lg:col-span-4">
        <div class="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-lift space-y-6">
          <h2 class="font-display text-2xl font-extrabold text-[#0F3D91]">Récapitulatif</h2>

          <div class="space-y-3 text-sm text-slate-600 font-medium">
            <div class="flex justify-between">
              <span>Sous-total fournitures</span>
              <span class="font-bold text-slate-900">{{ formatPrice(cartStore.totalAmount) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Frais de livraison</span>
              <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">Choix à l'étape suivante</span>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 flex items-end justify-between">
            <div>
              <p class="text-xs uppercase tracking-widest text-slate-400 font-bold">Total fournitures</p>
              <p class="font-display text-3xl font-extrabold text-[#0F3D91] mt-1">{{ formatPrice(cartStore.totalAmount) }}</p>
            </div>
          </div>

          <NuxtLink
            to="/checkout"
            class="block text-center bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-bold text-sm py-4 rounded-full shadow-md hover:scale-105 transition-all"
          >
            Valider & payer commande →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import { useFormatter } from "~/composables/useFormatter";

const cartStore = useCartStore();
const { formatPrice } = useFormatter();
</script>
