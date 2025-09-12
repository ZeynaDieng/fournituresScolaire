<!-- pages/index.vue -->
<template>
  <div class="relative">
    <!-- Floating Particles - Optimisé -->
    <FloatingParticles :count="8" />

    <!-- Hero Section with Optimized Background -->
    <AppHeroSection />
    <!-- Popular Packs Section with Optimized Loading -->
    <section class="section bg-gray-50" id="packs-populaires">
      <div class="container px-4">
        <!-- Loading State Moderne et Beau -->
        <div
          v-if="airtableStore.loading || productsStore.loading"
          class="relative"
        >
          <!-- Loading Moderne -->
          <ModernLoader
            title="Chargement des packs..."
            subtitle="Préparation de vos fournitures scolaires"
            :progress="75"
          />

          <!-- Skeleton Cards en arrière-plan -->
          <div class="pack-grid opacity-30">
            <div
              v-for="n in 3"
              :key="n"
              class="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col border border-gray-100"
            >
              <!-- Image placeholder avec shimmer -->
              <div
                class="relative w-full aspect-[4/3] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"
                ></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="w-16 h-16 bg-gray-300 rounded-full animate-pulse"
                  ></div>
                </div>
              </div>

              <div class="p-6 flex-1 flex flex-col">
                <!-- Badge -->
                <div
                  class="h-6 w-20 bg-gradient-to-r from-green-200 to-green-300 rounded-full mb-4 animate-pulse"
                ></div>

                <!-- Titre -->
                <div
                  class="h-6 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 animate-pulse"
                ></div>

                <!-- Description -->
                <div class="space-y-2 mb-6 flex-grow">
                  <div
                    class="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-full animate-pulse"
                  ></div>
                  <div
                    class="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-5/6 animate-pulse"
                  ></div>
                  <div
                    class="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-4/6 animate-pulse"
                  ></div>
                </div>

                <!-- Prix et bouton -->
                <div class="flex items-center justify-between">
                  <div
                    class="h-8 w-24 bg-gradient-to-r from-green-200 to-green-300 rounded animate-pulse"
                  ></div>
                  <div
                    class="h-10 w-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full animate-pulse"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Popular Packs Grid - Optimisé pour les performances -->
        <div v-else>
          <div class="text-center mb-12">
            <h2
              class="section-title transform transition-all duration-1000 ease-out translate-y-6 opacity-0 animate-fade-in-up"
              style="--delay: 0.1s"
            >
              Packs Scolaires Populaires
            </h2>
            <p
              class="text-xl text-gray-600 max-w-2xl mx-auto transform transition-all duration-1000 ease-out translate-y-6 opacity-0 animate-fade-in-up"
              style="--delay: 0.2s"
            >
              Nos packs les plus demandés pour chaque niveau scolaire
            </p>
          </div>

          <div class="pack-grid">
            <div
              v-for="(pack, index) in airtableStore.packs.length > 0
                ? airtableStore.packs.slice(0, 3)
                : productsStore.popularPacks"
              :key="pack.id"
              class="group"
            >
              <AppPackCard :pack="pack" @add-to-cart="addPackToCart" />
            </div>
          </div>
        </div>

        <div class="text-center p-4 mt-20" animation="fadeInUp">
          <NuxtLink
            to="/products"
            class="btn-primary inline-flex items-center p-4 space-x-2"
          >
            <span>Découvrir tous nos packs</span>
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </NuxtLink>
        </div>
        <!-- View All Button with Animation -->
      </div>
    </section>

    <!-- Latest Products Section -->
    <section class="section bg-white">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="section-title">Derniers Articles</h2>

          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos nouveaux produits et articles populaires
          </p>
        </div>

        <!-- Categories Filter -->
        <div class="flex flex-wrap justify-center gap-4 mb-12">
          <button
            v-for="category in ['Tous', ...productsStore.categories]"
            :key="category"
            @click="selectedCategory = category"
            class="px-4 py-2 rounded-full font-medium transition-all"
            :class="{
              'bg-primary-600 text-white': selectedCategory === category,
              'bg-gray-100 text-gray-700 hover:bg-primary-100':
                selectedCategory !== category,
            }"
          >
            {{ category }}
          </button>
        </div>

        <!-- Products Grid - Optimisé -->
        <div v-if="filteredProducts.length > 0" class="product-grid">
          <AppProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Loading pour les produits -->
        <div v-else class="product-grid">
          <div
            v-for="n in 6"
            :key="n"
            class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          >
            <!-- Image placeholder -->
            <div
              class="relative w-full aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"
              ></div>
            </div>

            <div class="p-4">
              <!-- Titre -->
              <div
                class="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-3 animate-pulse"
              ></div>
              <!-- Prix -->
              <div
                class="h-5 w-1/2 bg-gradient-to-r from-green-200 to-green-300 rounded mb-3 animate-pulse"
              ></div>
              <!-- Bouton -->
              <div
                class="h-8 w-full bg-gradient-to-r from-blue-200 to-blue-300 rounded animate-pulse"
              ></div>
            </div>
          </div>
        </div>

        <!-- View All Button -->
        <div class="text-center p-4 mt-12">
          <NuxtLink
            to="/products"
            class="btn-primary inline-flex items-center p-4 space-x-2"
          >
            <span>Voir tous les articles</span>
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section - Remplit l'espace avec du contenu attrayant -->
    <section class="section bg-green-50 py-16">
      <div class="container px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Pourquoi choisir nos fournitures scolaires ?
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Nous offrons des produits de qualité à des prix imbattables pour une
            rentrée scolaire réussie
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Feature 1 -->
          <div class="text-center group">
            <div
              class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors duration-300"
            >
              <svg
                class="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Qualité Garantie
            </h3>
            <p class="text-gray-600">
              Produits sélectionnés pour leur durabilité et leur qualité
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center group">
            <div
              class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300"
            >
              <svg
                class="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Prix Imbattables
            </h3>
            <p class="text-gray-600">
              Meilleurs prix du marché pour tous vos besoins scolaires
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center group">
            <div
              class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors duration-300"
            >
              <svg
                class="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Livraison Rapide
            </h3>
            <p class="text-gray-600">
              Réception de vos commandes en 24-48h partout au Sénégal
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="text-center group">
            <div
              class="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors duration-300"
            >
              <svg
                class="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Service Client
            </h3>
            <p class="text-gray-600">
              Support client disponible 7j/7 pour vous accompagner
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="section bg-gray-50 py-16">
      <div class="container px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-3xl font-bold text-green-600 mb-2">100+</div>
            <div class="text-gray-600">Produits disponibles</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-blue-600 mb-2">200+</div>
            <div class="text-gray-600">Clients satisfaits</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-purple-600 mb-2">24h</div>
            <div class="text-gray-600">Livraison express</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-orange-600 mb-2">5.0</div>
            <div class="text-gray-600">Note moyenne</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Products Section -->
    <section class="section bg-white py-16">
      <div class="container px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Produits les plus demandés
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos articles les plus populaires pour cette rentrée
            scolaire
          </p>
        </div>

        <div class="text-center mt-12">
          <NuxtLink
            to="/products"
            class="btn-primary inline-flex items-center px-8 py-3 text-lg"
          >
            <span>Voir tous les produits</span>
            <svg
              class="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Promotions Section - Utilise AppPromotionCard avec données de démonstration -->

    <!-- Testimonials Section -->
    <section class="section bg-gray-50 py-16">
      <div class="container px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Ce que disent nos clients
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les témoignages de parents et élèves satisfaits
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Testimonial 1 -->
          <div
            class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              "Excellent service ! J'ai reçu toutes les fournitures de mon fils
              en 24h. Qualité parfaite et prix très raisonnables."
            </p>
            <div class="flex items-center">
              <div
                class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3"
              >
                <span class="text-green-600 font-semibold">AM</span>
              </div>
              <div>
                <div class="font-semibold text-gray-900">Aminata Mbaye</div>
                <div class="text-sm text-gray-500">Mère de famille</div>
              </div>
            </div>
          </div>

          <!-- Testimonial 2 -->
          <div
            class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              "Commande facile et rapide. Les packs sont parfaits pour la
              rentrée. Je recommande vivement !"
            </p>
            <div class="flex items-center">
              <div
                class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3"
              >
                <span class="text-blue-600 font-semibold">IS</span>
              </div>
              <div>
                <div class="font-semibold text-gray-900">Ibrahima Sarr</div>
                <div class="text-sm text-gray-500">Père de famille</div>
              </div>
            </div>
          </div>

          <!-- Testimonial 3 -->
          <div
            class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-4">
              "Service client exceptionnel ! Ils m'ont aidé à choisir les bonnes
              fournitures pour ma fille. Merci !"
            </p>
            <div class="flex items-center">
              <div
                class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3"
              >
                <span class="text-purple-600 font-semibold">FD</span>
              </div>
              <div>
                <div class="font-semibold text-gray-900">Fatou Diop</div>
                <div class="text-sm text-gray-500">Mère de famille</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="section bg-gradient-to-b from-green-200 to-green-100 py-16">
      <div class="container px-4">
        <div class="text-center">
          <h2 class="text-3xl text-primary-700 font-bold mb-4">
            Prêt pour la rentrée scolaire ?
          </h2>
          <p class="text-xl mb-8 opacity-90">
            Commandez maintenant et recevez vos fournitures en 24h
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/products"
              class="bg-white text-green-600 px-6 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 inline-flex items-center justify-center"
            >
              Voir tous les produits
            </NuxtLink>
            <NuxtLink
              to="/packs"
              class="border-2 border-primary-700 text-primary-700 px-6 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-300 inline-flex items-center justify-center"
            >
              Découvrir les packs
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Panel de test du panier (mode développement) -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from "vue";
import { useProductsStore } from "../stores/products";
import { useAirtableStore } from "../stores/airtable";
import { useCartStore } from "../stores/cart";
import type { Product, Pack } from "../stores/products";
// Lazy loading des composants pour de meilleures performances
const AnimatedSection = defineAsyncComponent(
  () => import("../components/AnimatedSection.vue")
);
const AnimatedCard = defineAsyncComponent(
  () => import("../components/AnimatedCard.vue")
);
const AnimatedButton = defineAsyncComponent(
  () => import("../components/AnimatedButton.vue")
);
const FloatingParticles = defineAsyncComponent(
  () => import("../components/FloatingParticles.vue")
);
const AppPromotionCard = defineAsyncComponent(
  () => import("../components/AppPromotionCard.vue")
);
const AppProductCard = defineAsyncComponent(
  () => import("../components/AppProductCard.vue")
);
const AppPackCard = defineAsyncComponent(
  () => import("../components/AppPackCard.vue")
);
const ModernLoader = defineAsyncComponent(
  () => import("../components/ModernLoader.vue")
);

