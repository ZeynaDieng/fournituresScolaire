<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 pt-8 pb-24">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Navigation Breadcrumb -->
      <nav class="flex items-center space-x-2 text-xs font-semibold text-slate-500">
        <NuxtLink to="/" class="hover:text-[#0F3D91]">Accueil</NuxtLink>
        <span>/</span>
        <NuxtLink to="/blog" class="hover:text-[#0F3D91]">Blog</NuxtLink>
        <span>/</span>
        <span class="text-slate-900 font-bold line-clamp-1">{{ article.title }}</span>
      </nav>

      <!-- Article Header -->
      <div class="space-y-4">
        <span class="text-xs font-extrabold uppercase tracking-widest text-[#0F3D91] block">
          {{ article.category }}
        </span>
        <h1 class="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 leading-tight">
          {{ article.title }}
        </h1>
        <div class="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span>Publié le {{ article.date }}</span>
          <span>·</span>
          <span>Temps de lecture : {{ article.readTime }}</span>
        </div>
      </div>

      <!-- Main Image -->
      <div class="rounded-3xl overflow-hidden shadow-md aspect-[16/9] bg-slate-100">
        <img :src="article.image" :alt="article.title" class="w-full h-full object-cover" />
      </div>

      <!-- Article Body -->
      <div class="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-sm space-y-6 text-slate-700 leading-relaxed font-normal text-base sm:text-lg">
        <p class="font-semibold text-slate-900 text-lg sm:text-xl leading-relaxed">
          {{ article.excerpt }}
        </p>

        <hr class="border-slate-100 my-6" />

        <p>
          La préparation de la rentrée scolaire au Sénégal nécessite une bonne anticipation afin d'assurer à vos enfants tous les outils pédagogiques nécessaires à leur réussite.
        </p>

        <h3 class="font-display text-2xl font-bold text-slate-950 pt-4">
          1. Les indispensables pour le Primaire
        </h3>
        <p>
          Pour les niveaux du CP au CM2, le Ministère de l'Éducation Nationale recommande un assortiment de cahiers grands carreaux (Seyes), de stylos à bille haute précision et d'outils de traçage adaptés.
        </p>

        <h3 class="font-display text-2xl font-bold text-slate-950 pt-4">
          2. Comment choisir son pack scolaires ?
        </h3>
        <p>
          Pour vous éviter de parcourir les marchés ou les papeteries sous la chaleur, EduShop propose des packs clés en main 100% conformes au programme officiel sénégalais.
        </p>

        <div class="pt-8">
          <NuxtLink
            to="/packs"
            class="inline-flex items-center gap-2 rounded-full bg-[#0F3D91] text-white px-8 py-3.5 text-sm font-bold shadow-lift hover:bg-[#0b2d6d] transition-all"
          >
            <span>Découvrir nos packs scolaires →</span>
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const article = {
  id: route.params.id,
  category: "GUIDES",
  title: "Liste des fournitures scolaires au Sénégal — Rentrée 2026",
  excerpt: "Le guide complet, classe par classe, des fournitures recommandées par le Ministère de l'Éducation nationale.",
  date: "12 juillet 2026",
  readTime: "8 min",
  image: "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
};

useHead({
  title: `${article.title} - Blog EduShop`,
});
</script>
