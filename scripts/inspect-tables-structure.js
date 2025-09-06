// scripts/inspect-tables-structure.js
// Script pour découvrir la structure exacte des tables Airtable
const Airtable = require("airtable");
require("dotenv").config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const PACKS_TABLE = process.env.AIRTABLE_PACKS_TABLE;
const PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE;
const ORDERS_TABLE = process.env.AIRTABLE_ORDERS_TABLE;

async function inspectTable(tableName, tableId) {
  console.log(`\n📋 Inspection de la table ${tableName} (${tableId}):`);

  try {
    // Essayer de créer un enregistrement test pour découvrir les champs
    const testRecord = await base(tableId).create({
      TestField: "test",
    });

    console.log(`   ✅ Table accessible`);
    console.log(`   📝 ID du test: ${testRecord.id}`);

    // Supprimer immédiatement le test
    await base(tableId).destroy(testRecord.id);
    console.log(`   🗑️  Test supprimé`);
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);

    if (error.message.includes("UNKNOWN_FIELD_NAME")) {
      console.log(`   💡 Cette table n'a pas de champ "TestField"`);
      console.log(`   🔍 Essayons de découvrir les champs existants...`);

      // Essayer quelques noms de champs communs
      const commonFields = [
        "Name",
        "Title",
        "Nom",
        "Description",
        "Price",
        "Prix",
        "Level",
        "Niveau",
        "Category",
        "Categorie",
        "In Stock",
        "Stock",
        "Image",
        "Image URL",
      ];

      for (const field of commonFields) {
        try {
          const testRecord = await base(tableId).create({
            [field]: "test",
          });
          console.log(`   ✅ Champ trouvé: "${field}"`);
          await base(tableId).destroy(testRecord.id);
          break;
        } catch (fieldError) {
          // Continue avec le prochain champ
        }
      }
    }
  }
}

async function inspectAllTables() {
  console.log("🔍 Inspection de la structure des tables Airtable...");

  await inspectTable("Packs", PACKS_TABLE);
  await inspectTable("Products", PRODUCTS_TABLE);
  await inspectTable("Orders", ORDERS_TABLE);

  console.log("\n💡 Pour créer les bonnes structures, vous devez :");
  console.log("   1. Aller dans Airtable");
  console.log("   2. Créer les champs nécessaires dans chaque table");
  console.log("   3. Relancer la synchronisation");
}

// Exécuter l'inspection
inspectAllTables().catch(console.error);
