<!-- pages/configurator.vue - Assistant Rentrée Zen Pro -->
<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 font-sans pb-24">
    <!-- Header avec barre de progression de l'assistant -->
    <div class="border-b border-slate-200 bg-white sticky top-16 md:top-20 z-30 shadow-xs">
      <div class="container-edu py-4 flex items-center gap-6">
        <div class="flex items-center gap-2 text-sm font-bold text-[#0F3D91]">
          <span>✨</span>
          <span>Assistant Rentrée</span>
        </div>
        <div class="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            class="h-full bg-[#0F3D91] transition-all duration-500 ease-out"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
        <span class="text-xs text-slate-500 font-bold tabular-nums">
          Étape {{ currentStep + 1 }} / {{ steps.length }}
        </span>
      </div>
    </div>

    <!-- Conteneur de l'assistant -->
    <section class="container-edu py-10 md:py-16 max-w-4xl">
      <ClientOnly>
        <!-- 📸 Bannières Scanner IA de Liste Scolaire (Placée en haut de l'assistant) -->
      <div class="bg-gradient-to-br from-[#0F3D91] to-[#0B132B] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-10 relative overflow-hidden">
        <div class="absolute -right-8 -bottom-8 w-48 h-48 bg-[#F4C542]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div class="relative z-10 space-y-4">
          <div class="flex items-center gap-2">
            <span class="bg-[#F4C542] text-slate-950 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
              NOUVEAU · ASSISTANT IA
            </span>
            <span v-if="scannedRequest" class="bg-emerald-500/20 text-emerald-300 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-400/30">
              Réf : {{ scannedRequest.id }}
            </span>
          </div>

          <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            📸 Photographiez votre <span class="text-[#F4C542]">liste scolaire</span>
          </h2>
          <p class="text-slate-200 text-xs sm:text-sm font-medium max-w-xl leading-relaxed">
            Importez la photo ou le PDF de votre liste de fournitures. L'assistant IA analyse le document, associe les produits disponibles et prépare votre commande.
          </p>

          <!-- Zone d'upload / Analyse -->
          <div v-if="!isScanning && !scannedRequest" class="pt-2">
            <label class="cursor-pointer inline-flex items-center gap-3 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-md hover:scale-105 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h0.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Importer ou prendre en photo ma liste (JPG, PNG, PDF)</span>
              <input type="file" accept="image/*,application/pdf" class="hidden" @change="handleFileUpload" />
            </label>
          </div>

          <!-- Spinner d'analyse IA -->
          <div v-if="isScanning" class="py-6 flex items-center gap-4 bg-white/10 p-5 rounded-2xl border border-white/15">
            <div class="w-8 h-8 border-3 border-white/30 border-t-[#F4C542] rounded-full animate-spin"></div>
            <div>
              <p class="font-bold text-sm text-white">Analyse de la liste par l'assistant IA...</p>
              <p class="text-xs text-slate-300">Matching 3 niveaux avec le catalogue EduShop</p>
            </div>
          </div>

          <!-- Résultat de l'analyse IA -->
          <div v-if="scannedRequest && !isScanning" class="pt-4 space-y-6 bg-white text-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
            <!-- Badge score de confiance qualitatif global -->
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span class="text-[11px] uppercase tracking-widest text-slate-400 font-extrabold block">RÉFÉRENCE UNIQUE</span>
                <span class="font-display font-extrabold text-xl text-[#0F3D91]">{{ scannedRequest.id }}</span>
              </div>
              <div class="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-extrabold px-4 py-2 rounded-full border border-emerald-200">
                <span>✅ Liste analysée — Confiance {{ scannedRequest.overallConfidenceLevel }}</span>
              </div>
            </div>

            <!-- Messages d'information recommandés -->
            <div class="space-y-2 text-xs sm:text-sm font-semibold">
              <p class="text-emerald-800 flex items-center gap-2">
                <span>✅</span>
                <span>Les articles disponibles sont prêts à être commandés immédiatement.</span>
              </p>
              <p class="text-amber-800 flex items-center gap-2">
                <span>🔍</span>
                <span>Les autres articles sont déjà en cours de recherche auprès de nos fournisseurs.</span>
              </p>
            </div>

            <!-- Liste des articles extraits (Matchs + Sourcing) -->
            <div class="space-y-3 pt-2">
              <h4 class="font-display text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Articles détectés dans votre liste ({{ scannedRequest.extractedItems.length }})
              </h4>

              <div class="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden max-h-80 overflow-y-auto">
                <div
                  v-for="item in scannedRequest.extractedItems"
                  :key="item.id"
                  class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50 transition-colors"
                >
                  <div class="space-y-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-bold text-slate-900 text-sm">
                        {{ item.quantity }}x {{ item.normalizedName }}
                      </span>

                      <!-- Badge affiché uniquement pour les articles en cours de recherche fournisseur -->
                      <span
                        v-if="item.matchType === 'sourcing'"
                        class="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full"
                      >
                        🔍 En cours de recherche auprès de nos fournisseurs
                      </span>
                    </div>

                    <p v-if="item.matchedProductName" class="text-xs text-slate-500 font-medium">
                      Article retenu : {{ item.matchedProductName }}
                    </p>
                  </div>

                  <div class="text-right shrink-0">
                    <span v-if="item.matchedProductPrice" class="font-extrabold text-sm text-[#0F3D91]">
                      {{ useFormatter().formatPrice(item.matchedProductPrice * item.quantity) }}
                    </span>
                    <span v-else class="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full inline-block">
                      Recherche fournisseur
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer & Bouton de commande des articles disponibles -->
            <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-widest text-slate-400 font-extrabold">Montant disponible maintenant</p>
                <p class="font-display text-3xl font-extrabold text-[#0F3D91]">
                  {{ useFormatter().formatPrice(scannedRequest.availableTotal) }}
                </p>
              </div>

              <div class="flex items-center gap-3 w-full sm:w-auto">
                <button
                  @click="scannedRequest = null"
                  class="text-xs font-bold text-slate-500 hover:text-slate-900 px-4 py-3 border border-slate-200 rounded-full"
                >
                  Scanner une autre photo
                </button>

                <button
                  @click="orderScannedAvailableItems"
                  class="bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-extrabold text-sm px-8 py-3.5 rounded-full shadow-md hover:scale-105 transition-all flex-1 sm:flex-initial text-center"
                >
                  🛒 Commander les articles disponibles ({{ useFormatter().formatPrice(scannedRequest.availableTotal) }}) →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </ClientOnly>

      <div class="eyebrow mb-3">Ou préparez votre pack manuellement — Étape {{ currentStep + 1 }} sur {{ steps.length }}</div>

      <!-- Étape 0 : Niveau -->
      <div v-if="currentStep === 0" class="space-y-6 animate-fade-in">
        <h1 class="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F3D91] leading-tight">
          Pour quel <span class="text-[#F4C542]">niveau</span> préparez-vous la rentrée ?
        </h1>
        <p class="text-slate-600 text-sm md:text-base">Choisissez la classe de votre enfant.</p>

        <div class="grid gap-6 sm:grid-cols-2 pt-4">
          <button
            v-for="lv in levelOptions"
            :key="lv.key"
            @click="selectedLevel = lv.key"
            class="text-left p-6 rounded-3xl border-2 transition-all flex flex-col justify-between group cursor-pointer bg-white"
            :class="selectedLevel === lv.key ? 'border-[#0F3D91] bg-[#0F3D91]/5 shadow-md ring-2 ring-[#0F3D91]/20' : 'border-slate-200/80 hover:border-[#0F3D91]/40'"
          >
            <div class="relative h-36 w-full mb-4 rounded-2xl bg-[#F8F6F0] overflow-hidden flex items-center justify-center p-3">
              <img :src="lv.image" :alt="lv.title" class="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105" />
              <span v-if="selectedLevel === lv.key" class="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#0F3D91] text-white flex items-center justify-center font-bold text-xs shadow-md">
                ✓
              </span>
            </div>
            <div class="flex items-end justify-between w-full">
              <div>
                <p class="text-[11px] uppercase tracking-widest text-slate-400 font-extrabold">{{ lv.sub }}</p>
                <h3 class="font-display text-xl font-extrabold text-[#0F3D91] mt-0.5">{{ lv.title }}</h3>
              </div>
              <span class="text-xs font-bold text-[#0F3D91] bg-[#0F3D91]/10 px-3 py-1.5 rounded-full">
                dès {{ lv.priceFormatted }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Étape 1 : Enfant -->
      <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
        <h1 class="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F3D91] leading-tight">
          Votre enfant est ?
        </h1>
        <p class="text-slate-600 text-sm md:text-base">Pour affiner les couleurs et accessoires recommandés.</p>

        <div class="grid gap-4 sm:grid-cols-2 pt-4">
          <button
            v-for="g in genderOptions"
            :key="g.key"
            @click="selectedGender = g.key"
            class="p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-all"
            :class="selectedGender === g.key ? 'border-[#0F3D91] bg-[#0F3D91]/5 shadow-lift' : 'border-slate-200/80 bg-white hover:border-[#0F3D91]/40'"
          >
            <span class="text-3xl">{{ g.emoji }}</span>
            <span class="font-bold text-sm text-[#0F3D91]">{{ g.label }}</span>
          </button>
        </div>
      </div>

      <!-- Étape 2 : École -->
      <div v-if="currentStep === 2" class="space-y-6 animate-fade-in">
        <h1 class="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F3D91] leading-tight">
          Dans quelle <span class="text-[#F4C542]">école</span> ?
        </h1>
        <p class="text-slate-600 text-sm md:text-base">Indiquez l'établissement ou la ville (optionnel).</p>

        <div class="pt-4 space-y-4">
          <input
            v-model="schoolName"
            type="text"
            placeholder="ex: École Sacré-Cœur, Dakar"
            class="w-full h-14 px-6 rounded-2xl border-2 border-slate-200/90 focus:border-[#0F3D91] focus:outline-none text-base bg-white shadow-xs font-medium"
          />
          <div class="flex flex-wrap gap-2 pt-2">
            <button
              v-for="s in ['École publique', 'École privée', 'Enseignant indépendant']"
              :key="s"
              @click="schoolName = s"
              class="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-[#0F3D91]"
            >
              {{ s }}
            </button>
          </div>
        </div>
      </div>

      <!-- Étape 3 : Sac -->
      <div v-if="currentStep === 3" class="space-y-6 animate-fade-in">
        <h1 class="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F3D91] leading-tight">
          Faut-il un <span class="text-[#F4C542]">sac à dos</span> ?
        </h1>
        <p class="text-slate-600 text-sm md:text-base">Sac ergonomique certifié dos-sain adapté au niveau scolaire.</p>

        <div class="grid gap-4 sm:grid-cols-2 pt-4">
          <button
            @click="wantsBag = true"
            class="p-6 rounded-3xl border-2 text-left transition-all"
            :class="wantsBag === true ? 'border-[#0F3D91] bg-[#0F3D91]/5 shadow-lift' : 'border-slate-200/80 bg-white hover:border-[#0F3D91]/40'"
          >
            <span class="text-3xl">🎒</span>
            <p class="mt-3 font-display text-xl font-bold text-[#0F3D91]">Oui, ajouter un sac</p>
            <p class="mt-1 text-xs text-slate-500 font-semibold">+ 12 500 FCFA · Sac ergonomique renforcé</p>
          </button>

          <button
            @click="wantsBag = false"
            class="p-6 rounded-3xl border-2 text-left transition-all"
            :class="wantsBag === false ? 'border-[#0F3D91] bg-[#0F3D91]/5 shadow-lift' : 'border-slate-200/80 bg-white hover:border-[#0F3D91]/40'"
          >
            <span class="text-3xl">✖️</span>
            <p class="mt-3 font-display text-xl font-bold text-[#0F3D91]">Non merci</p>
            <p class="mt-1 text-xs text-slate-500 font-semibold">Mon enfant a déjà un sac.</p>
          </button>
        </div>
      </div>

      <!-- Étape 4 : Couleurs -->
      <div v-if="currentStep === 4" class="space-y-6 animate-fade-in">
        <h1 class="font-display text-4xl md:text-5xl font-extrabold text-[#0F3D91] leading-tight">
          Quelle <span class="text-[#F4C542]">couleur</span> préfère-t-il / elle ?
        </h1>
        <p class="text-slate-600 text-sm md:text-base">Pour harmoniser le sac et les fournitures.</p>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-4">
          <button
            v-for="c in colorOptions"
            :key="c.key"
            @click="selectedColor = c.key"
            class="p-4 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer bg-white"
            :class="selectedColor === c.key ? 'border-[#0F3D91] bg-[#0F3D91]/5 shadow-md ring-2 ring-[#0F3D91]/20' : 'border-slate-200/80 hover:border-[#0F3D91]/40'"
          >
            <div
              class="w-10 h-10 rounded-full shadow-inner flex items-center justify-center text-white font-bold text-sm relative shrink-0"
              :style="{ backgroundColor: c.hex }"
            >
              <span v-if="selectedColor === c.key" class="drop-shadow-sm">✓</span>
            </div>
            <span class="text-xs font-bold text-slate-900 text-center leading-tight">
              {{ c.label }}
            </span>
          </button>
        </div>
        <p class="text-xs text-slate-500 font-bold mt-2">
          Couleur sélectionnée : {{ selectedColorObj?.label || "Choisissez une couleur" }}
        </p>
      </div>

      <!-- Étape 5 : Extras -->
      <div v-if="currentStep === 5" class="space-y-6 animate-fade-in">
        <h1 class="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F3D91] leading-tight">
          Un <span class="text-[#F4C542]">petit plus</span> ?
        </h1>
        <p class="text-slate-600 text-sm md:text-base">Ajoutez les accessoires indispensables (optionnels).</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          <button
            v-for="e in extraOptions"
            :key="e.key"
            @click="toggleExtra(e.key)"
            class="text-left bg-white rounded-3xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
            :class="selectedExtras.includes(e.key) ? 'border-[#0F3D91] bg-[#0F3D91]/5 shadow-md ring-2 ring-[#0F3D91]/20' : 'border-slate-200/80 hover:border-[#0F3D91]/40'"
          >
            <!-- Product Photo Container -->
            <div class="relative aspect-square w-full bg-[#F8F6F0] flex items-center justify-center p-4 overflow-hidden">
              <img
                :src="e.image"
                :alt="e.label"
                class="max-h-full max-w-full object-contain mix-blend-multiply transform group-hover:scale-105 transition-transform duration-300"
              />
              <span
                class="absolute top-3 right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-md transition-all"
                :class="selectedExtras.includes(e.key) ? 'bg-[#0F3D91] border-[#0F3D91] text-white scale-110' : 'bg-white border-slate-300 text-slate-400'"
              >
                {{ selectedExtras.includes(e.key) ? '✓' : '+' }}
              </span>
            </div>

            <!-- Product Info -->
            <div class="p-5 space-y-2 flex-1 flex flex-col justify-between w-full">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                  {{ e.brand }} · {{ e.category }}
                </span>
                <h3 class="font-display text-sm font-bold text-slate-900 leading-snug">
                  {{ e.label }}
                </h3>
              </div>

              <div class="pt-3 flex items-center justify-between border-t border-slate-100 w-full">
                <span class="font-display text-sm font-extrabold text-[#0F3D91]">
                  + {{ useFormatter().formatPrice(e.price) }}
                </span>
                <span
                  class="text-xs font-bold px-2.5 py-1 rounded-full"
                  :class="selectedExtras.includes(e.key) ? 'bg-[#0F3D91] text-white' : 'bg-slate-100 text-slate-600'"
                >
                  {{ selectedExtras.includes(e.key) ? 'Sélectionné' : 'Ajouter' }}
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Étape 6 : Résumé -->
      <div v-if="currentStep === 6" class="space-y-6 animate-fade-in">
        <h1 class="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F3D91] leading-tight">
          Votre pack est <span class="text-[#F4C542]">prêt</span>.
        </h1>
        <p class="text-slate-600 text-sm md:text-base">Vérifiez la composition puis validez votre commande.</p>

        <div class="rounded-3xl border-2 border-slate-200 bg-white overflow-hidden shadow-lift mt-6">
          <div class="p-6 md:p-8 space-y-6">
            <div class="flex items-center justify-between">
              <span class="eyebrow">{{ levelOptions.find(l => l.key === selectedLevel)?.title }}</span>
              <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Prêt à envoyer</span>
            </div>

            <h3 class="font-display text-2xl font-extrabold text-[#0F3D91]">
              Pack Scolaire Personnalisé EduShop
            </h3>

            <ul class="divide-y divide-slate-100 border-y border-slate-100 py-2">
              <li class="py-3 flex justify-between text-sm font-semibold">
                <span>Pack de fournitures scolaires de base</span>
                <span class="font-bold text-[#0F3D91]">{{ useFormatter().formatPrice(basePackPrice) }}</span>
              </li>
              <li v-if="wantsBag" class="py-3 flex justify-between text-sm font-semibold">
                <span>Sac à dos ergonomique renforcé</span>
                <span class="font-bold text-[#0F3D91]">12 500 FCFA</span>
              </li>
              <li v-for="exKey in selectedExtras" :key="exKey" class="py-3 flex justify-between text-sm font-semibold">
                <span>{{ extraOptions.find(e => e.key === exKey)?.label }}</span>
                <span class="font-bold text-[#0F3D91]">{{ useFormatter().formatPrice(extraOptions.find(e => e.key === exKey)?.price || 0) }}</span>
              </li>
            </ul>

            <div class="flex items-center justify-between pt-4">
              <div>
                <p class="text-xs uppercase tracking-widest text-slate-400 font-bold">Total Général</p>
                <p class="font-display text-3xl font-extrabold text-[#0F3D91]">{{ useFormatter().formatPrice(totalPrice) }}</p>
              </div>
              <button
                @click="finalizeConfiguratorOrder"
                class="bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-bold text-sm px-8 py-4 rounded-full shadow-md hover:scale-105 transition-all"
              >
                Ajouter au panier & commander →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation entre étapes -->
      <div class="mt-10 flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          @click="currentStep = Math.max(0, currentStep - 1)"
          :disabled="currentStep === 0"
          class="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30"
        >
          ← Retour
        </button>

        <button
          v-if="currentStep < steps.length - 1"
          @click="canAdvance && (currentStep++)"
          :disabled="!canAdvance"
          class="bg-[#0F3D91] hover:bg-[#1248a8] text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all disabled:opacity-40"
        >
          Continuer →
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { useAirtableStore } from "~/stores/airtable";
import { useProductsStore } from "~/stores/products";
import { useFormatter } from "~/composables/useFormatter";
import { saveSchoolListRequest, type SchoolListRequest } from "~/utils/school-list-service";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const airtableStore = useAirtableStore();
const productsStore = useProductsStore();

const isScanning = ref(false);
const scannedRequest = ref<SchoolListRequest | null>(null);

function compressImage(file: File, maxWidth = 900, maxHeight = 900, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        } catch (err) {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  isScanning.value = true;
  scannedRequest.value = null;

  try {
    const base64 = await compressImage(file);
    if (!base64) {
      alert("Le fichier choisi est vide ou illisible.");
      isScanning.value = false;
      input.value = "";
      return;
    }

    const res = await $fetch<{ success: boolean; data?: SchoolListRequest; error?: string }>("/api/ai/scan-list", {
      method: "POST",
      body: { image: base64, fileName: file.name },
    });

    if (res && res.success && res.data) {
      scannedRequest.value = res.data;
      saveSchoolListRequest(res.data);
    } else {
      alert(res?.error || "Erreur lors de l'analyse de la liste scolaire.");
    }
  } catch (err: any) {
    console.error("Erreur d'upload de la liste:", err);
    alert(err?.data?.message || err?.message || "Impossible d'analyser le fichier. Réessayez avec un fichier JPG ou PNG.");
  } finally {
    isScanning.value = false;
    input.value = "";
  }
}

function orderScannedAvailableItems() {
  if (!scannedRequest.value) return;

  const req = scannedRequest.value;
  saveSchoolListRequest(req);

  req.extractedItems.forEach((item) => {
    if ((item.matchType === 'exact' || item.matchType === 'equivalent') && item.matchedProductId && item.matchedProductPrice) {
      cartStore.addItem(
        {
          id: item.matchedProductId,
          name: item.matchedProductName || item.normalizedName,
          price: item.matchedProductPrice,
          image: item.matchedProductImage || "https://images.unsplash.com/photo-1588072432836-e10032774350?w=200&fit=crop",
          type: "product",
          schoolListRef: req.id,
        },
        item.quantity || 1
      );
    }
  });

  router.push("/cart");
}

onMounted(async () => {
  if (productsStore.products.length === 0) {
    productsStore.initializeDemoData();
  }
  if (airtableStore.products.length === 0) {
    await airtableStore.fetchProducts();
  }
});

const steps = ["Niveau", "Enfant", "École", "Sac", "Couleurs", "Extras", "Résumé"];

const currentStep = ref(0);
const selectedLevel = ref<string | null>((route.query.level as string) || "primaire");
const selectedGender = ref<string | null>("boy");
const schoolName = ref("");
const wantsBag = ref<boolean | null>(true);
const selectedColor = ref<string>("blue");
const selectedExtras = ref<string[]>(["calc"]);

const levelOptions = [
  {
    key: "prescolaire",
    title: "Préscolaire",
    sub: "3 – 5 ans",
    priceFormatted: "16 500 FCFA",
    image: "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
  },
  {
    key: "primaire",
    title: "Primaire",
    sub: "CP – CM2",
    priceFormatted: "21 000 FCFA",
    image: "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
  },
  {
    key: "college",
    title: "Collège",
    sub: "6ᵉ – 3ᵉ",
    priceFormatted: "28 000 FCFA",
    image: "https://i.pinimg.com/736x/10/54/a3/1054a36c0ce9460b0a1e2aafa65c9a20.jpg",
  },
  {
    key: "lycee",
    title: "Lycée",
    sub: "2nde – Term.",
    priceFormatted: "38 500 FCFA",
    image: "https://i.pinimg.com/736x/4c/27/58/4c275881308b4ae3956c80856018a375.jpg",
  },
];

const genderOptions = [
  { key: "boy", emoji: "👦", label: "Un garçon" },
  { key: "girl", emoji: "👧", label: "Une fille" },
];

const colorOptions = [
  { key: "blue", label: "Bleu profond", hex: "#0F3D91" },
  { key: "yellow", label: "Jaune soleil", hex: "#F4C542" },
  { key: "green", label: "Vert forêt", hex: "#15803d" },
  { key: "pink", label: "Rose poudré", hex: "#ec4899" },
  { key: "purple", label: "Violet roi", hex: "#7e22ce" },
  { key: "black", label: "Noir élégant", hex: "#1e293b" },
];

const extraOptions = computed(() => {
  const storeProds = airtableStore.products.length > 0 ? airtableStore.products : productsStore.products;
  if (storeProds && storeProds.length > 0) {
    return storeProds.map((p) => ({
      key: p.id,
      label: p.name,
      brand: p.category ? p.category.toUpperCase() : "EDUSHOP",
      category: p.category || "Accessoires",
      price: p.price,
      image: p.image,
    }));
  }
  return [
    {
      key: "sac-a-dos-navigateur",
      label: "Sac à dos Navigateur",
      brand: "EDUSHOP",
      category: "Bagagerie",
      price: 12500,
      image: "https://i.pinimg.com/736x/8c/4f/b8/8c4fb8bd40f1a67e063ffb2223f4190b.jpg",
    },
    {
      key: "cahiers-96p-lot-6",
      label: "Cahiers 96 pages — Lot de 6",
      brand: "CLAIREFONTAINE",
      category: "Cahiers",
      price: 3600,
      image: "https://i.pinimg.com/1200x/4e/99/18/4e991885818a6f5d75c158915c667798.jpg",
    },
    {
      key: "calculatrice-fx-92",
      label: "Calculatrice scientifique FX-92",
      brand: "CASIO",
      category: "Calculatrices",
      price: 14500,
      image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=500",
    },
    {
      key: "crayons-couleur-24",
      label: "Crayons de couleur — Lot de 24",
      brand: "FABER-CASTELL",
      category: "Arts plastiques",
      price: 4200,
      image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=500",
    },
    {
      key: "cahier-120p",
      label: "Cahier 200 pages grand format",
      brand: "CLAIREFONTAINE",
      category: "Cahiers",
      price: 600,
      image: "https://i.pinimg.com/736x/fd/f9/0b/fdf90bf685ccedf53d0297c5133f3678.jpg",
    },
    {
      key: "stylo-bille-bleu",
      label: "Stylo Bille Bleu (Lot de 4)",
      brand: "BIC",
      category: "Stylos",
      price: 500,
      image: "https://i.pinimg.com/736x/f3/c3/96/f3c396b6166cb46d61cafa6656cce35c.jpg",
    },
  ];
});

const selectedColorObj = computed(() => colorOptions.find((c) => c.key === selectedColor.value));

const basePackPrice = computed(() => {
  switch (selectedLevel.value) {
    case "prescolaire": return 16500;
    case "primaire": return 21000;
    case "college": return 28000;
    case "lycee": return 38500;
    default: return 21000;
  }
});

const totalPrice = computed(() => {
  let total = basePackPrice.value;
  if (wantsBag.value) total += 12500;
  selectedExtras.value.forEach((key) => {
    const ext = extraOptions.value.find((e) => e.key === key);
    if (ext) total += ext.price;
  });
  return total;
});

const canAdvance = computed(() => {
  switch (currentStep.value) {
    case 0: return !!selectedLevel.value;
    case 1: return !!selectedGender.value;
    case 2: return true;
    case 3: return wantsBag.value !== null;
    case 4: return !!selectedColor.value;
    default: return true;
  }
});

const progressPercent = computed(() => ((currentStep.value + 1) / steps.length) * 100);

function toggleExtra(key: string) {
  if (selectedExtras.value.includes(key)) {
    selectedExtras.value = selectedExtras.value.filter((k) => k !== key);
  } else {
    selectedExtras.value.push(key);
  }
}

function finalizeConfiguratorOrder() {
  const levelObj = levelOptions.find((l) => l.key === selectedLevel.value);
  const colorObj = colorOptions.find((c) => c.key === selectedColor.value);
  const genderLabel = genderOptions.find((g) => g.key === selectedGender.value)?.label || 'Élève';

  const packName = `Pack ${levelObj?.title || 'Scolaire'} Sur-Mesure (${colorObj?.label || 'Bleu'})`;
  const packDescription = `Niveau: ${levelObj?.title} · ${genderLabel} · ${schoolName.value ? 'École: ' + schoolName.value + ' · ' : ''}Couleur: ${colorObj?.label} · ${wantsBag.value ? 'Sac ergonomique inclus' : 'Sans sac'}`;

  const configuratorChoice = {
    level: levelObj?.title || 'Scolaire',
    gender: selectedGender.value === 'fille' || selectedGender.value === 'girl' ? 'girl' : 'boy',
    bag: wantsBag.value,
    color: colorObj?.label || 'Bleu',
    schoolName: schoolName.value || '',
  };

  if (process.client) {
    localStorage.setItem("active_configurator_choice", JSON.stringify(configuratorChoice));
  }

  cartStore.addItem(
    {
      id: `config-pack-${Date.now()}`,
      name: packName,
      price: totalPrice.value,
      image: "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
      type: "pack",
      description: packDescription,
      configuratorChoice: configuratorChoice,
    },
    1
  );
  router.push("/cart");
}
</script>
