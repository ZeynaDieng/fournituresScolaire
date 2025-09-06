#!/usr/bin/env node

/**
 * Script intelligent de création progressive des champs Airtable
 * Commence par les champs de base et ajoute progressivement les autres
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
 * Fonction pour obtenir la liste des champs existants
 */
async function getExistingFields(tableId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}?maxRecords=1`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Si pas d'enregistrements, on ne peut pas déterminer les champs
    if (!data.records || data.records.length === 0) {
      return [];
    }

    return Object.keys(data.records[0].fields);
  } catch (error) {
    console.warn(
      `Impossible de récupérer les champs existants: ${error.message}`
    );
    return [];
  }
}

/**
 * Fonction pour créer un enregistrement avec seulement les champs de base
 */
async function createBasicRecord(tableId, basicData) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: basicData,
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
    throw new Error(`Erreur lors de la création: ${error.message}`);
  }
}

/**
 * Fonction pour mettre à jour un enregistrement avec plus de champs
 */
async function updateRecordWithMoreFields(tableId, recordId, additionalData) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}/${recordId}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: additionalData,
        typecast: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
  }
}

/**
 * Supprimer un enregistrement
 */
async function deleteRecord(tableId, recordId) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}/${recordId}`;

  try {
    await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });
  } catch (error) {
    console.warn(`Impossible de supprimer l'enregistrement: ${error.message}`);
  }
}

/**
 * Données progressives pour chaque table
 */
const PROGRESSIVE_DATA = {
  products: {
    basic: {
      Name: "Produit Test", // Utilise le champ Name par défaut d'Airtable
    },
    step1: {
      description: "Description du produit",
      price: 1000,
      category: "Fournitures",
    },
    step2: {
      image: "test.jpg",
      inStock: true,
      quantity: 10,
      featured: false,
    },
    step3: {
      sku: "TEST-001",
      weight: 0.5,
      brand: "Test Brand",
      color: "Bleu",
    },
  },
  packs: {
    basic: {
      Name: "Pack Test",
    },
    step1: {
      description: "Description du pack",
      price: 5000,
      level: "CP",
    },
    step2: {
      image: "pack-test.jpg",
      inStock: true,
      quantity: 5,
      featured: true,
    },
    step3: {
      discount: 15,
      totalItems: 10,
      originalPrice: 6000,
    },
  },
  orders: {
    basic: {
      Name: "Commande Test",
    },
    step1: {
      customerName: "Client Test",
      customerEmail: "test@example.com",
      total: 5000,
    },
    step2: {
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "card",
    },
    step3: {
      customerPhone: "+221701234567",
      customerAddress: "Adresse test",
    },
  },
};

/**
 * Fonction pour créer progressivement les champs d'une table
 */
async function createFieldsProgressively(tableId, tableName, progressiveData) {
  console.log(`\n🔧 Création progressive des champs pour ${tableName}...`);

  let recordId = null;

  try {
    // Étape 1: Créer un enregistrement de base
    console.log(`   📝 Étape 1: Création de l'enregistrement de base...`);
    recordId = await createBasicRecord(tableId, progressiveData.basic);
    console.log(`   ✅ Enregistrement créé avec l'ID: ${recordId}`);

    // Attendre un peu
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Étape 2: Ajouter les champs du step1
    if (progressiveData.step1) {
      console.log(`   📝 Étape 2: Ajout des champs principaux...`);
      await updateRecordWithMoreFields(
        tableId,
        recordId,
        progressiveData.step1
      );
      console.log(`   ✅ Champs principaux ajoutés`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Étape 3: Ajouter les champs du step2
    if (progressiveData.step2) {
      console.log(`   📝 Étape 3: Ajout des champs secondaires...`);
      await updateRecordWithMoreFields(
        tableId,
        recordId,
        progressiveData.step2
      );
      console.log(`   ✅ Champs secondaires ajoutés`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Étape 4: Ajouter les champs du step3
    if (progressiveData.step3) {
      console.log(`   📝 Étape 4: Ajout des champs avancés...`);
      await updateRecordWithMoreFields(
        tableId,
        recordId,
        progressiveData.step3
      );
      console.log(`   ✅ Champs avancés ajoutés`);
    }

    console.log(`   ✅ Tous les champs créés pour ${tableName}`);
    return recordId;
  } catch (error) {
    console.error(
      `   ❌ Erreur lors de la création des champs pour ${tableName}:`,
      error.message
    );

    // Analyser l'erreur
    if (error.message.includes("INVALID_MULTIPLE_CHOICE_OPTIONS")) {
      console.log(
        `   💡 Des champs de sélection doivent être créés manuellement`
      );
    } else if (error.message.includes("UNKNOWN_FIELD_NAME")) {
      console.log(`   💡 Certains champs n'existent pas encore, continuons...`);
    }

    return recordId;
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log("🚀 Création progressive des champs Airtable...\n");

  // Vérifier les variables d'environnement
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error("❌ Variables d'environnement Airtable manquantes");
    process.exit(1);
  }

  const tables = [
    {
      id: AIRTABLE_PRODUCTS_TABLE,
      name: "Products",
      data: PROGRESSIVE_DATA.products,
    },
    { id: AIRTABLE_PACKS_TABLE, name: "Packs", data: PROGRESSIVE_DATA.packs },
    {
      id: AIRTABLE_ORDERS_TABLE,
      name: "Orders",
      data: PROGRESSIVE_DATA.orders,
    },
  ];

  const createdRecords = [];

  for (const table of tables) {
    if (!table.id) {
      console.warn(`⚠️  Table ID manquant pour ${table.name}, ignorée`);
      continue;
    }

    const recordId = await createFieldsProgressively(
      table.id,
      table.name,
      table.data
    );
    if (recordId) {
      createdRecords.push({
        tableId: table.id,
        recordId,
        tableName: table.name,
      });
    }

    // Attendre entre chaque table
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Nettoyer les enregistrements de test
  console.log("\n🧹 Nettoyage des enregistrements de test...");
  for (const record of createdRecords) {
    console.log(
      `   🗑️  Suppression de l'enregistrement de test de ${record.tableName}...`
    );
    await deleteRecord(record.tableId, record.recordId);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Création progressive terminée!");
  console.log("💡 Vérifiez vos tables Airtable dans le navigateur");
  console.log(
    '🔍 Lancez "npm run test:airtable-config" pour voir les champs créés'
  );
  console.log(
    "📖 Consultez le AIRTABLE_SETUP_GUIDE.md pour finaliser la configuration"
  );
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
