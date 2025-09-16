// scripts/test-airtable-config.js
// Script pour tester que la configuration Airtable est correcte
const Airtable = require("airtable");
require("dotenv").config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const PACKS_TABLE = process.env.AIRTABLE_PACKS_TABLE;
const PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE;
const ORDERS_TABLE = process.env.AIRTABLE_ORDERS_TABLE;

// Champs requis pour chaque table
const REQUIRED_PACK_FIELDS = [
  "Name",
  "Level",
  "Price",
  "Original Price",
  "Image URL",
  "Description",
  "Contents",
  "Is Popular",
  "In Stock",
  "Is Promotion",
  "Promotion End Date",
  "Local ID",
];

const REQUIRED_PRODUCT_FIELDS = [
  "Name",
  "Price",
  "Original Price",
  "Image URL",
  "Category",
  "Description",
  "In Stock",
  "Is Promotion",
  "Promotion End Date",
  "Images",
  "Features",
  "Specs",
  "Reviews",
  "Bulk Options",
  "Local ID",
];

const REQUIRED_ORDER_FIELDS = [
  "Order ID",
  "Customer Name",
  "Customer Email",
  "Customer Phone",
  "Total Amount",
  "Status",
  "Created Date",
  "Items",
  "Shipping Address",
];

async function testTableFields(tableName, tableId, requiredFields) {
  console.log(`\n🧪 Test de la table ${tableName} (${tableId}):`);

  const missingFields = [];
  const workingFields = [];

  for (const field of requiredFields) {
    try {
      const testRecord = await base(tableId).create({
        [field]:
          field === "Price" ||
          field === "Original Price" ||
          field === "Total Amount"
            ? 100
            : field === "Is Popular" ||
              field === "In Stock" ||
              field === "Is Promotion"
            ? true
            : field === "Promotion End Date" || field === "Created Date"
            ? "2024-12-31"
            : "test",
      });

      // Supprimer immédiatement le test
      await base(tableId).destroy(testRecord.id);
      workingFields.push(field);
    } catch (error) {
      missingFields.push(field);
    }
  }

  if (workingFields.length > 0) {
    console.log(
      `   ✅ Champs fonctionnels (${workingFields.length}/${requiredFields.length}):`
    );
    workingFields.forEach((field) => console.log(`      - ${field}`));
  }

  if (missingFields.length > 0) {
    console.log(`   ❌ Champs manquants (${missingFields.length}):`);
    missingFields.forEach((field) => console.log(`      - ${field}`));
  }

  return {
    total: requiredFields.length,
    working: workingFields.length,
    missing: missingFields.length,
    missingFields,
  };
}

async function testAllTables() {
  console.log("🔍 Test de la configuration Airtable...");
  console.log("📋 Vérification des champs requis dans chaque table...");

  const packResults = await testTableFields(
    "Packs",
    PACKS_TABLE,
    REQUIRED_PACK_FIELDS
  );
  const productResults = await testTableFields(
    "Products",
    PRODUCTS_TABLE,
    REQUIRED_PRODUCT_FIELDS
  );
  const orderResults = await testTableFields(
    "Orders",
    ORDERS_TABLE,
    REQUIRED_ORDER_FIELDS
  );

  console.log("\n📊 Résumé de la configuration:");
  console.log(
    `   📦 Packs: ${packResults.working}/${packResults.total} champs`
  );
  console.log(
    `   🛍️  Products: ${productResults.working}/${productResults.total} champs`
  );
  console.log(
    `   📝 Orders: ${orderResults.working}/${orderResults.total} champs`
  );

  const allReady =
    packResults.missing === 0 &&
    productResults.missing === 0 &&
    orderResults.missing === 0;

  if (allReady) {
    console.log("\n🎉 Configuration parfaite ! Toutes les tables sont prêtes.");
    console.log("✅ Vous pouvez maintenant lancer: npm run sync:tables");
  } else {
    console.log("\n⚠️  Configuration incomplète. Actions nécessaires:");

    if (packResults.missing > 0) {
      console.log(`\n📦 Table Packs - Champs à créer:`);
      packResults.missingFields.forEach((field) => {
        const type =
          field === "Price" || field === "Original Price"
            ? "(Number)"
            : field === "Is Popular" ||
              field === "In Stock" ||
              field === "Is Promotion"
            ? "(Checkbox)"
            : field === "Promotion End Date"
            ? "(Date)"
            : field === "Image URL"
            ? "(URL)"
            : field === "Description" || field === "Contents"
            ? "(Long text)"
            : field === "Level"
            ? "(Single select: CP, CE1-CE2, Collège, Lycée)"
            : "(Text)";
        console.log(`   - ${field} ${type}`);
      });
    }

    if (productResults.missing > 0) {
      console.log(`\n🛍️  Table Products - Champs à créer:`);
      productResults.missingFields.forEach((field) => {
        const type =
          field === "Price" || field === "Original Price"
            ? "(Number)"
            : field === "In Stock" || field === "Is Promotion"
            ? "(Checkbox)"
            : field === "Promotion End Date"
            ? "(Date)"
            : field === "Image URL"
            ? "(URL)"
            : field === "Description" ||
              field === "Images" ||
              field === "Features" ||
              field === "Specs" ||
              field === "Reviews" ||
              field === "Bulk Options"
            ? "(Long text)"
            : field === "Category"
            ? "(Single select: Cahiers, Stylos, Crayons, etc.)"
            : "(Text)";
        console.log(`   - ${field} ${type}`);
      });
    }

    if (orderResults.missing > 0) {
      console.log(`\n📝 Table Orders - Champs à créer:`);
      orderResults.missingFields.forEach((field) => {
        const type =
          field === "Total Amount"
            ? "(Number)"
            : field === "Created Date"
            ? "(Date)"
            : field === "Customer Email"
            ? "(Email)"
            : field === "Customer Phone"
            ? "(Phone)"
            : field === "Status"
            ? "(Single select: Pending, Paid, Shipped, Delivered)"
            : field === "Items" || field === "Shipping Address"
            ? "(Long text)"
            : "(Text)";
        console.log(`   - ${field} ${type}`);
      });
    }

    console.log("\n💡 Consultez le guide: AIRTABLE_SETUP_GUIDE.md");
  }

  return allReady;
}

// Exécuter les tests
testAllTables().catch(console.error);
