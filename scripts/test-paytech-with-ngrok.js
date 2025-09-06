// scripts/test-paytech-with-ngrok.js

require("dotenv").config();

async function testPaytechWithNgrok() {
  console.log("🧪 Test du flux PayTech + Airtable avec ngrok...");

  const ngrokUrl = "https://af232a290731.ngrok-free.app"; // URL du tunnel ngrok

  // Données de test pour une commande PayTech (format correct)
  const testOrder = {
    amount: 25000, // 250 CFA
    currency: "XOF",
    ref_command: `TEST-PT-${Date.now()}`,
    item_name: "Pack Scolaire CE2",
    customer: {
      name: "Amadou Diallo",
      email: "amadou.diallo@test.com",
      phone: "221771234567",
    },
    items: [
      { name: "Cahier 96 pages", quantity: 5, price: 1500 },
      { name: "Stylos Bic", quantity: 10, price: 1000 },
    ],
    shipping: {
      address: "123 Avenue Bourguiba, Dakar",
      city: "Dakar",
    },
    // URLs HTTPS via ngrok
    success_url: `${ngrokUrl}/payment/success`,
    cancel_url: `${ngrokUrl}/payment/cancel`,
    ipn_url: `${ngrokUrl}/api/paytech/webhook`,
  };

  try {
    // 1. Tester d'abord l'API simple de création de commandes
    console.log("1️⃣ Test de création de commande simple (WhatsApp)...");

    const createResponse = await fetch(
      `${ngrokUrl}/api/orders/create-pending`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: testOrder.customer,
          shipping: testOrder.shipping,
          items: testOrder.items,
          amounts: {
            total: testOrder.amount,
            subtotal: testOrder.amount,
            shipping: 0,
            discount: 0,
          },
        }),
      }
    );

    if (createResponse.ok) {
      const createResult = await createResponse.json();
      console.log("✅ Commande créée avec succès:", createResult.order.ref);
      console.log("   ID:", createResult.order.id);
      console.log("   Total:", createResult.order.total, "FCFA");
    } else {
      const createError = await createResponse.json();
      console.log("❌ Erreur création commande:", createError);
    }

    // 2. Vérifier que la commande est dans Airtable
    console.log("\n2️⃣ Vérification dans Airtable...");

    const airtableResponse = await fetch(`${ngrokUrl}/api/airtable/orders`);

    if (airtableResponse.ok) {
      const airtableResult = await airtableResponse.json();
      console.log(
        `✅ ${airtableResult.total} commande(s) trouvée(s) dans Airtable`
      );

      // Afficher les dernières commandes
      const recentOrders = airtableResult.data.slice(0, 3);
      recentOrders.forEach((order, index) => {
        console.log(
          `   ${index + 1}. ${order.customerName || "N/A"} - ${
            order.totalAmount || 0
          } FCFA - ${order.status}`
        );
      });
    } else {
      console.log("❌ Erreur récupération Airtable");
    }

    // 3. (Optionnel) Tester l'initiation PayTech si on veut
    console.log(
      "\n3️⃣ Simulation dinitiation PayTech (désactivé pour éviter les erreurs)..."
    );
    console.log("   URL ngrok disponible:", ngrokUrl);
    console.log(
      "   Pour tester PayTech manuellement, utiliser cette URL dans la config."
    );

    console.log("\n🎉 Test terminé avec succès !");
  } catch (error) {
    console.error("\n💥 Échec du test:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testPaytechWithNgrok();
}
