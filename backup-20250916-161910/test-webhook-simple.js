/**
 * Test du webhook PayTech simple
 */

require("dotenv").config();

async function testWebhookSimple() {
  const baseUrl = "https://fournitures-scolaire.vercel.app/api";

  console.log("🧪 TEST WEBHOOK PAYTECH SIMPLE");
  console.log("================================");

  // Test du webhook simple
  console.log("1️⃣ Test webhook-simple...");
  try {
    const webhookData = {
      type_event: "sale_complete",
      ref_command: "TEST-WEBHOOK-" + Date.now(),
      item_price: 5000,
      final_item_price: 5000,
      payment_method: "PayTech",
      client_phone: "221123456789",
      custom_field: JSON.stringify({ test: true }),
    };

    const response = await fetch(`${baseUrl}/paytech/webhook-simple`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "PayTech-Webhook-Test",
      },
      body: JSON.stringify(webhookData),
    });

    const result = await response.text();
    let parsedResult;

    try {
      parsedResult = JSON.parse(result);
    } catch (e) {
      parsedResult = {
        error: true,
        message: result,
        statusCode: response.status,
      };
    }

    console.log(`Webhook-simple: ${response.status}`, parsedResult);

    if (response.ok) {
      console.log("✅ Webhook simple fonctionne !");
      return true;
    } else {
      console.log("❌ Webhook simple en erreur");
      return false;
    }
  } catch (error) {
    console.error("❌ Erreur test webhook simple:", error.message);
    return false;
  }
}

// Test principal
testWebhookSimple()
  .then((success) => {
    console.log("\n📊 RÉSULTAT FINAL:");
    if (success) {
      console.log("✅ Webhook PayTech simple opérationnel");
    } else {
      console.log("❌ Problèmes restants avec webhook");
    }
  })
  .catch(console.error);
