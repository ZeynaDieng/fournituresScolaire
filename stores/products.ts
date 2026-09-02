import { defineStore } from "pinia";
import { officialCatalog } from "~/data/products-senegal";
import { officialPacks } from "~/data/packs-senegal";

interface Feature {
  label: string;
  value: string;
}

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  price: number;
  costPrice?: number;
  sellingPrice?: number;
  isActive?: boolean;
  stock?: number;
  inStock: boolean;
  lowStockThreshold?: number;
  schoolLevel?: string; // Maternelle, Primaire, Collège, Lycée, Tous niveaux
  format?: string;      // PF, GF, GM, A4, A5, Standard
  unit?: string;        // Unité, Paquet, Lot
  specs?: { label: string; value: string }[];
  originalPrice?: number | null;
  features?: Feature[];
  images: string | string[]; // <- accepte une image ou plusieurs
  category: string;
  image: string;
  description: string;
  isPromotion?: boolean;
  promotionEndDate?: Date;
  reviews?: Review[];
  bulkOptions?: Array<{
    quantity: number;
    unitPrice: number;
    discount: number;
  }>;
}

export interface Pack {
  id: string;
  name: string;
  level: string; // CP, CE1-CE2, Collège, Lycée
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  contents: string[];
  isPopular?: boolean;
  inStock: boolean;
  isPromotion?: boolean;
  promotionEndDate?: Date;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  endDate: Date | string;
  products: string[];
  type: "percentage" | "fixed" | "bogo";
  trending?: boolean;
  icon?: string;
  category?: string;
  rating?: number;
  features?: string[];
  originalPrice?: number;
  currentPrice?: number;
}

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [] as Product[],
    packs: [] as Pack[],
    promotions: [] as Promotion[],
    loading: false,
    categories: [
      "Cahiers",
      "Écriture",
      "Géométrie",
      "Fournitures",
      "Protège-cahiers",
      "Livres",
      "Stylos",
      "Sacs",
      "Ardoises",
      "Calculatrices",
      "Règles",
      "Crayons",
      "Gommes",
      "Classeurs",
      "Arts plastiques",
      "Écriture & Traçage",
      "Maroquinerie",
      "Accessoires",
    ],
  }),

  getters: {
    // Produits par catégorie
    getProductsByCategory(state) {
      return (category: string): Product[] =>
        state.products.filter(
          (product: Product) => product.category === category
        );
    },

    // Packs par niveau
    getPacksByLevel(state) {
      return (level: string): Pack[] =>
        state.packs.filter((pack: Pack) => pack.level === level);
    },

    // Packs populaires
    popularPacks(state): Pack[] {
      return state.packs.filter((pack: Pack) => pack.isPopular).slice(0, 4);
    },

    // Produits en promotion
    promotionalProducts(state): Product[] {
      const now = new Date();
      return state.products.filter(
        (p) =>
          p.isPromotion &&
          (!p.promotionEndDate || new Date(p.promotionEndDate) > now)
      );
    },

    // Packs en promotion
    promotionalPacks(state): Pack[] {
      return state.packs.filter((pack: Pack) => pack.isPromotion);
    },

    // Promotions actives
    activePromotions(state): Promotion[] {
      const now = new Date();
      return state.promotions.filter(
        (promo: Promotion) => new Date(promo.endDate) > now
      );
    },

    // Recherche de produits
    searchProducts(state) {
      return (query: string): (Product | Pack)[] => {
        const searchTerm = query.toLowerCase();
        const matchingProducts = state.products.filter(
          (product: Product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        const matchingPacks = state.packs.filter(
          (pack: Pack) =>
            pack.name.toLowerCase().includes(searchTerm) ||
            pack.level.toLowerCase().includes(searchTerm)
        );
        return [...matchingProducts, ...matchingPacks];
      };
    },

    // Obtenir un produit par ID
    getProductById(state) {
      return (id: string): Product | undefined => {
        return state.products.find((product: Product) => product.id === id);
      };
    },

    // Obtenir un pack par ID
    getPackById(state) {
      return (id: string): Pack | undefined => {
        return state.packs.find((pack: Pack) => pack.id === id);
      };
    },
  },

  actions: {
    // Initialiser les données de démo
    initializeDemoData() {
      this.packs = (officialPacks as any[]).map((p) => ({
        id: p.id,
        name: p.name,
        level: p.schoolLevel,
        schoolLevel: p.schoolLevel,
        schoolName: p.schoolName,
        price: p.calculatedSellingPrice,
        costPrice: p.calculatedCostPrice,
        sellingPrice: p.calculatedSellingPrice,
        image: p.coverImage,
        coverImage: p.coverImage,
        description: p.description,
        contents: p.items.map((i: any) => `${i.quantity}x ${i.productName}`),
        items: p.items,
        isPopular: true,
        inStock: true,
        isActive: true,
      }));

      let baseProducts = (officialCatalog as any[]).map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        metaTitle: item.metaTitle,
        metaDescription: item.metaDescription,
        keywords: item.keywords,
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice,
        price: item.sellingPrice || item.price || 300,
        category: item.category,
        isActive: item.isActive !== false,
        stock: item.stock ?? 50,
        inStock: item.inStock !== false && (item.stock ?? 50) > 0,
        lowStockThreshold: item.lowStockThreshold ?? 10,
        schoolLevel: item.schoolLevel || "Tous niveaux",
        format: item.format || "Standard",
        unit: item.unit || "Unité",
        image: item.image || "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=500",
        images: [item.image || "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=500"],
        description: item.description || "",
      }));

      // Fusion avec les modifications du Backoffice stockées dans localStorage
      if (process.client) {
        try {
          const savedProds = localStorage.getItem("edushop_custom_products");
          if (savedProds) {
            const parsed: Product[] = JSON.parse(savedProds);
            const map = new Map<string, Product>();
            baseProducts.forEach((p) => map.set(p.id, p));
            parsed.forEach((p) => map.set(p.id, { ...map.get(p.id), ...p }));
            baseProducts = Array.from(map.values());
          }
        } catch (e) {
          console.error("Erreur lecture custom products:", e);
        }
      }

      this.products = baseProducts;

      this.promotions = [
        {
          id: "promo-cahiers",
          title: "10 Cahiers = 4000 CFA",
          description: "10 cahiers grand format au lieu de 5000 CFA",
          discount: 20,
          endDate: new Date("2024-12-31"),
          products: ["cahier-96p"],
          type: "percentage",
        },
        {
          id: "promo-pack-lycee",
          title: "Pack Lycée + Livraison Gratuite",
          description:
            "Achetez le pack lycée et bénéficiez de la livraison gratuite",
          discount: 0,
          endDate: new Date("2024-12-15"),
          products: ["pack-lycee"],
          type: "fixed",
        },
      ];
    },

    // Charger les produits depuis Airtable
    async fetchProducts(): Promise<void> {
      this.loading = true;
      try {
        // Charger les produits depuis l'API Airtable
        const productsResponse = await $fetch("/api/admin/products");
        const packsResponse = await $fetch("/api/admin/packs");
        const promotionsResponse = await $fetch("/api/admin/promotions");

        // Transformer les données Airtable en format attendu
        this.products = productsResponse.map((product: any) => ({
          id: product.id,
          name: product.Name,
          price: product.Price,
          originalPrice: product["Original Price"] || null,
          image:
            product["Image URL"] ||
            "https://placehold.co/600x400/F4ECF7/17202A?text=Produit",
          images: product["Image URL"]
            ? [product["Image URL"]]
            : ["https://placehold.co/600x400/F4ECF7/17202A?text=Produit"],
          category: product.Category,
          description: product.Description || "",
          inStock: product["In Stock"] || true,
          isPromotion:
            product["Original Price"] &&
            product["Original Price"] > product.Price,
          features: product.Features
            ? typeof product.Features === "string"
              ? product.Features.split(", ")
              : product.Features
            : [],
          specs: product.Specs
            ? typeof product.Specs === "string"
              ? product.Specs.split(", ")
              : product.Specs
            : [],
          reviews: [],
          bulkOptions: [],
        }));

        // Transformer les packs Airtable en format attendu
        this.packs = packsResponse.map((pack: any) => ({
          id: pack.id,
          name: pack.Name,
          level: pack.Level,
          price: pack.Price,
          originalPrice: pack["Original Price"] || null,
          image:
            pack["Image URL"] ||
            "https://placehold.co/600x400/F4ECF7/17202A?text=Pack",
          description: pack.Description || "",
          contents: pack.Contents
            ? pack.Contents.split("\n").filter((item: string) => item.trim())
            : [],
          isPopular: pack["Is Popular"] || false,
          inStock: pack["In Stock"] || true,
          isPromotion:
            pack["Original Price"] && pack["Original Price"] > pack.Price,
        }));

        // Transformer les promotions Airtable en format attendu
        this.promotions = promotionsResponse.map((promo: any) => ({
          id: promo.id,
          title: promo.Name,
          description: promo.Description || "",
          discount: promo["Discount %"] || 0,
          endDate: promo["End Date"] || new Date(),
          products: promo.Products ? promo.Products.split(",") : [],
          type: "percentage" as const,
          trending: promo.Trending || false,
        }));

        console.log("✅ Données Airtable chargées:", {
          products: this.products.length,
          packs: this.packs.length,
          promotions: this.promotions.length,
        });
      } catch (error: unknown) {
        console.error(
          "❌ Erreur lors du chargement des données Airtable:",
          error
        );
        // Fallback vers les données de démo en cas d'erreur
        this.initializeDemoData();
      } finally {
        this.loading = false;
      }
    },

    removeProduct(id: string) {
      this.products = this.products.filter((p) => p.id !== id);
    },
    // Calculer le nombre d'articles en promotion
    getPromotionCount(): number {
      return this.products.filter((p) => p.isPromotion).length;
    },
    // Ajouter un produit
    addProduct(product: Product): void {
      this.products.push(product);
      if (process.client) {
        try {
          localStorage.setItem("edushop_custom_products", JSON.stringify(this.products));
        } catch (e) {
          console.error("Erreur enregistrement custom products:", e);
        }
      }
    },

    // Sauvegarder/Mettre à jour un produit et persister dans localStorage
    saveProduct(product: Partial<Product> & { id: string }): void {
      const idx = this.products.findIndex((p: Product) => p.id === product.id);
      if (idx !== -1) {
        this.products[idx] = { ...this.products[idx], ...product };
      } else {
        this.products.push(product as Product);
      }

      if (process.client) {
        try {
          localStorage.setItem("edushop_custom_products", JSON.stringify(this.products));
        } catch (e) {
          console.error("Erreur enregistrement custom products:", e);
        }
      }
    },

    // Ajouter un pack
    addPack(pack: Pack): void {
      this.packs.push(pack);
    },

    // Mettre à jour le stock d'un produit
    updateProductStock(id: string, inStock: boolean): void {
      const product = this.products.find((p: Product) => p.id === id);
      if (product) {
        product.inStock = inStock;
      } else {
        const pack = this.packs.find((p: Pack) => p.id === id);
        if (pack) {
          pack.inStock = inStock;
        }
      }
    },

    // Appliquer une promotion à un produit
    applyPromotionToProduct(
      productId: string,
      discount: number,
      endDate: Date
    ): void {
      const product = this.products.find((p: Product) => p.id === productId);
      if (product) {
        product.originalPrice = product.price;
        product.price = product.price * (1 - discount / 100);
        product.isPromotion = true;
        product.promotionEndDate = endDate;
      }
    },

    // Retirer une promotion d'un produit
    removePromotionFromProduct(productId: string): void {
      const product = this.products.find((p: Product) => p.id === productId);
      if (
        product &&
        product.originalPrice !== null &&
        product.originalPrice !== undefined
      ) {
        product.price = product.originalPrice;
        product.originalPrice = undefined;
        product.isPromotion = false;
        product.promotionEndDate = undefined;
      }
    },

    // Obtenir des recommandations basées sur l'âge/niveau
    getRecommendations(level: string): (Product | Pack)[] {
      // Logique de recommandation basée sur le niveau
      const recommendedPacks = this.packs.filter((pack: Pack) => {
        if (["CP", "CE1", "CE2"].includes(level)) {
          return pack.level === "Primaire" || pack.level === level;
        } else if (["6ème", "5ème", "4ème", "3ème"].includes(level)) {
          return pack.level === "Collège" || pack.level === level;
        } else if (["Seconde", "Première", "Terminale"].includes(level)) {
          return pack.level === "Lycée" || pack.level === level;
        }
        return false;
      });

      // Ajouter des produits complémentaires
      const recommendedProducts = this.products.filter((product: Product) => {
        if (["CP", "CE1", "CE2"].includes(level)) {
          return ["Cahiers", "Stylos", "Crayons"].includes(product.category);
        } else if (level === "Collège") {
          return ["Classeurs", "Feuilles", "Calculatrices"].includes(
            product.category
          );
        } else if (level === "Lycée") {
          return ["Classeurs", "Calculatrices", "Règles"].includes(
            product.category
          );
        }
        return false;
      });

      return [...recommendedPacks, ...recommendedProducts].slice(0, 6);
    },
  },
});
