#!/usr/bin/env node

/**
 * Test final avant déploiement
 * Vérifie que toutes les fonctionnalités critiques marchent
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

console.log("🚀 Test Final - Pré-déploiement");
console.log("================================\n");

const tests = [
  {
    name: "Build de production",
    command: "npm run build",
    timeout: 120000, // 2 minutes
    critical: true,
  },
  {
    name: "Test WhatsApp",
    command: "npx tsx scripts/test-whatsapp-integration.ts",
    timeout: 10000,
    critical: true,
  },
  {
    name: "Vérification des routes",
    command: "find server/api -name '*.ts' | wc -l",
    timeout: 5000,
    critical: false,
  },
];

async function runTest(test) {
  console.log(`🧪 ${test.name}`);
  console.log("-".repeat(test.name.length + 3));

  try {
    const startTime = Date.now();
    const { stdout, stderr } = await execAsync(test.command, {
      timeout: test.timeout,
    });
    const duration = Date.now() - startTime;

    if (stderr && test.critical) {
      console.log(`⚠️  Warnings: ${stderr.slice(0, 200)}...`);
    }

    console.log(`✅ Réussi en ${duration}ms`);
    if (stdout && stdout.length < 500) {
      console.log(`📄 Output: ${stdout.trim()}`);
    }
    console.log("");

    return { success: true, duration, output: stdout };
  } catch (error) {
    console.log(`❌ Échec: ${error.message}`);
    if (error.stdout) {
      console.log(`📄 Output: ${error.stdout.slice(0, 200)}...`);
    }
    console.log("");

    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log("🔄 Exécution des tests...\n");

  let successCount = 0;
  let criticalFailures = 0;

  for (const test of tests) {
    const result = await runTest(test);

    if (result.success) {
      successCount++;
    } else if (test.critical) {
      criticalFailures++;
    }
  }

  // Résumé
  console.log("📊 Résumé des Tests");
  console.log("===================");
  console.log(`✅ Tests réussis: ${successCount}/${tests.length}`);
  console.log(`❌ Échecs critiques: ${criticalFailures}`);

  if (criticalFailures === 0) {
    console.log("\n🎉 Tous les tests critiques passent !");
    console.log("✨ Le projet est prêt pour le déploiement\n");

    console.log("🚀 Prochaines étapes :");
    console.log("1. Pousser le code vers GitHub");
    console.log("2. Connecter le repository à Vercel/Netlify");
    console.log("3. Configurer les variables d'environnement");
    console.log("4. Déployer !");
    console.log("\n📖 Voir DEPLOYMENT_GUIDE.md pour plus de détails");
  } else {
    console.log(`\n🚨 ${criticalFailures} test(s) critique(s) échoué(s)`);
    console.log("⚠️  Corriger ces problèmes avant le déploiement");
    process.exit(1);
  }
}

// Tests spécifiques
async function testSpecificFunctionality() {
  console.log("🔍 Tests spécifiques supplémentaires");
  console.log("------------------------------------");

  // Test de la configuration WhatsApp
  try {
    console.log("📱 Test configuration WhatsApp...");
    const { formatWhatsAppOrderMessage } = await import(
      "../utils/whatsapp-config.js"
    );

    const testData = {
      customer: {
        name: "Test",
        email: "test@example.com",
        phone: "+221700000000",
      },
      shipping: { address: "Test", city: "Dakar", method: "Test", cost: 1000 },
      items: [{ name: "Test Item", quantity: 1, price: 1000 }],
      amounts: { subtotal: 1000, shipping: 1000, discount: 0, total: 2000 },
    };

    const message = formatWhatsAppOrderMessage(testData);

    if (message && message.includes("Test") && message.includes("2000")) {
      console.log("✅ Configuration WhatsApp opérationnelle");
    } else {
      console.log("❌ Problème avec la configuration WhatsApp");
    }
  } catch (error) {
    console.log(`❌ Erreur WhatsApp: ${error.message}`);
  }

  console.log("");
}

// Lancer tous les tests
runAllTests()
  .then(() => {
    return testSpecificFunctionality();
  })
  .catch((error) => {
    console.error("💥 Erreur lors des tests:", error);
    process.exit(1);
  });
