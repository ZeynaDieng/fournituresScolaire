// server/api/airtable/products.get.ts
import { AirtableService } from "../../../utils/airtable";

let memoryProductsCache: any = null;

export default defineEventHandler(async (event) => {
  if (memoryProductsCache) {
    return memoryProductsCache;
  }

  try {
    const products = await AirtableService.getProducts();

    const formattedProducts = products.map((product: any) => {
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
    memoryProductsCache = {
      success: true,
      data: [],
    };
    return memoryProductsCache;
  }
});
