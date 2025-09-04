// /server/api/admin/test/google-sheets-headers.post.ts
import { createSheetHeaders } from "../../../../utils/google-sheets";

export default defineEventHandler(async (event) => {
  try {
    console.log("📊 Création des en-têtes Google Sheets...");

    // Appeler la fonction de création des en-têtes
    const result = await createSheetHeaders();

    return {
      success: true,
      message: "En-têtes créés avec succès dans Google Sheets",
      result,
    };
  } catch (error) {
    console.error("❌ Erreur création en-têtes:", error);

    return {
      success: false,
      error: error.message || "Erreur inconnue",
      details: error,
    };
  }
});
