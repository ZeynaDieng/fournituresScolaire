#!/usr/bin/env node

/**
 * Test des nouvelles fonctionnalités après correction
 */

console.log("🧪 TEST DES NOUVELLES FONCTIONNALITÉS");
console.log("=".repeat(60));

const BASE_URL = "https://fournitures-scolaire.vercel.app";

async function testEndpoints() {
  const tests = [
    {
      name: "Test 'Mes commandes' par email",
      url: `${BASE_URL}/api/airtable/orders/by-email?email=test@example.com`,
      method: "GET",
    },
    {
      name: "Test 'Mes commandes' email invalide",
      url: `${BASE_URL}/api/airtable/orders/by-email?email=invalid-email`,
      method: "GET",
      expectError: true,
    },
    {
      name: "Test facture commande inexistante",
      url: `${BASE_URL}/api/airtable/orders/TEST123/invoice`,
      method: "GET",
      expectError: true,
    },
    {
      name: "Test webhook PayTech (nouveau)",
      url: `${BASE_URL}/api/paytech/webhook-new`,
      method: "POST",
      body: {
        type_event: "sale_complete",
        ref_command: "TEST_ORDER_123",
        item_price: 10000,
        final_item_price: 10000,
        payment_method: "orange_money_sn",
        client_phone: "221777780456",
      },
    },
    {
      name: "Test contact avec notifications forcées",
      url: `${BASE_URL}/api/contact/send`,
      method: "POST",
      body: {
        name: "Test User",
        email: "test@example.com",
        phone: "221777780456",
        subject: "Test des notifications",
        message:
          "Ceci est un test pour vérifier que les notifications fonctionnent même en mode fallback.",
      },
    },
  ];

  for (const test of tests) {
    console.log(`\n🧪 ${test.name}...`);
    try {
      const options = {
        method: test.method,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Diagnostic-Bot/1.0",
        },
      };

      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(test.url, options);

      if (test.expectError) {
        if (!response.ok) {
          console.log(
            `   ✅ Erreur attendue: ${response.status} ${response.statusText}`
          );
        } else {
          console.log(
            `   ⚠️  Attendait une erreur mais got ${response.status}`
          );
        }
      } else {
        if (response.ok) {
          const data = await response.json();
          console.log(`   ✅ ${response.status}`);

          // Afficher des infos spécifiques selon le test
          if (test.name.includes("commandes")) {
            console.log(
              `   📦 Commandes trouvées: ${
                data.orders ? data.orders.length : 0
              }`
            );
          } else if (test.name.includes("contact")) {
            console.log(`   📧 Mode fallback: ${data.fallback || false}`);
            console.log(`   📨 Message: ${data.message}`);
          } else if (test.name.includes("webhook")) {
            console.log(`   🔔 Webhook traité: ${data.success}`);
          }
        } else {
          const errorData = await response.text();
          console.log(
            `   ❌ ${response.status}: ${errorData.substring(0, 100)}...`
          );
        }
      }
    } catch (error) {
      console.log(`   ❌ Erreur réseau: ${error.message}`);
    }
  }
}

async function testPageSuccess() {
  console.log("\n🎉 Test page de succès dynamique...");
  try {
    const testUrl = `${BASE_URL}/payment/success?ref=TEST123&amount=15000&method=PayTech`;
    const response = await fetch(testUrl);

    if (response.ok) {
      const html = await response.text();
      const isDynamic =
        html.includes("TEST123") &&
        html.includes("15") &&
        html.includes("PayTech");
      console.log(
        `   ${isDynamic ? "✅" : "❌"} Page success ${
          isDynamic ? "dynamique" : "statique"
        }`
      );
    } else {
      console.log(`   ❌ Erreur page success: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Erreur test page: ${error.message}`);
  }
}

// Lancer tous les tests
async function runAllTests() {
  await testEndpoints();
  await testPageSuccess();

  console.log("\n" + "=".repeat(60));
  console.log("📊 RÉSULTATS:");
  console.log("- Les endpoints sont créés localement mais pas encore déployés");
  console.log("- Besoin de déployer sur Vercel pour tester en production");
  console.log("- Le contact fonctionne mais reste en mode fallback (Airtable)");
  console.log("- Le webhook PayTech doit être corrigé");
  console.log("\n🚀 PROCHAINE ÉTAPE: Déployer sur Vercel");
}

runAllTests().catch(console.error);
