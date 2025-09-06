#!/usr/bin/env node

/**
 * Script pour ajouter les champs manquants spécifiques
 * Basé sur l'analyse de test:airtable-config
 */

const dotenv = require("dotenv");
const path = require("path");

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE;
const AIRTABLE_PACKS_TABLE = process.env.AIRTABLE_PACKS_TABLE;
const AIRTABLE_ORDERS_TABLE = process.env.AIRTABLE_ORDERS_TABLE;

/**
 * Fonction pour créer/mettre à jour un enregistrement avec des champs spécifiques
 */
async function addMissingFieldsToTable(tableId, missingFields) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`;

  try {
    // Créer un enregistrement de test avec les champs manquants
    const testData = {};

    for (const field of missingFields) {
      switch (field.name) {
        case "Name":
          testData[field.name] = "Test Product";
          break;
        case "Image URL":
          testData[field.name] = "https://example.com/image.jpg";
          break;
        case "Images":
          testData[field.name] = JSON.stringify(["image1.jpg", "image2.jpg"]);
          break;
        case "Specs":
          testData[field.name] = JSON.stringify({
            weight: "100g",
            size: "10x5cm",
          });
          break;
        case "Bulk Options":
          testData[field.name] = JSON.stringify([{ qty: 10, price: 900 }]);
          break;
        case "Local ID":
          testData[field.name] = "TEST_001";
          break;
        case "Order ID":
          testData[field.name] = "ORDER_TEST_001";
          break;
        case "Customer Name":
          testData[field.name] = "Client Test";
          break;
        case "Customer Email":
          testData[field.name] = "test@example.com";
          break;
        case "Customer Phone":
          testData[field.name] = "+221701234567";
          break;
        case "Status":
          testData[field.name] = "Pending";
          break;
        case "Created Date":
          testData[field.name] = new Date().toISOString().split("T")[0];
          break;
        case "Items":
          testData[field.name] = JSON.stringify([{ id: "test", quantity: 1 }]);
          break;
        case "Shipping Address":
          testData[field.name] = "Adresse de test, Dakar";
          break;
        default:
          testData[field.name] = "Test value";
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: testData,
        typecast: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const result = await response.json();
    return result.id;
  } catch (error) {
    throw new Error(`Erreur lors de l'ajout des champs: ${error.message}`);
  }
}

/**
 * Supprimer un enregistrement de test
 */
async function deleteTestRecord(tableId, recordId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}/${recordId}`;

  try {
    await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });
  } catch (error) {
    console.warn(
      `Impossible de supprimer l'enregistrement de test: ${error.message}`
    );
  }
}

/**
 * Champs manquants identifiés par le test
 */
const MISSING_FIELDS = {
  packs: [{ name: "Image URL", type: "url" }],
  products: [
    { name: "Name", type: "singleLineText" },
    { name: "Image URL", type: "url" },
    { name: "Images", type: "multilineText" },
    { name: "Specs", type: "multilineText" },
    { name: "Bulk Options", type: "multilineText" },
    { name: "Local ID", type: "singleLineText" },
  ],
  orders: [
    { name: "Order ID", type: "singleLineText" },
    { name: "Customer Name", type: "singleLineText" },
    { name: "Customer Email", type: "email" },
    { name: "Customer Phone", type: "phoneNumber" },
    { name: "Status", type: "singleSelect" },
    { name: "Created Date", type: "date" },
    { name: "Items", type: "multilineText" },
    { name: "Shipping Address", type: "multilineText" },
  ],
};

/**
 * Fonction principale
 */
async function main() {
  console.log("🚀 Ajout des champs manquants spécifiques...\n");

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error("❌ Variables d'environnement Airtable manquantes");
    process.exit(1);
  }

  const tables = [
    { id: AIRTABLE_PACKS_TABLE, name: "Packs", fields: MISSING_FIELDS.packs },
    {
      id: AIRTABLE_PRODUCTS_TABLE,
      name: "Products",
      fields: MISSING_FIELDS.products,
    },
    {
      id: AIRTABLE_ORDERS_TABLE,
      name: "Orders",
      fields: MISSING_FIELDS.orders,
    },
  ];

  const createdRecords = [];

  for (const table of tables) {
    if (!table.id) {
      console.warn(`⚠️  Table ID manquant pour ${table.name}, ignorée`);
      continue;
    }

    if (table.fields.length === 0) {
      console.log(`✅ Aucun champ manquant pour ${table.name}`);
      continue;
    }

    console.log(`\n🔧 Ajout des champs manquants pour ${table.name}...`);
    console.log(
      `   📝 Champs à ajouter: ${table.fields.map((f) => f.name).join(", ")}`
    );

    try {
      const recordId = await addMissingFieldsToTable(table.id, table.fields);
      console.log(`   ✅ Champs ajoutés avec succès (ID: ${recordId})`);

      createdRecords.push({
        tableId: table.id,
        recordId,
        tableName: table.name,
      });

      // Attendre un peu entre chaque table
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(
        `   ❌ Erreur lors de l'ajout des champs pour ${table.name}:`,
        error.message
      );

      if (error.message.includes("UNKNOWN_FIELD_NAME")) {
        console.log(`   💡 Certains champs doivent être créés manuellement`);
      } else if (error.message.includes("INVALID_MULTIPLE_CHOICE_OPTIONS")) {
        console.log(
          `   💡 Les champs de sélection nécessitent une configuration manuelle`
        );
      }
    }
  }

  // Nettoyer les enregistrements de test après un délai
  if (createdRecords.length > 0) {
    console.log(
      "\n⏳ Attente de 5 secondes pour que les champs soient créés..."
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("\n🧹 Nettoyage des enregistrements de test...");
    for (const record of createdRecords) {
      console.log(
        `   🗑️  Suppression de l'enregistrement de test de ${record.tableName}...`
      );
      await deleteTestRecord(record.tableId, record.recordId);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Ajout des champs terminé!");
  console.log("\n📋 Prochaines étapes:");
  console.log("1. Vérifiez vos tables Airtable dans le navigateur");
  console.log(
    '2. Pour les champs "Status" et autres sélections, ajoutez les options manuellement:'
  );
  console.log("   - Status: Pending, Paid, Shipped, Delivered");
  console.log('3. Lancez "npm run test:airtable-config" pour vérifier');
  console.log('4. Si tout est OK, lancez "npm run sync:tables"');
}

// Exécuter le script
if (require.main === module) {
  main().catch(console.error);
}
