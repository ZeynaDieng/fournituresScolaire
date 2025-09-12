import { getAirtableProducts } from "~/utils/airtable-admin";

export default defineEventHandler(async (event) => {
  try {
    return await getAirtableProducts();
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération des produits",
    });
  }
});
