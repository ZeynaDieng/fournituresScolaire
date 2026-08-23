<template>
  <section class="relative min-h-[90vh] flex items-center pt-24 pb-20 overflow-hidden text-white">
    <!-- Photo de fond principale (Exact Vite asset imported) -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: 'url(' + heroFamilyImg + ')' }"
    ></div>

    <!-- Overlay sombre pour contraster le texte -->
    <div class="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
      <div class="max-w-3xl space-y-6">
        <!-- Headline principal -->
        <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
          Préparez toute la rentrée<br />
          <span class="text-[#F4C542]">en moins de 2 minutes.</span>
        </h1>

        <!-- Subhead -->
        <p class="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
          Choisissez la classe de votre enfant. Nous préparons automatiquement la liste officielle. Vous n'avez plus qu'à valider.
        </p>

        <!-- CTA Buttons Row -->
        <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <NuxtLink
            to="/configurator"
            class="inline-flex items-center justify-center gap-2 bg-[#F4C542] hover:bg-[#e0b230] text-slate-950 font-extrabold text-sm px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <span>Commencer l'assistant →</span>
          </NuxtLink>

          <NuxtLink
            to="/packs"
            class="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-8 py-4 rounded-full backdrop-blur-md ring-1 ring-white/30 transition-all"
          >
            <span>Découvrir les packs</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import heroFamilyImg from "~/assets/images/hero-family.jpg";

const stats = [
  { key: "12 400+", label: "familles servies" },
  { key: "48h", label: "livraison Dakar" },
  { key: "98%", label: "satisfaction" },
  { key: "-25%", label: "vs séparé" },
];
</script>
