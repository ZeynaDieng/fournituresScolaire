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
      <div class="eyebrow mb-3">Étape {{ currentStep + 1 }} — {{ steps[currentStep] }}</div>

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

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const airtableStore = useAirtableStore();
const productsStore = useProductsStore();

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
