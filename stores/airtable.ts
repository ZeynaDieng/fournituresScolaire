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

import { useProductsStore } from "./products";

export const useAirtableStore = defineStore("airtable", {
  state: () => {
    const productsStore = useProductsStore();
    return {
      products: (productsStore.products || []) as Product[],
      packs: (productsStore.packs || []) as Pack[],
      promotions: [] as Promotion[],
      testimonials: [] as Testimonial[],
      categories: [] as string[],
      loading: false,
      error: null as string | null,
      sources: {} as Record<string, "live" | "cache" | "fallback">,
      lastUpdates: {} as Record<string, number>,
    };
  },

  getters: {
    // État global de la source pour affichage UI
    isUsingCache: (state) => Object.values(state.sources).includes("cache"),
    isUsingFallback: (state) =>
      Object.values(state.sources).includes("fallback"),

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
    /**
     * Helper pour la gestion intelligente du cache (Smart Fetch)
     * Priorité Live -> Fallback Cache (localStorage) -> Fallback Statique
     */
    async _smartFetch<T>(
      key: string,
      apiPath: string,
      defaultData: T[] = []
    ): Promise<T[]> {
      const cacheKey = `airtable_cache_${key}`;
      this.loading = true;

      try {
        console.log(`📡 Tentative d'appel API Live: ${apiPath}`);
        const response = (await $fetch(apiPath)) as any;
        const data = response.data || response;

        // 1. Mise à jour immédiate si succès et données non vides
        if (response && response.success !== false && Array.isArray(data) && data.length > 0) {
          // Sauvegarder dans localStorage (uniquement côté client)
          if (process.client) {
            localStorage.setItem(
              cacheKey,
              JSON.stringify({
                data,
                timestamp: Date.now(),
              })
            );
          }

          this.sources[key] = "live";
          this.lastUpdates[key] = Date.now();
          console.log(`✅ ${key} mis à jour depuis Airtable (Live, ${data.length} éléments)`);
          return data;
        }
        throw new Error("Données Airtable vides ou invalides");
      } catch (error) {
        console.warn(`⚠️ Échec API pour ${key}, tentative de récupération cache local.`);

        // 2. Fallback sur le cache LocalStorage
        if (process.client) {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            try {
              const { data, timestamp } = JSON.parse(cached);
              if (Array.isArray(data) && data.length > 0) {
                this.sources[key] = "cache";
                this.lastUpdates[key] = timestamp;
                console.log(`📦 ${key} chargé depuis le Cache Local (${new Date(timestamp).toLocaleString()})`);
                return data;
              }
            } catch (e) {
              console.error("Erreur de lecture du cache JSON", e);
            }
          }
        }

        // 3. Fallback ultime sur les données statiques par défaut
        console.warn(`🚨 Aucun cache disponible pour ${key}, utilisation du fallback statique.`);
        this.sources[key] = "fallback";
        return defaultData;
      } finally {
        this.loading = false;
      }
    },

    // Récupérer tous les produits depuis Airtable
    async fetchProducts() {
      const productsStore = useProductsStore();
      if (productsStore.products.length === 0) {
        productsStore.initializeDemoData();
      }

      this.products = await this._smartFetch<Product>(
        "products",
        "/api/airtable/products",
        productsStore.products as any
      );

      // Extraire les catégories uniques
      if (this.products.length > 0) {
        this.categories = [
          ...new Set(this.products.map((p: Product) => p.category)),
        ].sort();
      }
    },

    // Récupérer tous les packs depuis Airtable
    async fetchPacks() {
      const productsStore = useProductsStore();
      if (productsStore.packs.length === 0) {
        productsStore.initializeDemoData();
      }

      this.packs = await this._smartFetch<Pack>(
        "packs",
        "/api/airtable/packs",
        productsStore.packs as any
      );
    },

    // Récupérer toutes les promotions depuis Airtable
    async fetchPromotions() {
      this.promotions = await this._smartFetch<Promotion>(
        "promotions",
        "/api/airtable/promotions"
      );
    },

    // Récupérer tous les témoignages depuis Airtable
    async fetchTestimonials() {
      this.testimonials = await this._smartFetch<Testimonial>(
        "testimonials",
        "/api/airtable/testimonials"
      );
    },

    // Récupérer un produit par ID
    async fetchProductById(id: string) {
      let product = this.products.find((p) => p.id === id);
      if (product) return product;

      // Essayer le store de fallback
      const productsStore = useProductsStore();
      if (productsStore.products.length === 0) {
        productsStore.initializeDemoData();
      }
      const fallbackProd = productsStore.getProductById(id);
      if (fallbackProd) return fallbackProd;

      // Si pas dans la liste globale, charger via API spécifique
      try {
        const response = (await $fetch(`/api/airtable/products/${id}`)) as any;
        return response.data || null;
      } catch {
        return null;
      }
    },

    // Récupérer un pack par ID
    async fetchPackById(id: string) {
      let pack = this.packs.find((p) => p.id === id);
      if (pack) return pack;

      const productsStore = useProductsStore();
      if (productsStore.packs.length === 0) {
        productsStore.initializeDemoData();
      }
      return productsStore.getPackById(id) || null;
    },

    // Créer une commande
    async createOrder(orderData: any) {
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

    // Initialiser le store (évite les ré-appels réseau inutiles)
    async initialize() {
      if (this.products.length > 0 && this.packs.length > 0) {
        return;
      }
      // Charger les données de base
      await Promise.all([
        this.fetchProducts(),
        this.fetchPacks(),
        this.fetchPromotions(),
        this.fetchTestimonials(),
      ]);
    },

    // Vider le cache local et forcer le rafraîchissement
    async refreshAll() {
      if (process.client) {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("airtable_cache_")) {
            localStorage.removeItem(key);
          }
        });
      }
      this.sources = {};
      this.lastUpdates = {};
      await this.initialize();
    },
  },
});

