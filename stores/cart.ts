// stores/cart.ts
import { defineStore } from "pinia";
import { watch, onMounted } from "vue";
import type { Ref } from "vue";
import type { CustomerInfo } from "~/types/cart";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: "pack" | "product" | "promotion";
  category?: string;
  description?: string;
  originalPrice?: number;
  discount?: number;
  features?: string[];
}

export interface ShippingInfo {
  address: string;
  city: string;
  phone: string;
  deliveryType: "home" | "store";
  deliveryFee: number;
}

export interface OrderSummary {
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false,
    shippingInfo: null as ShippingInfo | null,
    promoCode: "",
    promoDiscount: 0,
  }),

  getters: {
    // Nombre total d'articles dans le panier
    itemCount(state): number {
      return state.items.reduce(
        (total: number, item: CartItem) => total + item.quantity,
        0
      );
    },

    // Sous-total du panier
    subtotal(state): number {
      return state.items.reduce(
        (total: number, item: CartItem) => total + item.price * item.quantity,
        0
      );
    },

    // Frais de livraison
    deliveryFee(state): number {
      // Logique de calcul des frais de livraison
      return this.subtotal > 0 ? 0 : 0; //  défaut
    },

    // Total avec livraison et réductions
    total(state): number {
      const subtotal = this.subtotal;
      const delivery = this.deliveryFee;
      const discount = (subtotal * this.promoDiscount) / 100;
      return Math.max(0, subtotal + delivery - discount);
    },

    // Résumé de la commande
    orderSummary(state): OrderSummary {
      return {
        subtotal: this.subtotal,
        deliveryFee: this.deliveryFee,
        total: this.total,
        itemCount: this.itemCount,
      };
    },

    // Vérifier si un article est dans le panier
    isInCart(state): (id: string) => boolean {
      return (id: string) =>
        state.items.some((item: CartItem) => item.id === id);
    },

    // Obtenir la quantité d'un article
    getItemQuantity(state): (id: string) => number {
      return (id: string): number => {
        const item = state.items.find((item: CartItem) => item.id === id);
        return item ? item.quantity : 0;
      };
    },
  },

  actions: {
    // Ajouter un article au panier
    addItem(item: Omit<CartItem, "quantity">, quantity: number = 1) {
      // Validation des données pour éviter les NaN
      const validatedItem = {
        ...item,
        price: Number(item.price) || 0, // S'assurer que le prix est un nombre valide
        quantity: Math.max(1, Number(quantity) || 1), // S'assurer que la quantité est valide
      };

      // Vérification supplémentaire
      if (
        !validatedItem.id ||
        !validatedItem.name ||
        isNaN(validatedItem.price)
      ) {
        console.error("Données invalides pour l'article:", item);
        this.showToast("Erreur: données de produit invalides", "error");
        return;
      }

      const existingItem = this.items.find(
        (cartItem: CartItem) => cartItem.id === validatedItem.id
      );

      if (existingItem) {
        existingItem.quantity += validatedItem.quantity;
      } else {
        this.items.push({
          ...validatedItem,
          quantity: validatedItem.quantity,
        } as CartItem);
      }

      this.showToast(`${validatedItem.name} ajouté au panier`, "success");
      this.saveToStorage();
    },

    // Retirer un article du panier
    removeItem(id: string) {
      const index = this.items.findIndex((item: CartItem) => item.id === id);
      if (index > -1) {
        const item = this.items[index];
        this.items.splice(index, 1);
        this.showToast(`${item.name} retiré du panier`, "info");
        this.saveToStorage();
      }
    },

    // Mettre à jour la quantité d'un article
    updateQuantity(id: string, quantity: number) {
      const item = this.items.find((item: CartItem) => item.id === id);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(id);
        } else {
          item.quantity = quantity;
          this.saveToStorage();
        }
      }
    },

    // Vider le panier
    clearCart() {
      this.items = [];
      this.promoCode = "";
      this.promoDiscount = 0;
      this.showToast("Panier vidé", "info");
    },

    // Ouvrir/fermer le panier
    toggleCart() {
      this.isOpen = !this.isOpen;
    },

    // Définir les informations de livraison
    setShippingInfo(info: ShippingInfo) {
      this.shippingInfo = info;
    },

    // Appliquer un code promo
    applyPromoCode(code: string) {
      // Codes promo prédéfinis
      const promoCodes = {
        RENTREE2024: 10,
        PARENT5: 5,
        NOUVEAU: 15,
      };

      const discount = promoCodes[code as keyof typeof promoCodes];

      if (discount) {
        this.promoCode = code;
        this.promoDiscount = discount;
        this.showToast(`Code promo appliqué: -${discount}%`, "success");
        return true;
      } else {
        this.showToast("Code promo invalide", "error");
        return false;
      }
    },

    // Retirer le code promo
    removePromoCode() {
      this.promoCode = "";
      this.promoDiscount = 0;
    },

    // Finaliser la commande
    async processOrder(
      customerInfo: CustomerInfo,
      paymentMethod: string = "paytech"
    ) {
      try {
        this.showToast("Initialisation du paiement...", "info");

        if (paymentMethod === "paytech") {
          const orderRef = "EDU" + Date.now().toString();
          const itemNames = this.items.map((item) => item.name).join(", ");

          const paymentData = {
            ref: orderRef,
            ref_command: orderRef,
            amount: this.total,
            item_price: this.total,
            currency: "XOF",
            item_name: itemNames,
            command_name: `Commande ${customerInfo.name} - EduShop`,
            target_payment: "Orange Money, Wave, Free Money",
            customer: {
              name: customerInfo.name,
              email: customerInfo.email,
              phone: this.shippingInfo
                ? this.shippingInfo.phone || customerInfo.phone
                : customerInfo.phone,
            },
            items: this.items.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              type: item.type,
              image: item.image,
            })),
            shipping: this.shippingInfo,
            promoCode: this.promoCode,
            promoDiscount: this.promoDiscount,
          };

          const response = await $fetch<{
            success: boolean;
            data: any;
            payment_url: string;
          }>("/api/paytech/initiate", {
            method: "POST",
            body: paymentData,
          });

          if (response.success && response.payment_url) {
            this.saveOrderForPayment(orderRef, paymentData);
            this.showToast("Redirection vers PayTech...", "success");
            setTimeout(() => {
              window.location.href = response.payment_url;
            }, 1500);

            return {
              success: true,
              orderId: orderRef,
              message: "Redirection vers PayTech...",
              paymentUrl: response.payment_url,
            };
          } else {
            throw new Error("Impossible d'initialiser le paiement PayTech");
          }
        } else {
          throw new Error("Méthode de paiement non supportée");
        }
      } catch (error: any) {
        console.error("Order processing error:", error);
        this.showToast(error.message || "Erreur lors du paiement", "error");
        return {
          success: false,
          message: error.message || "Erreur lors du traitement de la commande",
        };
      }
    },
    // Sauvegarder le panier dans localStorage
    saveToStorage() {
      if (process.client) {
        localStorage.setItem(
          "eduShopCart",
          JSON.stringify({
            items: this.items,
            promoCode: this.promoCode,
            promoDiscount: this.promoDiscount,
          })
        );
      }
    },
    saveOrderForPayment(orderId: string, orderData: any) {
      if (process.client) {
        localStorage.setItem(
          `order_${orderId}`,
          JSON.stringify({
            ...orderData,
            timestamp: Date.now(),
            status: "pending",
          })
        );
      }
    },

    // Récupérer une commande sauvegardée
    getOrderFromStorage(orderId: string) {
      if (process.client) {
        const saved = localStorage.getItem(`order_${orderId}`);
        return saved ? JSON.parse(saved) : null;
      }
      return null;
    },

    // Marquer une commande comme payée
    markOrderAsPaid(orderId: string) {
      if (process.client) {
        const orderData = this.getOrderFromStorage(orderId);
        if (orderData) {
          orderData.status = "paid";
          orderData.paidAt = Date.now();
          localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));

          // Vider le panier après paiement réussi
          this.clearCart();
        }
      }
    },
    // Charger le panier depuis localStorage
    loadFromStorage() {
      if (process.client) {
        const saved = localStorage.getItem("eduShopCart");
        if (saved) {
          const data = JSON.parse(saved);
          this.items = data.items || [];
          this.promoCode = data.promoCode || "";
          this.promoDiscount = data.promoDiscount || 0;
        }
      }
    },

    // Afficher une notification toast
    showToast(message: string, type: "success" | "error" | "info" = "info") {
      // Cette fonction sera implémentée avec vue-toastification
      console.log(`[${type.toUpperCase()}] ${message}`);
    },

    // Méthode de test pour ajouter des articles de démonstration
    addTestItems() {
      const testItems = [
        {
          id: "test-pack-1",
          name: "Pack CP Complet",
          price: 15000,
          image: "/images/products/pack-cp.jpg",
          type: "pack" as const,
          category: "CP",
          description: "Pack complet pour le CP",
        },
        {
          id: "test-product-1",
          name: "Stylo Plume",
          price: 2500,
          image: "/images/products/stylo-plume.jpg",
          type: "product" as const,
          category: "Écriture",
          description: "Stylo plume de qualité",
        },
        {
          id: "test-product-2",
          name: "Cahier Spiral",
          price: 1500,
          image: "/images/products/cahier-spiral.jpg",
          type: "product" as const,
          category: "Cahiers",
          description: "Cahier spiral 100 pages",
        },
      ];

      // Ajouter chaque article de test
      testItems.forEach((item) => {
        this.addItem(item, 1);
      });

      this.showToast("Articles de test ajoutés au panier", "success");
      console.log("🧪 Articles de test ajoutés:", testItems.length);
    },
  },
});

// Auto-sauvegarde du panier
export const useCartAutoSave = () => {
  const cartStore = useCartStore();

  // Watcher pour sauvegarder automatiquement
  if (process.client) {
    watch(
      () => cartStore.items,
      () => cartStore.saveToStorage(),
      { deep: true }
    );

    // Charger au démarrage
    onMounted(() => {
      cartStore.loadFromStorage();
    });
  }
};
