#!/usr/bin/env node

/**
 * Script pour tester les permissions du token Airtable
 * Usage: node scripts/test-token-permissions.js
 */

require("dotenv").config();

require("dotenv").config();
const NEW_TOKEN = process.env.AIRTABLE_API_KEY;
const BASE_ID = "appNfAqzPEZYgkBvL";
const TABLE_ID = "tbl4JVykOdi6YFvfd";

console.log("🔍 TEST DES PERMISSIONS TOKEN AIRTABLE");
console.log("======================================");
console.log("");

async function testTokenPermissions() {
  const fetch = require("node-fetch");

  console.log("🔧 Configuration de test:");
  console.log(`   Nouveau Token: ${NEW_TOKEN.substring(0, 20)}...`);
  console.log(`   Base ID: ${BASE_ID}`);
  console.log(`   Table ID: ${TABLE_ID}`);
  console.log("");

  // Test 1: Vérifier les bases accessibles
  console.log("1️⃣ TEST: Liste des bases accessibles");
  console.log("=====================================");

  try {
    const response = await fetch("https://api.airtable.com/v0/meta/bases", {
      headers: {
        Authorization: `Bearer ${NEW_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Accès aux métadonnées réussi !");
      console.log(`📋 Bases trouvées: ${data.bases ? data.bases.length : 0}`);

      if (data.bases && data.bases.length > 0) {
        console.log("\n🏢 BASES ACCESSIBLES:");
        data.bases.forEach((base, index) => {
          console.log(`${index + 1}. ${base.name}`);
          console.log(`   ID: ${base.id}`);
          console.log(`   Permission: ${base.permissionLevel}`);

          if (base.id === BASE_ID) {
            console.log("   🎯 ← C'est votre base de fournitures !");
          }
          console.log("");
        });

        const targetBase = data.bases.find((b) => b.id === BASE_ID);
        if (targetBase) {
          console.log(
            `✅ Base trouvée: ${targetBase.name} (${targetBase.permissionLevel})`
          );

          // Test 2: Accès aux tables de cette base
          await testBaseTables(targetBase);
        } else {
          console.log(
            `❌ Base ${BASE_ID} non trouvée dans les bases accessibles`
          );
          console.log("💡 Le token n'a peut-être pas accès à cette base");
        }
      }
    } else {
      const errorText = await response.text();
      console.log("❌ Erreur d'accès aux métadonnées:");
      console.log(errorText);
    }
  } catch (error) {
    console.log("❌ Erreur lors du test:");
    console.log(`   ${error.message}`);
  }

  async function testBaseTables(base) {
    console.log(`\n2️⃣ TEST: Tables de la base "${base.name}"`);
    console.log("=========================================");

    try {
      const response = await fetch(
        `https://api.airtable.com/v0/meta/bases/${base.id}/tables`,
        {
          headers: {
            Authorization: `Bearer ${NEW_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Accès aux tables réussi !");
        console.log(
          `📋 Tables trouvées: ${data.tables ? data.tables.length : 0}`
        );

        if (data.tables && data.tables.length > 0) {
          console.log("\n📊 TABLES DISPONIBLES:");
          data.tables.forEach((table, index) => {
            console.log(`${index + 1}. ${table.name}`);
            console.log(`   ID: ${table.id}`);
            console.log(`   Description: ${table.description || "Aucune"}`);

            if (table.id === TABLE_ID) {
              console.log("   🎯 ← C'est votre table packs !");
            }

            if (table.name.toLowerCase().includes("pack")) {
              console.log("   📦 ← Table liée aux packs");
            }
            console.log("");
          });

          const targetTable = data.tables.find((t) => t.id === TABLE_ID);
          if (targetTable) {
            console.log(`✅ Table packs trouvée: ${targetTable.name}`);

            // Test 3: Lecture des données
            await testTableData(targetTable);
          } else {
            console.log(`❌ Table ${TABLE_ID} non trouvée`);
            console.log("💡 Tables candidates pour les packs:");
            data.tables
              .filter((t) => t.name.toLowerCase().includes("pack"))
              .forEach((t) => console.log(`   - ${t.name} (${t.id})`));
          }
        }
      } else {
        const errorText = await response.text();
        console.log("❌ Erreur d'accès aux tables:");
        console.log(errorText);
      }
    } catch (error) {
      console.log("❌ Erreur lors du test des tables:");
      console.log(`   ${error.message}`);
    }
  }

  async function testTableData(table) {
    console.log(`\n3️⃣ TEST: Données de la table "${table.name}"`);
    console.log("============================================");

    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${BASE_ID}/${table.id}?maxRecords=3`,
        {
          headers: {
            Authorization: `Bearer ${NEW_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Lecture des données réussie !");
        console.log(
          `📦 Enregistrements: ${data.records ? data.records.length : 0}`
        );

        if (data.records && data.records.length > 0) {
          console.log("\n🎉 DONNÉES AIRTABLE RÉELLES !");
          console.log("=============================");

          data.records.forEach((record, index) => {
            console.log(`\n📋 Pack ${index + 1}:`);
            console.log(`   ID: ${record.id}`);
            console.log(`   Champs:`);

            Object.entries(record.fields).forEach(([field, value]) => {
              if (typeof value === "string" && value.length > 50) {
                console.log(`      ${field}: ${value.substring(0, 50)}...`);
              } else {
                console.log(`      ${field}: ${value}`);
              }
            });
          });

          console.log("\n✅ SUCCÈS TOTAL !");
          console.log("Votre token fonctionne parfaitement !");
        } else {
          console.log("⚠️ Table vide - aucun enregistrement");
        }
      } else {
        const errorText = await response.text();
        console.log("❌ Erreur de lecture des données:");
        console.log(errorText);
      }
    } catch (error) {
      console.log("❌ Erreur lors de la lecture:");
      console.log(`   ${error.message}`);
    }
  }
}

console.log("🚀 Démarrage du test complet...");
console.log("");

testTokenPermissions()
  .then(() => {
    console.log("\n🏁 Test terminé !");
  })
  .catch((error) => {
    console.error("\n💥 Erreur générale:", error.message);
  });
