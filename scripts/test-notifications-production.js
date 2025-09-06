#!/usr/bin/env node

/**
 * Script pour tester et résoudre définitivement les problèmes
 */

const fetch = require("node-fetch");

const BASE_URL = "https://fournitures-scolaire.vercel.app";

async function testContactReal() {
  console.log("📧 TEST FORMULAIRE CONTACT RÉEL");
  console.log("=".repeat(50));

  // Données de test réelles
  const testData = {
    name: "Test User",
    email: "zeynash1@gmail.com", // Votre email pour recevoir la notification
    phone: "221777780456",
    subject: "Test depuis le script automatique",
    message:
      "Ceci est un test automatique du formulaire de contact pour vérifier que les notifications fonctionnent correctement.",
  };

  console.log("📤 Envoi test contact:", testData);

  try {
    const response = await fetch(`${BASE_URL}/api/contact/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log("Réponse complète:", JSON.stringify(data, null, 2));

    if (data.fallback) {
      console.log("\n⚠️  MODE FALLBACK ACTIVÉ");
      console.log("- L'enregistrement Airtable a échoué");
      console.log("- Les notifications devraient quand même être envoyées");
      console.log("- Vérifiez votre email pour la notification");
    } else {
      console.log("\n✅ MODE NORMAL");
      console.log("- Enregistrement Airtable réussi");
      console.log("- Notifications envoyées");
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
}

async function testWebhookReal() {
  console.log("\n🔔 TEST WEBHOOK PAYTECH RÉEL");
  console.log("=".repeat(50));

  // Données webhook réalistes
  const webhookData = {
    type_event: "sale_complete",
    ref_command: "CMD_TEST_" + Date.now(),
    item_price: 25000,
    final_item_price: 25000,
    payment_method: "paytech",
    client_phone: "221777780456",
    custom_field: JSON.stringify({
      customer_name: "Test Customer",
      customer_email: "zeynash1@gmail.com",
    }),
  };

  console.log("📤 Envoi webhook test:", webhookData);

  try {
    const response = await fetch(`${BASE_URL}/api/paytech/webhook-new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookData),
    });

    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log("Réponse webhook:", JSON.stringify(data, null, 2));

    if (response.status === 200) {
      console.log("\n✅ WEBHOOK TRAITÉ");
      console.log("- Le paiement fictif a été traité");
      console.log("- Vérifiez si les notifications ont été envoyées");
    } else {
      console.log("\n❌ WEBHOOK ÉCHOUÉ");
      console.log("- Erreur dans le traitement du webhook");
    }
  } catch (error) {
    console.error("❌ Erreur webhook:", error.message);
  }
}

async function testCompleteFlow() {
  console.log("🎯 TEST COMPLET DU FLUX NOTIFICATIONS");
  console.log("=".repeat(60));

  await testContactReal();
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Pause
  await testWebhookReal();

  console.log("\n" + "=".repeat(60));
  console.log("📋 RÉSUMÉ");
  console.log("Si tout fonctionne correctement, vous devriez avoir reçu:");
  console.log("1. Un email de notification de contact");
  console.log("2. Un message WhatsApp (si configuré)");
  console.log("3. Un email de notification de commande (si webhook OK)");
  console.log("\n🔍 Vérifiez vos emails et messages");
}

testCompleteFlow().catch(console.error);
