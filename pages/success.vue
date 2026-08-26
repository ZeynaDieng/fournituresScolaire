<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-[#FBFBFA] p-4 text-slate-900">
    <div class="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl text-center max-w-lg w-full space-y-6">
      
      <!-- Success Icon Badge -->
      <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
        <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      </div>

      <!-- Success Title -->
      <div class="space-y-2">
        <span class="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          PAIEMENT ACQUITTÉ & COMMANDE CONFIRMÉE
        </span>
        <h1 class="font-display text-3xl font-extrabold text-slate-950">
          Merci pour votre commande !
        </h1>
        <p class="text-xs text-slate-500 font-medium">
          Votre transaction a été enregistrée avec succès. Votre facture officielle est disponible ci-dessous.
        </p>
      </div>

      <!-- Order Details Summary Box -->
      <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2">
        <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
          <span class="text-slate-400 font-bold uppercase">Référence Commande</span>
          <span class="font-bold text-[#0F3D91]">#{{ orderData.ref }}</span>
        </div>

        <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
          <span class="text-slate-400 font-bold uppercase">Client</span>
          <span class="font-bold text-slate-900">{{ orderData.customerName }}</span>
        </div>

        <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
          <span class="text-slate-400 font-bold uppercase">Mode de règlement</span>
          <span class="font-bold text-emerald-700">{{ orderData.paymentMethod }}</span>
        </div>

        <div class="flex items-center justify-between pt-1">
          <span class="text-slate-400 font-bold uppercase">Montant Total Acquitté</span>
          <span class="font-extrabold text-[#0F3D91] text-sm">{{ formatPrice(orderData.total) }}</span>
        </div>
      </div>

      <!-- Automatic Invoice Banner -->
      <div class="p-4 bg-blue-50/80 rounded-2xl border border-blue-200/60 text-xs text-[#0F3D91] font-semibold flex items-center justify-center gap-2">
        <svg class="w-4 h-4 text-[#0F3D91] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Votre facture officielle avec cachet MATKAM et signature est générée automatiquement.</span>
      </div>

      <!-- Primary Action Buttons -->
      <div class="space-y-3">
        <button
          @click="triggerInvoiceDownload"
          class="w-full py-4 bg-[#0F3D91] hover:bg-[#0c3278] text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg class="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Télécharger ma Facture PDF (Cachet & Signature)</span>
        </button>

        <a
          :href="`https://wa.me/221771133926?text=Bonjour%20EduShop,%20je%20viens%20de%20régler%20ma%20commande%20%23${orderData.ref}.`"
          target="_blank"
          class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982l-1.413 5.162 5.281-1.385c1.455.794 3.094 1.213 4.787 1.214h.004c5.505 0 9.988-4.479 9.989-9.984 0-2.668-1.037-5.176-2.922-7.062-1.886-1.884-4.394-2.921-7.066-2.921zm5.952 14.502c-.25.702-1.472 1.341-2.022 1.401-.502.055-1.155.078-3.702-.977-3.256-1.348-5.347-4.664-5.508-4.881-.161-.217-1.31-1.745-1.31-3.329 0-1.584.829-2.363 1.124-2.684.296-.321.644-.402.859-.402.215 0 .43.003.617.012.198.009.465-.075.727.554.27.644.918 2.242.998 2.404.08.161.134.349.027.564-.107.215-.161.349-.322.537-.161.188-.338.42-.483.564-.161.161-.329.336-.141.658.188.322.836 1.378 1.794 2.232 1.231 1.097 2.27 1.437 2.593 1.598.322.161.51.134.698-.08.188-.215.805-.939 1.02-1.261.215-.322.43-.269.725-.161.296.107 1.878.886 2.2 1.047.322.161.537.242.617.376.08.134.08.779-.17 1.481z"/>
          </svg>
          <span>Suivre la livraison sur WhatsApp</span>
        </a>

        <NuxtLink
          to="/"
          class="block w-full py-3 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors"
        >
          Retour à l'accueil du site
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { printOfficialInvoice } from "~/utils/invoice-generator";

const route = useRoute();

const orderData = ref({
  ref: (route.query.ref as string) || `REF-${Date.now().toString().slice(-6)}`,
  customerName: "Client EduShop",
  phone: "",
  email: "",
  city: "Dakar",
  address: "",
  total: 0,
  paymentMethod: "PAYTECH",
  createdAt: new Date().toLocaleDateString("fr-FR"),
  configuratorChoice: undefined as any,
  items: [] as Array<{ name: string; quantity: number; price: number }>,
});

const formatPrice = (val: number) => {
  return new Intl.NumberFormat("fr-FR").format(val) + " F CFA";
};

const triggerInvoiceDownload = () => {
  if (orderData.value.items.length === 0 && process.client) {
    const saved = localStorage.getItem("last_order");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.items) {
          orderData.value.items = parsed.items;
          orderData.value.total = parsed.total || parsed.amount;
        }
      } catch (e) {}
    }
  }
  printOfficialInvoice(orderData.value);
};

onMounted(() => {
  if (process.client) {
    const queryRef = route.query.ref as string;
    let saved = queryRef ? localStorage.getItem(`order_${queryRef}`) : null;
    if (!saved) {
      saved = localStorage.getItem("last_order");
    }
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const calculatedItems = parsed.items && parsed.items.length > 0 ? parsed.items.map((i: any) => ({
          name: i.name || i.title || "Article EduShop",
          quantity: i.quantity || 1,
          price: Number(i.price || i.unitPrice || 0),
        })) : [];

        const itemsSum = calculatedItems.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);
        const shippingFee = Number(parsed.shippingFee || 0);
        const calculatedTotal = Number(parsed.total || parsed.amount || (itemsSum + shippingFee));

        let pmLabel = parsed.paymentMethod || "Paiement à la livraison (Espèces)";
        if (pmLabel === "paytech") pmLabel = "Paiement en ligne";
        else if (pmLabel === "cash") pmLabel = "Paiement à la livraison (Espèces)";
        else if (pmLabel === "wave") pmLabel = "Wave Mobile Money";
        else if (pmLabel === "om") pmLabel = "Orange Money";

        orderData.value = {
          ref: parsed.orderRef || queryRef || `REF-${Date.now().toString().slice(-6)}`,
          customerName: parsed.customerName || "Client EduShop",
          phone: parsed.customerPhone || "",
          email: parsed.customerEmail || "",
          city: "Dakar",
          address: parsed.address || "",
          total: calculatedTotal,
          paymentMethod: pmLabel,
          createdAt: new Date().toLocaleDateString("fr-FR"),
          configuratorChoice: parsed.configuratorChoice || undefined,
          items: calculatedItems,
        };
      } catch (e) {
        console.log("Erreur lecture commande locale:", e);
      }
    }
  }
});

useHead({
  title: "Commande Confirmée & Facture - EduShop Sénégal",
});
</script>
