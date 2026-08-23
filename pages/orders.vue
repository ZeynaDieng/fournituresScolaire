<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 pt-8 pb-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Top Eyebrow & Search Bar -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-[#0F3D91] block">
              SUIVI DE COMMANDE EN TEMPS RÉEL
            </span>
            <h1 class="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight flex items-center gap-3">
              <span>Commande #{{ activeOrder.ref }}</span>
              <button 
                @click="copyRef"
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-all cursor-pointer"
                title="Copier la référence"
              >
                <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <svg v-else class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
                <span>{{ copied ? 'Copié !' : 'Copier' }}</span>
              </button>
            </h1>
            <p class="text-slate-500 text-xs sm:text-sm font-medium">
              Passée le {{ activeOrder.date }} · <span class="font-extrabold text-slate-950">{{ formatPrice(activeOrder.total) }}</span>
            </p>
          </div>

          <!-- Dynamic Search Form -->
          <div class="w-full md:w-80">
            <form @submit.prevent="searchOrder" class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="N° de commande (ex: ES-2026-8241)"
                class="w-full pl-4 pr-10 py-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-[#0F3D91] focus:ring-1 focus:ring-[#0F3D91] transition-all"
              />
              <button
                type="submit"
                class="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#0F3D91] text-white rounded-full flex items-center justify-center hover:bg-[#0c3278] transition-colors cursor-pointer"
              >
                <svg v-if="!isSearching" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <div v-else class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </button>
            </form>
          </div>
        </div>

        <!-- Dynamic Overall Progress Bar -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <div class="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Avancement de la commande</span>
            <span class="text-[#0F3D91]">{{ currentStepPercent }}%</span>
          </div>
          <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-[#0F3D91] transition-all duration-700 ease-out rounded-full"
              :style="{ width: `${currentStepPercent}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Column: Stepper Timeline Card (lg:col-span-8) -->
        <div class="lg:col-span-8 space-y-6">
          <div class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
            
            <div class="flex items-center justify-between">
              <h2 class="font-display text-xl font-extrabold text-slate-950">
                Étapes de suivi
              </h2>

              <!-- Demo Interactive Step Switcher -->
              <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full text-xs font-semibold">
                <button
                  v-for="(step, idx) in steps"
                  :key="step.id"
                  @click="currentStepIndex = idx"
                  class="px-2.5 py-1 rounded-full transition-all cursor-pointer"
                  :class="currentStepIndex === idx ? 'bg-[#0F3D91] text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  {{ idx + 1 }}
                </button>
              </div>
            </div>

            <!-- Stepper Timeline -->
            <div class="relative space-y-10">
              
              <div
                v-for="(step, idx) in steps"
                :key="step.id"
                class="relative flex items-start space-x-6 group"
              >
                <!-- Vertical Line -->
                <div
                  v-if="idx < steps.length - 1"
                  class="absolute left-5 top-10 bottom-0 w-0.5 -ml-[1px] transition-colors duration-500"
                  :class="idx < currentStepIndex ? 'bg-[#0F3D91]' : 'bg-slate-200'"
                ></div>

                <!-- Step Circle -->
                <div
                  class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all duration-500 shrink-0"
                  :class="[
                    idx <= currentStepIndex 
                      ? 'bg-[#0F3D91] text-white shadow-md' 
                      : 'bg-slate-100 text-slate-400',
                    idx === currentStepIndex ? 'ring-4 ring-blue-100 scale-105' : ''
                  ]"
                >
                  <svg v-if="idx === 0" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>

                  <svg v-else-if="idx === 1" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 2a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H5zm0 2h10v3H5V4zm0 5h10v9H5V9z" clip-rule="evenodd"/>
                  </svg>

                  <svg v-else-if="idx === 2" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M8 16a2 2 0 100-4 2 2 0 000 4zM16 16a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h.268a3.001 3.001 0 015.464 0h3.536a3.001 3.001 0 015.464 0H19a1 1 0 001-1v-4a1 1 0 00-.293-.707l-3-3A1 1 0 0016 7h-2V4a2 2 0 00-2-2H4zm10 5h2.586l2 2H14V9z" clip-rule="evenodd"/>
                  </svg>

                  <svg v-else class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                  </svg>
                </div>

                <!-- Step Info -->
                <div class="pt-1 space-y-1">
                  <h3
                    class="font-display text-lg font-extrabold transition-colors"
                    :class="idx <= currentStepIndex ? 'text-slate-950' : 'text-slate-400'"
                  >
                    {{ step.title }}
                  </h3>
                  <p
                    class="text-xs font-medium"
                    :class="idx === currentStepIndex ? 'text-[#0F3D91] font-bold animate-pulse' : 'text-slate-400'"
                  >
                    {{ step.desc }}
                  </p>
                </div>
              </div>

            </div>
          </div>

          <!-- Accordion: Articles de la commande -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <button
              @click="showItems = !showItems"
              class="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-blue-50 text-[#0F3D91] flex items-center justify-center font-bold">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-display text-base font-extrabold text-slate-950">
                    Contenu de la commande
                  </h3>
                  <p class="text-xs text-slate-500 font-medium">
                    {{ activeOrder.items.length }} article(s) · Total: {{ formatPrice(activeOrder.total) }}
                  </p>
                </div>
              </div>

              <svg
                class="w-5 h-5 text-slate-500 transition-transform duration-300"
                :class="showItems ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Items List -->
            <div v-if="showItems" class="pt-4 border-t border-slate-100 space-y-3">
              <div
                v-for="(item, idx) in activeOrder.items"
                :key="idx"
                class="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div class="flex items-center gap-3">
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-200/60"
                  />
                  <div>
                    <h4 class="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                      {{ item.name }}
                    </h4>
                    <p class="text-xs text-slate-500 font-medium">
                      Quantité: {{ item.qty }}
                    </p>
                  </div>
                </div>
                <span class="font-extrabold text-xs sm:text-sm text-[#0F3D91]">
                  {{ formatPrice(item.price * item.qty) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Shipping & Interactive Support (lg:col-span-4) -->
        <div class="lg:col-span-4 space-y-6">
          
          <!-- Card 1: Adresse & Info de livraison -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 class="font-display text-lg font-extrabold text-slate-950 flex items-center justify-between">
              <span>Livraison</span>
              <span class="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200">
                Confirmée
              </span>
            </h3>
            
            <div class="space-y-1 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
              <p class="font-bold text-slate-950">{{ activeOrder.customerName }}</p>
              <p>{{ activeOrder.address }}</p>
              <p class="text-slate-500">Dakar · {{ activeOrder.phone }}</p>
            </div>

            <!-- SMS/WhatsApp Toggle Button -->
            <div class="pt-3 border-t border-slate-100">
              <button
                @click="smsNotifications = !smsNotifications"
                class="w-full flex items-center justify-between text-left p-3 rounded-2xl bg-blue-50/60 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-[#0F3D91]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  </svg>
                  <span class="text-xs font-bold text-[#0F3D91]">Alertes WhatsApp & SMS</span>
                </div>
                <span
                  class="w-8 h-4 rounded-full p-0.5 transition-colors"
                  :class="smsNotifications ? 'bg-[#0F3D91]' : 'bg-slate-300'"
                >
                  <span
                    class="block w-3 h-3 bg-white rounded-full transition-transform"
                    :class="smsNotifications ? 'translate-x-4' : 'translate-x-0'"
                  ></span>
                </span>
              </button>
            </div>
          </div>

          <!-- Card 2: Support WhatsApp Direct -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div class="space-y-1">
              <h3 class="font-display text-lg font-extrabold text-slate-950">
                Besoin d'aide ?
              </h3>
              <p class="text-xs text-slate-500 font-medium leading-relaxed">
                Notre équipe répond en moins de 5 min sur WhatsApp.
              </p>
            </div>

            <a
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2.5 w-full text-center border-2 border-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-full transition-all shadow-md cursor-pointer"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
              <span>Suivi direct sur WhatsApp</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const searchQuery = ref("");
const isSearching = ref(false);
const copied = ref(false);
const showItems = ref(true);
const smsNotifications = ref(true);
const currentStepIndex = ref(2); // Default step 3 (Expédition en cours)

// Active Order State
const activeOrder = ref({
  ref: "ES-2026-8241",
  date: "12 juillet 2026",
  total: 42200,
  customerName: "Modou Ndiaye",
  address: "Sacré-Cœur 3, Villa 1024",
  phone: "+221 77 000 00 00",
  items: [
    {
      name: "Pack Scolaire Élémentaire (CP / CE1)",
      price: 25000,
      qty: 1,
      image: "https://cdn-icons-png.flaticon.com/512/3429/3429149.png",
    },
    {
      name: "Cahier Grand Format 200 Pages Séyès",
      price: 1800,
      qty: 5,
      image: "https://cdn-icons-png.flaticon.com/512/3389/3389081.png",
    },
    {
      name: "Boîte de 12 Stylos BIC Bleu",
      price: 2200,
      qty: 1,
      image: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
    },
  ],
});

const steps = [
  { id: 1, title: "Commande reçue", desc: "12 juil. · 09:24" },
  { id: 2, title: "Préparation", desc: "12 juil. · 14:05" },
  { id: 3, title: "Expédition", desc: "En cours de livraison par notre coursier" },
  { id: 4, title: "Livraison", desc: "Estimée aujourd'hui avant 18h00" },
];

// Computed percent
const currentStepPercent = computed(() => {
  return Math.round(((currentStepIndex.value + 1) / steps.length) * 100);
});

// Format Price helper
const formatPrice = (val: number) => {
  return new Intl.NumberFormat("fr-FR").format(val) + " F CFA";
};

// Copy Ref helper
const copyRef = () => {
  navigator.clipboard?.writeText(activeOrder.value.ref);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};

// Search Order handler
const searchOrder = () => {
  if (!searchQuery.value.trim()) return;
  isSearching.value = true;
  setTimeout(() => {
    activeOrder.value.ref = searchQuery.value.toUpperCase();
    isSearching.value = false;
    currentStepIndex.value = Math.floor(Math.random() * 4); // Dynamic status simulation
  }, 400);
};

// WhatsApp Link
const whatsappUrl = computed(() => {
  const text = encodeURIComponent(
    `Bonjour EduShop, je souhaite suivre ma commande N° ${activeOrder.value.ref}`
  );
  return `https://wa.me/221771133926?text=${text}`;
});

useSeoMeta({
  title: `Suivi Commande #${activeOrder.value.ref} - EduShop Sénégal`,
  description: "Suivez le statut de votre commande en temps réel sur EduShop.",
});
</script>
