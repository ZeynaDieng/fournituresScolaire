#!/usr/bin/env node

/**
 * Script pour créer automatiquement les champs manquants dans les tables Airtable
 * Ce script utilise une approche alternative pour créer les champs requis
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

// Définir les champs requis pour chaque table
const REQUIRED_FIELDS = {
  products: [
    { name: "id", type: "singleLineText" },
    { name: "name", type: "singleLineText" },
    { name: "description", type: "multilineText" },
    {
      name: "price",
      type: "currency",
      options: { precision: 2, symbol: "CFA" },
    },
    {
      name: "category",
      type: "singleSelect",
      options: {
        choices: [
          { name: "Cahiers" },
          { name: "Stylos" },
          { name: "Crayons" },
          { name: "Fournitures" },
          { name: "Cartables" },
          { name: "Autres" },
        ],
      },
    },
    { name: "image", type: "singleLineText" },
    { name: "inStock", type: "checkbox" },
    { name: "quantity", type: "number", options: { precision: 0 } },
    { name: "featured", type: "checkbox" },
    {
      name: "tags",
      type: "multipleSelects",
      options: {
        choices: [
          { name: "CP" },
          { name: "CE1" },
          { name: "CE2" },
          { name: "CM1" },
          { name: "CM2" },
          { name: "Popular" },
          { name: "New" },
          { name: "Promo" },
        ],
      },
    },
    { name: "sku", type: "singleLineText" },
    { name: "weight", type: "number", options: { precision: 2 } },
    { name: "dimensions", type: "singleLineText" },
    { name: "material", type: "singleLineText" },
    { name: "brand", type: "singleLineText" },
    { name: "color", type: "singleLineText" },
    { name: "createdAt", type: "dateTime" },
    { name: "updatedAt", type: "dateTime" },
  ],
  packs: [
    { name: "id", type: "singleLineText" },
    { name: "name", type: "singleLineText" },
    { name: "description", type: "multilineText" },
    {
      name: "price",
      type: "currency",
      options: { precision: 2, symbol: "CFA" },
    },
    {
      name: "originalPrice",
      type: "currency",
      options: { precision: 2, symbol: "CFA" },
    },
    {
      name: "level",
      type: "singleSelect",
      options: {
        choices: [
          { name: "CP" },
          { name: "CE1" },
          { name: "CE2" },
          { name: "CM1" },
          { name: "CM2" },
          { name: "Tous niveaux" },
        ],
      },
    },
    { name: "image", type: "singleLineText" },
    { name: "inStock", type: "checkbox" },
    { name: "quantity", type: "number", options: { precision: 0 } },
    { name: "featured", type: "checkbox" },
    { name: "discount", type: "number", options: { precision: 0 } },
    { name: "products", type: "multilineText" },
    { name: "totalItems", type: "number", options: { precision: 0 } },
    { name: "createdAt", type: "dateTime" },
    { name: "updatedAt", type: "dateTime" },
  ],
  orders: [
    { name: "id", type: "singleLineText" },
    { name: "customerName", type: "singleLineText" },
    { name: "customerEmail", type: "email" },
    { name: "customerPhone", type: "phoneNumber" },
    { name: "customerAddress", type: "multilineText" },
    {
      name: "total",
      type: "currency",
      options: { precision: 2, symbol: "CFA" },
    },
    {
      name: "status",
      type: "singleSelect",
      options: {
        choices: [
          { name: "pending" },
          { name: "confirmed" },
          { name: "shipped" },
          { name: "delivered" },
          { name: "cancelled" },
        ],
      },
    },
    {
      name: "paymentStatus",
      type: "singleSelect",
      options: {
        choices: [
          { name: "pending" },
          { name: "paid" },
          { name: "failed" },
          { name: "refunded" },
        ],
      },
    },
    {
      name: "paymentMethod",
      type: "singleSelect",
      options: {
        choices: [
          { name: "card" },
          { name: "mobile_money" },
          { name: "bank_transfer" },
          { name: "cash_on_delivery" },
        ],
      },
    },
    { name: "items", type: "multilineText" },
    { name: "shippingAddress", type: "multilineText" },
    { name: "notes", type: "multilineText" },
    { name: "createdAt", type: "dateTime" },
    { name: "updatedAt", type: "dateTime" },
  ],
};

/**
 * Fonction pour créer un champ dans une table Airtable
 * Utilise l'API Metadata pour créer les champs
 */
