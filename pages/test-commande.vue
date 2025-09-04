<!-- /pages/test-commande.vue -->
<template>
  <div class="min-h-screen bg-gray-100 py-12">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">
        🧪 Test Commande Rapide
      </h1>

      <form @submit.prevent="passerCommande" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nom complet
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Votre nom"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            v-model="form.phone"
            type="tel"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="221123456789"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Ville
          </label>
          <select
            v-model="form.city"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Choisir une ville</option>
            <option value="Dakar">Dakar</option>
            <option value="Thiès">Thiès</option>
            <option value="Saint-Louis">Saint-Louis</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Adresse
          </label>
          <textarea
            v-model="form.address"
            required
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Votre adresse complète"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
        >
          {{ isLoading ? "Envoi en cours..." : "📱 Passer commande WhatsApp" }}
        </button>
      </form>

      <div
        v-if="result"
        class="mt-6 p-4 rounded-lg"
        :class="[
          result.success
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200',
        ]"
      >
        <div class="flex items-center gap-2 mb-2">
          <div
            :class="[
              'w-3 h-3 rounded-full',
              result.success ? 'bg-green-500' : 'bg-red-500',
            ]"
          ></div>
          <span
            :class="[
              'font-medium',
              result.success ? 'text-green-800' : 'text-red-800',
            ]"
          >
            {{ result.success ? "Commande créée !" : "Erreur" }}
          </span>
        </div>

        <div v-if="result.success" class="text-green-700 text-sm space-y-1">
          <p>✅ Référence: {{ result.order?.ref }}</p>
          <p>✅ Total: {{ formatCurrency(result.order?.total || 0) }}</p>
          <p v-if="result.googleSheets?.success">✅ Ajouté à Google Sheets</p>
          <p v-else>⚠️ Google Sheets non configuré</p>
        </div>

        <div v-if="!result.success" class="text-red-700 text-sm">
          {{ result.message || "Erreur inconnue" }}
        </div>

        <div class="mt-3 flex gap-2">
          <a
            :href="whatsappLink"
            target="_blank"
            class="inline-block px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            📱 Ouvrir WhatsApp
          </a>
          <NuxtLink
            to="/admin/commandes-locales"
            class="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            📋 Voir les commandes
          </NuxtLink>
        </div>
      </div>

      <!-- Instructions -->
      <div class="mt-6 text-sm text-gray-600 bg-blue-50 rounded-lg p-4">
        <h3 class="font-medium text-blue-800 mb-2">Instructions :</h3>
        <ol class="space-y-1 list-decimal list-inside">
          <li>Remplissez le formulaire</li>
          <li>Cliquez "Passer commande"</li>
          <li>La commande sera envoyée sur WhatsApp</li>
          <li>
            Vérifiez dans "Commandes Locales" si Google Sheets ne fonctionne pas
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Données du formulaire
const form = ref({
  name: "Test Client",
  email: "test@example.com",
  phone: "221123456789",
  city: "Dakar",
  address: "123 Rue Test",
});

const isLoading = ref(false);
const result = ref<any>(null);
const whatsappLink = ref("");

// Formater les montants
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Passer commande
const passerCommande = async () => {
  isLoading.value = true;
  result.value = null;

  try {
    // Données de commande test
    const orderData = {
      customer: {
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone,
      },
      shipping: {
        address: form.value.address,
        city: form.value.city,
        method: "Livraison standard",
        cost: 2000,
      },
      items: [
        {
          name: "Pack CP complet",
          quantity: 1,
          price: 15000,
        },
      ],
      amounts: {
        subtotal: 15000,
        shipping: 2000,
        discount: 0,
        total: 17000,
      },
    };

    // Appeler l'API
    const response = (await $fetch("/api/orders/create-pending", {
      method: "POST",
      body: orderData,
    })) as any;

    result.value = response;

    // Générer le lien WhatsApp
    if (response.success) {
      const message = `*Nouvelle Commande - EduShop Sénégal* 📚

*CLIENT:*
👤 Nom: ${form.value.name}
📧 Email: ${form.value.email}
📱 Téléphone: ${form.value.phone}

*LIVRAISON:*
📍 Adresse: ${form.value.address}
🏙️ Ville: ${form.value.city}
🚚 Mode: Livraison standard

*ARTICLES:*
📦 Pack CP complet (Qté: 1, Prix: 15000 CFA)

*RÉSUMÉ:*
💰 Sous-total: 15 000 CFA
🚚 Livraison: 2 000 CFA
💳 TOTAL: 17 000 CFA

---
✅ Commande prête pour validation et paiement Wave`;

      whatsappLink.value = `https://wa.me/221777780456?text=${encodeURIComponent(
        message
      )}`;
    }
  } catch (error: any) {
    result.value = {
      success: false,
      message: error.message || "Erreur inconnue",
    };
  } finally {
    isLoading.value = false;
  }
};
</script>
