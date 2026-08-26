<template>
  <div class="space-y-6">
    
    <!-- Action Header -->
    <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-display text-2xl font-extrabold text-slate-950">Gestion des Commandes Clients</h2>
        <p class="text-xs text-slate-500 font-medium">Inspectez les choix des clients du commencement à la fin et suivez la livraison</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="exportOrdersCSV"
          class="px-5 py-2.5 bg-[#F4C542] hover:bg-[#f5cb54] text-slate-950 font-extrabold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <span>📥 Exporter en CSV / Excel</span>
        </button>

        <button
          @click="fetchOrders"
          class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full transition-all cursor-pointer flex items-center gap-2"
        >
          <span>🔄 Actualiser</span>
        </button>
      </div>
    </div>

    <!-- Stats summary boxes -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-bold uppercase">Total Commandes</span>
        <span class="font-display text-2xl font-extrabold text-slate-950 block">{{ orders.length }}</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-bold uppercase">En attente</span>
        <span class="font-display text-2xl font-extrabold text-amber-600 block">{{ getPendingOrdersCount() }}</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-bold uppercase">En livraison / Validées</span>
        <span class="font-display text-2xl font-extrabold text-blue-600 block">{{ getConfirmedOrdersCount() }}</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
        <span class="text-xs text-slate-400 font-bold uppercase">Chiffre d'Affaires</span>
        <span class="font-display text-2xl font-extrabold text-[#0F3D91] block">{{ formatCurrency(getTotalRevenue()) }}</span>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par référence, client, téléphone, ville..."
        class="w-full sm:w-80 px-4 py-3 text-xs font-semibold bg-white border border-slate-200 rounded-full focus:outline-none focus:border-[#0F3D91]"
      />
      <span class="text-xs font-bold text-slate-500">
        {{ filteredOrders.length }} commande(s) répertoriée(s)
      </span>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th class="py-4 px-6">Référence</th>
              <th class="py-4 px-6">Client & Contact</th>
              <th class="py-4 px-6">Articles & Fournitures Commandées</th>
              <th class="py-4 px-6">Mode Obtention</th>
              <th class="py-4 px-6">Montant Total</th>
              <th class="py-4 px-6">Statut</th>
              <th class="py-4 px-6 text-right">Inspection 360°</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr v-for="order in filteredOrders" :key="order.ref" class="hover:bg-slate-50/80 transition-colors">
              <td class="py-4 px-6 font-display font-extrabold text-slate-950">#{{ order.ref }}</td>
              <td class="py-4 px-6">
                <div class="space-y-0.5">
                  <span class="font-bold text-slate-900 block">{{ order.customerName || order.customerPhone || 'Client' }}</span>
                  <span class="text-slate-400 font-medium block">{{ order.phone || order.customerPhone }} · {{ order.city || order.address || 'Dakar' }}</span>
                </div>
              </td>
              <td class="py-4 px-6">
                <div class="space-y-1 max-w-xs">
                  <div v-for="(it, idx) in (order.items || [])" :key="idx" class="flex items-center justify-between gap-2 text-[11px]">
                    <span class="font-semibold text-slate-800 line-clamp-1">
                      <strong class="text-[#0F3D91]">{{ it.quantity || 1 }}x</strong> {{ it.name || it.title }}
                    </span>
                    <span class="text-slate-500 font-medium shrink-0">{{ formatCurrency(it.price || 0) }}</span>
                  </div>
                  <div v-if="!order.items || order.items.length === 0" class="text-slate-400 italic text-[11px]">
                    Pack Fournitures Scolaires (1x)
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <span 
                  class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border inline-block"
                  :class="(order.deliveryType === 'store' || order.address?.toLowerCase().includes('retrait')) ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-[#0F3D91] border-blue-200'"
                >
                  {{ (order.deliveryType === 'store' || order.address?.toLowerCase().includes('retrait')) ? '🏬 Retrait Magasin' : '🚚 Livraison Domicile' }}
                </span>
              </td>
              <td class="py-4 px-6 font-extrabold text-[#0F3D91]">{{ formatCurrency(order.total || order.amount) }}</td>
              <td class="py-4 px-6">
                <select
                  v-model="order.status"
                  @change="updateOrderStatus(order)"
                  class="px-3 py-1.5 rounded-full text-[11px] font-bold border focus:outline-none cursor-pointer"
                  :class="getStatusBadgeClass(order.status)"
                >
                  <option value="pending">🟡 En attente</option>
                  <option value="confirmed">🔵 Confirmée</option>
                  <option value="shipped">🚚 En livraison</option>
                  <option value="delivered">🟢 Livrée</option>
                  <option value="cancelled">🔴 Annulée</option>
                </select>
              </td>
              <td class="py-4 px-6 text-right space-x-2">
                <button
                  @click="openInspectionModal(order)"
                  class="px-3 py-1.5 bg-[#0F3D91] hover:bg-[#0c3278] text-white font-bold text-[11px] rounded-full transition-all cursor-pointer shrink-0"
                >
                  👁️ Inspecter (360°)
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL INSPECTION 360° DU CHOIX CLIENT DU COMMENCEMENT À LA FIN -->
    <div v-if="showDetail && detailOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
        
        <!-- Modal Top Header -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#0F3D91] block">
              RAPPORT D'INSPECTION COMMANDE 360°
            </span>
            <h3 class="font-display text-2xl font-extrabold text-slate-950">
              Commande #{{ detailOrder.ref }}
            </h3>
          </div>
          <button @click="showDetail = false" class="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
            ✕
          </button>
        </div>

        <!-- Section 0: Demande de Liste Scolaire IA (Si associée à la commande) -->
        <div v-if="detailOrder.schoolListRef" class="bg-gradient-to-r from-[#0F3D91] to-[#0B132B] p-5 rounded-2xl text-white space-y-3 shadow-md">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="bg-[#F4C542] text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                SCANNER IA
              </span>
              <span class="font-display font-extrabold text-sm text-[#F4C542]">
                Référence : {{ detailOrder.schoolListRef }}
              </span>
            </div>
            <span class="text-xs font-extrabold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3 py-1 rounded-full">
              Traitement IA prêt
            </span>
          </div>
          <p class="text-xs text-slate-200 font-medium">
            Cette commande a été générée via l'assistant IA de scan de liste scolaire. Seuls les articles disponibles ont été facturés.
          </p>
        </div>

        <!-- Section 1: Parcours & Choix de l'Assistant Rentrée (Affiché UNIQUEMENT si le client a utilisé l'Assistant) -->
        <div v-if="detailOrder && detailOrder.configuratorChoice" class="bg-blue-50/60 p-5 rounded-2xl border border-blue-200/60 space-y-3">
          <h4 class="font-display text-sm font-extrabold text-[#0F3D91] flex items-center justify-between">
            <span class="flex items-center gap-2">
              <span>✨</span>
              <span>Détails & Choix Personnalisés du Client (Assistant Rentrée Zen)</span>
            </span>
            <span class="text-xs font-extrabold px-3 py-1 bg-[#0F3D91] text-white rounded-full">
              Couleur : {{ extractPackColor(detailOrder) }}
            </span>
          </h4>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="bg-white p-3 rounded-xl border border-slate-200/60 space-y-1">
              <span class="text-[10px] text-slate-400 font-bold uppercase block">1. Niveau Scolaire</span>
              <span class="font-bold text-slate-900 block">{{ extractPackLevel(detailOrder) }}</span>
            </div>

            <div class="bg-white p-3 rounded-xl border border-slate-200/60 space-y-1">
              <span class="text-[10px] text-slate-400 font-bold uppercase block">2. Profil Enfant</span>
              <span class="font-bold text-slate-900 block">{{ detailOrder.configuratorChoice?.gender === 'girl' ? '👧 Fille' : (detailOrder.configuratorChoice?.gender === 'boy' ? '👦 Garçon' : 'Élève') }}</span>
            </div>

            <div class="bg-white p-3 rounded-xl border border-slate-200/60 space-y-1">
              <span class="text-[10px] text-slate-400 font-bold uppercase block">3. Sac à Dos</span>
              <span class="font-bold text-slate-900 block">{{ (detailOrder.configuratorChoice?.bag || isBagIncluded(detailOrder)) ? '🎒 Sac Navigateur Inclus' : 'Non requis' }}</span>
            </div>

            <div class="bg-white p-3 rounded-xl border border-slate-200/60 space-y-1">
              <span class="text-[10px] text-slate-400 font-bold uppercase block">4. Couleur Sélectionnée</span>
              <span class="font-bold text-[#0F3D91] block">{{ extractPackColor(detailOrder) }}</span>
            </div>
          </div>
        </div>

        <!-- Section 1 bis : Badge Liste Scolaire Scannée par IA -->
        <div v-else-if="detailOrder && (detailOrder.schoolListRef || (detailOrder.sourcingItems && detailOrder.sourcingItems.length > 0))" class="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
          <div class="flex items-center justify-between">
            <h4 class="font-display text-sm font-extrabold text-amber-900 flex items-center gap-2">
              <span>📄</span>
              <span>Commande issue d'une Liste Scolaire Scannée (IA & OCR)</span>
            </h4>
            <span v-if="detailOrder.schoolListRef" class="text-xs font-extrabold px-3 py-1 bg-amber-800 text-white rounded-full">
              Réf Scan : {{ detailOrder.schoolListRef }}
            </span>
          </div>
          <p class="text-xs text-amber-800 font-medium">
            Le client a scanné sa liste scolaire. Les fournitures disponibles en magasin sont prêtes ci-dessous, et les fournitures spécifiques à rechercher sont indiquées dans la section <strong>Mission Sourcing</strong>.
          </p>
        </div>

        <!-- Section 2: Informations de Livraison & Contact -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
            <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Coordonnées du Client</span>
            <p class="font-bold text-slate-900 text-sm">{{ detailOrder.customerName || detailOrder.phone }}</p>
            <p class="text-slate-600 font-medium">📞 {{ detailOrder.phone || detailOrder.customerPhone }}</p>
            <p class="text-slate-600 font-medium">✉️ {{ detailOrder.email || detailOrder.customerEmail || 'client@edushop.sn' }}</p>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
            <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Mode d'Obtention & Paiement</span>
            <p class="font-bold text-[#0F3D91]">
              {{ (detailOrder.deliveryType === 'store' || detailOrder.address?.toLowerCase().includes('retrait')) ? '🏬 Retrait en Magasin (Ouakam, Dakar) — GRATUIT' : `🚚 Livraison à Domicile : ${detailOrder.address}, ${detailOrder.city}` }}
            </p>
            <p class="text-slate-600 font-medium">Mode Règlement: <strong class="text-emerald-700 font-bold">{{ detailOrder.paymentMethod }}</strong></p>
            <p class="text-slate-600 font-medium">Date Commande: {{ detailOrder.createdAt || detailOrder.date }}</p>
          </div>
        </div>

        <!-- Section 3: FICHE DE PRÉPARATION COLIS - Liste Intégrale des Fournitures à Mettre dans le Sac -->
        <div class="space-y-4">
          <!-- Bloc A: Articles Prêts en Stock -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="font-display text-sm font-extrabold text-slate-950 flex items-center gap-2">
                <span>📦</span>
                <span>Fournitures Disponibles en Stock à Emballer</span>
              </h4>
              <span v-if="detailOrder.configuratorChoice" class="text-[11px] font-bold text-slate-500">
                Couleur sac : <strong class="text-[#0F3D91]">{{ extractPackColor(detailOrder) }}</strong>
              </span>
            </div>

            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
              <div 
                v-for="(item, idx) in getDetailedPackingList(detailOrder)" 
                :key="idx" 
                class="flex items-center justify-between text-xs p-2.5 bg-white rounded-xl border border-slate-200/60"
              >
                <div class="flex items-center gap-3">
                  <span class="px-2 py-1 rounded-lg bg-blue-100 text-[#0F3D91] font-extrabold text-xs">
                    {{ item.qty }}
                  </span>
                  <div>
                    <span class="font-extrabold text-slate-900 block">{{ item.name }}</span>
                    <span v-if="item.note" class="text-[11px] text-slate-500 font-medium block">{{ item.note }}</span>
                  </div>
                </div>
                <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  ✓ Prêt à emballer
                </span>
              </div>
            </div>
          </div>

          <!-- Bloc B: Mission Sourcing / Articles Hors Stock à Rechercher pour le Client -->
          <div v-if="detailOrder && getSourcingList(detailOrder).length > 0" class="space-y-2">
            <h4 class="font-display text-sm font-extrabold text-amber-900 flex items-center gap-2">
              <span>🔍</span>
              <span>Mission Sourcing — Articles Hors Stock à Rechercher par l'Équipe EduShop ({{ getSourcingList(detailOrder).length }})</span>
            </h4>
            <div class="bg-amber-50/60 rounded-2xl p-4 border border-amber-200 space-y-2.5">
              <div 
                v-for="(sItem, sIdx) in getSourcingList(detailOrder)" 
                :key="sIdx" 
                class="flex items-center justify-between text-xs p-2.5 bg-white rounded-xl border border-amber-200/80"
              >
                <div class="flex items-center gap-3">
                  <span class="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-extrabold text-xs">
                    {{ sItem.quantity || 1 }}x
                  </span>
                  <div>
                    <span class="font-extrabold text-slate-900 block">{{ sItem.normalizedName || sItem.rawText }}</span>
                    <span class="text-[11px] text-slate-500 font-medium block">Texte brut scanné : "{{ sItem.rawText }}"</span>
                  </div>
                </div>
                <span class="text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                  🔎 À rechercher / Acheter
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Bottom Actions & WhatsApp Direct Contact -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div class="text-xs">
            <span class="text-slate-400 font-medium">Total Commande: </span>
            <span class="font-display text-lg font-extrabold text-[#0F3D91] ml-1">{{ formatCurrency(detailOrder.total) }}</span>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            <button
              @click="sendOrderEmailAdmin(detailOrder)"
              :disabled="isSendingEmail"
              class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full transition-all cursor-pointer flex items-center gap-2"
            >
              <span v-if="isSendingEmail" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>📧 Envoyer à zeynash1@gmail.com</span>
            </button>

            <button
              @click="downloadOrderPDF(detailOrder)"
              class="px-4 py-2.5 bg-[#0F3D91] hover:bg-[#0c3278] text-white font-bold text-xs rounded-full transition-all cursor-pointer flex items-center gap-2"
            >
              <span>📄 Télécharger PDF</span>
            </button>

            <a
              :href="`https://wa.me/${(detailOrder.phone || detailOrder.customerPhone || '').replace(/[^0-9]/g, '')}?text=Bonjour%20${detailOrder.customerName},%20nous%20sommes%20l'équipe%20EduShop.%20Votre%20commande%20%23${detailOrder.ref}%20est%20en%20cours%20de%20traitement.`"
              target="_blank"
              class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full transition-all cursor-pointer flex items-center gap-2"
            >
              <span>💬 Contacter sur WhatsApp</span>
            </a>

            <button
              @click="showDetail = false"
              class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { printOfficialInvoice } from "~/utils/invoice-generator";

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const searchQuery = ref("");
const showDetail = ref(false);
const detailOrder = ref<any>(null);
const isSendingEmail = ref(false);

