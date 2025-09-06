#!/usr/bin/env node

/**
 * Vérificateur rapide de déploiement
 * Test automatique des endpoints critiques
 */

async function testDeployment(baseUrl) {
  console.log(`🧪 Test du déploiement: ${baseUrl}`);
  console.log("=".repeat(50));

  const tests = [
    {
      name: "Page d'accueil",
      url: `${baseUrl}/`,
      expected: "EduShop",
    },
    {
      name: "API Status",
      url: `${baseUrl}/api/status`,
      expected: "ok",
    },
    {
      name: "Produits Airtable",
      url: `${baseUrl}/api/airtable/products`,
      expected: "products",
    },
    {
      name: "Promotions",
      url: `${baseUrl}/api/airtable/promotions`,
      expected: "promotions",
    },
    {
      name: "Page Checkout",
      url: `${baseUrl}/checkout`,
      expected: "checkout",
    },
  ];

  let passedTests = 0;
  const totalTests = tests.length;

  for (const test of tests) {
    process.stdout.write(`🔍 ${test.name}... `);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(test.url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "DeploymentChecker/1.0",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const text = await response.text();
        const hasExpected = text
          .toLowerCase()
          .includes(test.expected.toLowerCase());

        if (hasExpected) {
          console.log("✅ PASS");
          passedTests++;
        } else {
          console.log("⚠️  PARTIAL (réponse OK mais contenu inattendu)");
        }
      } else {
        console.log(`❌ FAIL (${response.status})`);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("❌ TIMEOUT");
      } else {
        console.log(`❌ ERROR (${error.message})`);
      }
    }
  }

  console.log("\n📊 Résultats:");
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(
    `📈 Taux de succès: ${Math.round((passedTests / totalTests) * 100)}%`
  );

  if (passedTests === totalTests) {
    console.log("\n🎉 Déploiement entièrement fonctionnel !");
    console.log("📱 Vous pouvez maintenant tester WhatsApp manuellement");
  } else if (passedTests >= totalTests * 0.8) {
    console.log("\n⚠️  Déploiement partiellement fonctionnel");
    console.log("🔧 Quelques ajustements peuvent être nécessaires");
  } else {
    console.log("\n🚨 Problèmes détectés dans le déploiement");
    console.log("🔧 Vérifier les logs Vercel et la configuration");
  }

  console.log("\n📖 Guide complet: node scripts/post-deployment-checklist.js");
}

// Utilisation
if (process.argv[2]) {
  const url = process.argv[2].replace(/\/$/, ""); // Remove trailing slash
  testDeployment(url);
} else {
  console.log("🚀 Vérificateur de Déploiement");
  console.log("==============================");
  console.log("");
  console.log(
    "Usage: node scripts/test-deployment.js https://votre-site.vercel.app"
  );
  console.log("");
  console.log("Exemples d'URLs Vercel typiques:");
  console.log("• https://fournitures-scolaire-abc123.vercel.app");
  console.log("• https://edushop-senegal-def456.vercel.app");
  console.log("• https://votre-nom-projet.vercel.app");
  console.log("");
  console.log("💡 L'URL sera fournie par Vercel à la fin du déploiement");
  console.log("📋 Lancez ensuite: node scripts/post-deployment-checklist.js");
}

export { testDeployment };
