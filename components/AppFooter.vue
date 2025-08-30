<template>
  <footer class="bg-primary-green text-white pt-12 pb-6 mt-auto">
    <div class="container mx-auto px-4">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- About Section -->
        <div class="col-span-1 md:col-span-2">
          <h3 class="text-xl font-bold mb-4">À propos de nous</h3>
          <p class=" mb-4">
            Votre partenaire de confiance pour toutes les fournitures scolaires de qualité à des prix imbattables.
          </p>
         
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Liens rapides</h3>
          <ul class="space-y-2">
            <li><a href="/" class=" hover:text-white transition-colors">Accueil</a></li>
            <li><a href="/products" class=" hover:text-white transition-colors">Produits</a></li>
            <li><a href="/packs" class=" hover:text-white transition-colors">Packs</a></li>
            <li><a href="/promotions" class=" hover:text-white transition-colors">Promotions</a></li>
            <li><a href="/about" class=" hover:text-white transition-colors">À propos</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Contactez-nous</h3>
          <address class="not-italic">
            <div class="flex items-center mb-2">
              <svg class="h-5 w-5 mr-2 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="">Ouakam Cité Avion, Dakar</span>
            </div>
            <div class="flex items-center mb-2">
              <svg class="h-5 w-5 mr-2 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:zeynash1@gmail.com" class=" hover:text-white transition-colors">zeynash1@gmail.com</a>
            </div>
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-2 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+221777780456" class=" hover:text-white transition-colors">+221 77 778 04 56</a>
            </div>
          </address>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-white pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-white text-sm">&copy; {{ new Date().getFullYear() }} Fournitures Scolaires. Tous droits réservés.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-white hover:text-white text-sm">Mentions légales</a>
            <a href="#" class="text-white hover:text-white text-sm">Politique de confidentialité</a>
            <a href="#" class="text-white hover:text-white text-sm">Conditions générales</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Script setup if needed
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
