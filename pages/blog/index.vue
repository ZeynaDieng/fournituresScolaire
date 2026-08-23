<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 pt-8 pb-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header section (Matching exact Lovable screenshot) -->
      <div class="mb-12">
        <span class="text-[11px] font-extrabold uppercase tracking-widest text-[#0F3D91] block mb-2">
          BLOG
        </span>
        <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
          Conseils pour <span class="text-[#0F3D91] font-normal block sm:inline">une belle année.</span>
        </h1>
      </div>

      <!-- Featured Article (Hero Card - Matching exact screenshot) -->
      <div class="mb-16">
        <NuxtLink
          :to="`/blog/${featuredArticle.id}`"
          class="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 md:grid-cols-2 items-center"
        >
          <!-- Left Photo Column -->
          <div class="relative aspect-[4/3] md:aspect-auto md:h-full bg-slate-100 overflow-hidden">
            <img
              :src="featuredArticle.image"
              :alt="featuredArticle.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <!-- Right Content Column -->
          <div class="p-8 md:p-12 space-y-4 flex flex-col justify-center">
            <span class="text-xs font-extrabold uppercase tracking-widest text-[#0F3D91]">
              {{ featuredArticle.category }}
            </span>
            
            <h2 class="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 group-hover:text-[#0F3D91] transition-colors leading-tight">
              {{ featuredArticle.title }}
            </h2>
            
            <p class="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
              {{ featuredArticle.excerpt }}
            </p>
            
            <div class="pt-4 flex items-center gap-2 text-xs text-slate-400 font-medium border-t border-slate-100">
              <span>{{ featuredArticle.date }}</span>
              <span>·</span>
              <span>{{ featuredArticle.readTime }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Secondary Articles Grid -->
      <div class="space-y-8">
        <h3 class="font-display text-xl font-extrabold text-slate-950">
          Tous les articles
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="article in secondaryArticles"
            :key="article.id"
            :to="`/blog/${article.id}`"
            class="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <!-- Article Image -->
            <div class="relative aspect-[16/10] bg-slate-100 overflow-hidden">
              <img
                :src="article.image"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <!-- Content -->
            <div class="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div class="space-y-2">
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#0F3D91] block">
                  {{ article.category }}
                </span>
                <h4 class="font-display text-lg font-bold text-slate-950 group-hover:text-[#0F3D91] transition-colors leading-snug">
                  {{ article.title }}
                </h4>
                <p class="text-slate-600 text-xs leading-relaxed font-medium line-clamp-2">
                  {{ article.excerpt }}
                </p>
              </div>

              <div class="pt-3 text-[11px] text-slate-400 font-medium border-t border-slate-100 flex items-center justify-between">
                <span>{{ article.date }}</span>
                <span>{{ article.readTime }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
// Article vedette (Screenshot Lovable 100%)
const featuredArticle = {
  id: "liste-fournitures-scolaires-senegal-2026",
  category: "GUIDES",
  title: "Liste des fournitures scolaires au Sénégal — Rentrée 2026",
  excerpt: "Le guide complet, classe par classe, des fournitures recommandées par le Ministère de l'Éducation nationale.",
  date: "12 juillet 2026",
  readTime: "8 min",
  image: "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
};

// Articles secondaires
const secondaryArticles = [
  {
    id: "organisation-sac-a-dos-enfant",
    category: "ORGANISATION",
    title: "5 astuces pour organiser le sac de son enfant",
    excerpt: "Comment éviter d'avoir un sac trop lourd et bien ranger les cahiers au quotidien.",
    date: "5 juillet 2026",
    readTime: "4 min",
    image: "https://i.pinimg.com/736x/8c/4f/b8/8c4fb8bd40f1a67e063ffb2223f4190b.jpg",
  },
  {
    id: "preparer-rentree-cp-sans-stress",
    category: "CONSEILS PARENTS",
    title: "Préparer la rentrée au CP sans stress",
    excerpt: "Toutes les étapes d'accompagnement pour le grand passage à la grande école.",
    date: "28 juin 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "budget-fournitures-erreurs-a-eviter",
    category: "BUDGET",
    title: "Fournitures scolaires : les erreurs à éviter pour économiser",
    excerpt: "Nos conseils pour optimiser votre budget de rentrée en achetant malin et durable.",
    date: "18 juin 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
  },
];

useHead({
  title: "Conseils pour une belle année - Blog EduShop",
  meta: [
    {
      name: "description",
      content: "Découvrez nos conseils et guides pour préparer la rentrée scolaire au Sénégal.",
    },
  ],
});
</script>
