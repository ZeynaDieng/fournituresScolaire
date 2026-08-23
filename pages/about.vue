<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 pt-8 pb-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      
      <!-- 1. Hero Section (Screenshot 1) -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <!-- Left Text Column -->
        <div class="lg:col-span-6 space-y-6">
          <span class="text-[11px] font-extrabold uppercase tracking-widest text-[#0F3D91] block">
            NOTRE HISTOIRE
          </span>

          <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
            La rentrée<br />
            scolaire,<br />
            <span class="text-[#0F3D91] font-normal">réinventée</span> au<br />
            Sénégal.
          </h1>

          <div class="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            <p>
              EduShop, développé par la société mère MATKAM, est né d'un constat simple : chaque année, préparer la rentrée devient plus complexe pour les familles sénégalaises. Listes officielles introuvables, ruptures de stock, prix qui varient d'un magasin à l'autre. En 2024, nous avons décidé de construire la meilleure façon d'y remédier.
            </p>
            <p>
              Aujourd'hui, plus de 12 400 familles nous font confiance chaque année. Notre équipe de 18 personnes, basée à Dakar, travaille avec plus de 200 écoles partenaires pour que chaque enfant démarre l'année avec les bonnes fournitures.
            </p>
          </div>
        </div>

        <!-- Right Photo Column -->
        <div class="lg:col-span-6">
          <div class="rounded-[32px] overflow-hidden shadow-xl aspect-[4/3] relative bg-slate-100 border border-slate-200/60">
            <img
              :src="heroFamilyImg"
              alt="Maman et sa fille préparant les fournitures scolaires"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <!-- 2. Values Cards Section (Screenshot 1) -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Card 1 -->
        <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div class="w-10 h-10 rounded-full bg-blue-50 text-[#0F3D91] flex items-center justify-center font-bold text-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <div class="space-y-2">
            <h3 class="font-display text-xl font-extrabold text-slate-950">
              Familles d'abord
            </h3>
            <p class="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
              Chaque décision est prise pour rendre la rentrée plus simple pour les parents et les enfants.
            </p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div class="w-10 h-10 rounded-full bg-blue-50 text-[#0F3D91] flex items-center justify-center font-bold text-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
            </svg>
          </div>
          <div class="space-y-2">
            <h3 class="font-display text-xl font-extrabold text-slate-950">
              Qualité, sans compromis
            </h3>
            <p class="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
              Fournitures sélectionnées avec des enseignants. Rien n'entre au catalogue sans être testé.
            </p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div class="w-10 h-10 rounded-full bg-blue-50 text-[#0F3D91] flex items-center justify-center font-bold text-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="space-y-2">
            <h3 class="font-display text-xl font-extrabold text-slate-950">
              Prix justes
            </h3>
            <p class="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
              Nous négocions directement avec les fabricants pour offrir les meilleurs prix, sans frais cachés.
            </p>
          </div>
        </div>
      </section>

      <!-- 3. Notre Mission Royal Blue Banner Section (Screenshot 2) -->
      <section class="bg-[#0F3D91] rounded-[32px] p-8 sm:p-12 md:p-16 text-white shadow-lift relative overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 space-y-4">
            <span class="text-xs font-extrabold uppercase tracking-widest text-[#F4C542] block">
              NOTRE MISSION
            </span>
            <h2 class="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Que chaque enfant<br />
              démarre l'école
            </h2>
          </div>

          <div class="lg:col-span-5 space-y-6">
            <p class="text-white/80 text-sm md:text-base leading-relaxed font-normal">
              Pour 5 packs vendus, nous en offrons 1 à une famille en difficulté via nos écoles partenaires. Depuis 2024, plus de 2 800 enfants ont ainsi reçu leurs fournitures scolaires gratuitement.
            </p>

            <NuxtLink
              to="/contact"
              class="inline-block bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-sm"
            >
              Devenir partenaire
            </NuxtLink>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import heroFamilyImg from "~/assets/images/hero-family.jpg";

useHead({
  title: "À propos - EduShop Sénégal",
  meta: [
    {
      name: "description",
      content: "Découvrez notre histoire, nos engagements et notre mission pour simplifier la rentrée scolaire au Sénégal.",
    },
  ],
});
</script>
