<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 pt-8 pb-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Eyebrow & Title -->
      <div class="text-center mb-12 space-y-2">
        <span class="text-[11px] font-extrabold uppercase tracking-widest text-[#0F3D91] block">
          FAVORIS
        </span>
        <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
          Ma Liste d'Envies
        </h1>
        <p class="text-slate-500 text-sm font-medium">
          Retrouvez tous vos produits favoris
        </p>
      </div>

      <!-- Wishlist Vide Card -->
      <div class="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm text-center space-y-6">
        <div class="w-16 h-16 mx-auto bg-[#0F3D91]/10 text-[#0F3D91] rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </div>

        <div class="space-y-2">
          <h3 class="font-display text-xl sm:text-2xl font-extrabold text-slate-950">
            Votre liste d'envies est vide
          </h3>
          <p class="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
            Ajoutez des produits à votre liste d'envies pour les retrouver facilement plus tard.
          </p>
        </div>

        <div class="pt-2">
          <NuxtLink
            to="/products"
            class="inline-flex items-center gap-3 px-8 py-4 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Découvrir nos produits</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Ma Liste d'Envies - EduShop Sénégal",
  description: "Retrouvez tous vos produits favoris dans votre liste d'envies.",
});
</script>
