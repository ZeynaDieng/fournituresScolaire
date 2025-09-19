// server/api/admin/packs/[id].ts
import { getAirtableBase } from "~/utils/airtable-base";
import { defineEventHandler, createError, getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const packId = getRouterParam(event, "id");

    if (!packId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Pack ID is required",
      });
    }

    const base = getAirtableBase();
    const packsTable = process.env.AIRTABLE_PACKS_TABLE!;

    const records = await base(packsTable)
      .select({
        filterByFormula: `RECORD_ID() = '${packId}'`,
      })
      .firstPage();

    if (!records || records.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `Pack with ID ${packId} not found`,
      });
    }

    const foundPack = records[0].fields;

    return {
      id: records[0].id,
      ...foundPack,
    };
  } catch (error: any) {
    console.error("❌ Erreur lors de la récupération du pack admin:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Erreur lors de la récupération du pack",
    });
  }
});
