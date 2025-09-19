#!/usr/bin/env node

// Script pour tester la connexion Airtable

console.log("🔍 Test de la connexion Airtable...\n");

// Charger les variables d'environnement
require("dotenv").config();

console.log("📋 Variables Airtable :");
console.log(
  `   AIRTABLE_API_KEY: ${
    process.env.AIRTABLE_API_KEY ? "✅ Défini" : "❌ Manquant"
  }`
);
console.log(
  `   AIRTABLE_BASE_ID: ${
    process.env.AIRTABLE_BASE_ID ? "✅ Défini" : "❌ Manquant"
  }`
);
console.log(
  `   AIRTABLE_PACKS_TABLE: ${
    process.env.AIRTABLE_PACKS_TABLE ? "✅ Défini" : "❌ Manquant"
  }`
);

if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
  console.log("\n❌ Configuration Airtable incomplète !");
  process.exit(1);
}

// Test de connexion directe à Airtable
async function testAirtableConnection() {
  try {
    console.log("\n🧪 Test de connexion directe à Airtable...");

    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;
    const packsTable = process.env.AIRTABLE_PACKS_TABLE || "Packs";

    const url = `https://api.airtable.com/v0/${baseId}/${packsTable}?maxRecords=3`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Connexion réussie !`);
      console.log(`   📦 Packs trouvés: ${data.records?.length || 0}`);

      if (data.records && data.records.length > 0) {
        console.log("\n📋 Premier pack trouvé :");
        const firstPack = data.records[0];
        console.log(`   ID: ${firstPack.id}`);
        console.log(`   Nom: ${firstPack.fields?.Name || "N/A"}`);
        console.log(`   Prix: ${firstPack.fields?.Price || "N/A"}`);
      }
    } else {
      const errorData = await response.text();
      console.log(`   ❌ Erreur Airtable: ${response.status}`);
      console.log(`   Détails: ${errorData}`);
    }
  } catch (error) {
    console.log(`   ❌ Erreur de connexion: ${error.message}`);
  }
}

// Test de l'API locale
async function testLocalAPI() {
  try {
    console.log("\n🧪 Test de l'API locale...");

    const response = await fetch("http://localhost:3000/api/airtable/packs");
    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ API locale OK`);
      console.log(`   Succès: ${data.success}`);
      console.log(`   Packs: ${data.data?.length || 0}`);
    } else {
      const errorData = await response.text();
      console.log(`   ❌ Erreur API locale: ${response.status}`);
      console.log(`   Détails: ${errorData.substring(0, 200)}...`);
    }
  } catch (error) {
    console.log(`   ❌ Erreur API locale: ${error.message}`);
  }
}

async function main() {
  await testAirtableConnection();
  await testLocalAPI();

  console.log("\n💡 Si les tests échouent :");
  console.log("   1. 🔑 Vérifiez votre token Airtable");
  console.log("   2. 🆔 Vérifiez l'ID de votre base");
  console.log("   3. 📋 Vérifiez le nom de la table Packs");
  console.log("   4. 🔄 Redémarrez le serveur");

  console.log("\n✨ Test terminé !");
}

main().catch(console.error);