const sendOrderEmailAdmin = async (order: any) => {
  if (!order) return;
  isSendingEmail.value = true;
  try {
    const res: any = await $fetch("/api/admin/send-order-email", {
      method: "POST",
      body: {
        targetEmail: "zeynash1@gmail.com",
        order: order,
      },
    });

    if (res && res.success) {
      alert("✅ E-mail envoyé avec succès à zeynash1@gmail.com !");
    } else {
      alert("⚠️ Service e-mail : " + (res?.error || "Erreur d'envoi. Veuillez vérifier la connexion SMTP."));
    }
  } catch (e: any) {
    alert("❌ Erreur lors de l'envoi de l'e-mail: " + e.message);
  } finally {
    isSendingEmail.value = false;
  }
};

const orders = ref([
  {
    id: 1,
    ref: "ES-2026-8241",
    customerName: "Modou Ndiaye",
    phone: "+221 77 123 45 67",
    email: "modou.ndiaye@gmail.com",
    city: "Dakar (Sacré-Cœur)",
    address: "Villa 1024, Sacré-Cœur 3",
    total: 42200,
    status: "shipped",
    paymentMethod: "Orange Money / Wave",
    createdAt: "2026-07-12 10:30",
    configuratorChoice: {
      level: "Primaire (CP - CM2)",
      gender: "boy",
      bag: true,
      color: "Bleu Profond (#0F3D91)",
      school: "École Éléphant Sacré-Cœur",
    },
    items: [
      { name: "Pack Scolaire Élémentaire (CP / CE1)", quantity: 1, price: 25000 },
      { name: "Sac à Dos Scolaire Ergonomique Navigateur", quantity: 1, price: 12500 },
      { name: "Gourde Isotherme Inox 500ml", quantity: 1, price: 4700 },
    ],
  },
  {
    id: 2,
    ref: "ES-2026-7130",
    customerName: "Aïssatou Diop",
    phone: "+221 78 987 65 43",
    email: "aissatou.diop@gmail.com",
    city: "Dakar (Plateau)",
    address: "Avenue Léopold Sédar Senghor",
    total: 14500,
    status: "delivered",
    paymentMethod: "PayTech / Card",
    createdAt: "2026-07-03 14:15",
    configuratorChoice: {
      level: "Collège (6ème - 3ème)",
      gender: "girl",
      bag: false,
      color: "Rose Poudré",
      school: "Collège Sainte Marie de Hann",
    },
    items: [
      { name: "Calculatrice scientifique FX-92 Casio", quantity: 1, price: 14500 },
    ],
  },
  {
    id: 3,
    ref: "ES-2026-6014",
    customerName: "Cheikh Seck",
    phone: "+221 70 456 78 90",
    email: "cheikh.seck@yahoo.fr",
    city: "Thiès",
    address: "Quartier Dixième",
    total: 28900,
    status: "delivered",
    paymentMethod: "Paiement à la livraison",
    createdAt: "2026-06-22 09:00",
    configuratorChoice: {
      level: "Lycée (2nde - Term.)",
      gender: "boy",
      bag: true,
      color: "Noir Élégant",
      school: "Lycée Malick Sy Thiès",
    },
    items: [
      { name: "Pack Lycée Scientifique 2nde à Terminale", quantity: 1, price: 28900 },
    ],
  },
  {
    id: 4,
    ref: "ES-2026-5509",
    customerName: "Fatou Sow",
    phone: "+221 76 555 44 33",
    email: "fatou.sow@gmail.com",
    city: "Saint-Louis",
    address: "Île de Saint-Louis",
    total: 35000,
    status: "confirmed",
    paymentMethod: "Wave Sénégal",
    createdAt: "2026-06-18 16:45",
    configuratorChoice: {
      level: "Préscolaire (3-5 ans)",
      gender: "girl",
      bag: true,
      color: "Jaune Soleil",
      school: "Maternelle Saint-Louis",
    },
    items: [
      { name: "Pack Préscolaire Maternelle Complet", quantity: 1, price: 16500 },
      { name: "Sac à Dos Enfant Motif Jaune", quantity: 1, price: 12500 },
      { name: "Kit Dessin & Peinture Gouache", quantity: 1, price: 6000 },
    ],
  },
]);

