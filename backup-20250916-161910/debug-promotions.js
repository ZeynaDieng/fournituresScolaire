#!/usr/bin/env node
// scripts/debug-promotions.js
// Script pour déboguer les différences de promotions entre pages

const fs = require("fs");

console.log("🔍 DEBUG - PROMOTIONS ENTRE PAGES");
console.log("=".repeat(50));

async function testPromotionsEndpoint() {
  try {
    // Test de l'endpoint promotions
    const response = await fetch(
      "http://localhost:3000/api/airtable/promotions"
    );
    const data = await response.json();

    console.log("\n📊 ENDPOINT PROMOTIONS:");
    console.log(`✅ Succès: ${data.success}`);
    console.log(`📦 Total: ${data.total || data.data?.length || 0}`);
    console.log(`💾 Fallback: ${data.fallback ? "OUI" : "NON"}`);

    if (data.data && data.data.length > 0) {
      console.log("\n🎯 PREMIÈRE PROMOTION:");
      const promo = data.data[0];
      console.log(`   ID: ${promo.id}`);
      console.log(`   Titre: ${promo.title}`);
      console.log(`   Prix original: ${promo.originalPrice} CFA`);
      console.log(`   Prix actuel: ${promo.currentPrice} CFA`);
      console.log(
        `   Features: ${
          Array.isArray(promo.features)
            ? promo.features.join(", ")
            : typeof promo.features
        }`
      );
      console.log(`   Trending: ${promo.trending}`);
      console.log(`   Featured: ${promo.featured}`);
    }

    return data;
  } catch (error) {
    console.error("❌ Erreur endpoint:", error.message);
    return null;
  }
}

async function analyzePromotionsData() {
  const data = await testPromotionsEndpoint();

  if (!data || !data.data) {
    console.log("\n❌ Impossible d'analyser les données");
    return;
  }

  console.log("\n🔍 ANALYSE DÉTAILLÉE:");
  console.log("=".repeat(30));

  const promos = data.data;

  // Analyse des prix
  const withPrices = promos.filter((p) => p.originalPrice && p.currentPrice);
  const withoutPrices = promos.filter(
    (p) => !p.originalPrice || !p.currentPrice
  );

  console.log(`💰 Promotions avec prix: ${withPrices.length}`);
  console.log(`❓ Promotions sans prix: ${withoutPrices.length}`);

  // Analyse des features
  const withFeatures = promos.filter(
    (p) => p.features && Array.isArray(p.features) && p.features.length > 0
  );
  const badFeatures = promos.filter(
    (p) => p.features && !Array.isArray(p.features)
  );

  console.log(`✨ Features correctes: ${withFeatures.length}`);
  console.log(`⚠️  Features mal formatées: ${badFeatures.length}`);

  // Trending vs Featured
  const trending = promos.filter((p) => p.trending);
  const featured = promos.filter((p) => p.featured);

  console.log(`🔥 Trending: ${trending.length}`);
  console.log(`⭐ Featured: ${featured.length}`);

  console.log("\n💡 RECOMMANDATIONS:");
  console.log("=".repeat(20));

  if (withoutPrices.length > 0) {
    console.log(
      "⚠️  Certaines promotions n'ont pas de prix - cela peut causer des NaN dans le panier"
    );
  }

  if (badFeatures.length > 0) {
    console.log(
      "⚠️  Certaines features sont mal formatées - cela peut causer des problèmes d'affichage"
    );
  }

  if (data.fallback) {
    console.log(
      "⚠️  Mode fallback actif - les données viennent du code, pas d'Airtable"
    );
  } else {
    console.log("✅ Données proviennent d'Airtable - configuration correcte !");
  }
}

// Test des pages
async function testPages() {
  console.log("\n🌐 TEST DES PAGES:");
  console.log("=".repeat(20));

  console.log("📄 Page d'accueil: http://localhost:3000/");
  console.log(
    "   - Utilise: AppPromotionCard (qui utilise airtableStore.activePromotions)"
  );
  console.log("📄 Page promotions: http://localhost:3000/promotions");
  console.log(
    "   - Utilise: pages/promotions.vue (qui utilise airtableStore.promotions)"
  );

  console.log("\n🔍 DIFFÉRENCES POTENTIELLES:");
  console.log("   - activePromotions: filtrées par date et statut actif");
  console.log("   - promotions: toutes les promotions du store");
}

// Exécution
analyzePromotionsData().then(() => {
  testPages();
  console.log("\n🎯 NEXT STEPS:");
  console.log("1. Visitez http://localhost:3000 pour voir la page d'accueil");
  console.log("2. Visitez http://localhost:3000/promotions pour comparer");
  console.log("3. Vérifiez la console du navigateur pour des erreurs JS");
});
