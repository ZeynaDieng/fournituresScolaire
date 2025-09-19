#!/usr/bin/env node

/**
 * Script pour récupérer les vraies données Airtable avec les bons IDs
 */

const fetch = require("node-fetch");

require('dotenv').config();

const TOKEN = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_ID = process.env.AIRTABLE_PACKS_TABLE;

console.log("🎯 RÉCUPÉRATION DES VRAIES DONNÉES AIRTABLE");
console.log("===========================================");
console.log("");
console.log("📋 Configuration:");
console.log(`   Token: ${TOKEN.substring(0, 20)}...`);
console.log(`   Base ID: ${BASE_ID}`);
console.log(`   Table ID: ${TABLE_ID}`);
console.log("");

async function getRealPacksData() {
  try {
    console.log("🚀 Tentative de connexion...");

    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;
    console.log(`📡 URL: ${url}`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ Erreur de la réponse:");
      console.log(errorText);

      // Suggestions spécifiques selon l'erreur
      if (response.status === 403) {
        console.log("");
        console.log("💡 ERREUR 403 - PERMISSIONS:");
        console.log("   Le token n'a pas les permissions nécessaires");
        console.log("   1. Allez sur https://airtable.com/create/tokens");
        console.log("   2. Créez un nouveau token avec ces permissions:");
        console.log("      ✅ data.records:read");
        console.log("      ✅ data.records:write");
        console.log("      ✅ schema.bases:read");
        console.log("   3. Sélectionnez votre base dans les scopes");
      } else if (response.status === 404) {
        console.log("");
        console.log("💡 ERREUR 404 - RESSOURCE NON TROUVÉE:");
        console.log("   La base ou la table n'existe pas avec ces IDs");
        console.log("   Vérifiez l'URL de votre base Airtable");
      }
      return;
    }

    const data = await response.json();

    console.log("✅ CONNEXION RÉUSSIE !");
    console.log(
      `📦 ${data.records ? data.records.length : 0} pack(s) trouvé(s)`
    );
    console.log("");

    if (data.records && data.records.length > 0) {
      console.log("🎉 VOS PACKS AIRTABLE RÉELS !");
      console.log("=============================");

      data.records.forEach((record, index) => {
        console.log(`\n${index + 1}. 📦 Pack Airtable`);
        console.log(`   🆔 ID: ${record.id}`);
        console.log(`   📊 Champs disponibles:`);

        Object.entries(record.fields).forEach(([field, value]) => {
          if (typeof value === "string" && value.length > 80) {
            console.log(`      ${field}: ${value.substring(0, 80)}...`);
          } else if (Array.isArray(value)) {
            console.log(
              `      ${field}: [${value.length} éléments] ${value
                .slice(0, 2)
                .join(", ")}${value.length > 2 ? "..." : ""}`
            );
          } else {
            console.log(`      ${field}: ${value}`);
          }
        });

        console.log("   " + "─".repeat(60));
      });

      console.log("\n📊 ANALYSE DES CHAMPS DISPONIBLES");
      console.log("=================================");

      const allFields = new Set();
      data.records.forEach((record) => {
        Object.keys(record.fields).forEach((field) => allFields.add(field));
      });

      console.log(`Champs trouvés (${allFields.size}):`);
      Array.from(allFields)
        .sort()
        .forEach((field) => {
          console.log(`  ✓ ${field}`);
        });

      console.log("\n🔄 CONFIGURATION POUR VOTRE .env");
      console.log("================================");
      console.log("Mettez à jour votre fichier .env avec:");
      console.log(`AIRTABLE_API_KEY=${TOKEN}`);
      console.log(`AIRTABLE_BASE_ID=${BASE_ID}`);
      console.log(`AIRTABLE_PACKS_TABLE=${TABLE_ID}`);

      console.log("\n🎯 DONNÉES FORMATÉES POUR L'API");
      console.log("===============================");
      console.log("Voici comment vos données apparaîtraient dans l'API:");
      console.log("");

      const formattedPacks = data.records.map((record) => ({
        id: record.id,
        // Essayer différents noms de champs possibles
        name:
          record.fields.Name ||
          record.fields.Nom ||
          record.fields.name ||
          record.fields.title,
        level:
          record.fields.Level || record.fields.Niveau || record.fields.level,
        price: record.fields.Price || record.fields.Prix || record.fields.price,
        originalPrice:
          record.fields["Original Price"] ||
          record.fields["Prix Original"] ||
          record.fields.originalPrice,
        image:
          record.fields.Image || record.fields.image || record.fields.photo,
        description: record.fields.Description || record.fields.description,
        contents:
          record.fields.Contents ||
          record.fields.Contenu ||
          record.fields.contents,
        isPopular:
          record.fields["Is Popular"] ||
          record.fields["Est Populaire"] ||
          record.fields.isPopular,
        inStock:
          record.fields["In Stock"] ||
          record.fields["En Stock"] ||
          record.fields.inStock,
        isPromotion:
          record.fields["Is Promotion"] ||
          record.fields["Est Promotion"] ||
          record.fields.isPromotion,
        // Garder tous les champs bruts pour référence
        _rawFields: record.fields,
      }));

      console.log(JSON.stringify(formattedPacks, null, 2));
    } else {
      console.log("⚠️ La table existe mais est vide");
      console.log("Ajoutez des données à votre table Airtable");
    }
  } catch (error) {
    console.log("❌ ERREUR lors de la connexion:");
    console.log(`   ${error.message}`);

    if (error.code === "ENOTFOUND") {
      console.log(
        "\n💡 Problème de réseau - vérifiez votre connexion internet"
      );
    }
  }
}

console.log("🏁 Démarrage de la récupération...");
console.log("");

getRealPacksData()
  .then(() => {
    console.log("\n✅ Script terminé !");
  })
  .catch((error) => {
    console.error("\n💥 Erreur générale:", error.message);
  });
