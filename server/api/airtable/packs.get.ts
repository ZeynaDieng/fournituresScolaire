// server/api/airtable/packs.get.ts
// API publique des packs avec vraies données Airtable (token côté serveur)

import { getAirtableBase } from "~/utils/airtable-base";

import { senegalesePacks } from "~/data/products-senegal";

// Données de fallback au cas où Airtable ne fonctionne pas
const fallbackPacksData: any[] = [
  ...senegalesePacks.primaire.map((p: any, i: number) => ({
    id: `fb-pri-${i}`,
    name: p.name,
    level: p.level,
    price: p.price,
    originalPrice: p.originalPrice,
    image: "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
    description: `Pack complet pour le niveau ${p.level}.`,
    contents: p.contents,
    isPopular: p.isPopular,
    inStock: true,
    isPromotion: !!p.originalPrice,
    promotionEndDate: new Date("2025-12-31"),
  })),
  ...senegalesePacks.college.map((p: any, i: number) => ({
    id: `fb-col-${i}`,
    name: p.name,
    level: p.level,
    price: p.price,
    originalPrice: p.originalPrice,
    image: "https://i.pinimg.com/1200x/1d/c1/de/1dc1de98d4ae9813ed13b1c17dc3043e.jpg",
    description: `Pack complet pour le niveau ${p.level}.`,
    contents: p.contents,
    isPopular: p.isPopular,
    inStock: true,
    isPromotion: !!p.originalPrice,
    promotionEndDate: new Date("2025-12-31"),
  })),
];



function transformAirtableToPublicFormat(
  airtableRecord: any,
  recordId: string
) {
  return {
    id: recordId, // Utiliser l'ID du record Airtable
    name: airtableRecord.Name,
    level: airtableRecord.Level,
    price: Number(airtableRecord.Price) || 0,
    originalPrice: airtableRecord["Original Price"]
      ? Number(airtableRecord["Original Price"])
      : undefined,
    image: airtableRecord["Image URL"] || airtableRecord.Image || "",
    description: airtableRecord.Description || "",
    contents: airtableRecord.Contents
      ? typeof airtableRecord.Contents === "string"
        ? airtableRecord.Contents.split(", ")
        : airtableRecord.Contents
      : [],
    isPopular: airtableRecord["Is Popular"] || false,
    inStock: airtableRecord["In Stock"] !== false,
    isPromotion: airtableRecord["Is Promotion"] || false,
    promotionEndDate: airtableRecord["Promotion End Date"]
      ? new Date(airtableRecord["Promotion End Date"])
      : null,
  };
}

let memoryPacksCache: any = null;

export default defineEventHandler(async (event) => {
  if (memoryPacksCache) {
    return memoryPacksCache;
  }

  try {
    const base = getAirtableBase();
    const records = await base(process.env.AIRTABLE_PACKS_TABLE!)
      .select()
      .all();

    if (records && records.length > 0) {
      const transformedPacks = records.map((record) =>
        transformAirtableToPublicFormat(record.fields, record.id)
      );

      memoryPacksCache = {
        success: true,
        data: transformedPacks,
        source: "airtable",
      };
      return memoryPacksCache;
    }
  } catch (airtableError: any) {
    // En cas d'erreur ou 429 Airtable, utiliser les données de fallback en cache mémoire
    memoryPacksCache = {
      success: true,
      data: fallbackPacksData,
      source: "fallback",
    };
    return memoryPacksCache;
  }

  memoryPacksCache = {
    success: true,
    data: fallbackPacksData,
    source: "fallback",
  };
  return memoryPacksCache;
});
