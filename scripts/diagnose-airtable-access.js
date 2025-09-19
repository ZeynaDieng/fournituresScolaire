#!/usr/bin/env node

/**
 * Script de diagnostic complet pour Airtable
 * Usage: node scripts/diagnose-airtable-access.js
 */

require("dotenv").config();

console.log("🩺 DIAGNOSTIC AIRTABLE COMPLET");
console.log("==============================");
console.log("");

// Étape 1: Vérifier les credentials
console.log("1️⃣ VÉRIFICATION DES CREDENTIALS");
console.log("===============================");

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const packsTable = process.env.AIRTABLE_PACKS_TABLE;

console.log(`API Key: ${apiKey ? "✅ Présente" : "❌ Manquante"}`);
console.log(`Base ID: ${baseId ? "✅ Présente" : "❌ Manquante"}`);
console.log(`Table ID Packs: ${packsTable ? "✅ Présente" : "❌ Manquante"}`);

if (apiKey) {
  console.log(
    `API Key format: ${
      apiKey.startsWith("pat")
        ? "✅ Format correct (Personal Access Token)"
        : "⚠️ Format ancien ou incorrect"
    }`
  );
  console.log(`API Key longueur: ${apiKey.length} caractères`);
}

if (baseId) {
  console.log(
    `Base ID format: ${
      baseId.startsWith("app") ? "✅ Format correct" : "❌ Format incorrect"
    }`
  );
}

if (packsTable) {
  console.log(
    `Table ID format: ${
      packsTable.startsWith("tbl") ? "✅ Format correct" : "❌ Format incorrect"
    }`
  );
}

console.log("");

// Étape 2: Test de base simple
console.log("2️⃣ TEST DE BASE SIMPLE");
console.log("======================");

async function testBaseAccess() {
  if (!apiKey || !baseId) {
    console.log("❌ Impossible de tester - credentials manquants");
    return false;
  }

  try {
    const fetch = require("node-fetch");

    // Test d'accès à la base (sans spécifier de table)
    const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;

    console.log(`📡 Test d'accès à la base: ${baseId}`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Accès à la base réussi !");
      console.log(
        `📋 Tables trouvées: ${data.tables ? data.tables.length : 0}`
      );

      if (data.tables && data.tables.length > 0) {
        console.log("\n📊 TABLES DISPONIBLES:");
        console.log("======================");

        data.tables.forEach((table, index) => {
          console.log(`${index + 1}. ${table.name}`);
          console.log(`   ID: ${table.id}`);
          console.log(`   Description: ${table.description || "Aucune"}`);
          console.log(
            `   Vue primaire: ${table.primaryFieldId || "Non définie"}`
          );

          // Chercher la table packs
          if (
            table.name.toLowerCase().includes("pack") ||
            table.id === packsTable
          ) {
            console.log("   🎯 ← Cette table pourrait être celle des packs !");
          }

          console.log("");
        });

        // Vérifier si notre table packs existe
        const packsTableExists = data.tables.find((t) => t.id === packsTable);
        if (packsTableExists) {
          console.log(`✅ La table packs (${packsTable}) existe !`);
          console.log(`   Nom: ${packsTableExists.name}`);
          return { success: true, packsTable: packsTableExists };
        } else {
          console.log(
            `❌ La table packs (${packsTable}) n'existe pas dans cette base`
          );
          console.log("💡 Tables candidates pour les packs:");
          data.tables
            .filter((t) => t.name.toLowerCase().includes("pack"))
            .forEach((t) => console.log(`   - ${t.name} (${t.id})`));
        }
      }

      return { success: true, tables: data.tables };
    } else {
      const errorText = await response.text();
      console.log("❌ Erreur d'accès à la base:");
      console.log(errorText);
      return false;
    }
  } catch (error) {
    console.log("❌ Erreur lors du test:");
    console.log(`   ${error.message}`);
    return false;
  }
}

// Étape 3: Suggestions de résolution
function provideSuggestions() {
  console.log("\n3️⃣ SUGGESTIONS DE RÉSOLUTION");
  console.log("=============================");

  console.log("🔧 Actions recommandées:");
  console.log("");

  console.log("1. 🔑 VÉRIFIER LE TOKEN AIRTABLE:");
  console.log("   - Allez sur https://airtable.com/create/tokens");
  console.log("   - Vérifiez que votre token est actif");
  console.log("   - Vérifiez les permissions (lecture sur la base)");
  console.log("");

  console.log("2. 📋 VÉRIFIER LA BASE:");
  console.log("   - Allez sur https://airtable.com/");
  console.log("   - Ouvrez votre base de fournitures scolaires");
  console.log("   - Vérifiez l'URL pour confirmer l'ID de base");
  console.log("");

  console.log("3. 🗂️ VÉRIFIER LES TABLES:");
  console.log("   - Dans votre base, notez les noms exacts des tables");
  console.log("   - Cliquez sur une table et regardez l'URL pour l'ID");
  console.log("");

  console.log("4. 🔄 ALTERNATIVE - UTILISER LES DONNÉES LOCALES:");
  console.log("   - Votre site fonctionne déjà avec les données locales");
  console.log(
    "   - Vous pouvez continuer ainsi en attendant de résoudre Airtable"
  );
  console.log("");

  console.log("5. 📞 SI LE PROBLÈME PERSISTE:");
  console.log("   - Créez un nouveau token avec toutes les permissions");
  console.log("   - Vérifiez que votre compte Airtable est actif");
  console.log("   - Contactez le support Airtable si nécessaire");
}

// Exécution
async function runDiagnosis() {
  const baseTestResult = await testBaseAccess();

  console.log("\n📋 RÉSUMÉ DU DIAGNOSTIC");
  console.log("======================");

  if (baseTestResult && baseTestResult.success) {
    console.log("✅ Connexion à Airtable: OK");
    console.log("✅ Accès à la base: OK");

    if (baseTestResult.packsTable) {
      console.log("✅ Table packs trouvée: OK");
      console.log("\n🎉 TOUT SEMBLE EN ORDRE !");
      console.log(
        "Le problème pourrait être temporaire ou lié aux permissions de la table."
      );
    } else {
      console.log("❌ Table packs: Introuvable");
      console.log("\n🔧 Action requise: Vérifier l'ID de la table packs");
    }
  } else {
    console.log("❌ Connexion à Airtable: ÉCHEC");
    console.log("\n🔧 Action requise: Vérifier les credentials");
  }

  provideSuggestions();
}

runDiagnosis();
