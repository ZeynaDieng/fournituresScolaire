// server/api/airtable/products.get.ts
import { AirtableService } from "../../../utils/airtable";

export default defineEventHandler(async (event) => {
  try {
    const products = await AirtableService.getProducts();

    // Transformation des données Airtable vers le format de l'application
    const formattedProducts = products.map((product: any) => {
      // Fonction helper pour parser JSON avec fallback
      const safeJsonParse = (value: any, fallback: any = []) => {
        if (!value) return fallback;
        if (typeof value === "string") {
          try {
            return JSON.parse(value);
          } catch {
            // Si ce n'est pas du JSON valide, traiter comme une chaîne simple
            return value.split(", ").filter(Boolean);
          }
        }
        return value;
      };

      // Parsing des données JSON stockées dans Airtable avec gestion d'erreur
      const features = safeJsonParse(product.Features, []);
      const specs = safeJsonParse(product.Specs, []);
      const reviews = safeJsonParse(product.Reviews, []);
      const bulkOptions = safeJsonParse(product["Bulk Options"], []);

      // Parsing des images multiples
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

    return {
      success: true,
      data: formattedProducts,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des produits",
      data: [],
    };
  }
});
