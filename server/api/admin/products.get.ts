import { prisma } from "../../utils/prisma";
import { getAirtableProducts } from "~/utils/airtable-admin";

export default defineEventHandler(async (event) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
    });

    if (products && products.length > 0) {
      const formatted = products.map((p) => ({
        id: p.slug || p.sku || String(p.id),
        name: p.name,
        price: p.sellingPrice || p.price,
        costPrice: p.costPrice || 0,
        category: p.category,
        image: p.image,
        inStock: p.inStock,
        stock: p.stock,
      }));

      return { success: true, data: formatted, total: formatted.length, source: "postgresql" };
    }

    return await getAirtableProducts();
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return await getAirtableProducts();
  }
});
