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
    <div v-if="availableMethods.length > 0" class="space-y-3">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Méthode de paiement
      </label>
      <div class="grid grid-cols-1 gap-3">
        <div
          v-for="method in availableMethods"
          :key="method"
          @click="selectSingleMethod(method)"
          :class="[
            'p-3 rounded-lg border-2 cursor-pointer transition-all duration-200',
            selectedMethod === method
              ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 ring-opacity-20'
              : 'border-gray-200 hover:border-gray-300',
          ]"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img
                :src="getMethodIcon(method)"
                :alt="method"
                class="w-8 h-8 mr-3"
                @error="handleImageError"
              />
              <div>
                <h3 class="font-semibold text-gray-900">{{ method }}</h3>
                <p class="text-sm text-gray-600">
                  {{ getMethodDescription(method) }}
                </p>
              </div>
            </div>
            <div
              :class="[
                'w-4 h-4 rounded-full border-2',
                selectedMethod === method
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-gray-300',
              ]"
            >
              <div
                v-if="selectedMethod === method"
                class="w-2 h-2 bg-white rounded-full m-0.5"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
interface Props {
  modelValue?: string;
  amount?: number;
  country?: string;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
  (
    e: "payment-method-selected",
    data: { method: string; country: string }
  ): void;
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
    SN: ["Wave", "Free Money", "Orange Money", "Carte Bancaire"],
    CI: [
      "Wave CI",
      "Mtn Money CI",
      "Moov Money CI",
      "Orange Money CI",
      "Carte Bancaire",
    ],
    ML: ["Moov Money ML", "Orange Money ML", "Carte Bancaire"],
    BJ: ["Mtn Money BJ", "Moov Money BJ", "Carte Bancaire"],
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

  // Ne pas auto-sélectionner - laisser l'utilisateur choisir
  // if (!selectedMethod.value && availableMethods.value.length > 0) {
  //   const firstMethod = availableMethods.value[0];
  //   selectSingleMethod(firstMethod);
  // }
};

const selectSingleMethod = (method: string) => {
  selectedMethod.value = method;
  isMultipleSelected.value = false;
  console.log("PaymentMethodSelector: Méthode sélectionnée:", method);
  emit("update:modelValue", method);
  emit("change", method);

  // Déclencher automatiquement le popup PayTech après un court délai
  setTimeout(() => {
    emit("payment-method-selected", {
      method,
      country: selectedCountry.value,
    });
  }, 500);
};

const selectMultipleMethods = () => {
  selectedMethod.value = "";
  isMultipleSelected.value = true;
  const allMethods = availableMethods.value.join(", ");
  emit("update:modelValue", allMethods);
  emit("change", allMethods);
};

// Initialiser les méthodes de paiement au montage
onMounted(() => {
  updatePaymentMethods();
});

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

const getMethodDescription = (method: string): string => {
  const descriptionMap: Record<string, string> = {
    "Orange Money": "Paiement mobile Orange",
    "Orange Money CI": "Paiement mobile Orange Côte d'Ivoire",
    "Orange Money ML": "Paiement mobile Orange Mali",
    Wave: "Paiement mobile Wave",
    "Wave CI": "Paiement mobile Wave Côte d'Ivoire",
    "Free Money": "Paiement mobile Free",
    "Mtn Money CI": "Paiement mobile MTN Côte d'Ivoire",
    "Mtn Money BJ": "Paiement mobile MTN Bénin",
    "Moov Money CI": "Paiement mobile Moov Côte d'Ivoire",
    "Moov Money ML": "Paiement mobile Moov Mali",
    "Moov Money BJ": "Paiement mobile Moov Bénin",
    "Carte Bancaire": "Visa, Mastercard, etc.",
    Wizall: "Paiement mobile Wizall",
    Emoney: "Paiement mobile Emoney",
    "Tigo Cash": "Paiement mobile Tigo",
  };
  return descriptionMap[method] || "Méthode de paiement";
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (img) {
    img.style.display = "none";
  }
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
