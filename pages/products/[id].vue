<!-- pages/products/[id].vue -->
<template>
  <div
    class="min-h-screen bg-[#FBFBFA]"
  >
    <!-- Loading State -->
    <div v-if="pending" class="container mx-auto px-4 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="space-y-6">
          <div
            class="aspect-square bg-slate-200 rounded-3xl animate-pulse"
          ></div>
          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="i in 4"
              :key="i"
              class="aspect-square bg-slate-200 rounded-2xl animate-pulse"
            ></div>
          </div>
        </div>
        <div class="space-y-6">
          <div class="h-8 bg-slate-200 rounded-xl animate-pulse"></div>
          <div class="h-12 bg-slate-200 rounded-xl animate-pulse"></div>
          <div class="h-6 bg-slate-200 rounded-lg animate-pulse"></div>
          <div class="h-20 bg-slate-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="container mx-auto px-4 py-8 lg:py-16">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm text-slate-500 mb-8 font-medium">
        <NuxtLink to="/" class="hover:text-[#0F3D91] transition-colors"
          >Accueil</NuxtLink
        >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <NuxtLink
          to="/products"
          class="hover:text-[#0F3D91] transition-colors"
          >Produits</NuxtLink
        >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-slate-900 font-medium">{{ product.name }}</span>
      </nav>

      <!-- Main Product Section -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16">
        <!-- Image Gallery -->
        <div class="lg:col-span-7">
          <div class="space-y-6">
            <!-- Main Image -->
            <div class="relative group">
              <!-- Promotion Badge -->
              <div
                v-if="product.isPromotion"
                class="absolute top-6 left-6 z-20"
              >
                <div
                  class="bg-[#F4C542] text-slate-950 px-4 py-2 rounded-full shadow-md font-extrabold text-xs"
                >
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-5 h-5 animate-pulse"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 117 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="font-bold">-{{ discountPercentage }}%</span>
                  </div>
                </div>
              </div>

              <!-- Wishlist Button -->
              <div class="absolute top-6 right-6 z-20">
                <button
                  @click="toggleWishlist"
                  class="group/heart w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300"
                  :class="{
                    'text-red-500 bg-red-50': isWishlisted,
                    'text-slate-400': !isWishlisted,
                  }"
                >
                  <svg
                    class="w-6 h-6 transition-transform group-hover/heart:scale-110"
                    :fill="isWishlisted ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              <!-- Main Product Image -->
              <div
                class="aspect-square bg-[#F8F6F0] rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 flex items-center justify-center p-8"
              >
                <img
                  :src="selectedImage || product.image"
                  :alt="product.name"
                  class="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            <!-- Thumbnail Gallery -->
            <div class="grid grid-cols-4 gap-4">
              <button
                v-for="(image, index) in productImages"
                :key="index"
                @click="selectedImage = image"
                class="aspect-square bg-[#F8F6F0] rounded-2xl overflow-hidden border-2 transition-all duration-300 flex items-center justify-center p-2"
                :class="{
                  'border-[#0F3D91] shadow-md':
                    selectedImage === image || (!selectedImage && index === 0),
                  'border-slate-200/80 hover:border-[#0F3D91]/40':
                    selectedImage !== image && (selectedImage || index !== 0),
                }"
              >
                <img
                  :src="image"
                  :alt="`${product.name} - Image ${index + 1}`"
                  class="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
                />
              </button>
            </div>

            <!-- Product Features -->
            <div
              v-if="productFeatures.length > 0"
              class="bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200 p-6 shadow-lg"
            >
              <h3
                class="font-display text-xl sm:text-2xl font-extrabold text-[#0F3D91] mb-4"
              >
                Caractéristiques
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="feature in productFeatures"
                  :key="feature.label"
                  class="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100"
                >
                  <div
                    class="w-6 h-6 bg-[#0F3D91] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-xs"
                  >
                    ✓
                  </div>
                  <div>
                    <div class="font-medium text-slate-900">
                      {{ feature.label }}
                    </div>
                    <div class="text-sm text-slate-600">
                      {{ feature.value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="lg:col-span-5">
          <div class="sticky top-8 space-y-8">
            <!-- Header -->
            <div>
              <!-- Title -->
              <h1
                class="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F3D91] leading-tight mb-4"
              >
                {{ product.name }}
              </h1>

              <!-- Reviews -->
              <div class="flex items-center gap-4 mb-6">
                <div class="flex items-center gap-1">
                  <div class="flex items-center">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      class="w-5 h-5"
                      :class="i <= 4 ? 'text-yellow-400' : 'text-slate-200'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  </div>
                  <span class="text-lg font-semibold text-slate-900">4.8</span>
                  <span class="text-slate-500">(127 avis)</span>
                </div>
                <button
                  class="text-[#0F3D91] hover:text-[#0b2f70] font-bold text-sm transition-colors"
                >
                  Voir les avis
                </button>
              </div>

              <!-- Description -->
              <p class="text-lg text-slate-600 leading-relaxed">
                {{ product.description }}
              </p>
            </div>

            <!-- Pricing -->
            <div
              class="bg-white rounded-3xl p-6 border-2 border-slate-200/80 shadow-xs space-y-4"
            >
              <div class="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span class="font-display text-3xl sm:text-4xl font-extrabold text-[#0F3D91] tracking-tight">
                  {{ formatPrice(product?.price) }}
                </span>
                
                <span v-if="product.originalPrice" class="text-lg text-slate-400 line-through font-semibold">
                  {{ formatPrice(product?.originalPrice) }}
                </span>

                <span v-if="product.originalPrice" class="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100/80">
                  -{{
                    Math.round(
                      (1 - product.price / product.originalPrice) * 100
                    )
                  }}% DE RÉDUCTION
                </span>
              </div>

              <div class="flex items-center justify-between text-xs pt-3 border-t border-slate-100 font-semibold text-slate-600">
                <span>Livraison rapide partout au Sénégal</span>
                <div
                  class="flex items-center gap-1.5"
                  :class="{
                    'text-emerald-700 font-bold': product.inStock,
                    'text-rose-600 font-bold': !product.inStock,
                  }"
                >
                  <span
                    :class="{
                      'w-2 h-2 bg-emerald-500 rounded-full animate-pulse':
                        product.inStock,
                      'w-2 h-2 bg-rose-500 rounded-full': !product.inStock,
                    }"
                  ></span>
                  <span>
                    {{ product.inStock ? "En stock · Expédition 24h" : "Rupture de stock" }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Quantity & Actions -->
            <div class="space-y-6">
              <!-- Quantity Selector -->
              <div class="flex items-center gap-4">
                <label class="text-sm font-bold text-slate-900">
                  Quantité :
                </label>
                <div
                  class="flex items-center bg-white rounded-full border-2 border-slate-200/80 p-1"
                >
                  <button
                    @click="decreaseQuantity"
                    :disabled="quantity <= 1"
                    class="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#0F3D91] hover:text-white flex items-center justify-center font-bold text-slate-700 disabled:opacity-30 transition-all cursor-pointer"
                  >
                    -
                  </button>

                  <span
                    class="px-5 font-extrabold text-base text-slate-900 min-w-[2.5rem] text-center"
                  >
                    {{ quantity }}
                  </span>

                  <button
                    @click="increaseQuantity"
                    :disabled="quantity >= maxQuantity"
                    class="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#0F3D91] hover:text-white flex items-center justify-center font-bold text-slate-700 disabled:opacity-30 transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-4 pt-2">
                <button
                  @click="addToCart"
                  :disabled="!product.inStock || isLoading"
                  class="w-full bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-bold text-base py-4 rounded-full shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                >
                  <div v-if="!isLoading" class="flex items-center gap-3">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    <span>Ajouter au panier</span>
                  </div>
                  <div v-else class="flex items-center gap-3">
                    <div
                      class="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"
                    ></div>
                    <span>Ajout en cours...</span>
                  </div>
                </button>

                <div class="grid grid-cols-2 gap-4">
                  <button
                    @click="buyNow"
                    :disabled="!product.inStock"
                    class="flex items-center justify-center gap-2 py-3.5 px-6 bg-[#0F3D91] hover:bg-[#0b2f70] text-white font-bold text-sm rounded-full transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span>Acheter</span>
                  </button>

                  <button
                    class="flex items-center justify-center gap-2 py-3.5 px-6 border-2 border-slate-200 hover:border-[#0F3D91] text-slate-700 hover:text-[#0F3D91] font-bold text-sm rounded-full transition-all hover:bg-[#0F3D91]/5 cursor-pointer"
                  >
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    <span>Partager</span>
                  </button>
                </div>
              </div>

              <!-- Bulk Options -->
              <div
                v-if="bulkOptions.length > 0"
                class="bg-white rounded-3xl border border-slate-200 p-6"
              >
                <h3 class="font-display text-lg font-extrabold text-[#0F3D91] mb-4">
                  Tarifs avec réductions
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    v-for="option in bulkOptions"
                    :key="option.quantity"
                    @click="selectBulkOption(option)"
                    class="group/bulk p-4 border-2 border-slate-200 hover:border-[#0F3D91] text-center rounded-2xl transition-all duration-300 hover:bg-[#0F3D91]/5 cursor-pointer"
                    :class="{
                      'border-[#0F3D91] bg-[#0F3D91]/10':
                        quantity === option.quantity,
                    }"
                  >
                    <div
                      class="text-2xl font-bold text-slate-900 group-hover/bulk:text-[#0F3D91] mb-1"
                    >
                      {{ option.quantity }}x
                    </div>
                    <div class="text-lg font-bold text-[#0F3D91] mb-1">
                      {{ formatPrice(option?.unitPrice) }} /unité
                    </div>
                    <div class="text-sm text-slate-500">
                      {{ option.discount }}% de remise
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Trust Indicators -->
            <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 class="font-bold text-slate-900 mb-4">Garanties</h3>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-[#0F3D91]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-slate-700 font-medium"
                    >Garantie satisfait ou remboursé 30 jours</span
                  >
                </div>
                <div class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-[#0F3D91]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-slate-700 font-medium">Expédition sous 24-48h</span>
                </div>
                <div class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-[#0F3D91]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-slate-700 font-medium">Support client 7j/7</span>
                </div>
                <div class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-[#0F3D91]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-slate-700 font-medium">Paiement sécurisé SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Information Tabs -->
      <div
        class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden mb-16"
      >
        <div class="border-b border-slate-200">
          <nav class="flex">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-8 py-5 font-bold text-base transition-all duration-300 cursor-pointer"
              :class="{
                'text-[#0F3D91] border-b-2 border-[#0F3D91] bg-[#0F3D91]/5':
                  activeTab === tab.id,
                'text-slate-600 hover:text-slate-900 hover:bg-slate-50':
                  activeTab !== tab.id,
              }"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <div class="p-8">
          <!-- Description Tab -->
          <div
            v-if="activeTab === 'description'"
            class="prose prose-lg max-w-none"
          >
            <h3 class="font-display text-2xl font-extrabold text-[#0F3D91] mb-6">
              Description détaillée
            </h3>
            <div class="text-slate-700 leading-relaxed space-y-4">
              <p>{{ product.description }}</p>
              <p>
                Ce produit de haute qualité est parfaitement adapté pour un
                usage scolaire intensif.
              </p>
            </div>
          </div>

          <!-- Specifications Tab -->
          <div v-if="activeTab === 'specs'" class="space-y-6">
            <h3 class="font-display text-2xl font-extrabold text-[#0F3D91]">
              Spécifications techniques
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="spec in productSpecs"
                :key="spec.label"
                class="flex justify-between items-center p-4 bg-[#F8F6F0] rounded-2xl"
              >
                <span class="font-bold text-slate-900">{{ spec.label }}</span>
                <span class="text-slate-600 font-medium">{{ spec.value }}</span>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="space-y-8">
            <div class="flex items-center justify-between">
              <h3 class="font-display text-2xl font-extrabold text-[#0F3D91]">Avis clients</h3>
              <button
                class="bg-[#0F3D91] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#0b2f70] transition-colors cursor-pointer"
              >
                Écrire un avis
              </button>
            </div>

            <!-- Reviews Summary -->
            <div
              class="bg-white rounded-3xl p-8 border border-slate-200/80"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="text-center">
                  <div class="text-6xl font-bold text-slate-900 mb-2">4.8</div>
                  <div class="flex items-center justify-center mb-2">
                    <div class="flex items-center">
                      <svg
                        v-for="i in 5"
                        :key="i"
                        class="w-6 h-6 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="text-slate-600">Basé sur 127 avis</div>
                </div>
                <div class="space-y-3">
                  <div
                    v-for="rating in [5, 4, 3, 2, 1]"
                    :key="rating"
                    class="flex items-center gap-3"
                  >
                    <span class="text-sm font-medium text-slate-700 w-8"
                      >{{ rating }}★</span
                    >
                    <div
                      class="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden"
                    >
                      <div
                        class="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-1000"
                        :style="{ width: getRatingPercentage(rating) + '%' }"
                      ></div>
                    </div>
                    <span
                      class="text-sm font-medium text-slate-500 w-12 text-right"
                      >{{ getRatingCount(rating) }} avis</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Individual Reviews -->
            <div class="space-y-6 mt-8">
              <div
                v-for="review in productReviews"
                :key="review.id"
                class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="font-semibold text-slate-900">
                    {{ review.user }}
                  </div>
                  <div class="flex items-center">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      class="w-4 h-4"
                      :class="
                        i <= review.rating
                          ? 'text-yellow-400'
                          : 'text-slate-200'
                      "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  </div>
                </div>
                <p class="text-slate-600">{{ review.comment }}</p>
                <div class="text-xs text-slate-400 mt-2">{{ review.date }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Product Found -->
    <div v-else class="container mx-auto px-4 py-16 text-center text-slate-500">
      <p>Produit introuvable.</p>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import CartIcon from "~/components/icons/CartIcon.vue";
import { useCartStore } from "~/stores/cart";
import { useNotifications } from "~/composables/useNotifications";
import { useAirtableStore } from "~/stores/airtable";
import type { Product } from "~/stores/products";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const { showSuccess } = useNotifications();
const airtableStore = useAirtableStore();

const pending = ref(true);
const product = ref<Product | null>(null);
const selectedImage = ref<string | null>(null);
const quantity = ref(1);
const maxQuantity = 10;
const isWishlisted = ref(false);
const isLoading = ref(false);
const activeTab = ref("description");

const productImages = ref<string[]>([]);
const productFeatures = ref<{ label: string; value: string }[]>([]);
const productSpecs = ref<{ label: string; value: string }[]>([]);
const productReviews = ref<{ id: number; user: string; rating: number; comment: string; date: string }[]>([]);
const tabs = ref([
  { id: "description", label: "Description" },
  { id: "specs", label: "Spécifications" },
  { id: "reviews", label: "Avis clients" },
]);
const bulkOptions = ref<{ quantity: number; unitPrice: number; discount: number }[]>([]);

const discountPercentage = computed(() => {
  if (!product.value || !product.value.originalPrice) return 0;
  return Math.round(
    ((product.value.originalPrice - product.value.price) /
      product.value.originalPrice) *
      100
  );
});

function formatPrice(price: number | undefined) {
  if (price === undefined || isNaN(price)) {

    return "0 FCFA";
  }
  // Utiliser XOF (code ISO pour le franc CFA) ou formatage personnalisé
  try {
    return price.toLocaleString("fr-FR", {
      style: "currency",
      currency: "XOF",
    });
  } catch (error) {
    // Fallback: formatage manuel si XOF n'est pas supporté
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  }
}

function increaseQuantity() {
  if (quantity.value < maxQuantity) quantity.value++;
}

function decreaseQuantity() {
  if (quantity.value > 1) quantity.value--;
}

function toggleWishlist() {
  isWishlisted.value = !isWishlisted.value;
}

function addToCart() {
  if (!product.value || !product.value.inStock) return;

  isLoading.value = true;

  // Ajouter au panier via le store
  cartStore.addItem(
    {
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image: product.value.image,
      type: "product",
    },
    quantity.value
  );

  setTimeout(() => {
    isLoading.value = false;
    showSuccess(
      `${quantity.value} ${product.value.name} ajouté(s) au panier !`
    );
  }, 500);
}

function buyNow() {
  if (!product.value?.inStock) return;
  cartStore.addItem(
    {
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image: product.value.image,
      type: "product",
    },
    quantity.value
  );
  navigateTo("/checkout");
}

function selectBulkOption(option: { quantity: number; unitPrice: number; discount: number }) {
  quantity.value = option.quantity;
}

function getRatingPercentage(star: number) {
  const totalReviews = productReviews.value.length;
  if (totalReviews === 0) return 0;
  const count = productReviews.value.filter((r) => r.rating === star).length;
  return Math.round((count / totalReviews) * 100);
}

function getRatingCount(star: number) {
  return productReviews.value.filter((r) => r.rating === star).length;
}


onMounted(async () => {
  try {
    const productId = route.params.id as string;
    
    // Utiliser le Smart Cache du store
    const foundProduct = await airtableStore.fetchProductById(productId);
    
    if (!foundProduct) {
      router.push("/404");
      return;
    }
    product.value = foundProduct;

    // Set up product images
    if (Array.isArray(product.value.images)) {
      productImages.value = product.value.images;
    } else if (product.value.images) {
      productImages.value = product.value.images
        .split(",")
        .map((s) => s.trim());
    } else {
      productImages.value = [product.value.image];
    }
    selectedImage.value = productImages.value[0];

    // Set up product features
    if (product.value.features && Array.isArray(product.value.features)) {
      // Transformer les chaînes en objets avec label et value
      productFeatures.value = product.value.features.map((feature) => {
        if (typeof feature === "string") {
          // Si c'est une chaîne, créer un objet avec label et value
          return {
            label: feature,
            value: "✓",
          };
        }
        // Si c'est déjà un objet avec label et value, le retourner tel quel
        return feature;
      });
    } else {
      productFeatures.value = [];
    }

    // Test temporaire pour forcer l'affichage
    if (productFeatures.value.length === 0) {
      productFeatures.value = [{ label: "Test caractéristique", value: "✓" }];
    }

    // Set up bulk options if available
    if (product.value.bulkOptions) {
      try {
        bulkOptions.value =
          typeof product.value.bulkOptions === "string"
            ? JSON.parse(product.value.bulkOptions)
            : product.value.bulkOptions;
      } catch {
        bulkOptions.value = [];
      }
    } else {
      bulkOptions.value = [];
    }

    // Set up reviews if available
    if (product.value.reviews) {
      try {
        productReviews.value =
          typeof product.value.reviews === "string"
            ? JSON.parse(product.value.reviews)
            : product.value.reviews;
      } catch {
        productReviews.value = [];
      }
    } else {
      productReviews.value = [];
    }

    // Set up specs if available
    if (product.value.specs) {
      try {
        productSpecs.value =
          typeof product.value.specs === "string"
            ? JSON.parse(product.value.specs)
            : product.value.specs;
      } catch {
        productSpecs.value = [];
      }
    } else {
      productSpecs.value = [];
    }
  } catch (error) {
    console.error("Error loading product:", error);
    router.push("/404");
  } finally {
    pending.value = false;
  }
});

useHead({
  title: computed(() => (product.value ? `${product.value.name} - EduShop` : 'Produit - EduShop')),
  meta: [
    { name: 'description', content: computed(() => product.value?.description || 'Fournitures scolaires de qualité au Sénégal.') },
    { property: 'og:title', content: computed(() => (product.value ? `${product.value.name} | EduShop Sénégal` : 'EduShop')) },
    { property: 'og:description', content: computed(() => product.value?.description || 'Achetez vos fournitures scolaires au meilleur prix au Sénégal.') },
    { property: 'og:image', content: computed(() => product.value?.image || 'https://www.e-du.shop/og-image.jpg') },
    { property: 'og:type', content: 'product' },
  ],
});
</script>


<style scoped>
/* Optional: any additional custom styles can go here */
</style>
