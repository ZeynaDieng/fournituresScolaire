// server/api/airtable/products.get.ts
import { AirtableService } from "../../../utils/airtable";
import { officialCatalog } from "../../../data/products-senegal";

export default defineEventHandler(async (event) => {

  try {
    let products: any[] = [];
    try {
      products = await AirtableService.getProducts();
    } catch {
      products = [];
    }

    if (!products || products.length === 0) {
      // Fallback vers le catalogue officiel local
      const formattedLocal = officialCatalog
        .filter((p: any) => p.isActive !== false)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          metaTitle: p.metaTitle,
          metaDescription: p.metaDescription,
          keywords: p.keywords,
          price: p.sellingPrice || p.price || 300,
          category: p.category,
          image: p.image,
          images: [p.image],
          description: p.description,
          inStock: p.inStock !== false && (p.stock ?? 50) > 0,
          schoolLevel: p.schoolLevel || "Tous niveaux",
          format: p.format || "Standard",
          unit: p.unit || "Unité",
        }));

      memoryProductsCache = {
        success: true,
        data: formattedLocal,
      };
      return memoryProductsCache;
    }

    const formattedProducts = (products || []).map((product: any) => {
      const safeJsonParse = (value: any, fallback: any = []) => {
        if (!value) return fallback;
        if (typeof value === "string") {
          try {
            return JSON.parse(value);
          } catch {
            return value.split(", ").filter(Boolean);
          }
        }
        return value;
      };

      const features = safeJsonParse(product.Features, []);
      const specs = safeJsonParse(product.Specs, []);
      const reviews = safeJsonParse(product.Reviews, []);
      const bulkOptions = safeJsonParse(product["Bulk Options"], []);

      const images = product.Images
        ? product.Images.split(", ").filter(Boolean)
        : [product["Image URL"]];

      return {
        id: product.id,
        name: String(product.Name || ""),
        price: product.Price || 0,
        originalPrice: product["Original Price"] || product.Price,
        category: String(product.Category || ""),
        image: String(product["Image URL"] || ""),
        images: images,
        description: String(product.Description || ""),
        inStock: Boolean(product["In Stock"]),
        isPromotion: Boolean(product["Is Promotion"]),
        promotionEndDate: product["Promotion End Date"]
          ? new Date(product["Promotion End Date"])
          : null,
        features: features,
        specs: specs,
        reviews: reviews,
        bulkOptions: bulkOptions,
      };
    });

    memoryProductsCache = {
      success: true,
      data: formattedProducts,
    };

    return memoryProductsCache;
  } catch (error) {
    console.error("Erreur API Airtable Products:", error);
    return {
      success: true,
      data: officialCatalog.filter((p: any) => p.isActive !== false),
    };
  }
});
