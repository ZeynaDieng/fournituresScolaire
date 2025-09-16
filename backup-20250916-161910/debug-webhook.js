// scripts/debug-webhook.js
// Script pour déboguer les webhooks PayTech

async function testWebhookEndpoint() {
  console.log("🔍 Test du endpoint webhook...");

  const webhookUrl = "http://localhost:3000/api/paytech/webhook";

  // Données de test simulant un webhook PayTech
  const testWebhookData = {
    type_event: "sale_complete",
    ref_command: "TEST_CMD_123",
    item_price: 10000,
    final_item_price: 10000,
    initial_item_price: 10000,
    payment_method: "Orange Money",
    client_phone: "+221701234567",
    token: "test_token_123",
    currency: "XOF",
    custom_field: JSON.stringify({
      order_id: "TEST_CMD_123",
      customer: {
        name: "Test User",
        email: "test@example.com",
        phone: "+221701234567",
      },
    }),
    // Simulation d'authentification PayTech
    api_key_sha256: "test_key_hash",
    api_secret_sha256: "test_secret_hash",
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testWebhookData),
    });

    const result = await response.text();

    console.log(`📡 Réponse du webhook:`);
    console.log(`   - Status: ${response.status}`);
    console.log(`   - Response: ${result}`);

    if (response.ok) {
      console.log("✅ Webhook accessible et fonctionnel");
    } else {
      console.log("❌ Problème avec le webhook");
      console.log("💡 Vérifiez que le serveur Nuxt est démarré");
    }
  } catch (error) {
    console.error("❌ Erreur lors du test du webhook:", error.message);
    console.log(
      "💡 Assurez-vous que le serveur est démarré sur http://localhost:3000"
    );
  }
}

async function checkWebhookLogs() {
  console.log("\n🔍 Vérification des logs de webhook...");

  // Cette fonction simule la vérification des logs
  // En production, vous pourriez lire un fichier de logs

  const suggestions = [
    "1. Vérifiez que l'URL webhook dans PayTech pointe vers votre serveur",
    "2. Assurez-vous que votre serveur est accessible depuis l'extérieur (ngrok en dev)",
    "3. Vérifiez les logs du serveur lors des tests de paiement",
    "4. Testez avec un paiement réel en mode sandbox",
    "5. Vérifiez que la vérification HMAC fonctionne correctement",
  ];

  console.log("📋 Suggestions de débogage:");
  suggestions.forEach((suggestion) => {
    console.log(`   ${suggestion}`);
  });
}

async function main() {
  console.log("🕵️ Débogage des webhooks PayTech\n");

  await testWebhookEndpoint();
  await checkWebhookLogs();

  console.log("\n💡 Points à vérifier si les paiements ne s'enregistrent pas:");
  console.log("   1. Le serveur Nuxt est-il démarré ?");
  console.log("   2. L'URL webhook dans PayTech est-elle correcte ?");
  console.log("   3. Les clés API PayTech sont-elles valides ?");
  console.log("   4. La base de données est-elle accessible ?");
  console.log("   5. Y a-t-il des erreurs dans les logs du serveur ?");
}

main().catch(console.error);
