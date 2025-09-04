<!-- /pages/admin/commandes-locales.vue -->
<template>
  <div class="p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">
          📋 Commandes Locales (en attente Google Sheets)
        </h1>
        <div class="flex gap-4">
          <button
            @click="refreshCommands"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            🔄 Actualiser
          </button>
          <button
            @click="testGoogleSheets"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            🧪 Tester Google Sheets
          </button>
        </div>
      </div>

      <!-- Statut Google Sheets -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div
            :class="[
              'w-4 h-4 rounded-full',
              sheetsStatus ? 'bg-green-500' : 'bg-red-500',
            ]"
          ></div>
          <h2 class="text-lg font-semibold">
            Statut Google Sheets: {{ sheetsStatus ? "Activé" : "Non activé" }}
          </h2>
        </div>

        <div
          v-if="!sheetsStatus"
          class="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <h3 class="font-medium text-red-800 mb-2">Action requise :</h3>
          <ol class="text-sm text-red-700 space-y-1 list-decimal list-inside">
            <li>
              Activez l'API Google Sheets :
              <a
                href="https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=101527018819"
                target="_blank"
                class="underline text-blue-600"
              >
                Cliquez ici
              </a>
            </li>
            <li>Cliquez sur "ACTIVER" / "ENABLE"</li>
            <li>Attendez 2-3 minutes</li>
            <li>Revenez tester ici</li>
          </ol>
        </div>

        <div
          v-if="sheetsStatus"
          class="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <p class="text-green-700">
            ✅ Google Sheets est activé ! Les nouvelles commandes seront
            automatiquement ajoutées.
          </p>
          <a
            :href="`https://docs.google.com/spreadsheets/d/${sheetId}/edit`"
            target="_blank"
            class="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            📊 Ouvrir Google Sheets
          </a>
        </div>
      </div>

      <!-- Commandes stockées localement -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">
          📦 Commandes reçues ({{ localOrders.length }})
        </h2>

        <div
          v-if="localOrders.length === 0"
          class="text-center py-8 text-gray-500"
        >
          <svg
            class="w-12 h-12 mx-auto mb-4 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M5 4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5zm0 2h10v8H5V6z"
              clip-rule="evenodd"
            />
          </svg>
          <p>Aucune commande pour le moment</p>
          <p class="text-sm mt-1">
            Testez une commande depuis la page checkout
          </p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="order in localOrders"
            :key="order.ref"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-semibold text-gray-900">{{ order.ref }}</h3>
                <p class="text-sm text-gray-600">
                  {{ formatDate(order.timestamp) }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-lg text-green-600">
                  {{ formatCurrency(order.total) }}
                </p>
                <span
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800"
                >
                  En attente WhatsApp
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 class="font-medium text-gray-700 mb-2">Client :</h4>
                <p>👤 {{ order.customer.name }}</p>
                <p>📧 {{ order.customer.email }}</p>
                <p>📱 {{ order.customer.phone }}</p>
              </div>

              <div>
                <h4 class="font-medium text-gray-700 mb-2">Livraison :</h4>
                <p>📍 {{ order.shipping.address }}</p>
                <p>🏙️ {{ order.shipping.city }}</p>
                <p>🚚 {{ order.shipping.method }}</p>
              </div>
            </div>

            <div class="mt-4">
              <h4 class="font-medium text-gray-700 mb-2">Articles :</h4>
              <div class="space-y-1">
                <div
                  v-for="item in order.items"
                  :key="item.name"
                  class="flex justify-between text-sm"
                >
                  <span>📦 {{ item.name }} (x{{ item.quantity }})</span>
                  <span>{{ formatCurrency(item.price * item.quantity) }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex justify-between text-sm">
                <span>Sous-total :</span>
                <span>{{ formatCurrency(order.amounts.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>Livraison :</span>
                <span>{{ formatCurrency(order.amounts.shipping) }}</span>
              </div>
              <div class="flex justify-between font-semibold text-lg mt-2">
                <span>Total :</span>
                <span class="text-green-600">{{
                  formatCurrency(order.amounts.total)
                }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex gap-2">
              <button
                @click="copyToGoogleSheets(order)"
                :disabled="!sheetsStatus"
                class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
              >
                📊 Copier vers Google Sheets
              </button>
              <button
                @click="generateWhatsAppLink(order)"
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                📱 Renvoyer WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

// État
const sheetsStatus = ref(false);
const sheetId = ref("1H5QEGhyaXB5A3ZBz9xqRqGp0CM508k4YyMZUtygTjl0");
const localOrders = ref([]);

// Formatage
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Charger les données
const refreshCommands = async () => {
  try {
    // Tester le statut Google Sheets
    const response = await $fetch("/api/admin/test/google-sheets-headers", {
      method: "POST",
    });
    sheetsStatus.value = response.success;
  } catch (error) {
    sheetsStatus.value = false;
  }

  // Simuler quelques commandes pour la démo
  // En réalité, ces données viendraient d'une base de données locale ou d'un fichier
  localOrders.value = [
    {
      ref: "WA-" + Date.now(),
      timestamp: new Date().toISOString(),
      customer: {
        name: "Test Client",
        email: "test@example.com",
        phone: "221123456789",
      },
      shipping: {
        address: "123 Rue Test",
        city: "Dakar",
        method: "Livraison standard",
      },
      items: [{ name: "Pack CP complet", quantity: 1, price: 15000 }],
      amounts: {
        subtotal: 15000,
        shipping: 2000,
        discount: 0,
        total: 17000,
      },
    },
  ];
};

// Tester Google Sheets
const testGoogleSheets = async () => {
  try {
    const response = await $fetch("/api/admin/test/google-sheets-headers", {
      method: "POST",
    });

    if (response.success) {
      alert(
        "✅ Google Sheets fonctionne ! Les commandes seront maintenant synchronisées."
      );
      sheetsStatus.value = true;
    } else {
      alert(
        "❌ Google Sheets ne fonctionne pas encore. Vérifiez que l'API est activée."
      );
    }
  } catch (error) {
    alert("❌ Erreur : " + error.message);
  }
};

// Copier vers Google Sheets
const copyToGoogleSheets = async (order: any) => {
  try {
    const response = await $fetch("/api/admin/test/google-sheets", {
      method: "POST",
      body: order,
    });

    if (response.success) {
      alert("✅ Commande copiée vers Google Sheets !");
    } else {
      alert("❌ Erreur lors de la copie : " + response.error);
    }
  } catch (error) {
    alert("❌ Erreur : " + error.message);
  }
};

// Générer lien WhatsApp
const generateWhatsAppLink = (order: any) => {
  const message = `*Nouvelle Commande - EduShop Sénégal* 📚

*CLIENT:*
👤 Nom: ${order.customer.name}
📧 Email: ${order.customer.email}
📱 Téléphone: ${order.customer.phone}

*LIVRAISON:*
📍 Adresse: ${order.shipping.address}
🏙️ Ville: ${order.shipping.city}
🚚 Mode: ${order.shipping.method}

*ARTICLES:*
${order.items
  .map(
    (item) => `📦 ${item.name} (Qté: ${item.quantity}, Prix: ${item.price} CFA)`
  )
  .join("\n")}

*RÉSUMÉ:*
💰 Sous-total: ${formatCurrency(order.amounts.subtotal)}
🚚 Livraison: ${formatCurrency(order.amounts.shipping)}
💳 TOTAL: ${formatCurrency(order.amounts.total)}

---
✅ Commande prête pour validation et paiement Wave`;

  const whatsappUrl = `https://wa.me/221777780456?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");
};

// Charger au montage
onMounted(() => {
  refreshCommands();
});
</script>