async function createField(tableId, fieldConfig) {
  const url = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables/${tableId}/fields`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fieldConfig),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `Erreur lors de la création du champ ${fieldConfig.name}: ${error}`
    );
  }

  return await response.json();
}

/**
 * Fonction pour obtenir la structure actuelle d'une table
 */
async function getTableStructure(tableId) {
  const url = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables/${tableId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur lors de la récupération de la structure: ${error}`);
  }

  return await response.json();
}

/**
 * Fonction pour vérifier quels champs existent déjà
 */
async function getExistingFields(tableId) {
  try {
    const structure = await getTableStructure(tableId);
    return structure.fields.map((field) => field.name.toLowerCase());
  } catch (error) {
    console.warn(
      `Impossible de récupérer la structure de la table ${tableId}:`,
      error.message
    );
    return [];
  }
}

/**
 * Fonction pour créer les champs manquants dans une table
 */
async function createMissingFields(tableId, tableName, requiredFields) {
  console.log(`\n🔍 Vérification de la table ${tableName}...`);

  try {
    const existingFields = await getExistingFields(tableId);
    console.log(`📋 Champs existants: ${existingFields.join(", ")}`);

    const missingFields = requiredFields.filter(
      (field) => !existingFields.includes(field.name.toLowerCase())
    );

    if (missingFields.length === 0) {
      console.log(`✅ Tous les champs requis existent déjà dans ${tableName}`);
      return true;
    }

    console.log(
      `📝 Champs manquants à créer: ${missingFields
        .map((f) => f.name)
        .join(", ")}`
    );

    for (const field of missingFields) {
      try {
        console.log(`   ➕ Création du champ "${field.name}"...`);
        await createField(tableId, field);
        console.log(`   ✅ Champ "${field.name}" créé avec succès`);

        // Attendre un peu entre chaque création pour éviter le rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(
          `   ❌ Erreur lors de la création du champ "${field.name}":`,
          error.message
        );

        // Si l'API Metadata n'est pas disponible, afficher des instructions manuelles
        if (
          error.message.includes("404") ||
          error.message.includes("not found")
        ) {
          console.log(
            `\n⚠️  L'API Metadata n'est pas disponible. Création manuelle requise:`
          );
          console.log(`     1. Ouvrez Airtable dans votre navigateur`);
          console.log(`     2. Allez dans la table ${tableName}`);
          console.log(`     3. Cliquez sur "+" pour ajouter un champ`);
          console.log(`     4. Nom: ${field.name}, Type: ${field.type}`);
          if (field.options) {
            console.log(
              `     5. Options: ${JSON.stringify(field.options, null, 8)}`
            );
          }
          return false;
        }
      }
    }

    console.log(`✅ Tous les champs manquants ont été créés dans ${tableName}`);
    return true;
  } catch (error) {
    console.error(
      `❌ Erreur lors du traitement de la table ${tableName}:`,
      error.message
    );
    return false;
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log(
    "🚀 Démarrage de la création automatique des champs Airtable...\n"
  );

  // Vérifier les variables d'environnement
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error("❌ Variables d'environnement Airtable manquantes");
    process.exit(1);
  }

  const tables = [
    {
      id: AIRTABLE_PRODUCTS_TABLE,
      name: "Products",
      fields: REQUIRED_FIELDS.products,
    },
    { id: AIRTABLE_PACKS_TABLE, name: "Packs", fields: REQUIRED_FIELDS.packs },
    {
      id: AIRTABLE_ORDERS_TABLE,
      name: "Orders",
      fields: REQUIRED_FIELDS.orders,
    },
  ];

  let allSuccessful = true;

  for (const table of tables) {
    if (!table.id) {
      console.warn(`⚠️  Table ID manquant pour ${table.name}, ignorée`);
      continue;
    }

    const success = await createMissingFields(
      table.id,
      table.name,
      table.fields
    );
    if (!success) {
      allSuccessful = false;
    }
  }

  console.log("\n" + "=".repeat(60));

  if (allSuccessful) {
    console.log("🎉 Tous les champs ont été créés avec succès!");
    console.log(
      "💡 Vous pouvez maintenant lancer le script de synchronisation complet"
    );
    console.log("   npm run sync:full");
  } else {
    console.log("⚠️  Certains champs n'ont pas pu être créés automatiquement");
    console.log(
      "📖 Consultez le guide AIRTABLE_SETUP_GUIDE.md pour les instructions manuelles"
    );
    console.log(
      '🔍 Lancez "npm run test:airtable-config" pour voir les champs manquants'
    );
  }
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

module.exports = { createMissingFields, REQUIRED_FIELDS };
