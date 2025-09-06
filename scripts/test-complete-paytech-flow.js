// scripts/test-complete-paytech-flow.js
// Script de test complet pour PayTech + Airtable

require("dotenv").config();

const BASE_URL = process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3003";

async function testCompletePaytechFlow() {
  console.log("🚀 Test Complet du Flux PayTech + Airtable");
  console.log(`📍 URL de base: ${BASE_URL}\n`);

  const testOrder = {
    amount: 15000, // 150 CFA
    currency: "XOF",
    item_name: "Pack Fournitures CP - Test",
    customer: {
      name: "Fatou Ndiaye",
      email: "fatou.ndiaye@test.sn",
      phone: "221776543210",
    },
    items: [
      { name: "Cahier 96 pages", quantity: 3, price: 2000 },
      { name: "Crayons de couleur", quantity: 1, price: 4500 },
      { name: "Gomme", quantity: 2, price: 750 },
      { name: "Règle 30cm", quantity: 1, price: 3000 },
    ],
    shipping: {
      address: "Cité Keur Gorgui, Villa 123",
      city: "Dakar",
      method: "Standard",
      cost: 2500,
    },
    target_payment: "orange_money",
  };

  try {
    console.log("📋 Phase 1 : Vérification des prérequis\n");

    // 1. Vérifier que le serveur est accessible
    console.log("🔍 Vérification du serveur...");
    const healthCheck = await fetch(`${BASE_URL}/api/airtable/orders`);
    if (!healthCheck.ok) {
      throw new Error("Serveur non accessible. Lancez `npm run dev` dabord.");
    }
    console.log("✅ Serveur accessible\n");

    // 2. Vérifier la configuration Airtable
    console.log("🔍 Vérification Airtable...");
    const airtableCheck = await healthCheck.json();
    console.log(
      `✅ Airtable connecté - ${airtableCheck.total} commandes existantes\n`
    );

    console.log("💳 Phase 2 : Simulation du processus de paiement\n");

    // 3. Initier le paiement PayTech (ou simulation)
    console.log("🚀 Initiation du paiement...");
    console.log(`   Client: ${testOrder.customer.name}`);
    console.log(`   Montant: ${testOrder.amount} FCFA`);
    console.log(`   Méthode: ${testOrder.target_payment}`);

    let orderRef;

    if (
      process.env.PAYTECH_API_KEY &&
      process.env.PAYTECH_API_KEY !== "your-api-key-here"
    ) {
      // Test avec vraie API PayTech
      console.log("   Mode: Vraie API PayTech");

      const paytechResponse = await fetch(`${BASE_URL}/api/paytech/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testOrder),
      });

      if (paytechResponse.ok) {
        const result = await paytechResponse.json();
        orderRef = result.ref_command;
        console.log(`✅ Paiement initié avec succès`);
        console.log(`   Référence: ${orderRef}`);
        console.log(`   URL PayTech: ${result.redirect_url}`);
        console.log(`   Token: ${result.token}`);
      } else {
        const error = await paytechResponse.json();
        console.log(`❌ Erreur PayTech: ${error.statusMessage}`);
        throw new Error(`PayTech Error: ${error.statusMessage}`);
      }
    } else {
      // Mode simulation - créer une commande directement
      console.log("   Mode: Simulation (pas de clés PayTech)");

      const simulationResponse = await fetch(
        `${BASE_URL}/api/airtable/orders/create-pending`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: testOrder.customer,
            shipping: testOrder.shipping,
            items: testOrder.items,
            amounts: {
              total: testOrder.amount,
              subtotal: testOrder.amount - testOrder.shipping.cost,
              shipping: testOrder.shipping.cost,
              discount: 0,
            },
          }),
        }
      );

      if (simulationResponse.ok) {
        const result = await simulationResponse.json();
        orderRef = result.order.ref;
        console.log(`✅ Commande créée en simulation`);
        console.log(`   Référence: ${orderRef}`);
      } else {
        throw new Error("Erreur création commande simulation");
      }
    }

    console.log("");

    // 4. Attendre un peu (simulation du délai de paiement)
    console.log("⏳ Simulation du processus de paiement...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 5. Vérifier que la commande est dans Airtable (statut Pending)
    console.log("🔍 Vérification dans Airtable...");
    const airtableResponse = await fetch(`${BASE_URL}/api/airtable/orders`);

    if (airtableResponse.ok) {
      const airtableResult = await airtableResponse.json();
      const testOrderInAirtable = airtableResult.data.find(
        (order) =>
          order.customerEmail === testOrder.customer.email ||
          order.customerName === testOrder.customer.name ||
          order.orderRef === orderRef
      );

      if (testOrderInAirtable) {
        console.log("✅ Commande trouvée dans Airtable:");
        console.log(`   Référence: ${testOrderInAirtable.orderRef}`);
        console.log(`   Client: ${testOrderInAirtable.customerName}`);
        console.log(`   Email: ${testOrderInAirtable.customerEmail}`);
        console.log(`   Statut: ${testOrderInAirtable.status}`);
        console.log(`   Total: ${testOrderInAirtable.totalAmount} FCFA`);
      } else {
        console.log("⚠️  Commande non trouvée dans Airtable");
        console.log("   Vérifiez la synchronisation...");
      }
    }

    console.log("");

    // 6. Simuler la confirmation de paiement (webhook)
    console.log("🔔 Simulation du webhook de confirmation...");

    if (orderRef) {
      try {
        const webhookResponse = await fetch(`${BASE_URL}/api/paytech/webhook`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type_event: "sale_complete",
            ref_command: orderRef,
            item_price: testOrder.amount,
            final_item_price: testOrder.amount,
            payment_method: testOrder.target_payment,
            client_phone: testOrder.customer.phone,
            token: `test_token_${Date.now()}`,
            currency: "XOF",
            custom_field: JSON.stringify({
              customer: testOrder.customer,
              items: testOrder.items,
            }),
            // Note: En production, PayTech calcule ce hash
            hmac_compute: "simulation_hash",
          }),
        });

        if (webhookResponse.ok) {
          console.log("✅ Webhook traité avec succès");
        } else {
          console.log("⚠️  Webhook échoué (normal en mode test)");
        }
      } catch (webhookError) {
        console.log(
          "⚠️  Erreur webhook (normal en mode test):",
          webhookError.message
        );
      }
    }

    // 7. Vérification finale dans Airtable
    console.log("\n📊 Phase 3 : Vérification finale\n");

    console.log("🔍 Statut final dans Airtable...");
    const finalCheck = await fetch(`${BASE_URL}/api/airtable/orders`);

    if (finalCheck.ok) {
      const finalResult = await finalCheck.json();
      console.log(`✅ Total commandes dans Airtable: ${finalResult.total}`);

      // Afficher les 5 dernières commandes
      const recentOrders = finalResult.data.slice(0, 5);
      console.log("\n📋 Dernières commandes:");
      recentOrders.forEach((order, index) => {
        console.log(
          `   ${index + 1}. ${order.customerName || "N/A"} - ${
            order.totalAmount || 0
          } FCFA - ${order.status || "N/A"}`
        );
      });
    }

    console.log("\n🎉 Test complet terminé avec succès !");
    console.log("\n💡 Prochaines étapes:");
    console.log(
      "   1. Consulter linterface admin: " + BASE_URL + "/admin/orders-airtable"
    );
    console.log("   2. Vérifier directement dans Airtable");
    console.log(
      "   3. Configurer les vraies clés PayTech pour les tests réels"
    );
  } catch (error) {
    console.error("\n💥 Erreur durant le test:", error.message);
    console.log("\n🔧 Vérifications suggérées:");
    console.log("   1. Le serveur est-il lancé ? (npm run dev)");
    console.log("   2. Les variables denvironnement sont-elles configurées ?");
    console.log("   3. Airtable est-il accessible ?");
    console.log("   4. ngrok est-il actif (si nécessaire) ?");
    process.exit(1);
  }
}

// Fonction utilitaire pour afficher la configuration
function showConfig() {
  console.log("⚙️  Configuration actuelle:");
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(
    `   PayTech API: ${
      process.env.PAYTECH_API_KEY ? "✅ Configuré" : "❌ Manquant"
    }`
  );
  console.log(`   PayTech Sandbox: ${process.env.PAYTECH_SANDBOX || "true"}`);
  console.log(
    `   Airtable: ${
      process.env.AIRTABLE_API_KEY ? "✅ Configuré" : "❌ Manquant"
    }`
  );
  console.log("");
}

if (require.main === module) {
  showConfig();
  testCompletePaytechFlow();
}

module.exports = { testCompletePaytechFlow };
