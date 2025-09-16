#!/usr/bin/env node
// scripts/test-fields-ready.js
// Script pour tester si les champs Airtable sont créés et prêts

const AIRTABLE_API_KEY =
  "patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a";
const AIRTABLE_BASE_ID = "appOtYkVavA4MMMnN";

const TABLES = {
  PROMOTIONS: "tblrUYgl2PgYIEMY5",
  TESTIMONIALS: "tblYjfi1FFk1CCH46",
};

const REQUIRED_FIELDS = {
  PROMOTIONS: [
    "Title",
    "Description",
    "Discount",
    "Type",
    "End Date",
    "Category",
    "Trending",
    "Featured",
    "Icon",
    "Rating",
    "Features",
    "Original Price",
    "Current Price",
    "Is Active",
  ],
  TESTIMONIALS: [
    "Name",
    "Role",
    "Avatar_URL",
    "Text",
    "Rating",
    "Location",
    "Is_Active",
    "Order",
  ],
};

async function testFieldsReady() {
  console.log("🔍 TEST DE PRÉPARATION DES CHAMPS AIRTABLE");
  console.log("=".repeat(50));

  let allReady = true;

  for (const [tableName, tableId] of Object.entries(TABLES)) {
    console.log(`\n📋 Test de la table ${tableName}...`);

    try {
      // Test avec un enregistrement minimal
      const testRecord = {
        records: [
          {
            fields: Object.fromEntries(
              REQUIRED_FIELDS[tableName]
                .slice(0, 3)
                .map((field) => [
                  field,
                  field === "Rating" ||
                  field === "Discount" ||
                  field === "Order"
                    ? 1
                    : field.includes("Active") ||
                      field.includes("Trending") ||
                      field.includes("Featured")
                    ? true
                    : field.includes("Date")
                    ? new Date().toISOString().split("T")[0]
                    : field.includes("Price")
                    ? 1000
                    : `Test ${field}`,
                ])
            ),
          },
        ],
      };

      const response = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testRecord),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ ${tableName} - Champs prêts !`);

        // Supprimer l'enregistrement de test
        const recordId = result.records[0].id;
        await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}/${recordId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
          }
        );
      } else {
        const error = await response.json();
        console.log(`   ❌ ${tableName} - Champs manquants !`);
        if (error.error.type === "UNKNOWN_FIELD_NAME") {
          console.log(
            `   🔧 Champ manquant: ${
              error.error.message.match(/"([^"]+)"/)?.[1] || "N/A"
            }`
          );
        }
        allReady = false;
      }
    } catch (err) {
      console.log(`   ❌ ${tableName} - Erreur: ${err.message}`);
      allReady = false;
    }
  }

  console.log("\n" + "=".repeat(50));

  if (allReady) {
    console.log("🎉 TOUS LES CHAMPS SONT PRÊTS !");
    console.log("\n✨ Prochaines étapes:");
    console.log("1. node scripts/fill-airtable-data.js");
    console.log("2. node scripts/final-audit.js");
    console.log("3. Visitez: http://localhost:3000");
  } else {
    console.log("⚠️  CHAMPS MANQUANTS DÉTECTÉS");
    console.log("\n📖 Instructions:");
    console.log("1. Consultez: cat GUIDE_CREATION_CHAMPS.md");
    console.log("2. Allez sur: https://airtable.com/appOtYkVavA4MMMnN");
    console.log("3. Créez les champs manquants");
    console.log("4. Relancez: node scripts/test-fields-ready.js");
  }
}

testFieldsReady().catch(console.error);
