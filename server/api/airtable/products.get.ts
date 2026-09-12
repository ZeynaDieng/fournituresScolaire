// server/api/airtable/products.get.ts
import { AirtableService } from "../../../utils/airtable";
import { officialCatalog } from "../../../data/products-senegal";

// Cache serveur en mémoire pour économiser le quota d'API Airtable (1000 requêtes/mois max sur offre gratuite)
let cachedProductsResponse: any = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const forceRefresh = query.refresh === "true";
  const now = Date.now();

  // Si on a des données en cache valides et pas de rafraîchissement forcé, on renvoie immédiatement le cache
  if (!forceRefresh && cachedProductsResponse && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedProductsResponse;
  }

  let airtableRecords: any[] = [];
  let airtableFailed = false;

  try {
    airtableRecords = await AirtableService.getProducts();
    if (!airtableRecords || airtableRecords.length === 0) {
      airtableFailed = true;
    }
  } catch (e) {
    console.warn("⚠️ Airtable API fetch error (quota ou token) :", e);
    airtableFailed = true;
  }

  // Si Airtable échoue (ex: Quota API atteint) et qu'on a déjà du cache en mémoire, on garde le cache !
  if (airtableFailed && cachedProductsResponse) {
    console.warn("⚡ Quota Airtable atteint ou indisponible : Renvoi des produits précédemment mis en cache.");
    return cachedProductsResponse;
  }

  const sourceList = (!airtableFailed && airtableRecords && airtableRecords.length > 0)
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

  const result = {
    success: true,
    data: products,
  };

  // Mettre à jour le cache uniquement si la réponse est valide
  if (products.length > 0) {
    cachedProductsResponse = result;
    lastFetchTime = now;
  }

  return result;
});