const filteredOrders = computed(() => {
  if (!searchQuery.value.trim()) return orders.value;
  const q = searchQuery.value.toLowerCase();
  return orders.value.filter(
    (o) =>
      o.ref.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q)
  );
});

const getPendingOrdersCount = () => orders.value.filter((o) => o.status === "pending").length;
const getConfirmedOrdersCount = () => orders.value.filter((o) => ["confirmed", "shipped", "delivered"].includes(o.status)).length;
const getTotalRevenue = () => orders.value.reduce((total, o) => total + o.total, 0);

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("fr-FR").format(val) + " F CFA";
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "pending": return "bg-amber-50 text-amber-800 border-amber-200";
    case "confirmed": return "bg-blue-50 text-[#0F3D91] border-blue-200";
    case "shipped": return "bg-purple-50 text-purple-800 border-purple-200";
    case "delivered": return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "cancelled": return "bg-rose-50 text-rose-800 border-rose-200";
    default: return "bg-slate-50 text-slate-800 border-slate-200";
  }
};

const openInspectionModal = (order: any) => {
  detailOrder.value = order;
  showDetail.value = true;
};

const extractPackColor = (order: any) => {
  if (!order) return "Bleu Profond";
  if (order.configuratorChoice?.color) return order.configuratorChoice.color;
  if (order.items) {
    for (const item of order.items) {
      const name = item.name || item.title || "";
      const match = name.match(/\(([^)]+)\)/);
      if (match && match[1] && !match[1].toLowerCase().includes("cp") && !match[1].toLowerCase().includes("ce")) {
        return match[1];
      }
      if (item.description && item.description.includes("Couleur:")) {
        const cMatch = item.description.match(/Couleur:\s*([^·\n]+)/);
        if (cMatch) return cMatch[1].trim();
      }
    }
  }
  return "Bleu Profond (#0F3D91)";
};

