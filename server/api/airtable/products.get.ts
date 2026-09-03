// server/api/airtable/products.get.ts
import { AirtableService } from "../../../utils/airtable";
import { officialCatalog } from "../../../data/products-senegal";

export default defineEventHandler(async (event) => {
  let airtableRecords: any[] = [];
  try {
    airtableRecords = await AirtableService.getProducts();
  } catch (e) {
    console.warn("Airtable API fetch error, fallback to catalog:", e);
    airtableRecords = [];
  }

  const sourceList = (airtableRecords && airtableRecords.length > 0)
    ? airtableRecords
    : officialCatalog.map(p => ({
        id: p.id,
        Name: p.name,
        Price: p.sellingPrice || p.price,
        Category: p.category,
        Description: p.description,
        "Image URL": p.image,
        "In Stock": p.inStock,
        "Local ID": p.id,
        "Original Price": p.originalPrice
      }));

  const map = new Map<string, any>();

  sourceList.forEach((product: any) => {
    const targetId = (product["Local ID"] && product["Local ID"] !== "undefined")
      ? product["Local ID"]
      : (product.id || product.slug);

    if (!targetId) return;

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
      ? (typeof product.Images === "string" ? product.Images.split(", ").filter(Boolean) : product.Images)
      : [product["Image URL"] || product.image || ""];

    const safeInStock = product["In Stock"] !== false && product["In Stock"] !== "false";

    map.set(targetId, {
      id: targetId,
      airtableRecordId: product.id,
      name: String(product.Name || product.name || ""),
      price: Number(product.Price || product.price || product.sellingPrice) || 0,
      sellingPrice: Number(product.Price || product.price || product.sellingPrice) || 0,
      costPrice: Number(product["Cost Price"] || product.costPrice) || Math.round((Number(product.Price || product.price) || 0) * 0.65),
      originalPrice: Number(product["Original Price"] || product.originalPrice) || null,
      category: String(product.Category || product.category || "Fournitures"),
      image: String(product["Image URL"] || product.image || ""),
      images: images,
      description: String(product.Description || product.description || ""),
      inStock: safeInStock,
      isActive: product["Is Active"] !== false && product["Is Active"] !== "false",
      stock: Number(product.Stock || product.stock) || 50,
      schoolLevel: String(product["School Level"] || product.schoolLevel || "Tous niveaux"),
      format: String(product.Format || product.format || "Standard"),
      unit: String(product.Unit || product.unit || "Unité"),
      isPromotion: Boolean(product["Is Promotion"] || product.isPromotion),
      promotionEndDate: product["Promotion End Date"] ? new Date(product["Promotion End Date"]) : null,
      features: safeJsonParse(product.Features || product.features, []),
      specs: safeJsonParse(product.Specs || product.specs, []),
      reviews: safeJsonParse(product.Reviews || product.reviews, []),
      bulkOptions: safeJsonParse(product["Bulk Options"] || product.bulkOptions, []),
    });
  });

  const products = Array.from(map.values());
  console.log(`📡 GET /api/airtable/products -> ${products.length} produits envoyés.`);

  return {
    success: true,
    data: products,
  };
});