// Since AppPackCard, AppProductCard etc. are in components/, Nuxt 3 auto-imports them.
// We just need to define the props they might expect if not done inside the components themselves.

const productsStore = useProductsStore();
const airtableStore = useAirtableStore();
const cartStore = useCartStore();

// Cache simple pour éviter les appels répétés
const dataLoaded = ref(false);

// Fetch data on component mount - Optimisé pour de meilleures performances
onMounted(async () => {
  // Éviter les appels répétés
  if (dataLoaded.value) return;

  try {
    // Charger seulement les données essentielles en parallèle
    await Promise.all([
      productsStore.fetchProducts(),
      airtableStore.fetchPacks(), // Seulement les packs pour la section principale
    ]);

    dataLoaded.value = true;

    // Charger les autres données en arrière-plan (non bloquant)
    setTimeout(async () => {
      try {
        await Promise.all([
          airtableStore.fetchProducts(),
          airtableStore.fetchPromotions(),
          airtableStore.fetchTestimonials(),
          fetchProductsFromAdmin(),
        ]);
      } catch (error) {
        console.warn("⚠️ Chargement en arrière-plan échoué:", error);
      }
    }, 100);
  } catch (error) {
    console.error("❌ Erreur lors du chargement:", error);
  }
});

// Latest Products Section
const selectedCategory = ref("Tous");
const productsFromAdmin = ref<Product[]>([]);

