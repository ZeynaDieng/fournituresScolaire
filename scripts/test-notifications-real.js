#!/usr/bin/env node

/**
 * Script de test des notifications en conditions réelles
 */

const BASE_URL = "https://fournitures-scolaire.vercel.app";

console.log("🧪 TEST DES NOTIFICATIONS EN CONDITIONS RÉELLES");
console.log("=".repeat(60));

async function testRealNotifications() {
  try {
    console.log("\n1. Test du formulaire de contact réel...");

    // Test avec de vraies données comme un utilisateur le ferait
    const contactResponse = await fetch(`${BASE_URL}/api/contact/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test Utilisateur Real",
        email: "zeynash1@gmail.com", // Votre email pour recevoir
        phone: "221777780456",
        subject: "Test notification réelle depuis script",
        message:
          "Ceci est un test pour vérifier que les notifications fonctionnent vraiment quand un utilisateur envoie le formulaire.",
      }),
    });

    const contactResult = await contactResponse.json();
    console.log("📧 Résultat contact:", contactResult);

    console.log("\n2. Test d'une commande WhatsApp réelle...");

    const orderResponse = await fetch(
      `${BASE_URL}/api/airtable/orders/whatsapp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: "Test Client Real",
          customerEmail: "zeynash1@gmail.com", // Votre email
          customerPhone: "221777780456", // Votre WhatsApp
          items: [
            {
              id: "test-1",
              name: "Cahier test",
              quantity: 2,
              price: 500,
            },
          ],
          totalAmount: 1000,
          deliveryAddress: "Dakar, Sénégal",
        }),
      }
    );

    const orderResult = await orderResponse.json();
    console.log("🛒 Résultat commande:", orderResult);

    console.log("\n3. Test du webhook PayTech simulé...");

    const webhookResponse = await fetch(`${BASE_URL}/api/paytech/webhook-new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type_event: "sale_complete",
        ref_command: orderResult.orderRef || "TEST_REF_REAL",
        item_price: 1000,
        final_item_price: 1000,
        payment_method: "wave",
        client_phone: "221777780456",
        custom_field: "test",
      }),
    });

    if (webhookResponse.ok) {
      const webhookResult = await webhookResponse.json();
      console.log("💳 Résultat webhook:", webhookResult);
    } else {
      console.error(
        "❌ Erreur webhook:",
        webhookResponse.status,
        await webhookResponse.text()
      );
    }
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

console.log("\n⚠️  ATTENTION: Ce test va envoyer de vrais emails et WhatsApp!");
console.log("📧 Email de test: zeynash1@gmail.com");
console.log("📱 WhatsApp de test: 221777780456");
console.log("\nExécution dans 3 secondes...");

setTimeout(async () => {
  await testRealNotifications();

  console.log("\n" + "=".repeat(60));
  console.log("✅ Test terminé! Vérifiez:");
  console.log("1. Votre email zeynash1@gmail.com");
  console.log("2. Votre WhatsApp 221777780456");
  console.log("3. Les logs dans Vercel");
}, 3000);
