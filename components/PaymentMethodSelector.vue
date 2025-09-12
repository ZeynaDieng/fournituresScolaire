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
