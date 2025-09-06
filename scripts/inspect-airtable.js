// scripts/inspect-airtable.js
// Script pour inspecter la structure de votre table Airtable

import Airtable from "airtable";
import "dotenv/config";

// Configuration Airtable
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const base = airtable.base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_PACKS_TABLE);

async function inspectTable() {
  console.log("🔍 Inspection de votre table Airtable...");
  console.log(`Base ID: ${process.env.AIRTABLE_BASE_ID}`);
  console.log(`Table: ${process.env.AIRTABLE_PACKS_TABLE}`);

  try {
    // Récupérer les premiers enregistrements pour voir la structure
    const records = await table.select({ maxRecords: 3 }).all();

    if (records.length > 0) {
      console.log("\n📋 Structure détectée:");
      console.log("=====================================");

      const firstRecord = records[0];
      const fields = firstRecord.fields;

      console.log(`Record ID: ${firstRecord.id}`);
      console.log("\n🔑 Colonnes disponibles:");
      Object.keys(fields).forEach((fieldName, index) => {
        const value = fields[fieldName];
        const type = Array.isArray(value) ? "Array" : typeof value;
        console.log(
          `${index + 1}. "${fieldName}" (${type}): ${JSON.stringify(value)}`
        );
      });

      console.log("\n📦 Tous les enregistrements:");
      records.forEach((record, index) => {
        console.log(`\n--- Enregistrement ${index + 1} ---`);
        Object.entries(record.fields).forEach(([key, value]) => {
          console.log(`${key}: ${JSON.stringify(value)}`);
        });
      });
    } else {
      console.log("❗ Aucun enregistrement trouvé dans la table.");
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
}

// Exécuter l'inspection
inspectTable();
