// server/api/airtable/products.get.ts
import { AirtableService } from "../../../utils/airtable";
import { officialCatalog } from "../../../data/products-senegal";

export default defineEventHandler(async (event) => {
  try {
    let airtableRecords: any[] = [];
    try {
      airtableRecords = await AirtableService.getProducts();
    } catch (e) {
      console.warn("Airtable fetch failed, using local fallback:", e);
      airtableRecords = [];
    }

    const localFormatted = officialCatalog
      .filter((p: any) => p.isActive !== false)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        keywords: p.keywords,
        price: p.sellingPrice || p.price || 300,
        costPrice: p.costPrice || Math.round((p.sellingPrice || p.price || 300) * 0.65),
        sellingPrice: p.sellingPrice || p.price || 300,
        category: p.category || "Fournitures",
        image: p.image,
        images: [p.image],
        description: p.description || "",
        inStock: p.inStock !== false && (p.stock ?? 50) > 0,
        stock: p.stock ?? 50,
        schoolLevel: p.schoolLevel || "Tous niveaux",
        format: p.format || "Standard",
        unit: p.unit || "Unité",
        isActive: p.isActive !== false,
      }));

    if (!airtableRecords || airtableRecords.length === 0) {
      return {
        success: true,
        data: localFormatted,
      };
    }

    const map = new Map<string, any>();
    localFormatted.forEach((p: any) => map.set(p.id, p));

    airtableRecords.forEach((product: any) => {
      const targetId = product["Local ID"] || product.id;
      const existing = map.get(targetId) || {};

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
        : [product["Image URL"] || existing.image];

      const safeInStock = product["In Stock"] !== false && product["In Stock"] !== "false";

      map.set(targetId, {
        ...existing,
        id: targetId,
        airtableRecordId: product.id,
        name: String(product.Name || existing.name || ""),
        price: Number(product.Price) || existing.price || 300,
        sellingPrice: Number(product.Price) || existing.sellingPrice || 300,
        costPrice: Number(product["Cost Price"]) || existing.costPrice || 200,
        originalPrice: Number(product["Original Price"]) || existing.originalPrice || null,
        category: String(product.Category || existing.category || "Fournitures"),
        image: String(product["Image URL"] || existing.image || ""),
        images: images,
        description: String(product.Description || existing.description || ""),
        inStock: safeInStock,
        isActive: product["Is Active"] !== false && product["Is Active"] !== "false",
        stock: Number(product.Stock) || existing.stock || 50,
        schoolLevel: String(product["School Level"] || existing.schoolLevel || "Tous niveaux"),
        format: String(product.Format || existing.format || "Standard"),
        unit: String(product.Unit || existing.unit || "Unité"),
        isPromotion: Boolean(product["Is Promotion"]),
        promotionEndDate: product["Promotion End Date"] ? new Date(product["Promotion End Date"]) : null,
        features: safeJsonParse(product.Features, existing.features || []),
        specs: safeJsonParse(product.Specs, existing.specs || []),
        reviews: safeJsonParse(product.Reviews, existing.reviews || []),
        bulkOptions: safeJsonParse(product["Bulk Options"], existing.bulkOptions || []),
      });
    });

    const mergedProducts = Array.from(map.values());
    console.log(`📡 [Server Audit] GET /api/airtable/products -> ${mergedProducts.length} produits fusionnés envoyés au client.`);

    return {
      success: true,
      data: mergedProducts,
    };
  } catch (error) {
    console.error("Erreur API Airtable Products:", error);
    return {
      success: true,
      data: officialCatalog.filter((p: any) => p.isActive !== false),
    };
  }
});
