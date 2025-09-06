// server/api/airtable/products.get.ts
import { AirtableService } from "../../../utils/airtable";

export default defineEventHandler(async (event) => {
  try {
    const products = await AirtableService.getProducts();

    // Transformation des données Airtable vers le format de l'application
    const formattedProducts = products.map((product: any) => {
      // Parsing des données JSON stockées dans Airtable
      const features = product.Features ? JSON.parse(product.Features) : [];
      const specs = product.Specs ? JSON.parse(product.Specs) : [];
      const reviews = product.Reviews ? JSON.parse(product.Reviews) : [];
      const bulkOptions = product["Bulk Options"]
        ? JSON.parse(product["Bulk Options"])
        : [];

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