async function fetchProductsFromAdmin(): Promise<Product[]> {
  const rows = (await $fetch("/api/admin/products")) as any[];
  return rows.map((p) => {
    let image: string = p["Image URL"] || "";
    if (!image && typeof p.Images === "string") {
      image = p.Images.split(",").map((s: string) => s.trim())[0] || "";
    }
    return {
      id: p.id,
      name: p.Name || "",
      price: Number(p.Price) || 0,
      originalPrice: p["Original Price"] ?? undefined,
      category: p.Category || "Autres",
      image,
      images: image ? [image] : [],
      description: p.Description || "",
      inStock: Boolean(p["In Stock"]) || false,
      isPromotion: Boolean(p["Is Promotion"]) || false,
      promotionEndDate: p["Promotion End Date"]
        ? new Date(p["Promotion End Date"])
        : undefined,
    } as Product;
  });
}

onMounted(async () => {
  try {
    productsFromAdmin.value = await fetchProductsFromAdmin();
  } catch (e) {
    const fallback =
      airtableStore.products && airtableStore.products.length > 0
        ? (airtableStore.products as Product[])
        : (productsStore.products as Product[]);
    productsFromAdmin.value = fallback;
  }
});

const filteredProducts = computed(() => {
  // Utiliser les données du store productsStore en priorité
  const list =
    productsStore.products.length > 0
      ? productsStore.products
      : productsFromAdmin.value;
  if (selectedCategory.value === "Tous") {
    return list.slice(0, 9);
  }
  return list.filter((p) => p.category === selectedCategory.value).slice(0, 8);
});

