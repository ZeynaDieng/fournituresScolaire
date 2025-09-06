// scripts/inspect-orders-table.js

require("dotenv").config();

async function inspectOrdersTable() {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!baseId || !apiKey || !ordersTableId) {
      console.error("❌ Configuration Airtable manquante");
      return;
    }

    console.log("🔍 Inspection de la table Orders...");
    console.log("Base ID:", baseId);
    console.log("Table ID:", ordersTableId);

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${ordersTableId}?maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Erreur API Airtable:", error);
      return;
    }

    const data = await response.json();

    if (data.records && data.records.length > 0) {
      console.log("\n📋 Champs détectés dans la table Orders:");
      const fields = Object.keys(data.records[0].fields);
      fields.forEach((field, index) => {
        console.log(`   ${index + 1}. ${field}`);
      });

      console.log("\n📊 Premier enregistrement:");
      console.log(JSON.stringify(data.records[0].fields, null, 2));
    } else {
      console.log(
        "📋 Table vide - Récupération de la structure via l'API de métadonnées..."
      );

      // Essayer de récupérer la structure via l'API de base
      const baseResponse = await fetch(
        `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (baseResponse.ok) {
        const baseData = await baseResponse.json();
        const ordersTable = baseData.tables.find((t) => t.id === ordersTableId);

        if (ordersTable) {
          console.log("\n📋 Champs configurés dans la table Orders:");
          ordersTable.fields.forEach((field, index) => {
            console.log(`   ${index + 1}. ${field.name} (${field.type})`);
          });
        }
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'inspection:", error.message);
  }
}

if (require.main === module) {
  inspectOrdersTable();
}
