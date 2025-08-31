<template>
  <div class="min-h-screen p-4 bg-green-50">
    <h1 class="text-2xl font-bold mb-4">Panier & Paiement</h1>

    <div v-if="cartStore.items.length === 0" class="text-center text-gray-600">
      Votre panier est vide.
    </div>

    <div v-else class="bg-white p-6 rounded-lg shadow-md fade-in">
      <!-- Articles du panier -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-4">Vos articles</h2>
        <div v-for="item in cartStore.items" :key="item.id" 
             class="flex justify-between items-center border-b py-2">
          <div class="flex-1">
            <p class="font-bold">{{ item.name }}</p>
            <p class="text-gray-600">{{ item.quantity }} × {{ item.price }} CFA</p>
            <p class="text-sm text-gray-500">{{ item.description }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="updateQuantity(item.id, item.quantity - 1)"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full">
              -
            </button>
            <span class="w-8 text-center">{{ item.quantity }}</span>
            <button @click="updateQuantity(item.id, item.quantity + 1)"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full">
              +
            </button>
            <button @click="removeItem(item.id)" 
                    class="text-red-500 hover:text-red-700 ml-4">
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <!-- Informations de livraison -->
      <div class="mb-6 border-t pt-4">
        <h3 class="text-md font-semibold mb-2">Informations de livraison</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="customerInfo.phone" 
                 type="tel" 
                 placeholder="Numéro de téléphone" 
                 class="border rounded-lg px-3 py-2"
                 required>
          <input v-model="customerInfo.email" 
                 type="email" 
                 placeholder="Email (optionnel)" 
                 class="border rounded-lg px-3 py-2">
          <input v-model="customerInfo.name" 
                 type="text" 
                 placeholder="Nom complet" 
                 class="border rounded-lg px-3 py-2"
                 required>
          <input v-model="customerInfo.address" 
                 type="text" 
                 placeholder="Adresse de livraison" 
                 class="border rounded-lg px-3 py-2"
                 required>
        </div>
      </div>

      <!-- Résumé de la commande -->
      <div class="border-t pt-4 mb-6">
        <div class="flex justify-between mb-2">
          <span>Sous-total:</span>
          <span>{{ cartStore.subtotal }} CFA</span>
        </div>
        <div class="flex justify-between mb-2">
          <span>Frais de livraison:</span>
          <span>{{ cartStore.deliveryFee }} CFA</span>
        </div>
        <div v-if="cartStore.promoDiscount > 0" class="flex justify-between mb-2 text-green-600">
          <span>Réduction ({{ cartStore.promoCode }}):</span>
          <span>-{{ Math.round(cartStore.subtotal * cartStore.promoDiscount / 100) }} CFA</span>
        </div>
        <div class="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total:</span>
          <span>{{ cartStore.total }} CFA</span>
        </div>
      </div>

      <!-- Boutons de paiement et rappel sécurité -->
      <div class="space-y-3">
        <button @click="pay" 
                :disabled="isProcessing || !isFormValid"
                :class="[
                  'w-full py-3 rounded-lg text-white font-semibold transition-colors',
                  isProcessing || !isFormValid 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-yellow-400 hover:bg-yellow-500'
                ]">
          <span v-if="isProcessing">Traitement en cours...</span>
          <span v-else>💳 Payer avec PayTech ({{ cartStore.total }} CFA)</span>
        </button>

        <div class="flex flex-col items-center gap-2 mt-2">
          <div class="flex items-center gap-2 text-green-700 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            Paiement 100% sécurisé via PayTech
          </div>
          <div class="text-xs text-gray-500 text-center">
            Accepte Orange Money, Free Money, Wave, cartes bancaires, etc.<br>
            Vos informations sont chiffrées et ne sont jamais partagées.
          </div>
        </div>
      </div>

      <!-- Messages d'erreur -->
      <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

// État du formulaire
const customerInfo = ref({
  phone: '',
  email: '',
  name: '',
  address: ''
})

// État du traitement
const isProcessing = ref(false)
const errorMessage = ref('')

// Validation du formulaire
const isFormValid = computed(() => {
  return customerInfo.value.phone.length >= 9 &&
         customerInfo.value.name.trim().length > 0 &&
         customerInfo.value.address.trim().length > 0
})

// Fonctions
function removeItem(id: string) {
  cartStore.removeItem(id)
}

function updateQuantity(id: string, quantity: number) {
  cartStore.updateQuantity(id, quantity)
}

async function pay() {
  if (!isFormValid.value) {
    errorMessage.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }

  isProcessing.value = true
  errorMessage.value = ''

  try {
    // Mettre à jour les informations de livraison dans le store
    cartStore.setShippingInfo({
      address: customerInfo.value.address,
      city: 'Dakar', // Vous pouvez ajouter un champ ville
      phone: customerInfo.value.phone,
      deliveryType: 'home',
      deliveryFee: cartStore.deliveryFee
    })

    // Lancer le processus de paiement PayTech
    const result = await cartStore.processOrder('paytech', customerInfo.value)
    
    if (!result.success) {
      errorMessage.value = result.message || 'Erreur lors du paiement'
    }
    // Si succès, l'utilisateur sera redirigé vers PayTech
    
  } catch (error: any) {
    console.error('Payment error:', error)
    errorMessage.value = error.message || 'Une erreur est survenue lors du paiement'
  } finally {
    isProcessing.value = false
  }
}

// Métadonnées de la page
useHead({
  title: 'Panier - EduShop',
  meta: [
    { name: 'description', content: 'Finalisez votre commande avec PayTech' }
  ]
})
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>