// Fonction pour ajouter un pack au panier
const addPackToCart = (pack: Pack) => {
  console.log("🛒 Ajout du pack au panier:", pack);
  cartStore.addItem(
    {
      id: pack.id,
      name: pack.name,
      price: pack.price,
      image: pack.image,
      type: "pack",
      description: pack.description,
    },
    1
  );
  console.log("✅ Pack ajouté au panier avec succès");
};

// Quick Order
const quickOrder = (level: string) => {
  // Implement quick order logic, e.g., redirect to a pre-filled cart or a specific pack page
  alert(`Commande rapide pour le niveau : ${level}`);
  // Example: router.push(`/packs?level=${level}`)
};
</script>

<style scoped>
/* Keyframes for animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-10px) translateX(10px);
  }
}

@keyframes float-medium {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-15px) translateX(-10px);
  }
}

/* Animation Classes */
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: var(--delay, 0s);
  animation-delay: var(--delay, 0s);
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 10s ease-in-out infinite;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Button Styles */
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5;
}

.btn-secondary {
  @apply bg-white text-gray-800 border-2 border-gray-200 hover:border-primary-600 font-semibold rounded-xl transition-all duration-300 hover:bg-gray-50;
}

/* Section Styles */
.section {
  @apply py-16 md:py-24;
}

.section-title {
  @apply text-3xl md:text-4xl font-bold text-primary-700 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #16a34a, #15803d);
    border-radius: 3px;
  }
}

.pack-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8;
}

.product-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6;
}

/* Grid Pattern */
.grid-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  background-size: 60px 60px;
}

.btn-primary {
  @apply bg-primary-600 text-white font-bold rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 transform hover:-translate-y-1;
}

.btn-secondary {
  @apply bg-white text-primary-600 font-bold rounded-full shadow-md hover:shadow-xl border border-primary-100 hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes pulse-cta {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse-cta {
  animation: pulse-cta 2s infinite ease-in-out;
}

.animation-delay-200 {
  animation-delay: 200ms;
}
.animation-delay-400 {
  animation-delay: 400ms;
}
.animation-delay-600 {
  animation-delay: 600ms;
}
</style>
