<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">
        Test du formulaire de checkout
      </h1>

      <!-- Test de validation -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Test de validation</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nom complet *
            </label>
            <input
              v-model="testForm.name"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email (optionnel)
            </label>
            <input
              v-model="testForm.email"
              type="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              placeholder="votre@email.com (optionnel)"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Téléphone *
            </label>
            <input
              v-model="testForm.phone"
              type="tel"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              placeholder="+221 77 123 45 67"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Adresse *
            </label>
            <input
              v-model="testForm.address"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              placeholder="Votre adresse complète"
            />
          </div>
        </div>

        <!-- Résultat de validation -->
        <div
          class="mt-6 p-4 rounded-lg"
          :class="
            isFormValid
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          "
        >
          <p
            class="text-sm font-medium"
            :class="isFormValid ? 'text-green-800' : 'text-red-800'"
          >
            {{
              isFormValid ? "✅ Formulaire valide" : "❌ Formulaire invalide"
            }}
          </p>
          <p
            class="text-xs mt-1"
            :class="isFormValid ? 'text-green-600' : 'text-red-600'"
          >
            {{ validationMessage }}
          </p>
        </div>

        <!-- Bouton de test -->
        <button
          @click="testValidation"
          :disabled="!isFormValid"
          class="mt-4 px-6 py-3 rounded-lg font-medium transition-colors"
          :class="
            isFormValid
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          "
        >
          Tester la validation
        </button>
      </div>

      <!-- Test PayTech -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-xl font-semibold mb-4">Test PayTech</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Montant (XOF)
            </label>
            <input
              v-model="paytechTest.amount"
              type="number"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              placeholder="5000"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Méthode de paiement
            </label>
            <select
              v-model="paytechTest.paymentMethod"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            >
              <option value="Orange Money">Orange Money</option>
              <option value="Wave">Wave</option>
              <option value="Free Money">Free Money</option>
              <option value="Carte Bancaire">Carte Bancaire</option>
            </select>
          </div>
        </div>

        <button
          @click="testPayTech"
          :disabled="!isFormValid"
          class="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Tester PayTech
        </button>

        <!-- Résultat PayTech -->
        <div
          v-if="paytechResult"
          class="mt-4 p-4 rounded-lg"
          :class="
            paytechResult.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          "
        >
          <p
            class="text-sm font-medium"
            :class="paytechResult.success ? 'text-green-800' : 'text-red-800'"
          >
            {{ paytechResult.success ? "✅ PayTech OK" : "❌ Erreur PayTech" }}
          </p>
          <p
            class="text-xs mt-1"
            :class="paytechResult.success ? 'text-green-600' : 'text-red-600'"
          >
            {{ paytechResult.message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Test form data
const testForm = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
});

const paytechTest = reactive({
  amount: 5000,
  paymentMethod: "Orange Money",
});

const paytechResult = ref(null);

// Validation
const isFormValid = computed(() => {
  return (
    testForm.name.trim() !== "" &&
    testForm.phone.trim() !== "" &&
    testForm.address.trim() !== ""
  );
});

const validationMessage = computed(() => {
  const missing = [];
  if (!testForm.name.trim()) missing.push("nom");
  if (!testForm.phone.trim()) missing.push("téléphone");
  if (!testForm.address.trim()) missing.push("adresse");

  if (missing.length === 0) {
    return "Tous les champs requis sont remplis (email optionnel)";
  }

  return `Champs manquants: ${missing.join(", ")}`;
});

// Test functions
const testValidation = () => {
  alert(
    `Validation: ${isFormValid.value ? "OK" : "ÉCHEC"}\n${
      validationMessage.value
    }`
  );
};

const testPayTech = async () => {
  if (!isFormValid.value) {
    alert("Veuillez remplir tous les champs requis");
    return;
  }

  try {
    const paymentData = {
      amount: paytechTest.amount,
      currency: "XOF",
      customer: {
        name: testForm.name,
        email: testForm.email,
        phone: testForm.phone,
      },
      items: [
        {
          id: "test-1",
          name: "Test Product",
          price: paytechTest.amount,
          quantity: 1,
          type: "product",
        },
      ],
      shipping: {
        address: testForm.address,
        city: "Dakar",
        method: "Livraison",
        cost: 0,
      },
      target_payment: paytechTest.paymentMethod,
    };

    console.log("Test PayTech avec:", paymentData);

    const response = await $fetch("/api/paytech/initiate", {
      method: "POST",
      body: paymentData,
    });

    paytechResult.value = {
      success: true,
      message: "Paiement initié avec succès",
    };
  } catch (error: any) {
    console.error("Erreur PayTech:", error);
    paytechResult.value = {
      success: false,
      message: error.data?.message || error.message || "Erreur inconnue",
    };
  }
};
</script>
