#!/usr/bin/env node

/**
 * Script pour vérifier la structure des tables Airtable
 */

const AIRTABLE_API_KEY =
  "patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a";
const AIRTABLE_BASE_ID = "appOtYkVavA4MMMnN";
const AIRTABLE_CONTACTS_TABLE = "tblX73JCops5jKevo";

async function checkAirtableTable() {
  console.log("🔍 VÉRIFICATION DE LA TABLE CONTACTS AIRTABLE");
  console.log("=".repeat(50));

  try {
    // Récupérer la structure de la table
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_CONTACTS_TABLE}?maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.log("❌ Erreur API Airtable:", response.status);
      console.log("   Détail:", error);
      return;
    }

    const data = await response.json();
    console.log("✅ Table accessible");
    console.log("📊 Nombre d'enregistrements:", data.records.length);

    if (data.records.length > 0) {
      console.log("\n📋 CHAMPS DISPONIBLES:");
      const firstRecord = data.records[0];
      const fields = Object.keys(firstRecord.fields);
      fields.forEach((field, index) => {
        console.log(`${index + 1}. ${field}`);
      });

      console.log("\n📝 EXEMPLE D'ENREGISTREMENT:");
      console.log(JSON.stringify(firstRecord.fields, null, 2));
    } else {
      console.log("\n📋 Table vide, testons l'ajout d'un enregistrement...");

      // Tester l'ajout d'un contact
      const testContact = {
        records: [
          {
            fields: {
              Name: "Test User",
              Email: "test@example.com",
              Phone: "221777123456",
              Subject: "Test",
              Message: "Test message",
              // Status: "New", // Omis car l'option n'existe pas encore
            },
          },
        ],
      };

      const addResponse = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_CONTACTS_TABLE}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testContact),
        }
      );

      if (addResponse.ok) {
        const result = await addResponse.json();
        console.log("✅ Test d'ajout réussi!");
        console.log("📋 ID créé:", result.records[0].id);
      } else {
        const error = await addResponse.json();
        console.log("❌ Erreur lors de l'ajout:");
        console.log(JSON.stringify(error, null, 2));
      }
    }
  } catch (error) {
    console.error("❌ Erreur réseau:", error.message);
  }
}

checkAirtableTable();
