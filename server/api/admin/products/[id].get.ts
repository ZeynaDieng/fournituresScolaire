import { getAirtableProductById } from "~/utils/airtable-admin";

export default defineEventHandler(async (event) => {
  try {
    const productId = getRouterParam(event, "id");

    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID du produit requis",
      });
    }

    const product = await getAirtableProductById(productId);

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: "Produit non trouvé",
      });
    }

    return product;
  } catch (error: any) {
    console.error("Erreur lors de la récupération du produit:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur interne du serveur",
    });
  }
});
