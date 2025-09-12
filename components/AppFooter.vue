<template>
  <footer class="bg-green-800 text-white">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Logo et description -->
        <div class="space-y-4">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div
              class="w-10 h-10 bg-accent-400 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 20.477 5.754 20 7.5 20s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 20.477 18.247 20 16.5 20c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span class="text-2xl font-bold text-white"
              >Edu<span class="text-accent-400">Shop</span></span
            >
          </NuxtLink>
          <p class="text-gray-300 text-sm">
            Votre partenaire de confiance pour toutes les fournitures scolaires
            de qualité à des prix compétitifs.
          </p>
        </div>

        <!-- Liens rapides -->
        <div>
          <h3
            class="text-base font-semibold text-white uppercase tracking-wider mb-4"
          >
            Liens rapides
          </h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                to="/"
                class="text-gray-300 hover:text-white transition-colors text-sm flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Accueil
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/products"
                class="text-gray-300 hover:text-white transition-colors text-sm flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Produits
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/packs"
                class="text-gray-300 hover:text-white transition-colors text-sm flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Packs
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/promotions"
                class="text-gray-300 hover:text-white transition-colors text-sm flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-3 7 3z"
                  />
                </svg>
                Promotions
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/about"
                class="text-gray-300 hover:text-white transition-colors text-sm flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                À propos
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Informations de contact -->
        <div>
          <h3
            class="text-base font-semibold text-white uppercase tracking-wider mb-4"
          >
            Contactez-nous
          </h3>
          <address class="space-y-3 not-italic">
            <div class="flex items-start">
              <svg
                class="flex-shrink-0 h-5 w-5 text-gray-300 mt-0.5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="text-sm text-gray-300"
                >Ouakam Cité Avion, Dakar, Sénégal</span
              >
            </div>
            <div class="flex items-center">
              <svg
                class="flex-shrink-0 h-5 w-5 text-gray-300 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a
                href="mailto:contact@edushop.sn"
                class="text-sm text-gray-300 hover:text-white transition-colors"
                >contact@edushop.sn</a
              >
            </div>
            <div class="flex items-center">
              <svg
                class="flex-shrink-0 h-5 w-5 text-gray-300 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a
                href="tel:+221782911844"
                class="text-sm text-gray-300 hover:text-white transition-colors"
                >+221 78 291 18 44</a
              >
            </div>
            <div class="flex items-center">
              <svg
                class="flex-shrink-0 h-5 w-5 text-gray-300 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-sm text-gray-300">Lun - Sam: 8h00 - 20h00</span>
            </div>
          </address>

          <!-- Newsletter -->
          <div class="mt-6">
            <h4 class="text-sm font-semibold text-white mb-2">Newsletter</h4>
            <p class="text-xs text-gray-300 mb-3">
              Inscrivez-vous pour recevoir nos offres spéciales
            </p>
            <form class="flex">
              <input
                type="email"
                placeholder="Votre email"
                class="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-l-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                class="bg-primary-600 text-white px-4 py-2 text-sm font-medium rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Copyright et mentions légales -->
    </div>
  </footer>
</template>

<script setup lang="ts">
// Script setup if needed
</script>

<style scoped>
/* Styles pour les liens actifs */
.router-link-active {
  @apply text-white font-medium;
}

/* Animation pour les liens de navigation */
a,
.nuxt-link-active {
  @apply transition-colors duration-200;
}

/* Style pour le formulaire de newsletter */
form:focus-within {
  @apply ring-2 ring-primary-500 rounded-md;
}

/* Style pour les icônes de contact */
.contact-icon {
  @apply flex-shrink-0 h-5 w-5 text-gray-300;
}

/* Animation au survol des liens */
.hover-lift {
  @apply transition-transform duration-200 hover:-translate-y-0.5;
}

/* Style pour les séparateurs de liens */
.link-separator {
  @apply text-gray-600 mx-1;
}

/* Style pour le badge de paiement sécurisé */
.payment-badge {
  @apply inline-flex items-center bg-gray-800 px-2 py-1 rounded-md transition-all duration-200 hover:bg-gray-700;
}

/* Style pour les liens du footer */
.footer-link {
  @apply text-gray-400 hover:text-white text-xs transition-colors duration-200;
}

/* Style pour le formulaire de newsletter */
.newsletter-input {
  @apply flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-l-md focus:ring-2 focus:ring-primary-500 focus:border-transparent;
}

.newsletter-button {
  @apply bg-primary-600 text-white px-4 py-2 text-sm font-medium rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors;
}

/* Style pour le copyright */
.copyright-text {
  @apply text-xs text-gray-400;
}

/* Style pour le coeur */
.heart {
  @apply inline-block text-red-400 animate-pulse;
}
</style>
