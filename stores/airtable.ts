// stores/airtable.ts
import { defineStore } from "pinia";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description?: string;
  inStock: boolean;
  isPromotion?: boolean;
  promotionEndDate?: Date | null;
}

interface Pack {
  id: string;
  name: string;
  level?: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
  contents: string[];
  isPopular: boolean;
  inStock: boolean;
  isPromotion?: boolean;
  promotionEndDate?: Date | null;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  type: "percentage" | "fixed" | "bogo";
  endDate: Date | null;
  products: string[];
  category?: string;
  trending?: boolean;
  featured?: boolean;
  icon?: string;
  rating?: number;
  features?: string[];
  originalPrice?: number;
  currentPrice?: number;
  isActive: boolean;
  createdTime: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
  location?: string;
  isActive: boolean;
  createdTime: string;
  order: number;
}

export const useAirtableStore = defineStore("airtable", {
  state: () => ({
    products: [] as Product[],
    packs: [] as Pack[],
    promotions: [] as Promotion[],
    testimonials: [] as Testimonial[],
    categories: [] as string[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    // Produits populaires
    popularProducts: (state) => state.products.slice(0, 8),

    // Packs populaires
    popularPacks: (state) => state.packs.filter((pack) => pack.isPopular),

    // Produits en promotion
    promotionProducts: (state) =>
      state.products.filter((product) => product.isPromotion),

    // Promotions actives
    activePromotions: (state) =>
      state.promotions.filter((promo) => {
        if (!promo.isActive) return false;
        if (!promo.endDate) return true;
        return new Date(promo.endDate) > new Date();
      }),

    // Promotions tendance
    trendingPromotions: (state) =>
      state.promotions.filter((promo) => promo.trending && promo.isActive),

    // Promotions mises en avant
    featuredPromotions: (state) =>
      state.promotions.filter((promo) => promo.featured && promo.isActive),

    // Témoignages actifs
    activeTestimonials: (state) =>
      state.testimonials.filter((testimonial) => testimonial.isActive),

    // Produits par catégorie
    productsByCategory: (state) => (category: string) => {
      return state.products.filter((product) => product.category === category);
    },
  },

  actions: {
    // Récupérer tous les produits depuis Airtable
    async fetchProducts() {
      this.loading = true;
      this.error = null;

      try {
        const response = (await $fetch("/api/airtable/products")) as any;
        this.products = response.data;

        // Extraire les catégories uniques
        this.categories = [
          ...new Set(response.data.map((p: Product) => p.category)),
        ].sort();
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        this.error = "Erreur lors du chargement des produits";
        this.products = [];
      } finally {
        this.loading = false;
      }
    },

    // Récupérer tous les packs depuis Airtable
    async fetchPacks() {
      this.loading = true;
      this.error = null;

      try {
        const response = (await $fetch("/api/airtable/packs")) as any;
        this.packs = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des packs:", error);
        this.error = "Erreur lors du chargement des packs";
        this.packs = [];
      } finally {
        this.loading = false;
      }
    },

    // Récupérer toutes les promotions depuis Airtable
    async fetchPromotions() {
      this.loading = true;
      this.error = null;

      try {
        const response = (await $fetch("/api/airtable/promotions")) as any;
        this.promotions = response.data || [];
      } catch (error) {
        console.error("Erreur lors de la récupération des promotions:", error);
        this.error = "Erreur lors du chargement des promotions";
        this.promotions = [];
      } finally {
        this.loading = false;
      }
    },

    // Récupérer tous les témoignages depuis Airtable
    async fetchTestimonials() {
      this.loading = true;
      this.error = null;

      try {
        const response = (await $fetch("/api/airtable/testimonials")) as any;
        this.testimonials = response.data || [];
      } catch (error) {
        console.error("Erreur lors de la récupération des témoignages:", error);
        this.error = "Erreur lors du chargement des témoignages";
        this.testimonials = [];
      } finally {
        this.loading = false;
      }
    },

    // Récupérer un produit par ID
    async fetchProductById(id: string) {
      return this.products.find((product) => product.id === id) || null;
    },

    // Récupérer un pack par ID
    async fetchPackById(id: string) {
      return this.packs.find((pack) => pack.id === id) || null;
    },

    // Créer une commande
    async createOrder(orderData: {
      customerName: string;
      customerEmail?: string;
      customerPhone?: string;
      items: any[];
      total: number;
    }) {
      try {
        const response = (await $fetch("/api/airtable/orders", {
          method: "POST",
          body: orderData,
        })) as any;

        return response.data;
      } catch (error) {
        console.error("Erreur lors de la création de la commande:", error);
        throw error;
      }
    },

    // Initialiser le store
    async initialize() {
      await Promise.all([
        this.fetchProducts(),
        this.fetchPacks(),
        this.fetchPromotions(),
        this.fetchTestimonials(),
      ]);
    },
  },
});
