// server/api/airtable/products.get.ts
import { AirtableService } from "../../../utils/airtable";

export default defineEventHandler(async (event) => {
  const airtableRecords = await AirtableService.getProducts();

  const map = new Map<string, any>();

  airtableRecords.forEach((product: any) => {
    const targetId = (product["Local ID"] && product["Local ID"] !== "undefined")
      ? product["Local ID"]
      : product.id;

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

    const images = product.Images
      ? product.Images.split(", ").filter(Boolean)
      : [product["Image URL"] || ""];

    const safeInStock = product["In Stock"] !== false && product["In Stock"] !== "false";

    map.set(targetId, {
      id: targetId,
      airtableRecordId: product.id,
      name: String(product.Name || ""),
      price: Number(product.Price) || 0,
      sellingPrice: Number(product.Price) || 0,
      costPrice: Number(product["Cost Price"]) || Math.round((Number(product.Price) || 0) * 0.65),
      originalPrice: Number(product["Original Price"]) || null,
      category: String(product.Category || "Fournitures"),
      image: String(product["Image URL"] || ""),
      images: images,
      description: String(product.Description || ""),
      inStock: safeInStock,
      isActive: product["Is Active"] !== false && product["Is Active"] !== "false",
      stock: Number(product.Stock) || 50,
      schoolLevel: String(product["School Level"] || "Tous niveaux"),
      format: String(product.Format || "Standard"),
      unit: String(product.Unit || "Unité"),
      isPromotion: Boolean(product["Is Promotion"]),
      promotionEndDate: product["Promotion End Date"] ? new Date(product["Promotion End Date"]) : null,
      features: safeJsonParse(product.Features, []),
      specs: safeJsonParse(product.Specs, []),
      reviews: safeJsonParse(product.Reviews, []),
      bulkOptions: safeJsonParse(product["Bulk Options"], []),
    });
  });

  const products = Array.from(map.values());
  console.log(`📡 GET /api/airtable/products -> ${products.length} produits Airtable Cloud purs envoyés.`);

  return {
    success: true,
    data: products,
  };
});
