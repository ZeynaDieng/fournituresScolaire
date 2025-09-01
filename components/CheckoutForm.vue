<!-- components/CheckoutForm.vue -->
<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Finaliser ma commande
      </h1>
      <p class="text-gray-600">Sécurisé par PayTech - Paiement 100% sécurisé</p>
    </div>

    <!-- Stepper -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex items-center"
        >
          <div
            :class="[
              'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
              currentStep >= index + 1
                ? 'bg-primary-green text-white'
                : 'bg-gray-200 text-gray-500',
            ]"
          >
            {{ index + 1 }}
          </div>
          <div class="ml-2">
            <p
              :class="[
                'text-sm font-medium',
                currentStep >= index + 1
                  ? 'text-primary-green'
                  : 'text-gray-500',
              ]"
            >
              {{ step.title }}
            </p>
          </div>
          <div
            v-if="index < steps.length - 1"
            :class="[
              'w-12 h-0.5 mx-4',
              currentStep > index + 1 ? 'bg-primary-green' : 'bg-gray-200',
            ]"
          ></div>
        </div>
      </div>
    </div>

    <form
      @submit.prevent="handleSubmit"
      class="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      <!-- Formulaire principal -->
      <div class="space-y-6">
        <!-- Informations client -->
        <div
          v-show="currentStep === 1"
          class="bg-white p-6 rounded-lg shadow-sm border"
        >
          <h2
            class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Informations personnelles
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Nom complet *
              </label>
              <input
                id="name"
                v-model="form.customer.name"
                type="text"
                required
                class="input-field"
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
                v-model="form.customer.email"
                type="email"
                required
                class="input-field"
                placeholder="votre@email.com"
              />
            </div>

            <div class="md:col-span-2">
              <label
                for="phone"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Téléphone *
              </label>
              <div class="flex">
                <select
                  v-model="phonePrefix"
                  class="input-field rounded-r-none w-20 text-center"
                >
                  <option value="+221">+221</option>
                  <option value="+225">+225</option>
                  <option value="+223">+223</option>
                  <option value="+229">+229</option>
                </select>
                <input
                  id="phone"
                  v-model="phoneNumber"
                  type="tel"
                  required
                  class="input-field rounded-l-none flex-1"
                  placeholder="77 123 45 67"
                  @input="formatPhoneNumber"
                />
              </div>
            </div>
          </div>

          <div class="mt-6">
            <button
              type="button"
              @click="nextStep"
              :disabled="!isStep1Valid"
              class="btn-primary w-full"
            >
              Continuer vers la livraison
            </button>
          </div>
        </div>

        <!-- Informations de livraison -->
        <div
          v-show="currentStep === 2"
          class="bg-white p-6 rounded-lg shadow-sm border"
        >
          <h2
            class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Livraison
          </h2>

          <div class="space-y-4">
            <div>
              <label
                for="address"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Adresse de livraison *
              </label>
              <textarea
                id="address"
                v-model="form.shipping.address"
                required
                rows="3"
                class="input-field"
                placeholder="Votre adresse complète..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  for="city"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ville *
                </label>
                <select
                  id="city"
                  v-model="form.shipping.city"
                  required
                  class="input-field"
                >
                  <option value="">Choisir une ville</option>
                  <option value="Dakar">Dakar</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Kaolack">Kaolack</option>
                  <option value="Ziguinchor">Ziguinchor</option>
                  <option value="Diourbel">Diourbel</option>
                  <option value="Tambacounda">Tambacounda</option>
                  <option value="Fatick">Fatick</option>
                  <option value="Kaffrine">Kaffrine</option>
                  <option value="Kolda">Kolda</option>
                  <option value="Louga">Louga</option>
                  <option value="Matam">Matam</option>
                  <option value="Kédougou">Kédougou</option>
                  <option value="Sédhiou">Sédhiou</option>
                </select>
              </div>

              <div>
                <label
                  for="delivery-method"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mode de livraison *
                </label>
                <select
                  id="delivery-method"
                  v-model="form.shipping.method"
                  required
                  class="input-field"
                  @change="updateShippingCost"
                >
                  <option value="">Choisir un mode</option>
                  <option value="standard">
                    Standard (2-3 jours) - 2000 FCFA
                  </option>
                  <option value="express">Express (24h) - 5000 FCFA</option>
                  <option value="pickup">Retrait en magasin - Gratuit</option>
                </select>
              </div>
            </div>
          </div>

          <div class="mt-6 flex space-x-4">
            <button
              type="button"
              @click="prevStep"
              class="btn-secondary flex-1"
            >
              Retour
            </button>
            <button
              type="button"
              @click="nextStep"
              :disabled="!isStep2Valid"
              class="btn-primary flex-1"
            >
              Continuer vers le paiement
            </button>
          </div>
        </div>

        <!-- Méthode de paiement -->
        <div
          v-show="currentStep === 3"
          class="bg-white p-6 rounded-lg shadow-sm border"
        >
          <h2
            class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Paiement
          </h2>

          <PaymentMethodSelector
            v-model="form.target_payment"
            :amount="totalAmount"
            :country="getCountryFromPhone()"
          />

          <div class="mt-6 flex space-x-4">
            <button
              type="button"
              @click="prevStep"
              class="btn-secondary flex-1"
            >
              Retour
            </button>
            <button
              type="submit"
              :disabled="isProcessing || !isStep3Valid"
              class="btn-primary flex-1"
            >
              <span
                v-if="isProcessing"
                class="flex items-center justify-center"
              >
                <svg
                  class="animate-spin h-4 w-4 mr-2"
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
                Traitement...
              </span>
              <span v-else> Payer {{ formatAmount(totalAmount) }} </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Résumé de commande -->
      <div class="lg:sticky lg:top-6 h-fit">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Résumé de la commande
          </h3>

          <!-- Articles -->
          <div class="space-y-3 mb-4">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex items-center justify-between py-2 border-b border-gray-100"
            >
              <div class="flex items-center">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-12 h-12 object-cover rounded mr-3"
                />
                <div>
                  <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
                  <p class="text-sm text-gray-500">Qté: {{ item.quantity }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium">
                  {{ formatAmount(item.price * item.quantity) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Totaux -->
          <div class="space-y-2 border-t border-gray-200 pt-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Sous-total</span>
              <span>{{ formatAmount(subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Livraison</span>
              <span>{{ formatAmount(form.shipping.cost) }}</span>
            </div>
            <div
              v-if="promoDiscount > 0"
              class="flex justify-between text-green-600"
            >
              <span>Réduction</span>
              <span>-{{ formatAmount(promoDiscount) }}</span>
            </div>
            <div
              class="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2"
            >
              <span>Total</span>
              <span class="text-primary-green">{{
                formatAmount(totalAmount)
              }}</span>
            </div>
          </div>

          <!-- Code promo -->
          <div class="mt-4">
            <div class="flex">
              <input
                v-model="promoCode"
                type="text"
                placeholder="Code promo"
                class="input-field rounded-r-none flex-1"
              />
              <button
                type="button"
                @click="applyPromoCode"
                :disabled="isApplyingPromo"
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-r-md transition-colors"
              >
                Appliquer
              </button>
            </div>
          </div>

          <!-- Badges sécurité -->
          <div
            class="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500"
          >
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
              SSL sécurisé
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              PayTech certifié
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import PaymentMethodSelector from "./PaymentMethodSelector.vue";

// Props et émissions
interface Props {
  cartItems?: Array<{
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
}

const props = withDefaults(defineProps<Props>(), {
  cartItems: () => [],
});

// Composables
const router = useRouter();

// Fonction pour formater les montants
const formatAmount = (amount: number, currency: string = "XOF"): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

// Fonction pour initier un paiement (simulée pour l'exemple)
const initiatePayment = async (paymentData: any) => {
  try {
    const response = await $fetch("/api/paytech/initiate", {
      method: "POST",
      body: paymentData,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// States
const currentStep = ref(1);
const isProcessing = ref(false);
const isApplyingPromo = ref(false);
const phonePrefix = ref("+221");
const phoneNumber = ref("");
const promoCode = ref("");
const promoDiscount = ref(0);

// Form data
const form = reactive({
  customer: {
    name: "",
    email: "",
    phone: "",
    id: null as string | number | null,
  },
  shipping: {
    address: "",
    city: "",
    method: "",
    cost: 0,
  },
  target_payment: "",
  amount: 0,
  currency: "XOF",
  items: props.cartItems,
});

// Steps configuration
const steps = [
  { id: 1, title: "Informations" },
  { id: 2, title: "Livraison" },
  { id: 3, title: "Paiement" },
];

// Computed
const subtotal = computed(() => {
  return props.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

const totalAmount = computed(() => {
  return subtotal.value + form.shipping.cost - promoDiscount.value;
});

const isStep1Valid = computed(() => {
  return (
    form.customer.name.trim() !== "" &&
    form.customer.email.trim() !== "" &&
    phoneNumber.value.trim() !== ""
  );
});

const isStep2Valid = computed(() => {
  return (
    form.shipping.address.trim() !== "" &&
    form.shipping.city !== "" &&
    form.shipping.method !== ""
  );
});

const isStep3Valid = computed(() => {
  return form.target_payment.trim() !== "";
});

// Methods
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const formatPhoneNumber = () => {
  // Format automatique du numéro de téléphone
  let value = phoneNumber.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  }
  phoneNumber.value = value;

  // Mise à jour du téléphone complet
  form.customer.phone = phonePrefix.value + value.replace(/\s/g, "");
};

const updateShippingCost = () => {
  const costs: Record<string, number> = {
    standard: 2000,
    express: 5000,
    pickup: 0,
  };
  form.shipping.cost = costs[form.shipping.method] || 0;
};

const getCountryFromPhone = () => {
  const countryMap: Record<string, string> = {
    "+221": "SN",
    "+225": "CI",
    "+223": "ML",
    "+229": "BJ",
  };
  return countryMap[phonePrefix.value] || "SN";
};

const applyPromoCode = async () => {
  if (!promoCode.value.trim()) return;

  isApplyingPromo.value = true;

  try {
    // Simuler l'appel API pour validation du code promo
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Exemple de codes promo
    const promoCodes: Record<string, number> = {
      WELCOME10: subtotal.value * 0.1,
      SCHOOL2024: 5000,
      STUDENT15: subtotal.value * 0.15,
    };

    if (promoCodes[promoCode.value.toUpperCase()]) {
      promoDiscount.value = promoCodes[promoCode.value.toUpperCase()];
      // Afficher un message de succès
    } else {
      // Afficher un message d'erreur
      console.log("Code promo invalide");
    }
  } catch (error) {
    console.error("Erreur lors de l'application du code promo:", error);
  } finally {
    isApplyingPromo.value = false;
  }
};

const handleSubmit = async () => {
  if (!isStep3Valid.value) return;

  isProcessing.value = true;

  try {
    form.amount = totalAmount.value;

    const paymentData = {
      amount: form.amount,
      currency: form.currency,
      customer: form.customer,
      items: form.items,
      shipping: form.shipping,
      target_payment: form.target_payment,
      promoCode: promoCode.value || undefined,
      promoDiscount: promoDiscount.value || undefined,
    };

    console.log("Initiation du paiement:", paymentData);

    const response = (await initiatePayment(paymentData)) as any;

    if (response.success && response.redirect_url) {
      // Redirection vers PayTech
      window.location.href = response.redirect_url;
    } else {
      throw new Error("Erreur lors de l'initiation du paiement");
    }
  } catch (error: any) {
    console.error("Erreur paiement:", error);
    // Afficher le message d'erreur à l'utilisateur
  } finally {
    isProcessing.value = false;
  }
};

// Watchers
watch(
  () => phonePrefix.value,
  () => {
    formatPhoneNumber();
  }
);

// Initialization
onMounted(() => {
  // Pré-remplir avec les données du panier si disponible
  if (props.cartItems.length === 0) {
    router.push("/cart");
  }
});
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.btn-primary {
  background-color: #16a34a;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary:hover:not(:disabled) {
  background-color: #15803d;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}
</style>
