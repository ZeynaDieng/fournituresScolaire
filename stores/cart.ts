// stores/cart.ts
import { defineStore } from 'pinia'
import { watch, onMounted } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  type: 'pack' | 'product'
  category?: string
  description?: string
}

export interface ShippingInfo {
  address: string
  city: string
  phone: string
  deliveryType: 'home' | 'store'
  deliveryFee: number
}

export interface OrderSummary {
  subtotal: number
  deliveryFee: number
  total: number
  itemCount: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false,
    shippingInfo: null as ShippingInfo | null,
    promoCode: '',
    promoDiscount: 0
  }),

  getters: {
    // Nombre total d'articles dans le panier
    itemCount: (state): number => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    // Sous-total du panier
    subtotal: (state): number => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    // Frais de livraison
    deliveryFee: (state): number => {
      if (!state.shippingInfo) return 0
      return state.shippingInfo.deliveryType === 'home' ? state.shippingInfo.deliveryFee : 0
    },

    // Total avec livraison et réductions
    total: (state): number => {
      const subtotal = state.subtotal
      const delivery = state.deliveryFee
      const discount = (subtotal * state.promoDiscount) / 100
      return subtotal + delivery - discount
    },

    // Résumé de la commande
    orderSummary: (state): OrderSummary => {
      return {
        subtotal: state.subtotal,
        deliveryFee: state.deliveryFee,
        total: state.total,
        itemCount: state.itemCount
      }
    },

    // Vérifier si un article est dans le panier
    isInCart: (state) => (id: string): boolean => {
      return state.items.some(item => item.id === id)
    },

    // Obtenir la quantité d'un article
    getItemQuantity: (state) => (id: string): number => {
      const item = state.items.find(item => item.id === id)
      return item ? item.quantity : 0
    }
  },

  actions: {
    // Ajouter un article au panier
    addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
      const existingItem = this.items.find(cartItem => cartItem.id === item.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({ ...item, quantity })
      }

      // Toast notification
      this.showToast(`${item.name} ajouté au panier`, 'success')
    },

    // Retirer un article du panier
    removeItem(id: string) {
      const index = this.items.findIndex(item => item.id === id)
      if (index > -1) {
        const item = this.items[index]
        this.items.splice(index, 1)
        this.showToast(`${item.name} retiré du panier`, 'info')
      }
    },

    // Mettre à jour la quantité d'un article
    updateQuantity(id: string, quantity: number) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(id)
        } else {
          item.quantity = quantity
        }
      }
    },

    // Vider le panier
    clearCart() {
      this.items = []
      this.promoCode = ''
      this.promoDiscount = 0
      this.showToast('Panier vidé', 'info')
    },

    // Ouvrir/fermer le panier
    toggleCart() {
      this.isOpen = !this.isOpen
    },

    // Définir les informations de livraison
    setShippingInfo(info: ShippingInfo) {
      this.shippingInfo = info
    },

    // Appliquer un code promo
    applyPromoCode(code: string) {
      // Codes promo prédéfinis
      const promoCodes = {
        'RENTREE2024': 10,
        'PARENT5': 5,
        'NOUVEAU': 15
      }

      const discount = promoCodes[code as keyof typeof promoCodes]
      
      if (discount) {
        this.promoCode = code
        this.promoDiscount = discount
        this.showToast(`Code promo appliqué: -${discount}%`, 'success')
        return true
      } else {
        this.showToast('Code promo invalide', 'error')
        return false
      }
    },

    // Retirer le code promo
    removePromoCode() {
      this.promoCode = ''
      this.promoDiscount = 0
    },

    // Finaliser la commande
    async processOrder(paymentMethod: string = 'paytech') {
      try {
        // Simulation d'appel API pour traitement de commande
        const orderData = {
          items: this.items,
          shipping: this.shippingInfo,
          orderSummary: this.orderSummary,
          promoCode: this.promoCode,
          paymentMethod
        }

        // Ici on intégrerait PayTech ou autre solution de paiement
        console.log('Processing order:', orderData)
        
        // Simulation du succès
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Vider le panier après succès
        this.clearCart()
        this.shippingInfo = null
        
        return {
          success: true,
          orderId: 'EDU' + Date.now().toString(),
          message: 'Commande traitée avec succès'
        }
      } catch (error) {
        console.error('Order processing error:', error)
        return {
          success: false,
          message: 'Erreur lors du traitement de la commande'
        }
      }
    },

    // Sauvegarder le panier dans localStorage
    saveToStorage() {
      if (process.client) {
        localStorage.setItem('eduShopCart', JSON.stringify({
          items: this.items,
          promoCode: this.promoCode,
          promoDiscount: this.promoDiscount
        }))
      }
    },

    // Charger le panier depuis localStorage
    loadFromStorage() {
      if (process.client) {
        const saved = localStorage.getItem('eduShopCart')
        if (saved) {
          const data = JSON.parse(saved)
          this.items = data.items || []
          this.promoCode = data.promoCode || ''
          this.promoDiscount = data.promoDiscount || 0
        }
      }
    },

    // Afficher une notification toast
    showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
      // Cette fonction sera implémentée avec vue-toastification
      console.log(`[${type.toUpperCase()}] ${message}`)
    }
  }
})

// Auto-sauvegarde du panier
export const useCartAutoSave = () => {
  const cartStore = useCartStore()
  
  // Watcher pour sauvegarder automatiquement
  watch(
    () => cartStore.items,
    () => cartStore.saveToStorage(),
    { deep: true }
  )
  
  // Charger au démarrage
  onMounted(() => {
    cartStore.loadFromStorage()
  })
}