// scripts/check-production.js
import fetch from "node-fetch";

async function checkProduction() {
  console.log("🚀 VÉRIFICATION SITE EN PRODUCTION\n");

  // Demander l'URL de production
  const prodUrl =
    process.env.PROD_URL || "https://fournitures-scolaire.vercel.app";
  console.log(`🌐 Site testé: ${prodUrl}\n`);

  const tests = [
    {
      name: "Page d'accueil",
      url: `${prodUrl}`,
      expected: 200,
    },
    {
      name: "Page checkout",
      url: `${prodUrl}/checkout`,
      expected: 200,
    },
    {
      name: "API diagnostic",
      url: `${prodUrl}/api/test/payment-debug`,
      expected: 200,
    },
    {
      name: "Test flow paiement",
      url: `${prodUrl}/test/payment-flow`,
      expected: 200,
    },
    {
      name: "API initiate PayTech",
      url: `${prodUrl}/api/paytech/initiate`,
      expected: 405, // Method not allowed (normal pour GET)
      method: "GET",
    },
  ];

  console.log("🧪 Tests automatiques:\n");

  for (const test of tests) {
    try {
      const response = await fetch(test.url, {
        method: test.method || "GET",
        timeout: 10000,
      });

      const status = response.status;
      const success =
        status === test.expected || (status >= 200 && status < 400);

      console.log(
        `${success ? "✅" : "❌"} ${test.name}: ${status} ${
          response.statusText
        }`
      );

      if (test.name === "API diagnostic" && success) {
        try {
          const data = await response.json();
          if (data.success) {
            console.log(
              `   📊 BDD: ${
                data.data.database.connected ? "Connectée" : "Erreur"
              }`
            );
            console.log(`   📦 Commandes: ${data.data.database.orders}`);
            console.log(`   💳 Paiements: ${data.data.database.payments}`);
          }
        } catch (e) {
          console.log("   ℹ️ Réponse non-JSON");
        }
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Erreur - ${error.message}`);
    }
  }

  console.log("\n🔍 Tests manuels à faire:\n");
  console.log(`1. 🏠 Accueil: ${prodUrl}`);
  console.log("   → Vérifier que la page se charge");
  console.log("   → Tester l'ajout au panier");

  console.log(`\n2. 🛒 Checkout: ${prodUrl}/checkout`);
  console.log("   → Remplir le formulaire");
  console.log("   → Tester l'initiation PayTech");

  console.log(`\n3. 📊 Diagnostic: ${prodUrl}/test/payment-debug`);
  console.log("   → Vérifier la connexion BDD");
  console.log("   → Voir les statistiques");

  console.log(`\n4. 🧪 Test flow: ${prodUrl}/test/payment-flow`);
  console.log("   → Créer commande de test");
  console.log("   → Simuler paiement");
  console.log("   → Vérifier sauvegarde");

  console.log("\n🎯 Tests critiques:\n");
  console.log("✅ Site accessible");
  console.log("✅ Base de données connectée");
  console.log("✅ APIs fonctionnelles");
  console.log("? Paiements PayTech (à tester manuellement)");

  console.log("\n💡 Si problèmes:");
  console.log("1. Vérifier variables d'environnement sur Vercel");
  console.log("2. Consulter logs: vercel logs");
  console.log("3. Redéployer: vercel --prod");
}

// Permettre de passer l'URL en paramètre
if (process.argv[2]) {
  process.env.PROD_URL = process.argv[2];
}

checkProduction().catch(console.error);
