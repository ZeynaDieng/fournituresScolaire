#!/usr/bin/env node

/**
 * Debug spécifique du webhook PayTech en production
 */

const BASE_URL = "https://fournitures-scolaire.vercel.app";

async function debugWebhook() {
  console.log("🔍 DEBUG WEBHOOK PAYTECH PRODUCTION");
  console.log("=".repeat(50));

  // Test 1: Webhook minimal (doit fonctionner)
  console.log("\n1️⃣ Test webhook minimal...");
  try {
    const response = await fetch(`${BASE_URL}/api/paytech/webhook-new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type_event: "test" }),
    });

    const data = await response.json();
    console.log(
      `   ${response.ok ? "✅" : "❌"} ${response.status}: ${
        data.message || data.statusMessage
      }`
    );
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
  }

  // Test 2: Webhook avec commande inexistante (devrait donner un warning mais pas échouer)
  console.log("\n2️⃣ Test webhook avec commande inexistante...");
  try {
    const response = await fetch(`${BASE_URL}/api/paytech/webhook-new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type_event: "sale_complete",
        ref_command: "INEXISTANTE_123",
        item_price: 1000,
        final_item_price: 1000,
        payment_method: "test",
      }),
    });

    const data = await response.json();
    console.log(
      `   ${response.ok ? "✅" : "❌"} ${response.status}: ${
        data.message || data.statusMessage
      }`
    );
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
  }

  // Test 3: Vérifier les commandes existantes
  console.log("\n3️⃣ Vérification commandes Airtable...");
  try {
    const response = await fetch(`${BASE_URL}/api/airtable/orders`);

    if (response.ok) {
      const orders = await response.json();
      console.log(`   ✅ ${orders.length} commandes dans Airtable`);

      if (orders.length > 0) {
        const firstOrder = orders[0];
        const orderRef = firstOrder["Order Ref"] || firstOrder.ref || "UNKNOWN";
        console.log(`   📦 Première commande: ${orderRef}`);

        // Test 4: Webhook avec commande existante
        console.log("\n4️⃣ Test webhook avec commande existante...");
        try {
          const webhookResponse = await fetch(
            `${BASE_URL}/api/paytech/webhook-new`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type_event: "sale_complete",
                ref_command: orderRef,
                item_price: 1000,
                final_item_price: 1000,
                payment_method: "test",
                client_phone: "221777780456",
              }),
            }
          );

          const webhookData = await webhookResponse.json();
          console.log(
            `   ${webhookResponse.ok ? "✅" : "❌"} ${
              webhookResponse.status
            }: ${webhookData.message || webhookData.statusMessage}`
          );
        } catch (error) {
          console.log(`   ❌ Erreur webhook: ${error.message}`);
        }
      }
    } else {
      console.log(`   ❌ Erreur Airtable: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 CONCLUSION:");
  console.log("Si le test 1 fonctionne mais pas les autres,");
  console.log("le problème vient de la gestion des commandes Airtable.");
  console.log("Il faut corriger updateOrderStatusInAirtable() ou");
  console.log("getOrderDetailsFromAirtable() dans le webhook.");
}

debugWebhook().catch(console.error);
