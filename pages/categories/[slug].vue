<!-- pages/categories/[slug].vue -->
<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 pt-4 sm:pt-8 pb-24 relative">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
      
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 font-medium">
        <NuxtLink to="/" class="hover:text-[#0F3D91] transition-colors">Accueil</NuxtLink>
        <svg class="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
        </svg>
        <NuxtLink to="/categories" class="hover:text-[#0F3D91] transition-colors">Catégories</NuxtLink>
        <svg class="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
        </svg>
        <span class="text-slate-900 font-bold capitalize">{{ categoryDisplayName }}</span>
      </nav>

      <!-- Category Header -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-3">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 bg-[#0F3D91]/10 text-[#0F3D91] rounded-full text-xs font-extrabold uppercase tracking-wider">
            RAYON PAPETERIE
          </span>
          <span class="text-xs font-semibold text-slate-500">
            {{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }} disponible{{ filteredProducts.length > 1 ? 's' : '' }}
          </span>
        </div>
        
        <h1 class="font-display text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
          Fournitures scolaires <span class="text-[#0F3D91] capitalize">{{ categoryDisplayName }}</span> au Sénégal
        </h1>
        <p class="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Découvrez notre sélection de fournitures scolaires de qualité supérieure dans le rayon <strong class="text-slate-900 capitalize">{{ categoryDisplayName }}</strong>.
          Commandez en ligne et bénéficiez de la livraison rapide à Dakar et partout au Sénégal avec EduShop.
        </p>
      </div>

      <!-- Quick Category Links -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        <NuxtLink
          v-for="cat in allCategories"
          :key="cat.slug"
          :to="`/categories/${cat.slug}`"
          class="px-4 py-2 rounded-full text-xs font-extrabold shrink-0 transition-all cursor-pointer border"
          :class="cat.slug === currentSlug ? 'bg-[#0F3D91] text-white border-[#0F3D91] shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'"
        >
          {{ cat.name }}
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
        <div v-for="i in 8" :key="i" class="h-80 bg-slate-200/70 rounded-3xl animate-pulse"></div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
        <AppProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
        <div class="text-4xl">📦</div>
        <h2 class="text-xl font-extrabold text-slate-900">Aucun produit trouvé dans cette catégorie</h2>
        <p class="text-slate-500 text-sm max-w-md mx-auto">
          Nous mettons à jour notre catalogue très régulièrement. Parcourez tous nos produits ou contactez-nous.
        </p>
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 bg-[#0F3D91] text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-[#0c3175] transition-all"
        >
          <span>Voir tout le catalogue</span>
          <span>→</span>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '~/stores/products';
import { officialCatalog } from '~/data/products-senegal.js';

const route = useRoute();
const productsStore = useProductsStore();
const currentSlug = computed(() => (route.params.slug as string) || '');

const pending = ref(true);
const productsList = ref<any[]>([]);

function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

const allCategories = [
  { name: 'Cahiers', slug: 'cahiers' },
  { name: 'Écriture', slug: 'ecriture' },
  { name: 'Géométrie', slug: 'geometrie' },
  { name: 'Fournitures', slug: 'fournitures' },
  { name: 'Protège-cahiers', slug: 'protege-cahiers' },
  { name: 'Livres', slug: 'livres' },
  { name: 'Stylos', slug: 'stylos' },
  { name: 'Sacs', slug: 'sacs' },
  { name: 'Ardoises', slug: 'ardoises' },
  { name: 'Calculatrices', slug: 'calculatrices' },
];

const categoryDisplayName = computed(() => {
  const matched = allCategories.find(c => c.slug === currentSlug.value);
  if (matched) return matched.name;
  return currentSlug.value.replace(/-/g, ' ');
});

onMounted(async () => {
  try {
    if (productsStore.products && productsStore.products.length > 0) {
      productsList.value = productsStore.products;
    } else {
      const response: any = await $fetch('/api/products');
      if (response && response.data && response.data.length > 0) {
        productsList.value = response.data;
      } else {
        productsList.value = officialCatalog;
      }
    }
  } catch (err) {
    console.warn('Erreur chargement API produits, bascule vers catalogue officiel', err);
    productsList.value = officialCatalog;
  } finally {
    pending.value = false;
  }
});

const filteredProducts = computed(() => {
  const slug = currentSlug.value;
  return productsList.value.filter(p => {
    if (!p.category) return false;
    const catSlug = slugify(p.category);
    return catSlug === slug || p.category.toLowerCase().includes(slug.replace(/-/g, ' '));
  });
});

// Canonical URL et Meta Tags SEO
const canonicalUrl = computed(() => `https://www.edushop.sn/categories/${currentSlug.value}`);
const pageTitle = computed(() => `${categoryDisplayName.value.toUpperCase()} - Fournitures Scolaires Sénégal | EduShop`);
const pageDescription = computed(() => `Achetez vos fournitures scolaires au rayon ${categoryDisplayName.value} au meilleur prix sur EduShop.sn. Livraison rapide à Dakar et partout au Sénégal.`);

useHead({
  title: pageTitle,
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ],
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'keywords', content: `${categoryDisplayName.value}, fournitures scolaires, papeterie, Sénégal, Dakar, EduShop` },
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'EduShop Sénégal' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': categoryDisplayName.value,
        'url': canonicalUrl.value,
        'description': pageDescription.value,
        'publisher': {
          '@type': 'Organization',
          'name': 'EduShop Sénégal',
          'url': 'https://www.edushop.sn'
        }
      }))
    }
  ]
});
</script>
