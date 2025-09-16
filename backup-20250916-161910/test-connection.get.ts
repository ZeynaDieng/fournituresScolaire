// server/api/airtable/test-connection.get.ts
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const AIRTABLE_API_KEY = config.airtableApiKey;
    const AIRTABLE_BASE_ID = config.airtableBaseId;

    console.log("🔧 Configuration Airtable:");
    console.log(
      "- API Key:",
      AIRTABLE_API_KEY ? "✅ Configuré" : "❌ Manquant"
    );
    console.log(
      "- Base ID:",
      AIRTABLE_BASE_ID ? "✅ Configuré" : "❌ Manquant"
    );

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return {
        success: false,
        error: "Configuration Airtable manquante",
        config: {
          hasApiKey: !!AIRTABLE_API_KEY,
          hasBaseId: !!AIRTABLE_BASE_ID,
        },
      };
    }

    // Test avec la table Products connue
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Products?maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Erreur Airtable: ${response.status} ${response.statusText}`,
        status: response.status,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Connexion Airtable fonctionnelle",
      config: {
        hasApiKey: !!AIRTABLE_API_KEY,
        hasBaseId: !!AIRTABLE_BASE_ID,
        baseId: AIRTABLE_BASE_ID,
      },
      testResult: {
        productsTable: "✅ Accessible",
        recordCount: data.records?.length || 0,
      },
      availableTables: [
        "Products ✅",
        "Packs ✅",
        "Promotions ❓ (à vérifier)",
        "Testimonials ❓ (à vérifier)",
      ],
    };
  } catch (error: any) {
    console.error("❌ Erreur test connexion:", error);

    return {
      success: false,
      error: error.message,
      suggestion: "Vérifiez votre configuration Airtable dans le .env",
    };
  }
});
