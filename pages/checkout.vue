<!-- pages/checkout.vue - Checkout & Paiement Wave / OM -->
<template>
  <div class="min-h-screen bg-[#FBFBFA] text-slate-900 font-sans pt-20 pb-28">
    <div class="container-edu pt-8 pb-4">
      <span class="eyebrow">Paiement Sécurisé</span>
      <h1 class="mt-3 font-display text-4xl md:text-5xl font-extrabold text-[#0F3D91]">
        Finaliser ma commande
      </h1>
    </div>

    <div class="container-edu grid gap-10 lg:grid-cols-12 mt-6">
      <div class="lg:col-span-8 space-y-8">
        <!-- Step indicators -->
        <div class="flex items-center gap-3 text-sm bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span :class="step === 1 ? 'bg-[#0F3D91] text-white font-bold' : 'bg-[#0F3D91] text-white font-bold'" class="w-7 h-7 rounded-full flex items-center justify-center text-xs">
            1
          </span>
          <span class="font-bold text-slate-900">Livraison</span>
          <div class="flex-1 h-px bg-slate-200"></div>
          <span :class="step === 2 ? 'bg-[#0F3D91] text-white font-bold' : 'bg-slate-200 text-slate-600'" class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">
            2
          </span>
          <span class="font-bold text-slate-900">Paiement</span>
        </div>

        <!-- Étape 1 : Formulaire de Livraison -->
        <form v-if="step === 1" @submit.prevent="step = 2" class="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-soft space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-2xl font-extrabold text-[#0F3D91]">Informations de livraison</h2>
            <span v-if="isAutoFilled" class="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ✓ Rebonjour ! Coordonnées pré-remplies
            </span>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Prénom *</label>
              <input v-model="form.firstName" required type="text" placeholder="Fatou" class="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#0F3D91] focus:outline-none text-sm" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Nom *</label>
              <input v-model="form.lastName" required type="text" placeholder="Sarr" class="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#0F3D91] focus:outline-none text-sm" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Téléphone (WhatsApp) *</label>
              <input v-model="form.phone" required type="tel" placeholder="+221 77 000 00 00" class="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#0F3D91] focus:outline-none text-sm" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Email</label>
              <input v-model="form.email" type="email" placeholder="client@exemple.sn" class="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#0F3D91] focus:outline-none text-sm" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Adresse complète / Quartier</label>
              <input v-model="form.address" :required="deliveryType === 'home'" type="text" placeholder="Ouakam, Sacré-Cœur, Mermoz, Almadies (Dakar)" class="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#0F3D91] focus:outline-none text-sm" />
            </div>
          </div>

          <!-- Selection du mode d'obtention (Livraison vs Retrait Magasin) -->
          <div class="space-y-3 pt-4 border-t border-slate-100">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700">Mode d'obtention de votre commande *</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Option 1 : Livraison a Domicile -->
              <label
                class="p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3"
                :class="deliveryType === 'home' ? 'border-[#0F3D91] bg-blue-50/40 shadow-xs' : 'border-slate-200 bg-white'"
              >
                <input type="radio" v-model="deliveryType" value="home" class="mt-1 text-[#0F3D91]" />
                <div>
                  <span class="font-bold text-sm text-slate-900 block">🚚 Livraison à domicile</span>
                  <span class="text-xs text-slate-500 block mt-0.5">
                    {{ cartSubtotal > 30000 ? 'OFFERTE (Dès 30 000 F)' : '2 500 F CFA — Livré sous 24h/48h' }}
                  </span>
                </div>
              </label>

              <!-- Option 2 : Retrait gratuit en Magasin -->
              <label
                class="p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3"
                :class="deliveryType === 'store' ? 'border-[#0F3D91] bg-blue-50/40 shadow-xs' : 'border-slate-200 bg-white'"
              >
                <input type="radio" v-model="deliveryType" value="store" class="mt-1 text-[#0F3D91]" />
                <div>
                  <span class="font-bold text-sm text-slate-900 block">🏬 Retrait en Magasin</span>
                  <span class="text-xs text-emerald-700 font-bold block mt-0.5">0 F CFA (Gratuit) — Ouakam, Dakar</span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            class="bg-[#0F3D91] hover:bg-[#1248a8] text-white font-bold text-sm px-8 py-4 rounded-full shadow-md transition-all"
          >
            Continuer vers le paiement →
          </button>
        </form>

        <!-- Étape 2 : Mode de Paiement -->
        <div v-else class="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-soft space-y-6">
          <h2 class="font-display text-2xl font-extrabold text-[#0F3D91]">Mode de paiement</h2>
          <p class="text-xs text-slate-500 font-semibold">🔒 Transaction sécurisée et rapide au Sénégal</p>

          <div class="space-y-3 pt-2">
            <label
              v-for="m in paymentMethods"
              :key="m.id"
              class="p-5 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all"
              :class="selectedPayment === m.id ? 'border-[#0F3D91] bg-[#0F3D91]/5 shadow-sm' : 'border-slate-200 hover:border-slate-300'"
            >
              <input type="radio" name="payment" :value="m.id" v-model="selectedPayment" class="accent-[#0F3D91]" />
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <p class="font-bold text-[#0F3D91] text-base">{{ m.name }}</p>
                  <span v-if="m.badge" class="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                    {{ m.badge }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 font-medium">{{ m.desc }}</p>
              </div>
              <span v-if="selectedPayment === m.id" class="text-xs font-extrabold text-[#0F3D91] bg-[#F4C542] px-3 py-1 rounded-full">
                Sélectionné
              </span>
            </label>
          </div>

          <div class="pt-6 flex items-center gap-4">
            <button @click="step = 1" class="text-xs font-bold text-slate-500 hover:text-slate-900">
              ← Retour à la livraison
            </button>
            <button
              @click="submitOrder"
              :disabled="isSubmitting"
              class="flex-1 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-bold text-sm py-4 rounded-full shadow-md hover:scale-105 transition-all text-center"
            >
              {{ isSubmitting ? 'Confirmation...' : 'Confirmer et payer ma commande →' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary Aside -->
      <aside class="lg:col-span-4">
        <div class="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-lift space-y-4">
          <h3 class="font-display text-xl font-extrabold text-[#0F3D91]">Résumé de la commande</h3>

          <ul class="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            <li v-for="item in cartStore.items" :key="item.id" class="py-3 flex justify-between text-xs">
              <span class="font-semibold text-slate-800 truncate pr-2">{{ item.name }} (x{{ item.quantity }})</span>
              <span class="font-bold text-[#0F3D91] shrink-0">{{ formatPrice((parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0) * (item.quantity || 1)) }}</span>
            </li>
          </ul>

          <div class="pt-3 border-t border-slate-200 space-y-2 text-xs font-semibold text-slate-600">
            <div class="flex justify-between">
              <span>Sous-total</span>
              <span class="text-slate-900">{{ formatPrice(cartSubtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Frais de livraison</span>
              <span class="text-slate-900">{{ shippingCost === 0 ? 'Offert' : formatPrice(shippingCost) }}</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-[#0F3D91]">
              <span>Total</span>
              <span>{{ formatPrice(totalPrice) }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { useAirtableStore } from "~/stores/airtable";
import { useFormatter } from "~/composables/useFormatter";

const router = useRouter();
const cartStore = useCartStore();
const airtableStore = useAirtableStore();
const { formatPrice } = useFormatter();

const step = ref<1 | 2>(1);
const selectedPayment = ref("paytech");
const deliveryType = ref<"home" | "store">("home");
const isSubmitting = ref(false);
const isAutoFilled = ref(false);

const form = ref({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
});

onMounted(() => {
  if (process.client) {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.firstName) form.value.firstName = u.firstName;
        if (u.lastName) form.value.lastName = u.lastName;
        if (u.phone) form.value.phone = u.phone;
        if (u.email) form.value.email = u.email;
        if (u.address) form.value.address = u.address;
        if (u.firstName || u.phone) {
          isAutoFilled.value = true;
        }
      } catch (e) {}
    }
  }
});

const paymentMethods = [
  { id: "paytech", name: "Paiement en ligne (PayTech)", desc: "Paiement sécurisé par Wave, Orange Money, Free Money ou Carte Bancaire", badge: "Recommandé" },
  { id: "cash", name: "Paiement à la livraison", desc: "Réglez directement en espèces lors de la livraison" },
];

const cartSubtotal = computed(() => {
  if (!cartStore.items || cartStore.items.length === 0) return 0;
  return cartStore.items.reduce((sum: number, item: any) => {
    const rawPrice = typeof item.price === "number" ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
    const rawQty = typeof item.quantity === "number" ? item.quantity : parseInt(String(item.quantity), 10) || 1;
    return sum + (rawPrice * rawQty);
  }, 0);
});

const shippingCost = computed(() => {
  if (deliveryType.value === "store") return 0;
  return cartSubtotal.value > 30000 ? 0 : 2500;
});

const totalPrice = computed(() => cartSubtotal.value + shippingCost.value);

async function submitOrder() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    let activeConfigurator = undefined;
    if (process.client) {
      const savedConfig = localStorage.getItem("active_configurator_choice");
      if (savedConfig) {
        try { activeConfigurator = JSON.parse(savedConfig); } catch (e) {}
      }
      if (!activeConfigurator && cartStore.items) {
        const customPackItem = cartStore.items.find((i: any) => i.configuratorChoice || (i.name && i.name.includes("Sur-Mesure")));
        if (customPackItem && customPackItem.configuratorChoice) {
          activeConfigurator = customPackItem.configuratorChoice;
        }
      }
    }

    const orderPayload = {
      customerName: `${form.value.firstName} ${form.value.lastName}`.trim(),
      customerPhone: form.value.phone,
      customerEmail: form.value.email,
      address: deliveryType.value === "store" ? "Retrait en Magasin (Ouakam, Dakar)" : form.value.address,
      deliveryType: deliveryType.value,
      shippingFee: shippingCost.value,
      items: cartStore.items,
      amount: totalPrice.value,
      total: totalPrice.value,
      paymentMethod: selectedPayment.value,
      configuratorChoice: activeConfigurator,
      orderRef: `REF-${Date.now().toString().slice(-6)}`,
    };

    if (process.client) {
      // 1. Sauvegarde dernière commande pour facture automatique
      localStorage.setItem("last_order", JSON.stringify(orderPayload));

      // 2. Envoi automatique par mail de chaque commande en détail à zeynash1@gmail.com
      $fetch("/api/admin/send-order-email", {
        method: "POST",
        body: {
          targetEmail: "zeynash1@gmail.com",
          order: orderPayload,
        },
      }).catch((err) => console.error("Erreur envoi email automatique commande:", err));

      // 3. Création automatique du compte client s'il n'existe pas encore
      const autoUser = {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        name: `${form.value.firstName} ${form.value.lastName}`.trim(),
        email: form.value.email || `${form.value.phone.replace(/[^0-9]/g, "")}@edushop.sn`,
        phone: form.value.phone,
        address: form.value.address,
        city: "Dakar",
        createdAt: new Date().toLocaleDateString("fr-FR"),
      };

      // Inscription automatique de la session utilisateur
      localStorage.setItem("user", JSON.stringify(autoUser));

      // Registre de l'historique des commandes client
      const existingUserOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
      const newOrderRecord = {
        ref: orderPayload.orderRef,
        orderRef: orderPayload.orderRef,
        date: new Date().toLocaleDateString("fr-FR"),
        createdAt: new Date().toLocaleDateString("fr-FR"),
        total: orderPayload.total,
        amount: orderPayload.total,
        status: "Confirmée",
        items: orderPayload.items,
        customerName: orderPayload.customerName,
        phone: orderPayload.customerPhone,
        email: orderPayload.customerEmail,
        address: orderPayload.address,
        paymentMethod: orderPayload.paymentMethod,
        deliveryType: orderPayload.deliveryType,
      };
      existingUserOrders.unshift(newOrderRecord);
      localStorage.setItem("user_orders", JSON.stringify(existingUserOrders));

      // Registre global des utilisateurs pour le Back-Office Admin
      const allUsers = JSON.parse(localStorage.getItem("all_users") || "[]");
      if (!allUsers.some((u: any) => u.phone === autoUser.phone || u.email === autoUser.email)) {
        allUsers.unshift(autoUser);
        localStorage.setItem("all_users", JSON.stringify(allUsers));
      }
    }

    // 1. Enregistrement Airtable (non-bloquant en cas d'erreur de quota Airtable)
    try {
      await airtableStore.createOrder(orderPayload);
    } catch (airtableErr) {
      console.warn("Notice: Airtable non-bloquant pour le paiement PayTech:", airtableErr);
    }

    // 2. Initiation du paiement PayTech pour tout paiement en ligne (Wave, OM, PayTech, Card)
    if (selectedPayment.value !== "cash") {
      try {
        const paytechResponse: any = await $fetch("/api/paytech/initiate", {
          method: "POST",
          body: {
            amount: totalPrice.value,
            currency: "XOF",
            item_name: `Commande EduShop #${orderPayload.orderRef}`,
            ref_command: orderPayload.orderRef,
            customer: {
              name: orderPayload.customerName,
              phone: orderPayload.customerPhone,
              email: orderPayload.customerEmail || `${orderPayload.customerPhone.replace(/[^0-9]/g, "")}@edushop.sn`,
            },
            items: cartStore.items,
            shipping: {
              address: orderPayload.address,
            },
            target_payment: selectedPayment.value === "wave" ? "wave" : (selectedPayment.value === "om" ? "om" : ""),
          },
        });

        if (paytechResponse && paytechResponse.redirect_url) {
          const redirectUrl = paytechResponse.redirect_url;

          if (process.client && typeof (window as any).PayTech !== "undefined") {
            try {
              const p = new (window as any).PayTech();
              p.withOption({
                tokenUrl: redirectUrl,
                prensentationMode: (window as any).PayTech.OPEN_IN_POPUP || 1,
                didPopupClosed: function (isCompleted: boolean) {
                  console.log("PayTech popup fermé, statut complété:", isCompleted);
                  if (isCompleted) {
                    cartStore.clearCart();
                    router.push(`/success?mode=payment&ref=${orderPayload.orderRef}`);
                  } else {
                    isSubmitting.value = false;
                  }
                },
              }).send();
              return;
            } catch (sdkErr) {
              console.warn("Erreur démarrage SDK PayTech popup, fallback popup standard:", sdkErr);
            }
          }

          if (process.client) {
            // Popup window officielle si le SDK rencontre un problème
            const popupWin = window.open(redirectUrl, "PayTech", "width=520,height=680,menubar=no,scrollbars=yes,status=no,toolbar=no,location=no");
            if (!popupWin) {
              alert("Veuillez autoriser les fenêtres surgissantes (pop-ups) pour régler votre commande.");
            }
            return;
          }
        }
      } catch (paytechErr: any) {
        console.error("Erreur PayTech:", paytechErr);
        alert("Erreur lors de la préparation du paiement PayTech.");
      }
    } else {
      // Pour paiement à la livraison (Cash)
      cartStore.clearCart();
      router.push(`/success?mode=payment&ref=${orderPayload.orderRef}`);
    }
  } catch (err) {
    console.error("Erreur commande:", err);
    cartStore.clearCart();
    router.push(`/success?mode=payment&ref=ES-2026-${Date.now().toString().slice(-4)}`);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
