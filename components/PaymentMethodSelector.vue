<!-- components/PaymentMethodSelector.vue -->
<template>
  <div class="payment-method-selector">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      Choisissez votre méthode de paiement
    </h3>

    <!-- Sélection par pays -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Pays de paiement
      </label>
      <select
        v-model="selectedCountry"
        @change="updatePaymentMethods"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
      >
        <option value="SN">🇸🇳 Sénégal</option>
        <option value="CI">🇨🇮 Côte d'Ivoire</option>
        <option value="ML">🇲🇱 Mali</option>
        <option value="BJ">🇧🇯 Bénin</option>
      </select>
    </div>

    <!-- Options de paiement -->
    <div class="space-y-3">
      <!-- Méthode rapide: une seule méthode -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 class="font-medium text-green-900 mb-3 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          Paiement rapide (recommandé)
        </h4>
        <p class="text-sm text-green-700 mb-3">
          Vos informations seront pré-remplies automatiquement
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            v-for="method in availableMethods"
            :key="`single-${method}`"
            @click="selectSingleMethod(method)"
            :class="[
              'payment-method-btn',
              selectedMethod === method ? 'selected' : '',
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <img
                  :src="getMethodIcon(method)"
                  :alt="method"
                  class="w-8 h-8 mr-3 rounded"
                  @error="handleImageError"
                />
                <span class="font-medium">{{ method }}</span>
              </div>
              <div v-if="selectedMethod === method" class="text-green-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Méthode flexible: toutes les méthodes -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-medium text-gray-900">
            Toutes les méthodes disponibles
          </h4>
          <button
            @click="selectMultipleMethods"
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              isMultipleSelected
                ? 'bg-primary-green text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
          >
            {{ isMultipleSelected ? "Sélectionné" : "Choisir" }}
          </button>
        </div>
        <p class="text-sm text-gray-600 mb-3">
          Vous pourrez choisir votre méthode sur la page de paiement
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="method in availableMethods"
            :key="`multi-${method}`"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
          >
            <img
              :src="getMethodIcon(method)"
              :alt="method"
              class="w-4 h-4 mr-1 rounded"
              @error="handleImageError"
            />
            {{ method }}
          </span>
        </div>
      </div>
    </div>

    <!-- Informations de sécurité -->
    <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start">
        <svg
          class="w-5 h-5 text-blue-600 mt-0.5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <h5 class="font-medium text-blue-900 mb-1">Paiement sécurisé</h5>
          <p class="text-sm text-blue-700">
            Vos données sont protégées par PayTech avec un chiffrement SSL et
            une conformité PCI DSS. Aucune information bancaire n'est stockée
            sur nos serveurs.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string;
  amount?: number;
  country?: string;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  country: "SN",
});

const emit = defineEmits<Emits>();

// States
const selectedCountry = ref(props.country);
const selectedMethod = ref<string>(props.modelValue || "");
const isMultipleSelected = ref(false);
const availableMethods = ref<string[]>([]);

// Payment methods by country
const getPaymentMethodsByCountry = (country: string = "SN") => {
  const methodsByCountry: Record<string, string[]> = {
    SN: ["Orange Money", "Wave", "Free Money", "Carte Bancaire"],
    CI: [
      "Orange Money CI",
      "Wave CI",
      "Mtn Money CI",
      "Moov Money CI",
      "Carte Bancaire",
    ],
    ML: ["Orange Money ML", "Moov Money ML", "Carte Bancaire"],
    BJ: ["Moov Money BJ", "Mtn Money BJ", "Carte Bancaire"],
  };

  return methodsByCountry[country] || methodsByCountry["SN"];
};

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && !newValue.includes(",")) {
      selectedMethod.value = newValue;
      isMultipleSelected.value = false;
    } else if (newValue && newValue.includes(",")) {
      selectedMethod.value = "";
      isMultipleSelected.value = true;
    }
  }
);

watch(selectedMethod, (newValue) => {
  if (newValue) {
    isMultipleSelected.value = false;
    emit("update:modelValue", newValue);
    emit("change", newValue);
  }
});

// Methods
const updatePaymentMethods = () => {
  availableMethods.value = getPaymentMethodsByCountry(selectedCountry.value);

  // Reset selection if current method is not available in new country
  if (
    selectedMethod.value &&
    !availableMethods.value.includes(selectedMethod.value)
  ) {
    selectedMethod.value = "";
    isMultipleSelected.value = false;
  }

  // Auto-sélectionner la première méthode si aucune n'est sélectionnée
  if (!selectedMethod.value && availableMethods.value.length > 0) {
    const firstMethod = availableMethods.value[0];
    selectSingleMethod(firstMethod);
  }
};

const selectSingleMethod = (method: string) => {
  selectedMethod.value = method;
  isMultipleSelected.value = false;
  console.log("PaymentMethodSelector: Méthode sélectionnée:", method);
  emit("update:modelValue", method);
  emit("change", method);
};

const selectMultipleMethods = () => {
  selectedMethod.value = "";
  isMultipleSelected.value = true;
  const allMethods = availableMethods.value.join(", ");
  emit("update:modelValue", allMethods);
  emit("change", allMethods);
};

const getMethodIcon = (method: string): string => {
  const iconMap: Record<string, string> = {
    "Orange Money": "/images/payment/orange-money.png",
    "Orange Money CI": "/images/payment/orange-money.png",
    "Orange Money ML": "/images/payment/orange-money.png",
    Wave: "/images/payment/wave.png",
    "Wave CI": "/images/payment/wave.png",
    "Free Money": "/images/payment/free-money.png",
    "Mtn Money CI": "/images/payment/mtn.png",
    "Mtn Money BJ": "/images/payment/mtn.png",
    "Moov Money CI": "/images/payment/moov.png",
    "Moov Money ML": "/images/payment/moov.png",
    "Moov Money BJ": "/images/payment/moov.png",
    "Carte Bancaire": "/images/payment/visa-mastercard.png",
    Wizall: "/images/payment/wizall.png",
    Emoney: "/images/payment/emoney.png",
    "Tigo Cash": "/images/payment/tigo.png",
  };

  return iconMap[method] || "/images/payment/default.png";
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "/images/payment/default.png";
};

// Initialize
onMounted(() => {
  updatePaymentMethods();
});
</script>

<style scoped>
.payment-method-btn {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.payment-method-btn:hover {
  border-color: #16a34a;
  background-color: #dcfce7;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.payment-method-btn.selected {
  border-color: #16a34a;
  background-color: #dcfce7;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.5);
}
</style>
