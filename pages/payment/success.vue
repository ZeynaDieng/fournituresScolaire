<!-- pages/payment/success.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-green-50 p-4">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <div class="mb-6">
        <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-green-600 mb-2">Paiement Réussi !</h1>
        <p class="text-gray-600">Votre commande a été traitée avec succès</p>
      </div>

      <div v-if="orderInfo" class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
        <h3 class="font-semibold mb-2">Détails de la commande</h3>
        <p><strong>Numéro:</strong> {{ orderInfo.ref }}</p>
        <p><strong>Montant:</strong> {{ orderInfo.amount }} CFA</p>
        <p><strong>Date:</strong> {{ formatDate(orderInfo.timestamp) }}</p>
        <p><strong>Téléphone:</strong> {{ orderInfo.customer?.phone }}</p>
      </div>

      <div class="space-y-3">
        <button @click="goToHome" 
                class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition">
          Continuer mes achats
        </button>
        
        <button @click="downloadReceipt" 
                class="w-full border border-green-500 text-green-500 hover:bg-green-50 py-2 px-4 rounded-lg transition">
          Télécharger le reçu
        </button>
      </div>

      <div class="mt-6 text-sm text-gray-500">
        <p>Un SMS de confirmation vous a été envoyé.</p>
        <p>Vous recevrez bientôt votre commande !</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const orderInfo = ref(null)

onMounted(() => {
  // Récupérer les informations de la commande depuis l'URL ou le localStorage
  const orderId = route.query.ref || route.query.order_id
  
  if (orderId) {
    // Marquer la commande comme payée
    cartStore.markOrderAsPaid(orderId as string)
    
    // Récupérer les détails de la commande
    orderInfo.value = cartStore.getOrderFromStorage(orderId as string)
  }
})

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString('fr-FR')
}

function goToHome() {
  router.push('/')
}

function downloadReceipt() {
  // Générer un reçu simple
  if (orderInfo.value) {
    const receiptContent = `
REÇU DE COMMANDE - EDUSHOP
================================
Numéro: ${orderInfo.value.ref}
Date: ${formatDate(orderInfo.value.timestamp)}
Montant: ${orderInfo.value.amount} CFA
Téléphone: ${orderInfo.value.customer?.phone}
Email: ${orderInfo.value.customer?.email}

Articles commandés:
${orderInfo.value.items?.map(item => 
  `- ${item.name} x${item.quantity} = ${item.price * item.quantity} CFA`
).join('\n')}

Merci pour votre achat !
    `
    
    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recu-${orderInfo.value.ref}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }
}

// Métadonnées
useHead({
  title: 'Paiement Réussi - EduShop',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>