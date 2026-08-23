#!/usr/bin/env node

/**
 * Script pour forcer le test avec les vraies variables d'environnement
 */

// Charger les variables d'environnement depuis .env
require("dotenv").config();

// Vérifier que les variables sont définies
if (
  !process.env.AIRTABLE_API_KEY ||
  !process.env.AIRTABLE_BASE_ID ||
  !process.env.AIRTABLE_PACKS_TABLE
) {
  console.error("❌ Variables d'environnement manquantes dans .env");
  console.log("Assurez-vous que votre .env contient:");
  console.log("AIRTABLE_API_KEY=votre_token");
  console.log("AIRTABLE_BASE_ID=appOtYkVavA4MMMnN");
  console.log("AIRTABLE_PACKS_TABLE=tbl4JVykOdi6YFvfd");
  process.exit(1);
}

console.log("🔄 FORÇAGE DES VARIABLES D'ENVIRONNEMENT");
console.log("=======================================");
console.log(
  `AIRTABLE_API_KEY: ${process.env.AIRTABLE_API_KEY.substring(0, 20)}...`
);
console.log(`AIRTABLE_BASE_ID: ${process.env.AIRTABLE_BASE_ID}`);
console.log(`AIRTABLE_PACKS_TABLE: ${process.env.AIRTABLE_PACKS_TABLE}`);
console.log("");

async function testWithForcedEnv() {
  try {
    // Importer la fonction de base Airtable
    const Airtable = require("airtable");

    console.log("🚀 Test avec variables forcées...");

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_BASE_ID);

    const records = await base(process.env.AIRTABLE_PACKS_TABLE).select().all();

    console.log(`✅ ${records.length} packs récupérés depuis Airtable !`);

    if (records.length > 0) {
      console.log("\n🎉 VOS PACKS AIRTABLE:");
      console.log("=====================");

      records.slice(0, 3).forEach((record, index) => {
        console.log(
          `${index + 1}. ${record.fields.Name} (${record.fields.Level})`
        );
        console.log(`   Prix: ${record.fields.Price} FCFA`);
      });

      if (records.length > 3) {
        console.log(`... et ${records.length - 3} autres packs`);
      }

      console.log("\n💡 SOLUTION:");
      console.log("=============");
      console.log("1. Arrêtez complètement votre serveur Nuxt (Ctrl+C)");
      console.log("2. Vérifiez que votre .env contient les bonnes valeurs");
      console.log("3. Redémarrez avec: npm run dev");
      console.log(
        "4. Ou forcez le redémarrage avec: npm run build && npm run dev"
      );
    } else {
      console.log("⚠️ Aucun pack trouvé");
    }
  } catch (error) {
    console.log("❌ Erreur avec variables forcées:");
    console.log(`   ${error.message}`);

    console.log("\n🔍 DIAGNOSTIC:");
    console.log("===============");
    console.log(
      "Les variables d'environnement sont correctes mais Airtable ne répond pas."
    );
    console.log("Cela peut être dû à:");
    console.log("1. Problème de réseau");
    console.log("2. Token Airtable temporairement invalide");
    console.log("3. Limite de taux d'Airtable atteinte");
  }
}

testWithForcedEnv();
