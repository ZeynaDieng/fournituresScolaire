import { getAirtablePacks } from "~/utils/airtable-admin";

export default defineEventHandler(async (event) => {
  try {
    return await getAirtablePacks();
  } catch (error) {
    console.error("Erreur lors de la récupération des packs:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération des packs",
    });
  }
});