const extractPackLevel = (order: any) => {
  if (!order) return "Primaire (CP - CM2)";
  if (order.configuratorChoice?.level) return order.configuratorChoice.level;
  if (order.items) {
    for (const item of order.items) {
      const name = (item.name || item.title || "").toLowerCase();
      if (name.includes("ce1") || name.includes("ce2") || name.includes("primaire")) return "Primaire (CP - CM2)";
      if (name.includes("prescolaire") || name.includes("maternelle")) return "Préscolaire (3-5 ans)";
      if (name.includes("college") || name.includes("6eme")) return "Collège (6ème - 3ème)";
      if (name.includes("lycee") || name.includes("2nde")) return "Lycée (2nde - Terminale)";
    }
  }
  return "Primaire (CP - CM2)";
};

const isBagIncluded = (order: any) => {
  if (!order) return false;
  if (order.configuratorChoice?.bag) return true;
  if (order.items) {
    return order.items.some((i: any) => {
      const name = (i.name || i.title || "").toLowerCase();
      return name.includes("sac") || name.includes("navigateur");
    });
  }
  return false;
};

const getDetailedPackingList = (order: any) => {
  if (!order) return [];
  const list: { name: string; qty: string; note?: string }[] = [];
  const color = extractPackColor(order);

  if (!order.items || order.items.length === 0) {
    list.push({ name: "Cahiers 48 pages (Clairefontaine)", qty: "10x", note: `Couleur : ${color}` });
    list.push({ name: "Stylos Bille BIC (Lot de 4)", qty: "2x" });
    list.push({ name: "Trousse scolaire 2 compartiments", qty: "1x", note: `Couleur : ${color}` });
    return list;
  }

  order.items.forEach((item: any) => {
    const itemName = item.name || item.title || "";
    const lower = itemName.toLowerCase();
    const q = item.quantity || 1;

    if (lower.includes("pack") || lower.includes("sur-mesure")) {
      if (lower.includes("primaire") || lower.includes("ce1") || lower.includes("ce2") || lower.includes("cp") || lower.includes("cm1") || lower.includes("cm2")) {
        list.push({ name: `Cahiers 48 pages (Format Standard 24x32)`, qty: `${10 * q}x`, note: "Marque Clairefontaine / Oxford" });
        list.push({ name: `Cahiers 100 pages grand format`, qty: `${4 * q}x`, note: "Couverture renforcée" });
        list.push({ name: `Stylos Bille BIC (2 Bleus, 1 Rouge, 1 Vert)`, qty: `${4 * q}x` });
        list.push({ name: `Crayons à papier HB2 avec gomme`, qty: `${2 * q}x` });
        list.push({ name: `Règle graduée 30cm incassable`, qty: `${1 * q}x` });
        list.push({ name: `Gomme blanche & Taille-crayon à réservoir`, qty: `${1 * q}x` });
        list.push({ name: `Boîte de 12 Crayons de couleur`, qty: `${1 * q}x` });
        list.push({ name: `Trousse scolaire 2 compartiments`, qty: `${1 * q}x`, note: `Couleur choisie : ${color}` });
      } else if (lower.includes("prescolaire") || lower.includes("maternelle")) {
        list.push({ name: `Cahiers de dessin & coloriage 48p`, qty: `${4 * q}x` });
        list.push({ name: `Boîte de 12 feutres lavables pointe moyenne`, qty: `${1 * q}x` });
        list.push({ name: `Boîte de crayons de cire ergocolor`, qty: `${1 * q}x` });
        list.push({ name: `Bâtons de colle 21g & Ciseau sécurité`, qty: `${2 * q}x` });
        list.push({ name: `Tablier de peinture imperméable`, qty: `${1 * q}x` });
      } else if (lower.includes("college") || lower.includes("lycee")) {
        list.push({ name: `Cahiers 200 pages grand format 24x32`, qty: `${10 * q}x` });
        list.push({ name: `Calculatrice scientifique / graphique (Casio)`, qty: `${1 * q}x`, note: "Piles incluses" });
        list.push({ name: `Kit de géométrie (Règle, Rapporteur, Équerre, Compas)`, qty: `${1 * q}x` });
        list.push({ name: `Lot de 4 Stylos Bille & Surligneurs Fluo`, qty: `${6 * q}x` });
        list.push({ name: `Classeur A4 à leviers + 200 poches transparentes`, qty: `${1 * q}x` });
      } else {
        list.push({ name: itemName, qty: `${q}x`, note: `Couleur : ${color}` });
      }

      if (order.configuratorChoice?.bag || isBagIncluded(order)) {
        list.push({ name: `Sac à dos scolaire renforcé Navigateur`, qty: `${1 * q}x`, note: `Couleur choisie : ${color}` });
      }
    } else {
      list.push({ name: itemName, qty: `${q}x`, note: item.description || `Prix: ${item.price} F CFA` });
    }
  });

  return list;
};

