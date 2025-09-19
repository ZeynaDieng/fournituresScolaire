// server/api/airtable/packs/[id].get.ts
// API publique pour récupérer un pack spécifique par ID (token côté serveur)

import { getAirtableBase } from "~/utils/airtable-base";
import { defineEventHandler, getRouterParam, createError } from "h3";

function transformAirtableToPublicFormat(
  airtableRecord: any,
  recordId: string
) {
  return {
    id: recordId,
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

    // Essayer d'abord de récupérer depuis Airtable
    try {
      const base = getAirtableBase();

      // Récupérer le pack spécifique par ID
      const record = await base(process.env.AIRTABLE_PACKS_TABLE!).find(packId);

      console.log(`✅ Pack ${packId} récupéré depuis Airtable`);

      const transformedPack = transformAirtableToPublicFormat(
        record.fields,
        record.id
      );

      return {
        success: true,
        data: transformedPack,
        source: "airtable",
      };
    } catch (airtableError: any) {
      console.warn(
        `⚠️ Erreur Airtable pour pack ${packId}, recherche dans fallback:`,
        airtableError.message
      );

      // En cas d'erreur Airtable, essayer de trouver dans les données de fallback
      // Importer les données de fallback depuis l'API des packs
      const fallbackResponse = await $fetch("/api/airtable/packs");

      if (fallbackResponse.success && fallbackResponse.data) {
        const fallbackPack = fallbackResponse.data.find(
          (pack: any) => pack.id === packId
        );

        if (fallbackPack) {
          return {
            success: true,
            data: fallbackPack,
            source: "fallback",
            warning: "Données de fallback utilisées - Airtable indisponible",
          };
        }
      }

      // Si pas trouvé dans le fallback non plus
      throw createError({
        statusCode: 404,
        statusMessage: `Pack avec l'ID ${packId} non trouvé`,
      });
    }
  } catch (error: any) {
    console.error(
      `❌ Erreur générale API pack ${getRouterParam(event, "id")}:`,
      error
    );

    if (error.statusCode) {
      throw error; // Re-lancer les erreurs HTTP
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Erreur interne du serveur",
    });
  }
});
