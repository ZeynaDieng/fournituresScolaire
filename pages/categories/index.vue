<!-- pages/categories/index.vue -->
<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 pt-4 sm:pt-8 pb-24 relative">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
      
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 font-medium">
        <NuxtLink to="/" class="hover:text-[#0F3D91] transition-colors">Accueil</NuxtLink>
        <svg class="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
        </svg>
        <span class="text-slate-900 font-bold">Catégories</span>
      </nav>

      <!-- Category Header -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-3">
        <span class="px-3 py-1 bg-[#0F3D91]/10 text-[#0F3D91] rounded-full text-xs font-extrabold uppercase tracking-wider">
          RAYONS EDUSHOP
        </span>
        <h1 class="font-display text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
          Toutes nos catégories de <span class="text-[#0F3D91]">fournitures scolaires</span>
        </h1>
        <p class="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Explorez nos rayons spécialisés pour trouver rapidement cahiers, stylos, matériels de géométrie, sacs à dos et accessoires pour la classe.
        </p>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="`/categories/${cat.slug}`"
          class="group bg-white rounded-3xl p-6 border-2 border-slate-200/90 hover:border-[#0F3D91] shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
        >
          <div class="flex items-start justify-between">
            <div class="w-14 h-14 rounded-2xl bg-[#0F3D91]/10 flex items-center justify-center text-2xl text-[#0F3D91] group-hover:bg-[#0F3D91] group-hover:text-white transition-colors">
              {{ cat.icon }}
            </div>
            <span class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 group-hover:bg-[#F4C542] group-hover:text-slate-950 transition-colors">
              ↗
            </span>
          </div>

          <div class="mt-6 space-y-2">
            <h2 class="font-display text-xl font-extrabold text-slate-950 group-hover:text-[#0F3D91] transition-colors">
              {{ cat.name }}
            </h2>
            <p class="text-slate-500 text-xs leading-relaxed">
              {{ cat.description }}
            </p>
          </div>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const categories = [
  { name: 'Cahiers', slug: 'cahiers', icon: '📓', description: 'Cahiers Clairefontaine, Oxford, 100p, 200p, grands et petits formats.' },
  { name: 'Écriture', slug: 'ecriture', icon: '✏️', description: 'Crayons à papier, marqueurs, surligneurs et gommes de précision.' },
  { name: 'Géométrie', slug: 'geometrie', icon: '📐', description: 'Règles 30cm, équerres, rapporteurs et compas Maped.' },
  { name: 'Fournitures', slug: 'fournitures', icon: '✂️', description: 'Ciseaux, colles, ardoises Velleda et rouleaux protège-cahiers.' },
  { name: 'Protège-cahiers', slug: 'protege-cahiers', icon: '📘', description: 'Protège-cahiers transparents et de couleurs variées.' },
  { name: 'Livres', slug: 'livres', icon: '📚', description: 'Manuels scolaires officiels et dictionnaires adaptés au programme.' },
  { name: 'Stylos', slug: 'stylos', icon: '🖊️', description: 'Stylos BIC 4 couleurs, Pilot Frixion et stylos à bille bleu, noir, rouge.' },
  { name: 'Sacs', slug: 'sacs', icon: '🎒', description: 'Sacs à dos scolaires ergonomiques et trousses garnies.' },
  { name: 'Ardoises', slug: 'ardoises', icon: '🪧', description: 'Ardoises effaçables à sec et ardoises bois traditionnelles.' },
  { name: 'Calculatrices', slug: 'calculatrices', icon: '🔢', description: 'Calculatrices scientifiques Casio FX-92 et calculatrices élémentaires.' },
];

useHead({
  title: 'Catégories de Fournitures Scolaires au Sénégal | EduShop',
  link: [
    { rel: 'canonical', href: 'https://www.edushop.sn/categories' }
  ],
  meta: [
    { name: 'description', content: 'Parcourez toutes les catégories de fournitures scolaires EduShop au Sénégal : cahiers, stylos, sacs, calculatrices, matériel de géométrie.' },
    { name: 'keywords', content: 'catégories fournitures scolaires, papeterie Sénégal, EduShop Dakar' },
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { property: 'og:title', content: 'Catégories de Fournitures Scolaires | EduShop Sénégal' },
    { property: 'og:description', content: 'Toutes les catégories de papeterie et fournitures scolaires livrées partout au Sénégal.' },
    { property: 'og:url', content: 'https://www.edushop.sn/categories' },
    { property: 'og:type', content: 'website' }
  ]
});
</script>
