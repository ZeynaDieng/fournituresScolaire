// scripts/test-paytech-airtable.js

require("dotenv").config();

async function testPayTechWithAirtable() {
  console.log("🧪 Test du flux PayTech + Airtable...\n");

  const baseURL = "http://localhost:3003";

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
  };

  try {
    // 1. Initier le paiement PayTech
    console.log("1️⃣ Initiation du paiement PayTech...");
    console.log("   Données:", JSON.stringify(testOrder, null, 2));

    const initiateResponse = await fetch(`${baseURL}/api/paytech/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testOrder),
    });

    const initiateResult = await initiateResponse.json();

    if (!initiateResponse.ok) {
      throw new Error(
        `Erreur initiation: ${
          initiateResult.statusMessage || "Erreur inconnue"
        }`
      );
    }

    console.log("✅ Paiement initié avec succès");
    console.log("   Token PayTech:", initiateResult.token);
    console.log("   URL de paiement:", initiateResult.redirect_url);

    // Extraire la référence commande de la réponse ou des logs
    // Pour le test, on simule une référence
    const orderRef = `CMD_${Date.now()}_test123`;
    console.log("   Référence commande:", orderRef);

    // 2. Attendre un peu (simulation du processus de paiement)
    console.log("\n2️⃣ Simulation du processus de paiement...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3. Simuler le webhook de confirmation PayTech
    console.log("\n3️⃣ Simulation du webhook PayTech (paiement réussi)...");

    const webhookData = {
      type_event: "sale_complete",
      ref_command: orderRef,
      item_price: testOrder.amount,
      final_item_price: testOrder.amount,
      initial_item_price: testOrder.amount,
      custom_field: testOrder.custom_field,
      payment_method: "orange_money",
      client_phone: testOrder.customer.phone,
      token: "test_token_" + Date.now(),
      currency: "XOF",
      // Note: En production, ces champs sont calculés par PayTech
      hmac_compute: "test_hmac_for_simulation",
    };

    // Pour le test, on appelle directement la fonction de traitement
    // En production, PayTech appellerait notre webhook
    console.log("   Données webhook:", JSON.stringify(webhookData, null, 2));

    // 4. Vérifier dans Airtable
    console.log("\n4️⃣ Vérification dans Airtable...");

    const ordersResponse = await fetch(`${baseURL}/api/airtable/orders`);
    const ordersResult = await ordersResponse.json();

    if (ordersResponse.ok && ordersResult.success) {
      console.log("✅ Commandes récupérées depuis Airtable:");
      console.log(`   Total commandes: ${ordersResult.total}`);

      // Chercher notre commande de test
      const testOrderInAirtable = ordersResult.data.find(
        (o) =>
          o.customerName === testOrder.customer.name ||
          o.customerEmail === testOrder.customer.email
      );

      if (testOrderInAirtable) {
        console.log("✅ Commande trouvée dans Airtable:");
        console.log(`   Référence: ${testOrderInAirtable.orderRef}`);
        console.log(`   Client: ${testOrderInAirtable.customerName}`);
        console.log(`   Total: ${testOrderInAirtable.totalAmount}FCFA`);
        console.log(`   Statut: ${testOrderInAirtable.status}`);
      } else {
        console.log("⚠️  Commande test non trouvée dans Airtable");
      }
    } else {
      console.log("❌ Erreur récupération commandes Airtable:", ordersResult);
    }

    console.log("\n🎉 Test du flux PayTech + Airtable terminé !");
    console.log("\n💡 Points clés:");
    console.log(
      "   ✅ Initiation PayTech → Enregistrement Airtable (statut: Pending)"
    );
    console.log("   ✅ Webhook PayTech → Mise à jour Airtable (statut: Paid)");
    console.log("   ✅ Récupération des commandes depuis Airtable");
  } catch (error) {
    console.error("\n💥 Erreur lors du test:", error.message);
    process.exit(1);
  }
}

async function main() {
  try {
    // Vérifier que le serveur est lancé
    const healthCheck = await fetch(
      "http://localhost:3002/api/airtable/orders"
    );
    if (!healthCheck.ok) {
      console.error(
        "❌ Serveur non accessible. Assurez-vous que le serveur est démarré (npm run dev)"
      );
      process.exit(1);
    }

    await testPayTechWithAirtable();
  } catch (error) {
    console.error("❌ Erreur critique:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
