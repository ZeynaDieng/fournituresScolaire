#!/usr/bin/env node

/**
 * Script pour tester la configuration PayTech en production
 * Utilisation: node scripts/test-production-paytech.js
 */

console.log("🧪 TEST CONFIGURATION PAYTECH EN PRODUCTION");
console.log("=".repeat(60));
console.log("");

const PRODUCTION_URL = "https://fournitures-scolaire.vercel.app";

async function testPaytechConfig() {
  try {
    console.log("🌐 Test de la configuration PayTech en production...");
    console.log(`📍 URL: ${PRODUCTION_URL}`);
    console.log("");

    // Test de base - accès au site
    console.log("1️⃣ Test d'accès au site...");
    const response = await fetch(PRODUCTION_URL);

    if (response.ok) {
      console.log("✅ Site accessible");
    } else {
      console.log("❌ Site non accessible:", response.status);
      return;
    }

    // Test spécifique pour la configuration PayTech
    console.log("");
    console.log("2️⃣ Test de la configuration PayTech...");

    // On peut tester via une page qui expose la config publique
    const configTest = await fetch(
      `${PRODUCTION_URL}/api/config/paytech`
    ).catch(() => null);

    if (configTest && configTest.ok) {
      const config = await configTest.json();
      console.log("✅ API de configuration accessible");
      console.log("📋 Configuration trouvée:", JSON.stringify(config, null, 2));
    } else {
      console.log(
        "⚠️  API de configuration non trouvée (normal si pas implémentée)"
      );
    }

    console.log("");
    console.log("3️⃣ Vérifications manuelles recommandées:");
    console.log("");
    console.log("👀 Visitez manuellement:", PRODUCTION_URL);
    console.log("🔍 Vérifiez dans la console du navigateur:");
    console.log('   - Aucune erreur "Configuration PayTech manquante"');
    console.log("   - Les variables NUXT_PUBLIC_* sont bien disponibles");
    console.log("");
    console.log("🛒 Testez le flux de commande:");
    console.log("   1. Ajoutez un produit au panier");
    console.log("   2. Allez au checkout");
    console.log("   3. Vérifiez que PayTech s'initialise");
    console.log("   4. Testez un paiement (petit montant)");
    console.log("");
  } catch (error) {
    console.error("❌ Erreur lors du test:", error.message);
  }
}

async function checkVercelConfig() {
  console.log("📋 CHECKLIST VERCEL CONFIGURATION:");
  console.log("-".repeat(40));

  const requiredVars = [
    "DATABASE_URL",
    "NUXT_PAYTECH_API_KEY",
    "NUXT_PAYTECH_SECRET_KEY",
    "NUXT_PAYTECH_SANDBOX",
    "NUXT_PUBLIC_PAYTECH_API_KEY",
    "NUXT_PUBLIC_PAYTECH_SANDBOX",
    "NUXT_PUBLIC_BASE_URL",
    "NUXT_PUBLIC_SITE_URL",
    "NUXT_PUBLIC_API_BASE",
    "NUXT_PUBLIC_PAYTECH_MERCHANT_ID",
  ];

  console.log("");
  console.log("✅ Variables requises sur Vercel:");
  requiredVars.forEach((varName, index) => {
    console.log(`   ${index + 1}. ${varName}`);
  });

  console.log("");
  console.log("⚠️  ATTENTION: Vérifiez que NUXT_PUBLIC_PAYTECH_MERCHANT_ID");
  console.log(
    '   contient votre vrai Merchant ID PayTech, pas "VotreMerchantId"'
  );
  console.log("");
}

// Exécution
async function main() {
  await checkVercelConfig();
  console.log("");
  await testPaytechConfig();

  console.log("");
  console.log("🚀 PROCHAINES ÉTAPES:");
  console.log("1. Configurez toutes les variables sur Vercel");
  console.log("2. Redéployez le site (git push)");
  console.log("3. Relancez ce test: npm run test:paytech");
  console.log("4. Testez manuellement le paiement");
  console.log("");
}

main().catch(console.error);
