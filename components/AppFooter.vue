<template>
  <footer class="bg-[#FBFBFA] text-slate-900 pt-16 pb-12 border-t border-slate-200/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        
        <!-- Brand Column (lg:col-span-5) -->
        <div class="lg:col-span-5 space-y-4">
          <!-- Logo EduShop -->
          <NuxtLink to="/" class="inline-flex items-center">
            <img
              :src="logoImg"
              alt="EduShop — Tout pour réussir"
              class="h-10 md:h-12 w-auto object-contain"
            />
          </NuxtLink>

          <!-- Description text -->
          <p class="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium max-w-sm">
            La meilleure façon de préparer la rentrée scolaire au Sénégal. Livraison partout à Dakar et dans les régions.
          </p>

          <!-- Social Icons (Facebook, Instagram, Twitter) -->
          <div class="flex items-center space-x-3 pt-2">
            <a
              href="https://www.facebook.com/profile.php?id=61591634111260&mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-[#0F3D91] hover:bg-[#0F3D91] hover:text-white transition-all bg-white shadow-xs"
              aria-label="Facebook"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/matkam_off?igsi=a3gxNmthZ3VtdXFi&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-[#0F3D91] hover:bg-[#0F3D91] hover:text-white transition-all bg-white shadow-xs"
              aria-label="Instagram"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@matkam01?_r=1&_t=ZS-997cWZ4HFQq"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-[#0F3D91] hover:bg-[#0F3D91] hover:text-white transition-all bg-white shadow-xs"
              aria-label="TikTok"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.33 6.33 0 0 0 6.33-6.32V9.28a8.21 8.21 0 0 0 4.92 1.63v-3.47a4.84 4.84 0 0 1-1-.75z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Links Columns Container (lg:col-span-7) -->
        <div class="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          
          <!-- Column 1: Boutique -->
          <div>
            <h3 class="font-display text-xs font-extrabold text-slate-950 uppercase tracking-wider mb-4">
              Boutique
            </h3>
            <ul class="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <NuxtLink to="/packs" class="hover:text-[#0F3D91] transition-colors">Packs scolaires</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/products" class="hover:text-[#0F3D91] transition-colors">Produits</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/products" class="hover:text-[#0F3D91] transition-colors">Nouveautés</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Column 2: Aide -->
          <div>
            <h3 class="font-display text-xs font-extrabold text-slate-950 uppercase tracking-wider mb-4">
              Aide
            </h3>
            <ul class="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <NuxtLink to="/contact" class="hover:text-[#0F3D91] transition-colors">Nous contacter</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/orders" class="hover:text-[#0F3D91] transition-colors">Suivi commande</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Column 3: EduShop -->
          <div>
            <h3 class="font-display text-xs font-extrabold text-slate-950 uppercase tracking-wider mb-4">
              EduShop
            </h3>
            <ul class="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <NuxtLink to="/about" class="hover:text-[#0F3D91] transition-colors">À propos</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/blog" class="hover:text-[#0F3D91] transition-colors">Blog</NuxtLink>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Bottom Legal Bar (Matching exact screenshot) -->
      <div class="mt-12 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-medium space-y-4 sm:space-y-0">
        <p>© 2026 EduShop Sénégal. Tous droits réservés.</p>
        
        <div class="flex items-center space-x-6">
          <NuxtLink to="/confidentialite" class="hover:text-[#0F3D91] transition-colors">
            Confidentialité
          </NuxtLink>
          <NuxtLink to="/cgv" class="hover:text-[#0F3D91] transition-colors">
            CGV
          </NuxtLink>
          <NuxtLink to="/mentions-legales" class="hover:text-[#0F3D91] transition-colors">
            Mentions légales
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import logoImg from "~/assets/images/edushop-official-logo-transparent.png";
</script>
