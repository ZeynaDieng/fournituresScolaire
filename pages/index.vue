<!-- pages/index.vue - Lovable Cloned Design -->
<template>
  <div class="relative bg-[#FBFBFA] min-h-screen text-slate-900 font-sans">
    <!-- 1. Hero Section (Screenshot 1) -->
    <AppHeroSection />

    <!-- 2. Sélecteur de Niveau Scolaire (Screenshot 2) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" id="niveaux">
      <div class="max-w-3xl mb-12">
        <span class="text-xs font-bold uppercase tracking-widest text-[#0F3D91]">Étape 1 / 2 minutes</span>
        <h2 class="mt-3 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
          Pour quel niveau préparez-vous <span class="text-[#0F3D91]">la rentrée</span> ?
        </h2>
        <p class="mt-3 text-slate-600 text-sm md:text-base leading-relaxed font-normal">
          Un seul clic. Notre assistant construit ensuite votre liste, s'adapte à l'école, et prépare tout automatiquement.
        </p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="lv in levels"
          :key="lv.key"
          :to="`/packs?level=${lv.key}`"
          class="group relative bg-white/80 rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
        >
          <!-- Top Card Image Container (Full-bleed edge-to-edge) -->
          <div class="relative h-48 w-full mb-6 rounded-2xl bg-[#F8F6F0] overflow-hidden">
            <img :src="lv.image" :alt="lv.title" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
          </div>

          <div>
            <p class="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
              {{ lv.sub }}
            </p>
            <h3 class="font-display text-2xl font-extrabold text-slate-950 leading-tight">
              {{ lv.title }}
            </h3>
            
            <div class="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
              <span class="text-xs font-semibold text-slate-500">
                {{ lv.count }} packs disponibles
              </span>
              <span class="w-8 h-8 rounded-full bg-[#0F3D91] text-white flex items-center justify-center font-bold text-xs group-hover:bg-[#F4C542] group-hover:text-slate-950 transition-colors">
                ↗
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>



    <!-- 3. Notre Mission (Screenshot 3) -->
    <section class="bg-[#FBFBFA] border-y border-slate-200/70 py-16 md:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <!-- Left Column -->
          <div class="lg:col-span-5 space-y-4">
            <span class="text-xs font-bold uppercase tracking-widest text-[#0F3D91]">NOTRE MISSION</span>
            <h2 class="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 leading-tight">
              Rendre la rentrée <span class="text-[#0F3D91]">simple</span>, pour toutes les familles.
            </h2>
          </div>

          <!-- Right Column -->
          <div class="lg:col-span-7 space-y-6">
            <p class="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              Chaque année, plus de 3 millions d'enfants sénégalais font leur rentrée. Pour beaucoup de parents, c'est un mois de stress.
            </p>
            <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
              Trouver la bonne liste. Comparer les prix. Faire trois marchés différents. Oublier la moitié. Refaire un aller-retour la veille.
            </p>
            <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
              EduShop existe pour transformer ce marathon en un moment simple. Nous travaillons avec des enseignants sénégalais pour composer des packs exactement conformes aux programmes officiels — et nous livrons partout, jusqu'aux régions.
            </p>

            <!-- Stats Row -->
            <div class="pt-6 grid grid-cols-3 gap-6 border-t border-slate-200">
              <div>
                <span class="font-display text-3xl sm:text-4xl font-extrabold text-slate-950 block">3M+</span>
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mt-1">ENFANTS AU SÉNÉGAL</span>
              </div>
              <div>
                <span class="font-display text-3xl sm:text-4xl font-extrabold text-slate-950 block">14</span>
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mt-1">RÉGIONS LIVRÉES</span>
              </div>
              <div>
                <span class="font-display text-3xl sm:text-4xl font-extrabold text-slate-950 block">82</span>
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mt-1">ENSEIGNANTS PARTENAIRES</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Pack le plus choisi (Screenshot 4) -->
    <section class="bg-[#0F3D91] text-white py-16 md:py-24 overflow-hidden relative" id="pack-vedette">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <!-- Left Column -->
          <div class="lg:col-span-6 space-y-6">
            <span class="text-xs font-bold uppercase tracking-widest text-[#F4C542]">PACK LE PLUS CHOISI</span>
            <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Pack Primaire Complet
            </h2>
            <p class="text-white/80 text-sm sm:text-base leading-relaxed">
              Le pack le plus choisi par les parents. Conforme au programme officiel du Ministère de l'Éducation nationale du Sénégal.
            </p>

            <!-- Stats Grid 2x2 -->
            <div class="grid grid-cols-2 gap-6 pt-4 border-t border-b border-white/15 py-6">
              <div>
                <span class="font-display text-3xl font-extrabold text-[#F4C542] block">32</span>
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-white/70 block">ARTICLES INCLUS</span>
              </div>
              <div>
                <span class="font-display text-3xl font-extrabold text-[#F4C542] block">-21%</span>
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-white/70 block">VS ACHAT SÉPARÉ</span>
              </div>
              <div>
                <span class="font-display text-3xl font-extrabold text-[#F4C542] block">4.9/5</span>
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-white/70 block">587 AVIS</span>
              </div>
              <div>
                <span class="font-display text-3xl font-extrabold text-[#F4C542] block">48h</span>
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-white/70 block">LIVRAISON DAKAR</span>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="pt-2 flex flex-wrap gap-4 items-center">
              <NuxtLink
                to="/configurator"
                class="inline-flex items-center gap-2 rounded-full bg-[#F4C542] text-slate-950 px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider hover:bg-[#f5cb54] transition-all transform hover:scale-105"
              >
                <span>Personnaliser mon pack</span>
                <span>→</span>
              </NuxtLink>

              <NuxtLink
                to="/packs/pack-ce1"
                class="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-6 py-3.5 text-xs font-semibold hover:bg-white/10 transition-all"
              >
                <span>Voir la liste complète</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Right Column Card Image -->
          <div class="lg:col-span-6 relative">
            <div class="rounded-3xl overflow-hidden shadow-2xl bg-white p-6 aspect-[4/3] relative flex items-center justify-center">
              <img
                :src="packPrimaireImg"
                alt="Pack Primaire Complet"
                class="max-h-full max-w-full object-contain mix-blend-multiply transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>



    <!-- 5. Compléter votre pack - Un dernier détail ? (Screenshot 5) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" id="produits">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-[#0F3D91]">COMPLÉTER VOTRE PACK</span>
          <h2 class="mt-2 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
            Un dernier détail ?
          </h2>
          <p class="mt-2 text-slate-600 text-sm font-medium">
            Une calculatrice, une gourde, un sac — ajoutés en un clic à votre pack.
          </p>
        </div>
        <NuxtLink to="/products" class="mt-4 md:mt-0 text-xs font-bold text-[#0F3D91] hover:underline inline-flex items-center gap-1">
          <span>Tout le catalogue</span>
          <span>→</span>
        </NuxtLink>
      </div>

      <!-- 4 Product Cards Grid (Screenshot 5 - 2 colonnes en mobile) -->
      <div class="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        <NuxtLink
          v-for="product in catalogueProducts"
          :key="product.id"
          :to="`/products/${product.id}`"
          class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
        >
          <!-- Product Image Container (Full-bleed) -->
          <div class="relative aspect-square bg-[#F8F6F0] overflow-hidden">
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <!-- Product Details -->
          <div class="p-3 sm:p-5 space-y-2 flex-1 flex flex-col justify-between">
            <div>
              <span class="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                {{ product.brand }}
              </span>
              <h3 class="font-display text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0F3D91] transition-colors leading-snug line-clamp-2 min-h-[2rem]">
                {{ product.name }}
              </h3>
            </div>

            <div class="pt-2 sm:pt-3 flex items-center justify-between border-t border-slate-100">
              <span class="font-display text-xs sm:text-base font-extrabold text-slate-950">
                {{ product.priceFormatted }}
              </span>
              <span class="text-[10px] sm:text-xs font-bold text-slate-700 flex items-center gap-0.5 sm:gap-1">
                <span class="text-[#F4C542]">★</span> {{ product.rating }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- 6. Fonctionnalités - Bien plus qu'une boutique (Screenshot 1) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-slate-200/60" id="fonctionnalites">
      <div class="mb-10">
        <span class="text-[11px] font-extrabold uppercase tracking-widest text-[#0F3D91]">FONCTIONNALITÉS</span>
        <h2 class="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950">
          Bien plus qu'une boutique.
        </h2>
      </div>

      <!-- 6 Grid Box Container with Dynamic Hover Highlight -->
      <div class="bg-white rounded-3xl border-2 border-slate-200/80 overflow-hidden shadow-soft grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
        <!-- Card 1 -->
        <div class="group p-8 md:p-10 space-y-4 bg-white hover:bg-[#EBE3D5] transition-all duration-300">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-[#0F3D91] border border-blue-100 group-hover:border-[#0F3D91] flex items-center justify-center text-[#0F3D91] group-hover:text-white transition-all duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="font-display text-xl font-extrabold text-slate-950">Checklist officielle PDF</h3>
          <p class="text-slate-500 group-hover:text-slate-800 text-xs sm:text-sm font-medium leading-relaxed transition-colors">
            Téléchargez la liste imprimable officielle conforme aux programmes sénégalais.
          </p>
        </div>

        <!-- Card 2 -->
        <div class="group p-8 md:p-10 space-y-4 bg-white hover:bg-[#EBE3D5] transition-all duration-300">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-[#0F3D91] border border-blue-100 group-hover:border-[#0F3D91] flex items-center justify-center text-[#0F3D91] group-hover:text-white transition-all duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 class="font-display text-xl font-extrabold text-slate-950">Rentrée en un clic</h3>
          <p class="text-slate-500 group-hover:text-slate-800 text-xs sm:text-sm font-medium leading-relaxed transition-colors">
            Retrouvez le niveau de votre enfant et commandez tout en un seul clic.
          </p>
        </div>

        <!-- Card 3: Parrainage -->
        <div class="group p-8 md:p-10 space-y-4 bg-white hover:bg-[#EBE3D5] transition-all duration-300">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-[#0F3D91] border border-blue-100 group-hover:border-[#0F3D91] flex items-center justify-center text-[#0F3D91] group-hover:text-white transition-all duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="font-display text-xl font-extrabold text-slate-950">Parrainage</h3>
          <p class="text-slate-500 group-hover:text-slate-800 text-xs sm:text-sm font-medium leading-relaxed transition-colors">
            Recommandez EduShop à 3 parents et recevez 5 000 F CFA de bon d'achat.
          </p>
        </div>

        <!-- Card 4 -->
        <div class="group p-8 md:p-10 space-y-4 bg-white hover:bg-[#EBE3D5] transition-all duration-300 border-t border-slate-200/80">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-[#0F3D91] border border-blue-100 group-hover:border-[#0F3D91] flex items-center justify-center text-[#0F3D91] group-hover:text-white transition-all duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 class="font-display text-xl font-extrabold text-slate-950">Comparateur de packs</h3>
          <p class="text-slate-500 group-hover:text-slate-800 text-xs sm:text-sm font-medium leading-relaxed transition-colors">
            Comparez nos différentes formules de packs scolaires côte à côte.
          </p>
        </div>

        <!-- Card 5 -->
        <div class="group p-8 md:p-10 space-y-4 bg-white hover:bg-[#EBE3D5] transition-all duration-300 border-t border-slate-200/80">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-[#0F3D91] border border-blue-100 group-hover:border-[#0F3D91] flex items-center justify-center text-[#0F3D91] group-hover:text-white transition-all duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 class="font-display text-xl font-extrabold text-slate-950">Support WhatsApp</h3>
          <p class="text-slate-500 group-hover:text-slate-800 text-xs sm:text-sm font-medium leading-relaxed transition-colors">
            Assistance rapide 7j/7 en français et wolof via WhatsApp.
          </p>
        </div>

        <!-- Card 6 -->
        <div class="group p-8 md:p-10 space-y-4 bg-white hover:bg-[#EBE3D5] transition-all duration-300 border-t border-slate-200/80">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-[#0F3D91] border border-blue-100 group-hover:border-[#0F3D91] flex items-center justify-center text-[#0F3D91] group-hover:text-white transition-all duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 class="font-display text-xl font-extrabold text-slate-950">Fidélité EduShop</h3>
          <p class="text-slate-500 group-hover:text-slate-800 text-xs sm:text-sm font-medium leading-relaxed transition-colors">
            Cumulez des points à chaque achat et profitez de réductions exclusives.
          </p>
        </div>
      </div>
    </section>

    <!-- 7. Ce qu'ils disent - Témoignages (Carrousel Horizontal Glissant) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-slate-200/60 overflow-hidden" id="temoignages">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <span class="text-[11px] font-extrabold uppercase tracking-widest text-[#0F3D91]">CE QU'ILS DISENT</span>
          <h2 class="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950">
            <span class="text-[#0F3D91]">240</span> familles nous font confiance au Sénégal.
          </h2>
        </div>

        <!-- Flèches de Navigation Carrousel -->
        <div class="flex items-center gap-3 shrink-0">
          <button
            @click="scrollTestimonials(-1)"
            class="w-12 h-12 rounded-full border-2 border-slate-200 hover:border-[#0F3D91] hover:bg-[#0F3D91] hover:text-white text-slate-800 font-extrabold flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 text-lg"
            aria-label="Avis précédent"
          >
            ←
          </button>
          <button
            @click="scrollTestimonials(1)"
            class="w-12 h-12 rounded-full border-2 border-slate-200 hover:border-[#0F3D91] hover:bg-[#0F3D91] hover:text-white text-slate-800 font-extrabold flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 text-lg"
            aria-label="Avis suivant"
          >
            →
          </button>
        </div>
      </div>

      <!-- Piste de Cartes de Témoignages (Glissement Horizontal Fluidifié) -->
      <div
        ref="testimonialsTrack"
        class="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 px-1 scroll-smooth"
      >
        <div
          v-for="(item, index) in homeTestimonials"
          :key="index"
          class="w-[88vw] sm:w-[380px] md:w-[420px] shrink-0 snap-start bg-white rounded-3xl border-2 border-slate-200/80 p-6 sm:p-8 shadow-soft flex flex-col justify-between space-y-6 hover:border-[#0F3D91]/40 transition-all duration-300"
        >
          <div class="space-y-4">
            <div class="flex text-[#F4C542] text-sm gap-1">
              {{ item.stars }}
            </div>
            <p class="font-display text-base sm:text-lg font-bold text-slate-950 leading-snug">
              "{{ item.text }}"
            </p>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0F3D91] shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p class="font-bold text-xs text-slate-950">{{ item.name }}</p>
              <p class="text-[11px] text-slate-400 font-semibold">{{ item.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Dark CTA Banner (Screenshot 3) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="bg-[#0B132B] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
        <!-- Shield Icon -->
        <div class="w-10 h-10 rounded-full border border-[#F4C542]/40 bg-[#F4C542]/10 flex items-center justify-center text-[#F4C542] mb-6">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h2 class="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
          La rentrée de votre enfant, <span class="text-[#F4C542]">réglée ce soir.</span>
        </h2>

        <p class="text-white/70 text-sm sm:text-base font-medium mb-8 max-w-lg">
          Deux minutes pour choisir le pack de votre enfant. Zéro stress. Livraison rapide partout au Sénégal.
        </p>

        <div class="flex flex-wrap items-center gap-4">
          <NuxtLink
            to="/packs"
            class="bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-extrabold text-xs sm:text-sm px-8 py-4 rounded-full shadow-md hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <span>Commander mon pack</span>
            <span>→</span>
          </NuxtLink>

          <a
            href="https://wa.me/221777780456"
            target="_blank"
            class="border border-white/25 hover:bg-white/10 text-white font-bold text-xs sm:text-sm px-7 py-4 rounded-full transition-all inline-flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Parler à un conseiller</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAirtableStore } from "~/stores/airtable";
import { useProductsStore } from "~/stores/products";
import packPrimaireImg from "~/assets/images/pack-primaire.jpg";
import AppHeroSection from "~/components/AppHeroSection.vue";

const airtableStore = useAirtableStore();
const productsStore = useProductsStore();

const testimonialsTrack = ref<HTMLElement | null>(null);

const scrollTestimonials = (direction: number) => {
  if (!testimonialsTrack.value) return;
  const scrollAmount = 380 * direction;
  testimonialsTrack.value.scrollBy({ left: scrollAmount, behavior: "smooth" });
};

const homeTestimonials = [
  {
    stars: "★★★★★",
    text: "En 10 minutes j'avais commandé le pack CM1 de mon fils. Livré à domicile dès le lendemain.",
    name: "Aïssatou D.",
    role: "Maman d'élève à Dakar",
  },
  {
    stars: "★★★★★",
    text: "Fini le stress et les allers-retours au marché Sandaga sous la chaleur. Les fournitures sont d'excellente qualité.",
    name: "Moussa S.",
    role: "Parent d'élève à Thiès",
  },
  {
    stars: "★★★★★",
    text: "Je recommande EduShop à tous les parents. Les packs préparés sont 100% conformes au programme scolaire.",
    name: "Fatou N.",
    role: "Institutrice à Mbour",
  },
  {
    stars: "★★★★★",
    text: "Service client très réactif sur WhatsApp. La livraison a été ponctuelle et les cahiers parfaitement emballés.",
    name: "Ousmane K.",
    role: "Parent d'élève à Saint-Louis",
  },
  {
    stars: "★★★★★",
    text: "Gain de temps formidable pour la rentrée. Prix très compétitifs et paiement facile par Wave.",
    name: "Mariama B.",
    role: "Maman d'élève à Ziguinchor",
  },
];

onMounted(async () => {
  if (productsStore.products.length === 0) {
    productsStore.initializeDemoData();
  }
  if (airtableStore.products.length === 0) {
    await airtableStore.initialize();
  }
});

// Niveaux scolaires avec décompte dynamique en temps réel des packs existants
const levels = computed(() => {
  const allPacks = (airtableStore.packs && airtableStore.packs.length > 0)
    ? airtableStore.packs
    : productsStore.packs;

  const countForLevel = (key: string) => {
    return allPacks.filter((p: any) => {
      const levelStr = (p.schoolLevel || p.level || p.niveau || "").toLowerCase();
      const nameStr = (p.name || p.nom || "").toLowerCase();
      const text = `${levelStr} ${nameStr}`;

      if (key === "prescolaire") {
        return (
          text.includes("prescolaire") ||
          text.includes("préscolaire") ||
          text.includes("maternelle") ||
          text.includes("tps") ||
          text.includes("ps") ||
          text.includes("ms") ||
          text.includes("gs")
        );
      }
      if (key === "primaire") {
        return (
          text.includes("primaire") ||
          text.includes("elementaire") ||
          text.includes("élémentaire") ||
          /\b(ci|cp|ce1|ce2|cm1|cm2)\b/i.test(text)
        );
      }
      if (key === "college") {
        return (
          text.includes("college") ||
          text.includes("collège") ||
          /\b(6e|6eme|6ème|5e|5eme|5ème|4e|4eme|4ème|3e|3eme|3ème)\b/i.test(text)
        );
      }
      if (key === "lycee") {
        return (
          text.includes("lycee") ||
          text.includes("lycée") ||
          /\b(2nde|seconde|1ere|1ère|premiere|première|term|terminale|tle)\b/i.test(text)
        );
      }
      return false;
    }).length;
  };

  return [
    {
      key: "prescolaire",
      title: "Préscolaire",
      sub: "3 – 5 ANS",
      count: countForLevel("prescolaire"),
      image: "https://i.pinimg.com/736x/8c/4f/b8/8c4fb8bd40f1a67e063ffb2223f4190b.jpg",
    },
    {
      key: "primaire",
      title: "Primaire",
      sub: "CP – CM2",
      count: countForLevel("primaire"),
      image: "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
    },
    {
      key: "college",
      title: "Collège",
      sub: "6ᵉ – 3ᵉ",
      count: countForLevel("college"),
      image: "https://i.pinimg.com/736x/10/54/a3/1054a36c0ce9460b0a1e2aafa65c9a20.jpg",
    },
    {
      key: "lycee",
      title: "Lycée",
      sub: "2NDE – TERM.",
      count: countForLevel("lycee"),
      image: "https://i.pinimg.com/736x/4c/27/58/4c275881308b4ae3956c80856018a375.jpg",
    },
  ];
});

// Produits réels liés aux fiches détails (Screenshot 5)
const catalogueProducts = computed(() => {
  let customProds: any[] = [];
  if (process.client) {
    customProds = JSON.parse(localStorage.getItem("custom_products") || "[]");
  }
  const storeProds = [...customProds, ...productsStore.products];
  if (storeProds.length > 0) {
    return storeProds.slice(0, 4).map((p) => {
      const priceVal = Number(p.sellingPrice || p.price || p.Price || 300);
      return {
        id: p.id,
        brand: p.category ? p.category.toUpperCase() : "EDUSHOP",
        name: p.name || p.Name || "Produit",
        priceFormatted: `${priceVal.toLocaleString("fr-FR")} F CFA`,
        rating: "4.9",
        image: p.image || p["Image URL"] || "https://i.pinimg.com/736x/4c/27/58/4c275881308b4ae3956c80856018a375.jpg",
      };
    });
  }
  return [
    {
      id: "cahier-96p",
      brand: "EDUSHOP",
      name: "Cahier 96 pages",
      priceFormatted: "500 F CFA",
      rating: "4.9",
      image: "https://i.pinimg.com/1200x/4e/99/18/4e991885818a6f5d75c158915c667798.jpg",
    },
    {
      id: "stylo-bille-bleu",
      brand: "BIC",
      name: "Stylo Bille Bleu",
      priceFormatted: "100 F CFA",
      rating: "4.8",
      image: "https://i.pinimg.com/736x/f3/c3/96/f3c396b6166cb46d61cafa6656cce35c.jpg",
    },
    {
      id: "cahier-120p",
      brand: "CLAIRECONTAINE",
      name: "Cahier 200 pages grand format",
      priceFormatted: "600 F CFA",
      rating: "4.9",
      image: "https://i.pinimg.com/736x/fd/f9/0b/fdf90bf685ccedf53d0297c5133f3678.jpg",
    },
    {
      id: "stylo-plume",
      brand: "FABER-CASTELL",
      name: "Stylo Plume avec cartouches",
      priceFormatted: "1 200 F CFA",
      rating: "4.9",
      image: "https://i.pinimg.com/1200x/c8/09/0d/c8090d67a9b7cea8c1e1157f2ef4f40c.jpg",
    },
  ];
});




</script>

