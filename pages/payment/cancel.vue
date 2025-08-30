<!-- pages/payment/cancel.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-red-50 p-4">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <div class="mb-6">
        <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-red-600 mb-2">Paiement Annulé</h1>
        <p class="text-gray-600">Votre paiement a été annulé ou a échoué</p>
      </div>

      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p class="text-sm text-yellow-700">
          Vos articles sont toujours dans votre panier. 
          Vous pouvez réessayer le paiement quand vous le souhaitez.
        </p>
      </div>

      <div class="space-y-3">
        <button @click="goToCart" 
                class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition">
          Retourner au panier
        </button>
        
        <button @click="goToHome" 
                class="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg transition">
          Continuer mes achats
        </button>
      </div>

      <div class="mt-6 text-sm text-gray-500">
        <p>Besoin d'aide ? Contactez notre service client</p>
        <a href="tel:+221123456789" class="text-blue-500 hover:underline">
          +221 12 345 67 89
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

function goToCart() {
  router.push('/cart')
}

function goToHome() {
  router.push('/')
}

// Métadonnées
useHead({
  title: 'Paiement Annulé - EduShop',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>