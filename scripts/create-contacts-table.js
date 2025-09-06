#!/usr/bin/env node

/**
 * Script pour créer automatiquement la table Contacts dans Airtable
 * et vérifier sa structure
 */

const fetch = require("node-fetch");
require("dotenv").config();

async function createContactsTable() {
  console.log("🔧 CRÉATION AUTOMATIQUE DE LA TABLE CONTACTS");
  console.log("=".repeat(60));

  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;

  if (!airtableApiKey || !airtableBaseId) {
    console.error("❌ Variables d'environnement manquantes:");
    console.error("   - AIRTABLE_API_KEY:", !!airtableApiKey);
    console.error("   - AIRTABLE_BASE_ID:", !!airtableBaseId);
    process.exit(1);
  }

  try {
    // 1. Lister toutes les tables existantes
    console.log("📋 Récupération des tables existantes...");
    const basesResponse = await fetch(
      `https://api.airtable.com/v0/meta/bases/${airtableBaseId}/tables`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!basesResponse.ok) {
      console.error("❌ Erreur récupération des tables:", basesResponse.status);
      const errorData = await basesResponse.text();
      console.error("Détail erreur:", errorData);
      process.exit(1);
    }

    const basesData = await basesResponse.json();
    const tables = basesData.tables || [];

    console.log("📊 Tables existantes dans la base:");
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.name} (ID: ${table.id})`);
    });

    // 2. Vérifier si la table Contacts existe déjà
    const existingContactsTable = tables.find(
      (table) => table.name === "Contacts"
    );

    if (existingContactsTable) {
      console.log("\n✅ La table Contacts existe déjà!");
      console.log(`   ID: ${existingContactsTable.id}`);
      console.log(`   Champs: ${existingContactsTable.fields?.length || 0}`);

      // Vérifier si l'ID dans .env est correct
      const envTableId = process.env.AIRTABLE_CONTACTS_TABLE;
      if (envTableId !== existingContactsTable.id) {
        console.log(`\n⚠️  ID de table incorrect dans .env:`);
        console.log(`   Actuel: ${envTableId}`);
        console.log(`   Correct: ${existingContactsTable.id}`);
        console.log("\n🔧 Mettez à jour votre .env avec:");
        console.log(`AIRTABLE_CONTACTS_TABLE=${existingContactsTable.id}`);
      }

      // Tester l'accès à la table
      await testContactsTable(existingContactsTable.id);
      return;
    }

    console.log("\n❌ La table Contacts n'existe pas.");
    console.log(
      "🚀 Malheureusement, l'API Airtable ne permet pas de créer des tables automatiquement."
    );
    console.log("\n📋 INSTRUCTIONS MANUELLES:");
    console.log("1. Allez sur https://airtable.com");
    console.log(`2. Ouvrez votre base (ID: ${airtableBaseId})`);
    console.log('3. Cliquez sur "Add a table" ou "Ajouter une table"');
    console.log('4. Nommez la table "Contacts"');
    console.log("5. Ajoutez les champs suivants:");

    const requiredFields = [
      { name: "Name", type: "Single line text" },
      { name: "Email", type: "Email" },
      { name: "Phone", type: "Phone number" },
      { name: "Subject", type: "Single line text" },
      { name: "Message", type: "Long text" },
      {
        name: "Status",
        type: "Single select",
        options: ["New", "Processing", "Resolved", "Closed"],
      },
      { name: "Created At", type: "Created time" },
    ];

    requiredFields.forEach((field, index) => {
      console.log(`   ${index + 1}. ${field.name} (${field.type})`);
      if (field.options) {
        console.log(`      Options: ${field.options.join(", ")}`);
      }
    });

    console.log("\n6. Une fois créée, récupérez l'ID de la table");
    console.log("7. Mettez à jour votre .env avec:");
    console.log("   AIRTABLE_CONTACTS_TABLE=tbl[VotreNouvelId]");
  } catch (error) {
    console.error("❌ Erreur lors de la création:", error);
    process.exit(1);
  }
}

async function testContactsTable(tableId) {
  console.log(`\n🧪 Test d'accès à la table Contacts (${tableId})...`);

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${tableId}?maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Accès à la table Contacts: OK");
      console.log(
        `   Nombre d'enregistrements trouvés: ${data.records?.length || 0}`
      );

      if (data.records && data.records.length > 0) {
        const firstRecord = data.records[0];
        console.log(
          "   Champs disponibles:",
          Object.keys(firstRecord.fields || {})
        );
      }
    } else {
      console.log("❌ Erreur d'accès à la table:", response.status);
      const errorData = await response.text();
      console.log("   Détail:", errorData);
    }
  } catch (error) {
    console.error("❌ Erreur de test:", error.message);
  }
}

// Exécution du script
if (require.main === module) {
  createContactsTable().catch(console.error);
}

module.exports = { createContactsTable, testContactsTable };
