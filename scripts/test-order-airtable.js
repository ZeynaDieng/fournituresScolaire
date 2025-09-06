// scripts/test-order-airtable.js

require("dotenv").config();
const {
  addOrderToAirtable,
  updateOrderStatusInAirtable,
} = require("../utils/airtable-orders.js");

async function testOrderCreation() {
  console.log("🧪 Test de création de commande dans Airtable...");

  // Données de test
  const testOrder = {
    ref: `TEST-${Date.now()}`,
    customer: {
      name: "Jean Dupont",
      email: "jean.dupont@test.com",
      phone: "0123456789",
    },
    shipping: {
      address: "123 Rue de la Paix",
      city: "Paris",
      method: "Standard",
      cost: 5.9,
    },
    items: [
      { name: "Stylo Plume", quantity: 2, price: 12.5 },
      { name: "Cahier Spiral", quantity: 1, price: 3.2 },
    ],
    amounts: {
      subtotal: 28.2,
      shipping: 5.9,
      discount: 0,
      total: 34.1,
    },
    status: "Pending",
  };

  try {
    // Tester la création
    console.log("📝 Création de la commande de test...");
    const result = await addOrderToAirtable(testOrder);
    console.log("✅ Commande créée avec succès:", result.id);
    console.log("   Référence:", testOrder.ref);
    console.log("   Total:", testOrder.amounts.total, "€");

    // Tester la mise à jour du statut (si le champ Status existe)
    try {
      console.log("🔄 Test de mise à jour du statut...");
      await updateOrderStatusInAirtable(testOrder.ref, "Paid");
      console.log("✅ Statut mis à jour avec succès");
    } catch (statusError) {
      console.log(
        "⚠️  Mise à jour du statut échouée (normal si le champ Status n'existe pas encore)"
      );
      console.log("   Message:", statusError.message);
    }

    return result;
  } catch (error) {
    console.error("❌ Erreur lors du test:", error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log("🚀 Démarrage du test des commandes Airtable...\n");

    // Vérifier la configuration
    const requiredVars = [
      "AIRTABLE_API_KEY",
      "AIRTABLE_BASE_ID",
      "AIRTABLE_ORDERS_TABLE",
    ];

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        console.error(`❌ Variable d'environnement manquante: ${varName}`);
        process.exit(1);
      }
    }

    console.log("✅ Configuration Airtable OK\n");

    await testOrderCreation();

    console.log("\n🎉 Test terminé avec succès !");
    console.log(
      "💡 Vérifiez votre table Orders dans Airtable pour voir la commande de test."
    );
  } catch (error) {
    console.error("\n💥 Échec du test:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
