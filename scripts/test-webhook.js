/**
 * Script de test webhook spécifique
 */

require("dotenv").config();

async function testWebhook() {
  console.log("🧪 TEST WEBHOOK PAYTECH");
  console.log("=======================");

  const testPayload = {
    type_event: "sale_complete",
    ref_command: "TEST123456",
    item_price: 5000,
    final_item_price: 5000,
    client_phone: "221777780456",
    payment_method: "PayTech",
  };

  try {
    console.log("1️⃣ Test webhook original...");
    const response1 = await fetch(
      "https://fournitures-scolaire.vercel.app/api/paytech/webhook",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPayload),
      }
    );

    const result1 = await response1.text();
    console.log("Webhook original:", response1.status, result1);

    console.log("\n2️⃣ Test webhook-new...");
    const response2 = await fetch(
      "https://fournitures-scolaire.vercel.app/api/paytech/webhook-new",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPayload),
      }
    );

    const result2 = await response2.text();
    console.log("Webhook-new:", response2.status, result2);

    console.log("\n3️⃣ Test endpoint commandes...");
    const response3 = await fetch(
      "https://fournitures-scolaire.vercel.app/api/airtable/orders"
    );
    const result3 = await response3.text();
    console.log(
      "Orders endpoint:",
      response3.status,
      result3.substring(0, 200) + "..."
    );

    console.log("\n4️⃣ Test endpoint commande spécifique...");
    const response4 = await fetch(
      "https://fournitures-scolaire.vercel.app/api/airtable/orders/TEST123456"
    );
    const result4 = await response4.text();
    console.log(
      "Single order:",
      response4.status,
      result4.substring(0, 200) + "..."
    );

    console.log("\n5️⃣ Test endpoint facture...");
    const response5 = await fetch(
      "https://fournitures-scolaire.vercel.app/api/airtable/orders/TEST123456/invoice"
    );
    const result5 = await response5.text();
    console.log(
      "Invoice:",
      response5.status,
      result5.substring(0, 200) + "..."
    );
  } catch (error) {
    console.error("❌ Erreur test:", error.message);
  }
}

testWebhook();
