<!-- components/Checkout/CheckoutForm.vue -->
<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Finaliser ma commande</h1>

    <!-- Résumé de la commande -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Formulaire client et livraison -->
      <div class="space-y-6">
        <!-- Informations client -->
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Informations personnelles
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Nom complet *
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre nom complet"
              />
            </div>

            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label
                for="phone"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Téléphone *
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="77 123 45 67"
              />
            </div>
          </form>
        </div>

        <!-- Informations de livraison -->
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Livraison</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Type de livraison
              </label>
              <div class="grid grid-cols-2 gap-3">
                <label
                  class="relative flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <input
                    v-model="shipping.deliveryType"
                    type="radio"
                    value="home"
                    class="mr-3"
                  />
                  <div>
                    <div class="font-medium">À domicile</div>
                    <div class="text-sm text-gray-500">2000 FCFA</div>
                  </div>
                </label>
                <label
                  class="relative flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <input
                    v-model="shipping.deliveryType"
                    type="radio"
                    value="store"
                    class="mr-3"
                  />
                  <div>
                    <div class="font-medium">En magasin</div>
                    <div class="text-sm text-gray-500">Gratuit</div>
                  </div>
                </label>
              </div>
            </div>

            <div v-if="shipping.deliveryType === 'home'">
              <label
                for="address"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Adresse de livraison *
              </label>
              <input
                id="address"
                v-model="shipping.address"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre adresse complète"
              />
            </div>

            <div>
              <label
                for="city"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Ville *
              </label>
              <select
                id="city"
                v-model="shipping.city"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une ville</option>
                <option value="Dakar">Dakar</option>
                <option value="Pikine">Pikine</option>
                <option value="Guédiawaye">Guédiawaye</option>
                <option value="Rufisque">Rufisque</option>
                <option value="Thiès">Thiès</option>
                <option value="Kaolack">Kaolack</option>
                <option value="Saint-Louis">Saint-Louis</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Code promo -->
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Code promo</h2>
          <div class="flex gap-3">
            <input
              v-model="promoCode"
              type="text"
              placeholder="Entrez votre code"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              @click="applyPromoCode"
              type="button"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Appliquer
            </button>
          </div>
          <div
            v-if="cartStore.promoCode"
            class="mt-2 flex items-center justify-between text-sm"
          >
            <span class="text-green-600">
              Code "{{ cartStore.promoCode }}" appliqué (-{{
                cartStore.promoDiscount
              }}%)
            </span>
            <button
              @click="removePromoCode"
              type="button"
              class="text-red-600 hover:text-red-700"
            >
              Retirer
            </button>
          </div>
        </div>
      </div>

      <!-- Résumé de la commande -->
      <div class="lg:sticky lg:top-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Votre commande
          </h2>

          <!-- Articles -->
          <div class="space-y-3 mb-4 max-h-60 overflow-y-auto">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-12 h-12 object-cover rounded"
              />
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900 truncate">
                  {{ item.name }}
                </h3>
                <p class="text-xs text-gray-500">
                  Quantité: {{ item.quantity }}
                </p>
              </div>
              <div class="text-sm font-medium text-gray-900">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>
          </div>

          <!-- Totaux -->
          <div class="space-y-2 pt-4 border-t border-gray-200">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Sous-total</span>
              <span>{{ formatPrice(cartStore.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Livraison</span>
              <span>{{ formatPrice(deliveryFee) }}</span>
            </div>
            <div
              v-if="cartStore.promoDiscount > 0"
              class="flex justify-between text-sm text-green-600"
            >
              <span>Réduction (-{{ cartStore.promoDiscount }}%)</span>
              <span
                >-{{
                  formatPrice(
                    (cartStore.subtotal * cartStore.promoDiscount) / 100
                  )
                }}</span
              >
            </div>
            <div
              class="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t"
            >
              <span>Total</span>
              <span>{{ formatPrice(cartStore.total) }}</span>
            </div>
          </div>

          <!-- Bouton de paiement -->
          <button
            @click="handleSubmit"
            :disabled="isProcessing || !isFormValid"
            class="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isProcessing">
              Payer avec PayTech - {{ formatPrice(cartStore.total) }}
            </span>
            <span v-else class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Traitement en cours...
            </span>
          </button>

          <!-- Méthodes de paiement acceptées -->
          <div class="mt-4 text-center">
            <p class="text-xs text-gray-500 mb-2">Paiement sécurisé avec</p>
            <div class="flex justify-center items-center space-x-4">
              <span
                class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded"
                >Orange Money</span
              >
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >Wave</span
              >
              <span
                class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                >Free Money</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CustomerInfo } from "~/types/cart";

useHead({
  title: "Finaliser ma commande - EduShop",
  meta: [
    {
      name: "description",
      content: "Finalisez votre commande de fournitures scolaires",
    },
  ],
});

// Store
const cartStore = useCartStore();
const router = useRouter();

// État local
const isProcessing = ref(false);
const promoCode = ref("");

// Formulaire client
const form = ref<CustomerInfo>({
  name: "",
  email: "",
  phone: "",
});

// Informations de livraison
const shipping = ref({
  deliveryType: "home" as "home" | "store",
  address: "",
  city: "",
  phone: "",
});

// Computed
const deliveryFee = computed(() => {
  return shipping.value.deliveryType === "home" ? 2000 : 0;
});

const isFormValid = computed(() => {
  const basicValid =
    form.value.name &&
    form.value.email &&
    form.value.phone &&
    shipping.value.city;
  const addressValid =
    shipping.value.deliveryType === "store" || shipping.value.address;
  return basicValid && addressValid && cartStore.items.length > 0;
});

// Méthodes
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(price);
};

const applyPromoCode = () => {
  if (promoCode.value.trim()) {
    cartStore.applyPromoCode(promoCode.value.trim());
  }
};

const removePromoCode = () => {
  cartStore.removePromoCode();
};

const updateShippingInfo = () => {
  cartStore.setShippingInfo({
    address: shipping.value.address,
    city: shipping.value.city,
    phone: shipping.value.phone || form.value.phone,
    deliveryType: shipping.value.deliveryType,
    deliveryFee: deliveryFee.value,
  });
};

const handleSubmit = async () => {
  if (!isFormValid.value) {
    cartStore.showToast(
      "Veuillez remplir tous les champs obligatoires",
      "error"
    );
    return;
  }

  try {
    isProcessing.value = true;

    // Mettre à jour les informations de livraison
    updateShippingInfo();

    // Préparer les informations client
    const customerInfo: CustomerInfo = {
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      phone: form.value.phone.trim(),
    };

    // Traiter la commande
    const result = await cartStore.processOrder(customerInfo, "paytech");

    if (!result.success) {
      throw new Error(result.message);
    }

    // Le store se charge de la redirection vers PayTech
  } catch (error: any) {
    console.error("Checkout error:", error);
    cartStore.showToast(
      error.message || "Erreur lors du traitement de la commande",
      "error"
    );
  } finally {
    isProcessing.value = false;
  }
};

// Vérifier que le panier n'est pas vide
onMounted(() => {
  if (cartStore.items.length === 0) {
    cartStore.showToast("Votre panier est vide", "info");
    router.push("/");
  }
});

// Auto-sauvegarder les informations de livraison
watch(
  [shipping, form],
  () => {
    if (form.value.phone && shipping.value.city) {
      updateShippingInfo();
    }
  },
  { deep: true }
);
</script>
