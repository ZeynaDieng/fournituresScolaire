// server/api/airtable/packs/[id].get.ts
// API publique pour récupérer un pack spécifique par ID (token côté serveur)

import { getAirtableBase } from "~/utils/airtable-base";
import { defineEventHandler, getRouterParam, createError } from "h3";

function parsePackContents(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((item: any) => {
        if (typeof item === "string") return item.trim();
        if (item && (item.productName || item.name)) {
          return `${item.quantity || 1}x ${item.productName || item.name}`;
        }
        return String(item).trim();
      })
      .filter(Boolean);
  }
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsePackContents(parsed);
      } catch {}
    }
    return trimmed
      .split(/\s*,\s*|\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function transformAirtableToPublicFormat(
  airtableRecord: any,
  recordId: string
) {
  const localId = airtableRecord["Local ID"] || airtableRecord.Slug || "";
  return {
    id: recordId,
    localId,
    slug: localId || recordId,
    name: airtableRecord.Name || airtableRecord.Title || "",
    level: airtableRecord.Level || airtableRecord["School Level"] || "Tous niveaux",
    price: Number(airtableRecord.Price) || 0,
    originalPrice: airtableRecord["Original Price"]
      ? Number(airtableRecord["Original Price"])
      : null,
    image: airtableRecord["Image URL"] || airtableRecord.Image || "https://i.pinimg.com/736x/06/af/19/06af192e5165b1694ed1d901ccbe991e.jpg",
    description: airtableRecord.Description || "",
    contents: parsePackContents(airtableRecord.Contents),
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
    const packId = getRouterParam(event, "id");

    if (!packId) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID du pack manquant",
      });
    }

    console.log(`📦 API publique pack détail - ID: ${packId}`);

    // 1. Essayer d'abord de récupérer depuis Airtable
    try {
      const base = getAirtableBase();
      const tableName = process.env.AIRTABLE_PACKS_TABLE || "Packs";

      if (base) {
        let record: any = null;

        if (packId.startsWith("rec")) {
          // ID officiel Airtable
          record = await base(tableName).find(packId);
        } else {
          // Local ID ou nom (ex: pack-ce1, pack-cp)
          const records = await base(tableName)
            .select({
              filterByFormula: `OR({Local ID} = '${packId}', RECORD_ID() = '${packId}')`,
              maxRecords: 1,
            })
            .firstPage();

          if (records && records.length > 0) {
            record = records[0];
          }
        }

        if (record) {
          console.log(`✅ Pack ${packId} récupéré depuis Airtable (${record.fields.Name})`);
          const transformedPack = transformAirtableToPublicFormat(
            record.fields,
            record.id
          );
          return {
            success: true,
            data: transformedPack,
            source: "airtable",
          };
        }
      }
    } catch (airtableError: any) {
      console.warn(
        `⚠️ Erreur Airtable pour pack ${packId}, recherche dans fallback:`,
        airtableError.message
      );
    }

    // 2. Recherche dans le cache global ou les packs de fallback
    try {
      const fallbackResponse: any = await $fetch("/api/airtable/packs");

      if (fallbackResponse && fallbackResponse.data && Array.isArray(fallbackResponse.data)) {
        const fallbackPack = fallbackResponse.data.find(
          (pack: any) =>
            pack.id === packId ||
            pack.localId === packId ||
            pack.slug === packId ||
            pack.name?.toLowerCase() === packId.toLowerCase()
        );

        if (fallbackPack) {
          return {
            success: true,
            data: fallbackPack,
            source: "fallback",
          };
        }
      }
    } catch (fallbackError: any) {
      console.warn("⚠️ Échec fallback packs:", fallbackError.message);
    }

    // Si pas trouvé dans le fallback non plus
    throw createError({
      statusCode: 404,
      statusMessage: `Pack avec l'ID ${packId} non trouvé`,
    });
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Erreur interne du serveur",
    });
  }
});
