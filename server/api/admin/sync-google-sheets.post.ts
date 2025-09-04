// /server/api/admin/sync-google-sheets.post.ts
import { syncExcelToGoogleSheets } from "../../../utils/google-sheets";

export default defineEventHandler(async (event) => {
  try {
    console.log(
      "🔄 Déclenchement synchronisation manuelle Excel → Google Sheets"
    );

    // Lancer la synchronisation
    const result = await syncExcelToGoogleSheets();

    if (result.success) {
      return {
        success: true,
        message: `✅ Synchronisation réussie: ${result.ordersCount} commandes`,
        data: {
          ordersCount: result.ordersCount,
          timestamp: new Date().toISOString(),
        },
      };
    } else {
      return {
        success: false,
        message: `❌ Erreur synchronisation: ${result.error}`,
        error: result.error,
      };
    }
  } catch (error) {
    console.error("❌ Erreur API sync Google Sheets:", error);

    return {
      success: false,
      message: "Erreur lors de la synchronisation",
      error: error.message,
    };
  }
});
