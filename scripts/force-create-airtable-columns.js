#!/usr/bin/env node

/**
 * Script de création de champs via l'API Web Airtable
 * Utilise une approche alternative pour créer les champs
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
 * Fonction pour créer un enregistrement de test avec tous les champs requis
 * Cela force Airtable à créer les colonnes manquantes
 */
async function createTestRecord(tableId, testData) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: testData,
        typecast: true, // Force la création de colonnes
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Erreur lors de la création de l'enregistrement de test: ${error}`
      );
    }

    const result = await response.json();
    return result.id;
  } catch (error) {
    console.error(
      "Erreur lors de la création de l'enregistrement de test:",
      error.message
    );
    throw error;
  }
}

/**
 * Fonction pour supprimer un enregistrement de test
 */
async function deleteTestRecord(tableId, recordId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}/${recordId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.warn(
        `Attention: impossible de supprimer l'enregistrement de test: ${error}`
      );
    }
  } catch (error) {
    console.warn(
      "Attention: impossible de supprimer l'enregistrement de test:",
      error.message
    );
  }
}

/**
 * Données de test pour forcer la création des colonnes
 */
const TEST_DATA = {
  products: {
    id: "TEST_PRODUCT_001",
    name: "Produit de test",
    description: "Description du produit de test",
    price: 1000,
    category: "Fournitures",
    image: "test-image.jpg",
    inStock: true,
    quantity: 10,
    featured: false,
    tags: ["CP", "Popular"],
    sku: "TEST-SKU-001",
    weight: 0.5,
    dimensions: "10x5x2 cm",
    material: "Plastique",
    brand: "Test Brand",
    color: "Bleu",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  packs: {
    id: "TEST_PACK_001",
    name: "Pack de test",
    description: "Description du pack de test",
    price: 5000,
    originalPrice: 6000,
    level: "CP",
    image: "test-pack.jpg",
    inStock: true,
    quantity: 5,
    featured: true,
    discount: 15,
    products: JSON.stringify(["TEST_PRODUCT_001"]),
    totalItems: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  orders: {
    id: "TEST_ORDER_001",
    customerName: "Client Test",
    customerEmail: "test@example.com",
    customerPhone: "+221701234567",
    customerAddress: "Adresse de test\nDakar, Sénégal",
    total: 5000,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "card",
    items: JSON.stringify([{ id: "TEST_PACK_001", quantity: 1, price: 5000 }]),
    shippingAddress: "Adresse de livraison de test",
    notes: "Notes de test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

/**
 * Fonction pour forcer la création des colonnes dans une table
 */
async function forceCreateColumns(tableId, tableName, testData) {
  console.log(`\n🔧 Traitement de la table ${tableName}...`);

  try {
    // Créer un enregistrement de test avec tous les champs
    console.log(
      `   📝 Création d'un enregistrement de test pour forcer les colonnes...`
    );
    const recordId = await createTestRecord(tableId, testData);

    console.log(`   ✅ Enregistrement de test créé avec l'ID: ${recordId}`);

    // Attendre un peu pour que les colonnes soient créées
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Supprimer l'enregistrement de test
    console.log(`   🗑️  Suppression de l'enregistrement de test...`);
    await deleteTestRecord(tableId, recordId);

    console.log(`   ✅ Colonnes créées avec succès dans ${tableName}`);
    return true;
  } catch (error) {
    console.error(
      `   ❌ Erreur lors du traitement de ${tableName}:`,
      error.message
    );

    // Analyser l'erreur pour donner des conseils
    if (error.message.includes("Invalid permissions")) {
      console.log(
        `   💡 Vérifiez que votre token API a les permissions d'écriture`
      );
    } else if (error.message.includes("INVALID_MULTIPLE_CHOICE_OPTIONS")) {
      console.log(
        `   💡 Certains champs de sélection doivent être créés manuellement`
      );
    } else if (error.message.includes("Table not found")) {
      console.log(
        `   💡 Vérifiez que l'ID de la table ${tableName} est correct`
      );
    }

    return false;
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log(
    "🚀 Création des colonnes Airtable via enregistrements de test...\n"
  );

  // Vérifier les variables d'environnement
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error("❌ Variables d'environnement Airtable manquantes");
    process.exit(1);
  }

  const tables = [
    { id: AIRTABLE_PRODUCTS_TABLE, name: "Products", data: TEST_DATA.products },
    { id: AIRTABLE_PACKS_TABLE, name: "Packs", data: TEST_DATA.packs },
    { id: AIRTABLE_ORDERS_TABLE, name: "Orders", data: TEST_DATA.orders },
  ];

  let allSuccessful = true;

  for (const table of tables) {
    if (!table.id) {
      console.warn(`⚠️  Table ID manquant pour ${table.name}, ignorée`);
      continue;
    }

    const success = await forceCreateColumns(table.id, table.name, table.data);
    if (!success) {
      allSuccessful = false;
    }

    // Attendre entre chaque table pour éviter le rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n" + "=".repeat(60));

  if (allSuccessful) {
    console.log("🎉 Toutes les colonnes ont été créées avec succès!");
    console.log("💡 Vous pouvez maintenant lancer la synchronisation complète");
    console.log("   npm run sync:tables");
  } else {
    console.log(
      "⚠️  Certaines colonnes n'ont pas pu être créées automatiquement"
    );
    console.log(
      "📖 Consultez le guide AIRTABLE_SETUP_GUIDE.md pour les instructions manuelles"
    );
    console.log(
      '🔍 Lancez "npm run test:airtable-config" pour voir les champs manquants'
    );
  }

  console.log("\n📋 Prochaines étapes recommandées:");
  console.log("1. Vérifiez vos tables Airtable dans le navigateur");
  console.log("2. Ajustez manuellement les types de champs si nécessaire");
  console.log('3. Lancez "npm run test:airtable-config" pour vérifier');
  console.log('4. Lancez "npm run sync:tables" pour synchroniser vos données');
}

// Gestion des erreurs globales
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Erreur non gérée:", reason);
  process.exit(1);
});

// Exécuter le script
if (require.main === module) {
  main().catch(console.error);
}
