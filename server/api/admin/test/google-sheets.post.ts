// /server/api/admin/test/google-sheets.post.ts
import { addOrderToGoogleSheets } from "../../../../utils/google-sheets";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    console.log("📊 Test Google Sheets - Données reçues:", body);

    // Appeler la fonction d'ajout à Google Sheets
    const result = await addOrderToGoogleSheets(body);

    return {
      success: true,
      message: "Commande ajoutée avec succès à Google Sheets",
      result,
    };
  } catch (error) {
    console.error("❌ Erreur test Google Sheets:", error);

    return {
      success: false,
      error: error.message || "Erreur inconnue",
      details: error,
    };
  }
});
