// scripts/test-dynamic-data.js
/**
 * Script de test pour vérifier que toutes les données proviennent d'Airtable
 */

const BASE_URL = "http://localhost:3000";

async function testEndpoint(endpoint, name) {
  try {
    console.log(`\n🔍 Test ${name}...`);
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      console.log(`✅ ${name}: ${data.data?.length || 0} éléments récupérés`);
      if (data.fallback) {
        console.log(
          `⚠️  ${name}: Utilise les données de fallback (Airtable indisponible)`
        );
      } else {
        console.log(`🎯 ${name}: Données Airtable authentiques`);
      }
      return {
        success: true,
        count: data.data?.length || 0,
        fallback: data.fallback,
      };
    } else {
      console.log(`❌ ${name}: ${data.error || "Erreur inconnue"}`);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log("🚀 TEST COMPLET DES DONNÉES DYNAMIQUES AIRTABLE");
  console.log("=".repeat(60));

  const endpoints = [
    { endpoint: "/api/airtable/products", name: "PRODUITS" },
    { endpoint: "/api/airtable/packs", name: "PACKS SCOLAIRES" },
    { endpoint: "/api/airtable/promotions", name: "PROMOTIONS" },
    { endpoint: "/api/airtable/testimonials", name: "TÉMOIGNAGES" },
  ];

  let totalSuccess = 0;
  let totalFallback = 0;
  const results = [];

  for (const { endpoint, name } of endpoints) {
    const result = await testEndpoint(endpoint, name);
    results.push({ name, ...result });

    if (result.success) {
      totalSuccess++;
      if (result.fallback) {
        totalFallback++;
      }
    }
  }

  console.log("\n📊 RÉSUMÉ DES TESTS");
  console.log("=".repeat(60));
  console.log(`✅ Endpoints fonctionnels: ${totalSuccess}/${endpoints.length}`);
  console.log(
    `🎯 Connectés à Airtable: ${totalSuccess - totalFallback}/${
      endpoints.length
    }`
  );
  console.log(`⚠️  En mode fallback: ${totalFallback}/${endpoints.length}`);

  if (totalSuccess === endpoints.length) {
    if (totalFallback === 0) {
      console.log("\n🎉 PARFAIT ! Toutes les données proviennent d'Airtable");
      console.log("💡 Le site est 100% dynamique");
    } else {
      console.log("\n✅ BIEN ! Tous les endpoints fonctionnent");
      console.log(
        "💡 Certains utilisent le fallback (vérifiez la config Airtable)"
      );
    }
  } else {
    console.log("\n⚠️  ATTENTION ! Certains endpoints ne fonctionnent pas");
    console.log("🔧 Vérifiez la configuration et les endpoints API");
  }

  console.log("\n🔗 LIENS DE TEST MANUELS:");
  endpoints.forEach(({ endpoint, name }) => {
    console.log(`${name}: ${BASE_URL}${endpoint}`);
  });

  console.log("\n📝 PAGES À VÉRIFIER:");
  console.log(`Page d'accueil: ${BASE_URL}/`);
  console.log(`Produits: ${BASE_URL}/products`);
  console.log(`Packs: ${BASE_URL}/packs`);
  console.log(`Promotions: ${BASE_URL}/promotions`);
}

// Exécuter les tests
runTests().catch(console.error);
