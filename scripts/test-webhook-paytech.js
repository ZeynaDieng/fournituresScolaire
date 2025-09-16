#!/usr/bin/env node

/**
 * 🧪 Test du webhook PayTech
 *
 * Ce script teste le webhook PayTech avec des données simulées
 */

require("dotenv").config();

console.log("🧪 TEST WEBHOOK PAYTECH");
console.log("========================");

async function testWebhookPaytech() {
  try {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/paytech/webhook-simple`;

    console.log(`🌐 URL du webhook: ${webhookUrl}`);

    // Test 1: Paiement réussi
    console.log("\n📋 TEST 1: Paiement réussi (sale_complete)");
    console.log("==========================================");

    const successPayload = {
      type_event: "sale_complete",
      ref_command: "CMD_TEST_SUCCESS_" + Date.now(),
      item_price: 50000,
      payment_method: "mobile_money",
      client_phone: "+221777780456",
      final_item_price: 50000,
      custom_field: Buffer.from(
        JSON.stringify({
          customer: {
            name: "Test Client",
            email: "test@example.com",
            phone: "+221777780456",
          },
          items: [
            {
              name: "Pack Scolaire Test",
              quantity: 1,
              price: 50000,
            },
          ],
        })
      ).toString("base64"),
    };

    console.log("📤 Envoi du webhook...");
    console.log("📋 Données:", JSON.stringify(successPayload, null, 2));

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(successPayload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Webhook traité avec succès");
        console.log("📊 Résultat:", result);
      } else {
        const error = await response.text();
        console.log("❌ Erreur webhook:", response.status, error);
      }
    } catch (error) {
      console.log("❌ Erreur réseau:", error.message);
      console.log("💡 Assurez-vous que le serveur est démarré (npm run dev)");
    }

    // Test 2: Paiement annulé
    console.log("\n📋 TEST 2: Paiement annulé (sale_cancel)");
    console.log("=========================================");

    const cancelPayload = {
      type_event: "sale_cancel",
      ref_command: "CMD_TEST_CANCEL_" + Date.now(),
      item_price: 50000,
      payment_method: "mobile_money",
      client_phone: "+221777780456",
      final_item_price: 50000,
    };

    console.log("📤 Envoi du webhook...");
    console.log("📋 Données:", JSON.stringify(cancelPayload, null, 2));

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cancelPayload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Webhook traité avec succès");
        console.log("📊 Résultat:", result);
      } else {
        const error = await response.text();
        console.log("❌ Erreur webhook:", response.status, error);
      }
    } catch (error) {
      console.log("❌ Erreur réseau:", error.message);
    }

    // Test 3: Paiement en attente
    console.log("\n📋 TEST 3: Paiement en attente (sale_pending)");
    console.log("=============================================");

    const pendingPayload = {
      type_event: "sale_pending",
      ref_command: "CMD_TEST_PENDING_" + Date.now(),
      item_price: 50000,
      payment_method: "mobile_money",
      client_phone: "+221777780456",
      final_item_price: 50000,
    };

    console.log("📤 Envoi du webhook...");
    console.log("📋 Données:", JSON.stringify(pendingPayload, null, 2));

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pendingPayload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Webhook traité avec succès");
        console.log("📊 Résultat:", result);
      } else {
        const error = await response.text();
        console.log("❌ Erreur webhook:", response.status, error);
      }
    } catch (error) {
      console.log("❌ Erreur réseau:", error.message);
    }

    // Résumé
    console.log("\n📋 RÉSUMÉ DES TESTS");
    console.log("===================");
    console.log("✅ Tests du webhook PayTech terminés");
    console.log("");
    console.log("💡 VÉRIFICATIONS:");
    console.log("1. Vérifiez les logs du serveur pour voir les webhooks reçus");
    console.log("2. Vérifiez dans Airtable que les statuts ont été mis à jour");
    console.log("3. Vérifiez que les emails et WhatsApp ont été envoyés");
    console.log("");
    console.log("🔧 CONFIGURATION PAYTECH:");
    console.log("URL IPN: " + webhookUrl);
    console.log("Méthode: POST");
    console.log("Content-Type: application/json");
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testWebhookPaytech().catch(console.error);
