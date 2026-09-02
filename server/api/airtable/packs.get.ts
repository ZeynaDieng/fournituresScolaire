// server/api/airtable/packs.get.ts
// API publique des packs avec vraies données Airtable (token côté serveur)

import { getAirtableBase } from "~/utils/airtable-base";
import { officialPacks } from "~/data/packs-senegal";

// Données de fallback au cas où Airtable ne fonctionne pas
const fallbackPacksData: any[] = (officialPacks || []).map((p: any) => ({
  id: p.id,
  name: p.name || p.nom,
  level: p.schoolLevel || p.niveau,
  price: p.calculatedSellingPrice || p.prix_pack || p.price,
  originalPrice: p.originalPrice || null,
  image: p.coverImage || p.image || "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
  description: p.description || "",
  contents: (p.items || []).map((i: any) => `${i.quantity || i.quantite}x ${i.productName}`),
  isPopular: p.isPopular ?? true,
  inStock: p.inStock ?? true,
  isPromotion: !!p.originalPrice,
  promotionEndDate: new Date("2026-12-31"),
}));

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
    if (!base) {
      console.warn("⚠️ Base Airtable non configurée, utilisation du fallback.");
      return { success: true, data: fallbackPacksData };
    }

    const records = await base("Packs").select().all();
    const formattedData = records.map((record) =>
      transformAirtableToPublicFormat(record.fields, record.id)
    );

    if (formattedData.length > 0) {
      memoryPacksCache = { success: true, data: formattedData };
      return memoryPacksCache;
    }

    return { success: true, data: fallbackPacksData };
  } catch (error: any) {
    console.warn("⚠️ Erreur lors de la récupération Airtable, utilisation du fallback:", error.message);
    return { success: true, data: fallbackPacksData };
  }
});
