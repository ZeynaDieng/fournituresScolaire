// /server/api/admin/test/google-sheets-diagnostic.post.ts
import { GOOGLE_SHEETS_CONFIG } from "../../../../utils/google-sheets-config";

export default defineEventHandler(async (event) => {
  try {
    console.log("🔍 Diagnostic Google Sheets...");

    // Vérifier la configuration
    const config = {
      sheetId: GOOGLE_SHEETS_CONFIG.SHEET_ID,
      apiKey: GOOGLE_SHEETS_CONFIG.API_KEY
        ? "Configuré (longueur: " + GOOGLE_SHEETS_CONFIG.API_KEY.length + ")"
        : "Non configuré",
      sheetName: GOOGLE_SHEETS_CONFIG.SHEET_NAME,
    };

    console.log("📊 Configuration:", config);

    // Test simple de l'API Google Sheets - lecture seule
    const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;

    console.log(
      "🌐 URL de test:",
      testUrl.replace(GOOGLE_SHEETS_CONFIG.API_KEY, "***")
    );

    const response = await fetch(testUrl);
    const responseText = await response.text();

    console.log("📡 Réponse HTTP:", response.status, response.statusText);
    console.log("📄 Contenu réponse:", responseText.substring(0, 500));

    if (!response.ok) {
      return {
        success: false,
        error: `Erreur ${response.status}: ${response.statusText}`,
        details: responseText,
        config,
        suggestions: [
          response.status === 401 ? "Vérifiez que l'API Key est valide" : null,
          response.status === 403
            ? "Vérifiez les permissions de l'API Key et que le Sheet est public"
            : null,
          response.status === 404
            ? "Vérifiez que l'ID du Sheet est correct"
            : null,
        ].filter(Boolean),
      };
    }

    const data = JSON.parse(responseText);

    return {
      success: true,
      message: "Configuration Google Sheets valide",
      config,
      sheetInfo: {
        title: data.properties?.title,
        sheetCount: data.sheets?.length,
        sheets: data.sheets?.map((sheet: any) => sheet.properties?.title),
      },
    };
  } catch (error) {
    console.error("❌ Erreur diagnostic:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      config: {
        sheetId: GOOGLE_SHEETS_CONFIG.SHEET_ID,
        apiKey: GOOGLE_SHEETS_CONFIG.API_KEY ? "Configuré" : "Non configuré",
        sheetName: GOOGLE_SHEETS_CONFIG.SHEET_NAME,
      },
    };
  }
});