const getSourcingList = (order: any) => {
  if (!order) return [];
  if (order.sourcingItems && Array.isArray(order.sourcingItems) && order.sourcingItems.length > 0) {
    return order.sourcingItems;
  }
  if (process.client) {
    try {
      const activeSLRStr = localStorage.getItem("active_school_list_request");
      if (activeSLRStr) {
        const activeSLR = JSON.parse(activeSLRStr);
        if (activeSLR.extractedItems) {
          const sourcings = activeSLR.extractedItems.filter((i: any) => i.matchType === 'sourcing' || !i.matchedProductPrice);
          if (sourcings.length > 0) return sourcings;
        }
      }
    } catch(e) {}
  }
  return [];
};

const updateOrderStatus = (order: any) => {
  alert(`Le statut de la commande #${order.ref} a été mis à jour.`);
};

const deleteOrder = (ref: string) => {
  if (confirm(`Voulez-vous vraiment supprimer la commande #${ref} ?`)) {
    orders.value = orders.value.filter((o) => o.ref !== ref);
    alert(`Commande #${ref} supprimée.`);
  }
};

const exportOrdersCSV = () => {
  let csvContent = "data:text/csv;charset=utf-8,Reference,Client,Telephone,Ville,Montant_FCFA,Statut,Date\n";
  orders.value.forEach((o) => {
    csvContent += `"${o.ref}","${o.customerName}","${o.phone}","${o.city}",${o.total},"${o.status}","${o.createdAt}"\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `edushop_commandes_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadOrderPDF = (order: any) => {
  printOfficialInvoice(order);
};

onMounted(() => {
  fetchOrders();
});

function fetchOrders() {
  if (process.client) {
    const savedUserOrders = localStorage.getItem("user_orders");
    if (savedUserOrders) {
      try {
        const parsed = JSON.parse(savedUserOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Fusionner les vraies commandes en haut du tableau
          const realOrders = parsed.map((o: any, idx: number) => ({
            id: `real-${idx}`,
            ref: o.orderRef || o.ref || `REF-${idx}`,
            customerName: o.customerName || o.name || "Client EduShop",
            phone: o.phone || o.customerPhone || "+221 77 000 00 00",
            email: o.email || o.customerEmail || "client@edushop.sn",
            city: o.city || "Dakar",
            address: o.address || "Dakar",
            deliveryType: o.deliveryType || "home",
            total: Number(o.total || o.amount || 0),
            status: o.status || "confirmed",
            paymentMethod: o.paymentMethod || "Wave / Orange Money",
            createdAt: o.createdAt || o.date || new Date().toLocaleDateString("fr-FR"),
            configuratorChoice: o.configuratorChoice || undefined,
            schoolListRef: o.schoolListRef || undefined,
            items: o.items || [],
            sourcingItems: o.sourcingItems || [],
          }));

          // Conserver également les démos si nécessaire mais mettre les vraies commandes en premier
          const existingRefs = new Set(realOrders.map((r: any) => r.ref));
          const nonDuplicateDemos = orders.value.filter((d: any) => !existingRefs.has(d.ref));
          orders.value = [...realOrders, ...nonDuplicateDemos];
        }
      } catch (e) {
        console.error("Erreur chargement commandes admin:", e);
      }
    }
  }
}

useHead({
  title: "Gestion des Commandes - Back-Office EduShop",
});
</script>
