// server/api/airtable/promotions.get.ts
import { prisma } from "../../utils/prisma";

const fallbackPromotionsData = [
  {
    id: "promo-1",
    title: "Pack Rentrée Scolaire",
    description: "Profitez de -20% sur tous les packs scolaires",
    discount: 20,
    type: "percentage",
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    products: [],
    category: "Pack",
    trending: true,
    featured: true,
    icon: "🎒",
    rating: 5,
    features: ["Livraison gratuite", "Garantie qualité", "Pack complet"],
    originalPrice: null,
    currentPrice: null,
    isActive: true,
    createdTime: new Date().toISOString(),
  },
  {
    id: "promo-2",
    title: "Fournitures Premium",
    description: "Réduction sur les fournitures de qualité supérieure",
    discount: 15,
    type: "percentage",
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    products: [],
    category: "Fournitures",
    trending: false,
    featured: false,
    icon: "📚",
    rating: 4,
    features: ["Qualité premium", "Durabilité testée"],
    originalPrice: null,
    currentPrice: null,
    isActive: true,
    createdTime: new Date().toISOString(),
  },
];

export default defineEventHandler(async (event) => {
  try {
    const dbPromotions = await prisma.promotion.findMany();
    if (dbPromotions && dbPromotions.length > 0) {
      const formattedPromos = dbPromotions.map((p) => ({
        id: String(p.id),
        title: p.title,
        description: p.description,
        discount: p.discount,
        type: p.type || "percentage",
        endDate: p.endDate,
        products: p.products ? JSON.parse(p.products) : [],
        category: "Promotion",
        trending: true,
        featured: true,
        icon: "🏷️",
        rating: 5,
        features: ["Offre spéciale"],
        isActive: true,
        createdTime: new Date().toISOString(),
      }));

      return {
        success: true,
        data: formattedPromos,
        total: formattedPromos.length,
        source: "postgresql",
      };
    }
  } catch (err) {
    console.warn("⚠️ Erreur Prisma PostgreSQL promotions:", err);
  }

  // Fallback de sécurité
  return {
    success: true,
    data: fallbackPromotionsData,
    total: fallbackPromotionsData.length,
    fallback: true,
  };
});
