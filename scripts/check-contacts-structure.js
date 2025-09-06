#!/usr/bin/env node

/**
 * Vérifier la structure exacte de la table Contacts
 */

const fetch = require("node-fetch");
require("dotenv").config();

async function checkContactsStructure() {
  console.log("🔍 VÉRIFICATION STRUCTURE TABLE CONTACTS");
  console.log("=".repeat(50));

  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE;

  try {
    // 1. Récupérer quelques enregistrements pour voir la structure
    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${contactsTableId}?maxRecords=3`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!response.ok) {
      console.log("❌ Erreur:", response.status);
      const error = await response.text();
      console.log("Détail:", error);
      return;
    }

    const data = await response.json();
    console.log(`✅ Table Contacts accessible`);
    console.log(`📊 Nombre d'enregistrements: ${data.records?.length || 0}`);

    if (data.records && data.records.length > 0) {
      console.log("\n📋 CHAMPS DISPONIBLES DANS LA TABLE:");
      const firstRecord = data.records[0];
      const fields = Object.keys(firstRecord.fields || {});

      fields.forEach((field, index) => {
        const value = firstRecord.fields[field];
        const type = typeof value;
        console.log(`   ${index + 1}. "${field}" (${type})`);
      });

      console.log("\n📝 EXEMPLE D'ENREGISTREMENT:");
      console.log(JSON.stringify(firstRecord.fields, null, 2));
    } else {
      console.log(
        "\n📋 Table vide, testons la création d'un enregistrement..."
      );
      await testCreateContact();
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
}

async function testCreateContact() {
  console.log("\n🧪 TEST CRÉATION CONTACT...");

  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  const contactsTableId = process.env.AIRTABLE_CONTACTS_TABLE;

  const testData = {
    records: [
      {
        fields: {
          Name: "Test Structure",
          Email: "test@example.com",
          Phone: "123456789",
          Subject: "Test des champs",
          Message: "Test de la structure des champs",
          Status: "New",
        },
      },
    ],
  };

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${contactsTableId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Création réussie!");
      console.log("ID:", result.records[0].id);
    } else {
      console.log("❌ Erreur création:", response.status);
      const error = await response.json();
      console.log("Détail:", JSON.stringify(error, null, 2));
    }
  } catch (error) {
    console.error("❌ Erreur test:", error.message);
  }
}

checkContactsStructure().catch(console.error);
