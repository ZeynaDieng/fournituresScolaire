// server/api/airtable/packs.get.ts
// API publique des packs avec vraies données Airtable (token côté serveur)

import { getAirtableBase } from "~/utils/airtable-base";
import { officialPacks } from "~/data/packs-senegal";

const fallbackPacksData: any[] = (officialPacks || []).map((p: any) => ({
  id: p.id,
  name: p.name || p.nom,
  level: p.schoolLevel || p.niveau,
  price: p.calculatedSellingPrice || p.prix_pack || p.price,
  originalPrice: p.targetPrice || p.originalPrice || null,
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
    id: recordId,
    name: airtableRecord.Name || airtableRecord.Title || "",
    level: airtableRecord.Level || airtableRecord["School Level"] || "Tous niveaux",
    price: Number(airtableRecord.Price) || 0,
    originalPrice: airtableRecord["Original Price"]
      ? Number(airtableRecord["Original Price"])
      : null,
    image: airtableRecord["Image URL"] || airtableRecord.Image || "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
    description: airtableRecord.Description || "",
    contents: airtableRecord.Contents
      ? (typeof airtableRecord.Contents === "string"
        ? airtableRecord.Contents.split(", ")
        : airtableRecord.Contents)
      : [],
    isPopular: airtableRecord["Is Popular"] !== false,
    inStock: airtableRecord["In Stock"] !== false,
    isPromotion: Boolean(airtableRecord["Is Promotion"] || airtableRecord["Original Price"]),
    promotionEndDate: airtableRecord["Promotion End Date"]
      ? new Date(airtableRecord["Promotion End Date"])
      : null,
  };
}

export default defineEventHandler(async (event) => {
  try {
    const base = getAirtableBase();
    if (!base) {
      return { success: true, data: fallbackPacksData };
    }

    const records = await base("Packs").select().all();
    const formattedData = records.map((record) =>
      transformAirtableToPublicFormat(record.fields, record.id)
    );

    if (formattedData.length > 0) {
      console.log(`📡 GET /api/airtable/packs -> ${formattedData.length} packs envoyés.`);
      return { success: true, data: formattedData };
    }

    return { success: true, data: fallbackPacksData };
  } catch (error: any) {
    console.warn("Erreur GET /api/airtable/packs:", error.message);
    return { success: true, data: fallbackPacksData };
  }
});
