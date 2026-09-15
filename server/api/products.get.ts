/**
 * Endpoint Produits avec PostgreSQL principal et fallback Airtable
 * GET /api/products
 */

import { defineEventHandler, getQuery } from "h3";
import { prisma } from "../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    });

    if (dbProducts && dbProducts.length > 0) {
      const formattedProducts = dbProducts.map((p) => {
        let imagesList = [p.image];
        if (p.images) {
          try {
            imagesList = JSON.parse(p.images);
          } catch {
            imagesList = [p.image];
          }
        }

        return {
          id: p.slug || p.sku || String(p.id),
          name: p.name,
          price: p.sellingPrice || p.price,
          sellingPrice: p.sellingPrice || p.price,
          costPrice: p.costPrice || 0,
          originalPrice: p.originalPrice,
          category: p.category,
          image: p.image,
          images: imagesList,
          description: p.description,
          inStock: p.inStock,
          stock: p.stock,
          schoolLevel: p.schoolLevel,
          format: p.format,
          unit: p.unit,
          isPromotion: p.isPromotion,
        };
      });

      return {
        success: true,
        data: formattedProducts,
        source: "postgresql",
      };
    }
  } catch (err) {
    console.warn("⚠️ Erreur Prisma PostgreSQL, bascule vers Airtable:", err);
  }

  // Fallback de sécurité vers Airtable
  try {
    const baseUrl = event.node.req.headers.host?.includes("localhost")
      ? "http://localhost:3000"
      : `https://${event.node.req.headers.host}`;

    const response = await $fetch(`${baseUrl}/api/airtable/products`);
    return response;
  } catch (error) {
    console.error("Erreur dans /api/products:", error);
    return {
      success: false,
      error: "Service temporairement indisponible",
      data: [],
    };
  }
});
