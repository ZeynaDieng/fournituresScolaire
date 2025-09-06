#!/usr/bin/env node
// scripts/inspect-airtable-structure.js
// Script pour inspecter la structure des tables Airtable

const AIRTABLE_API_KEY =
  "patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a";
const AIRTABLE_BASE_ID = "appOtYkVavA4MMMnN";

const TABLES = {
  PRODUCTS: "tblxGbcySHadDtsyn",
  PACKS: "tbl4JVykOdi6YFvfd",
  PROMOTIONS: "tblrUYgl2PgYIEMY5",
  TESTIMONIALS: "tblYjfi1FFk1CCH46",
};

async function inspectTable(tableName, tableId) {
  try {
    console.log(`\n🔍 INSPECTION DE LA TABLE: ${tableName}`);
    console.log(`📋 ID: ${tableId}`);
    console.log("-".repeat(50));

    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}?maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`❌ Erreur ${response.status}: ${response.statusText}`);
      return;
    }

    const data = await response.json();

    if (data.records && data.records.length > 0) {
      console.log("✅ Table accessible avec données");
      console.log(`📊 Nombre d'enregistrements: ${data.records.length}`);
      console.log("\n🏷️  CHAMPS DISPONIBLES:");

      const fields = Object.keys(data.records[0].fields);
      fields.forEach((field, index) => {
        const value = data.records[0].fields[field];
        const type = typeof value;
        console.log(
          `   ${index + 1}. "${field}" (${type}): ${JSON.stringify(
            value
          ).substring(0, 50)}${JSON.stringify(value).length > 50 ? "..." : ""}`
        );
      });
    } else {
      console.log("⚠️  Table accessible mais vide");
      console.log(
        "💡 Conseil: Créez au moins un enregistrement manuel dans Airtable pour voir la structure des champs"
      );
    }
  } catch (error) {
    console.error(
      `💥 Erreur lors de l'inspection de ${tableName}:`,
      error.message
    );
  }
}

async function inspectAllTables() {
  console.log("🔍 INSPECTION DES TABLES AIRTABLE");
  console.log("=".repeat(50));
  console.log(`🗄️  Base ID: ${AIRTABLE_BASE_ID}`);

  for (const [name, id] of Object.entries(TABLES)) {
    await inspectTable(name, id);
  }

  console.log("\n💡 CONSEILS POUR CRÉER LES CHAMPS:");
  console.log("=".repeat(50));
  console.log("📣 PROMOTIONS - Champs suggérés:");
  console.log("   • Title (Single line text)");
  console.log("   • Description (Long text)");
  console.log("   • Discount (Number)");
  console.log("   • Type (Single select: percentage, fixed, bogo)");
  console.log("   • End Date (Date)");
  console.log("   • Category (Single line text)");
  console.log("   • Trending (Checkbox)");
  console.log("   • Featured (Checkbox)");
  console.log("   • Icon (Single line text)");
  console.log("   • Rating (Number)");
  console.log("   • Features (Long text)");
  console.log("   • Original Price (Currency)");
  console.log("   • Current Price (Currency)");
  console.log("   • Is Active (Checkbox)");

  console.log("\n💬 TESTIMONIALS - Champs suggérés:");
  console.log("   • Name (Single line text)");
  console.log("   • Role (Single line text)");
  console.log("   • Avatar_URL (URL)");
  console.log("   • Text (Long text)");
  console.log("   • Rating (Number)");
  console.log("   • Location (Single line text)");
  console.log("   • Is_Active (Checkbox)");
  console.log("   • Order (Number)");
}

// Exécution du script
inspectAllTables().catch(console.error);
