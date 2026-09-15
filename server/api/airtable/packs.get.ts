// server/api/airtable/packs.get.ts
// API publique des packs avec vraies données Airtable (token côté serveur)

import { getAirtableBase } from "~/utils/airtable-base";
import { officialPacks } from "~/data/packs-senegal";
import { prisma } from "~/utils/prisma";

let cachedPacksResponse: any = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15 * 60 * 1000;

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
  const query = getQuery(event);
  const forceRefresh = query.refresh === "true";
  const now = Date.now();

  try {
    const dbPacks = await prisma.pack.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
    });

    if (dbPacks && dbPacks.length > 0) {
      const formattedPacks = dbPacks.map((p) => ({
        id: String(p.id),
        name: p.name,
        level: p.schoolLevel,
        price: p.calculatedSellingPrice || p.targetPrice || 20000,
        originalPrice: p.targetPrice ? p.targetPrice * 1.1 : null,
        image: p.coverImage || "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
        description: p.description || "",
        contents: [],
        isPopular: true,
        inStock: true,
        isPromotion: false,
        promotionEndDate: new Date("2026-12-31"),
      }));

      return { success: true, data: formattedPacks, source: "postgresql" };
    }
  } catch (err) {
    console.warn("⚠️ Erreur PostgreSQL packs, fallback Airtable:", err);
  }

  if (!forceRefresh && cachedPacksResponse && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedPacksResponse;
  }

  try {
    const base = getAirtableBase();
    if (!base) {
      return cachedPacksResponse || { success: true, data: fallbackPacksData };
    }

    const records = await base("Packs").select().all();
    const formattedData = records.map((record) =>
      transformAirtableToPublicFormat(record.fields, record.id)
    );

    if (formattedData.length > 0) {
      console.log(`📡 GET /api/airtable/packs -> ${formattedData.length} packs envoyés.`);
      const response = { success: true, data: formattedData };
      cachedPacksResponse = response;
      lastFetchTime = now;
      return response;
    }

    return cachedPacksResponse || { success: true, data: fallbackPacksData };
  } catch (error: any) {
    console.warn("Erreur GET /api/airtable/packs:", error.message);
    return cachedPacksResponse || { success: true, data: fallbackPacksData };
  }
});

