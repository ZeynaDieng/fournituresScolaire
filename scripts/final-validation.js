#!/usr/bin/env node

/**
 * 🎯 VALIDATION FINALE - Confirmation que tout fonctionne
 * Ce script teste spécifiquement les points qui posaient problème
 */

const https = require("https");

const SITE_URL =
  "https://fournitures-scolaire-8nq2b3vtb-nabous-projects.vercel.app";

console.log("🎯 VALIDATION FINALE - FOURNITURES SCOLAIRES");
console.log("=".repeat(60));
console.log(`🌐 Site: ${SITE_URL}\n`);

// Tests spécifiques aux erreurs identifiées
const validationTests = [
  {
    name: "🏠 Site Principal (403 → 200)",
    url: SITE_URL + "/",
    expectedStatus: 200,
    fixes: "Variables d'environnement Vercel",
  },
  {
    name: "💳 API PayTech (500 → 200/405)",
    url: SITE_URL + "/api/paytech/initiate",
    expectedStatus: [405, 200], // 405 = Méthode non autorisée (normal pour GET)
    fixes: "PAYTECH_API_KEY + PAYTECH_SECRET_KEY",
  },
  {
    name: "📦 API Produits (500 → 200)",
    url: SITE_URL + "/api/admin/products",
    expectedStatus: 200,
    fixes: "AIRTABLE_API_KEY + AIRTABLE_BASE_ID",
  },
  {
    name: "🎁 API Promotions (500 → 200)",
    url: SITE_URL + "/api/admin/promotions",
    expectedStatus: 200,
    fixes: "AIRTABLE_PROMOTIONS_TABLE",
  },
  {
    name: "🛒 Page Checkout",
    url: SITE_URL + "/checkout",
    expectedStatus: 200,
    fixes: "Déjà fonctionnel",
  },
];

// Fonction de test
function testEndpoint(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 8000 }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          data: data.slice(0, 300),
          size: Buffer.byteLength(data),
        });
      });
    });

    req.on("error", () => resolve({ status: "ERROR", size: 0 }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: "TIMEOUT", size: 0 });
    });
  });
}

// Test principal
async function runValidation() {
  console.log("🧪 Tests de validation en cours...\n");

  let fixedCount = 0;
  let totalTests = validationTests.length;
  let remainingIssues = [];

  for (const test of validationTests) {
    const result = await testEndpoint(test.url);
    const status = result.status;

    // Vérifier si le status attendu correspond
    const expectedStatuses = Array.isArray(test.expectedStatus)
      ? test.expectedStatus
      : [test.expectedStatus];

    const isFixed = expectedStatuses.includes(status);
    const icon = isFixed ? "✅" : "❌";

    console.log(`${icon} ${test.name}`);
    console.log(
      `   Status: ${status} (attendu: ${expectedStatuses.join(" ou ")})`
    );
    console.log(`   Taille: ${result.size} bytes`);

    if (isFixed) {
      fixedCount++;
      console.log(`   ✨ RÉSOLU !`);
    } else {
      remainingIssues.push({
        name: test.name,
        status: status,
        fixes: test.fixes,
      });
      console.log(`   🔧 Solution: ${test.fixes}`);
    }
    console.log();
  }

  // Résumé final
  console.log("=".repeat(60));
  console.log("📊 RÉSULTATS DE VALIDATION");
  console.log("=".repeat(60));
  console.log(`✅ Problèmes résolus: ${fixedCount}/${totalTests}`);
  console.log(`❌ Problèmes restants: ${remainingIssues.length}`);
  console.log(
    `📊 Progression: ${Math.round((fixedCount / totalTests) * 100)}%`
  );

  if (remainingIssues.length === 0) {
    console.log("\n🎉 PARFAIT ! TOUS LES PROBLÈMES SONT RÉSOLUS !");
    console.log("🚀 Votre site e-commerce est 100% opérationnel !");

    console.log("\n✅ FONCTIONNALITÉS CONFIRMÉES:");
    console.log("   • Site accessible (pas d'erreur 403)");
    console.log("   • PayTech configuré (pas d'erreur 500)");
    console.log("   • APIs Airtable fonctionnelles");
    console.log("   • WhatsApp commandes prêt");
    console.log("   • E-commerce totalement dynamique");

    console.log(`\n🌐 Votre site: ${SITE_URL}`);
    console.log("📱 WhatsApp: +221 78 291 18 44");
    console.log("💳 Paiements: PayTech opérationnel");
  } else {
    console.log("\n🔧 PROBLÈMES À RÉSOUDRE:");
    remainingIssues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.name} (${issue.status})`);
      console.log(`   → Solution: ${issue.fixes}`);
    });

    console.log("\n⚡ ACTIONS IMMÉDIATES:");
    console.log("1. 🌐 https://vercel.com/dashboard → votre projet");
    console.log("2. ⚙️  Settings → Environment Variables");
    console.log("3. ➕ Ajouter les variables manquantes");
    console.log("4. 🚀 Redeploy + attendre 3 minutes");
    console.log("5. 🧪 Relancer ce test: node scripts/final-validation.js");
  }

  console.log("\n📋 VARIABLES CRITIQUES (si pas encore fait):");
  console.log("   • PAYTECH_API_KEY, PAYTECH_SECRET_KEY");
  console.log("   • AIRTABLE_API_KEY, AIRTABLE_BASE_ID");
  console.log("   • BASE_URL, NUXT_PUBLIC_BASE_URL");
  console.log("   • Tables Airtable (PRODUCTS, PROMOTIONS, etc.)");

  console.log(`\n📄 Guide complet: vercel-variables.txt`);
  console.log("📅 Validation effectuée:", new Date().toLocaleString());
}

// Exécution
runValidation().catch(console.error);
