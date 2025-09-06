// scripts/simple-table-setup.js
// Script simple pour configurer les tables avec des champs de base
const Airtable = require("airtable");
require("dotenv").config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const PACKS_TABLE = process.env.AIRTABLE_PACKS_TABLE;
const PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE;

async function testBasicFields() {
  console.log("🧪 Test des champs de base dans Airtable...");

  // Champs les plus basiques qu'Airtable crée par défaut
  const basicFields = [
    "Name",
    "Notes",
    "Status",
    "Field 1",
    "Field 2",
    "Field 3",
  ];

  for (const field of basicFields) {
    try {
      console.log(`   🔍 Test du champ "${field}" dans Packs...`);
      const record = await base(PACKS_TABLE).create({
        [field]: "test",
      });
      console.log(`   ✅ Champ "${field}" fonctionne ! ID: ${record.id}`);

      // Supprimer immédiatement
      await base(PACKS_TABLE).destroy(record.id);

      // Si ça marche, on a trouvé un champ utilisable
      return field;
    } catch (error) {
      console.log(`   ❌ "${field}" ne fonctionne pas: ${error.message}`);
    }
  }

  return null;
}

async function setupWithBasicField() {
  const workingField = await testBasicFields();

  if (!workingField) {
    console.log("❌ Aucun champ de base ne fonctionne");
    console.log(
      "💡 Vous devez aller dans Airtable et créer manuellement les champs :"
    );
    console.log("   📦 Table Packs: Name, Level, Price, Description, Contents");
    console.log("   🛍️  Table Products: Name, Price, Category, Description");
    return;
  }

  console.log(`\n🎉 Champ de base trouvé: "${workingField}"`);

  // Créer des exemples dans les deux tables
  try {
    const packRecord = await base(PACKS_TABLE).create({
      [workingField]: "Pack Essentiel CP - 16500 CFA - CP",
    });
    console.log(`✅ Pack exemple créé: ${packRecord.id}`);

    const productRecord = await base(PRODUCTS_TABLE).create({
      [workingField]: "Cahier 32 pages - 300 CFA - Cahiers",
    });
    console.log(`✅ Produit exemple créé: ${productRecord.id}`);

    console.log("\n💡 Exemples créés ! Maintenant :");
    console.log("   1. Allez dans Airtable");
    console.log("   2. Ajoutez les champs nécessaires à chaque table");
    console.log("   3. Relancez la synchronisation");

    return { packRecord, productRecord };
  } catch (error) {
    console.error("❌ Erreur lors de la création des exemples:", error);
  }
}

// Exécuter le test
setupWithBasicField().catch(console.error);
