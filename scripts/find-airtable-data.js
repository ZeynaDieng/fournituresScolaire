#!/usr/bin/env node

/**
 * Script pour essayer de trouver les vraies données Airtable
 * Usage: node scripts/find-airtable-data.js
 */

require('dotenv').config();
const TOKEN = process.env.AIRTABLE_API_KEY;

console.log("🔍 RECHERCHE DES DONNÉES AIRTABLE RÉELLES");
console.log("=========================================");
console.log("");

async function findAirtableData() {
  const fetch = require("node-fetch");

  console.log("🎯 Objectif: Trouver vos vraies données de packs Airtable");
  console.log("");

  // Étape 1: Lister toutes les bases accessibles
  console.log("1️⃣ RECHERCHE DE VOS BASES");
  console.log("=========================");

  try {
    const response = await fetch("https://api.airtable.com/v0/meta/bases", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${data.bases?.length || 0} base(s) trouvée(s)`);

      if (data.bases && data.bases.length > 0) {
        for (const base of data.bases) {
          console.log(`\n📋 Base: ${base.name}`);
          console.log(`   ID: ${base.id}`);
          console.log(`   Permission: ${base.permissionLevel}`);

          // Chercher les tables de cette base
          await searchBaseTables(base);
        }
      } else {
        console.log("❌ Aucune base accessible avec ce token");
        console.log("");
        console.log("💡 VÉRIFICATIONS NÉCESSAIRES:");
        console.log(
          "   1. Le token a-t-il la permission 'schema.bases:read' ?"
        );
        console.log("   2. Le token est-il associé à des bases ?");
        console.log("   3. Votre compte Airtable est-il actif ?");
      }
    } else {
      const errorData = await response.text();
      console.log("❌ Impossible d'accéder aux bases");
      console.log(`Status: ${response.status}`);
      console.log(`Erreur: ${errorData}`);

      console.log("");
      console.log("💡 SOLUTIONS POSSIBLES:");
      console.log(
        "   1. Vérifiez que le token a la permission 'schema.bases:read'"
      );
      console.log("   2. Recréez le token avec TOUTES les permissions");
      console.log(
        "   3. Vérifiez que vous êtes propriétaire/collaborateur de la base"
      );
    }
  } catch (error) {
    console.log("❌ Erreur de connexion:");
    console.log(`   ${error.message}`);
  }

  async function searchBaseTables(base) {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/meta/bases/${base.id}/tables`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`   📊 ${data.tables?.length || 0} table(s)`);

        if (data.tables && data.tables.length > 0) {
          for (const table of data.tables) {
            console.log(`      - ${table.name} (${table.id})`);

            // Si c'est une table qui ressemble aux packs
            if (
              table.name.toLowerCase().includes("pack") ||
              table.name.toLowerCase().includes("produit") ||
              table.name.toLowerCase().includes("fourniture")
            ) {
              console.log(`        🎯 CANDIDAT POUR LES PACKS !`);

              // Essayer de lire quelques enregistrements
              await sampleTableData(base.id, table);
            }
          }
        }
      } else {
        console.log(`   ❌ Impossible d'accéder aux tables`);
      }
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
    }
  }

  async function sampleTableData(baseId, table) {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${baseId}/${table.id}?maxRecords=2`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(
          `        📦 ${data.records?.length || 0} enregistrement(s)`
        );

        if (data.records && data.records.length > 0) {
          console.log(`        🎉 DONNÉES TROUVÉES !`);
          console.log(
            `        📋 Champs: ${Object.keys(data.records[0].fields).join(
              ", "
            )}`
          );

          // Afficher le premier enregistrement
          const firstRecord = data.records[0];
          console.log(`        📝 Exemple:`);
          Object.entries(firstRecord.fields).forEach(([field, value]) => {
            const preview =
              typeof value === "string" && value.length > 30
                ? value.substring(0, 30) + "..."
                : value;
            console.log(`           ${field}: ${preview}`);
          });

          console.log("");
          console.log(`        ✅ CONFIGURATION POUR VOTRE .env:`);
          console.log(`        AIRTABLE_BASE_ID=${baseId}`);
          console.log(`        AIRTABLE_PACKS_TABLE=${table.id}`);
          console.log("");
        }
      } else {
        console.log(`        ❌ Pas d'accès aux données`);
      }
    } catch (error) {
      console.log(`        ❌ Erreur: ${error.message}`);
    }
  }
}

console.log("🚀 Recherche en cours...");
console.log("");

findAirtableData()
  .then(() => {
    console.log("🏁 Recherche terminée !");
    console.log("");
    console.log("💡 Si aucune donnée n'a été trouvée:");
    console.log("   1. Vérifiez les permissions du token");
    console.log("   2. Assurez-vous que les bases existent");
    console.log("   3. Contactez-moi avec l'URL de votre base Airtable");
  })
  .catch((error) => {
    console.error("💥 Erreur:", error.message);
  });
