#!/usr/bin/env node
// scripts/test-website-functionality.js
// Script pour tester les fonctionnalités en temps réel du site

const API_BASE = "http://localhost:3000/api";
const SITE_BASE = "http://localhost:3000";

async function testWebsitePages() {
  console.log("🌐 TEST DES PAGES DU SITE WEB");
  console.log("=".repeat(40));

  const pages = [
    { name: "Page d'accueil", url: `${SITE_BASE}/` },
    { name: "Page promotions", url: `${SITE_BASE}/promotions` },
    { name: "Page produits", url: `${SITE_BASE}/products` },
    { name: "Page packs", url: `${SITE_BASE}/packs` },
  ];

  for (const page of pages) {
    try {
      console.log(`\n🔗 Test ${page.name}...`);
      const response = await fetch(page.url);

      if (response.ok) {
        const html = await response.text();
        const hasAirtableData =
          html.includes("airtableStore") || html.includes("Airtable");
        const hasPromotions =
          html.includes("promotion") || html.includes("Promotion");
        const hasTestimonials =
          html.includes("testimonial") || html.includes("Témoignage");

        console.log(`✅ ${page.name}: ACCESSIBLE`);
        console.log(
          `   📊 Store Airtable détecté: ${hasAirtableData ? "✅" : "❌"}`
        );
        console.log(`   🏷️  Promotions: ${hasPromotions ? "✅" : "❌"}`);
        console.log(`   💬 Témoignages: ${hasTestimonials ? "✅" : "❌"}`);
      } else {
        console.log(`❌ ${page.name}: ERREUR ${response.status}`);
      }
    } catch (error) {
      console.log(`💥 ${page.name}: ÉCHEC - ${error.message}`);
    }
  }
}

async function testAPIEndpoints() {
  console.log("\n🔌 TEST DES ENDPOINTS API");
  console.log("=".repeat(40));

  const endpoints = [
    { name: "Produits", url: `${API_BASE}/airtable/products` },
    { name: "Packs", url: `${API_BASE}/airtable/packs` },
    { name: "Promotions", url: `${API_BASE}/airtable/promotions` },
    { name: "Testimonials", url: `${API_BASE}/airtable/testimonials` },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Test API ${endpoint.name}...`);
      const response = await fetch(endpoint.url);
      const data = await response.json();

      if (data.success) {
        const count = data.data?.length || 0;
        console.log(`✅ ${endpoint.name}: ${count} éléments`);

        if (count === 0) {
          console.log(`   ⚠️  Table vide - ajoutez des données dans Airtable`);
        }

        if (data.fallback) {
          console.log(`   ⚠️  Mode fallback actif`);
        }
      } else {
        console.log(`❌ ${endpoint.name}: ÉCHEC`);
        if (data.fallback) {
          console.log(`   🔄 Fallback: ${data.data?.length || 0} éléments`);
        }
      }
    } catch (error) {
      console.log(`💥 ${endpoint.name}: ERREUR - ${error.message}`);
    }
  }
}

async function showSummary() {
  console.log("\n📋 RÉSUMÉ DE LA DYNAMISATION");
  console.log("=".repeat(40));

  try {
    // Test des données principales
    const [products, packs, promotions, testimonials] = await Promise.all([
      fetch(`${API_BASE}/airtable/products`).then((r) => r.json()),
      fetch(`${API_BASE}/airtable/packs`).then((r) => r.json()),
      fetch(`${API_BASE}/airtable/promotions`).then((r) => r.json()),
      fetch(`${API_BASE}/airtable/testimonials`).then((r) => r.json()),
    ]);

    const stats = {
      products: products.data?.length || 0,
      packs: packs.data?.length || 0,
      promotions: promotions.data?.length || 0,
      testimonials: testimonials.data?.length || 0,
    };

    const total = Object.values(stats).reduce((a, b) => a + b, 0);

    console.log(`📊 DONNÉES DISPONIBLES:`);
    console.log(`   📦 Produits: ${stats.products}`);
    console.log(`   🎒 Packs: ${stats.packs}`);
    console.log(`   🏷️  Promotions: ${stats.promotions}`);
    console.log(`   💬 Témoignages: ${stats.testimonials}`);
    console.log(`   📈 TOTAL: ${total} éléments`);

    if (stats.promotions === 0) {
      console.log("\n⚠️  ACTION REQUISE:");
      console.log("   📝 Ajoutez des promotions dans Airtable");
      console.log("   📖 Consultez: GUIDE_REMPLISSAGE_AIRTABLE.md");
    }

    if (total > 15) {
      console.log("\n🎉 EXCELLENT! Votre site a suffisamment de données");
    } else if (total > 5) {
      console.log("\n👍 BIEN! Votre site a des données de base");
    } else {
      console.log("\n⚠️  ATTENTION! Peu de données disponibles");
    }
  } catch (error) {
    console.log(`💥 Erreur lors du calcul du résumé: ${error.message}`);
  }
}

async function main() {
  console.log("🚀 TEST COMPLET DU SITE DYNAMIQUE");
  console.log("=".repeat(50));
  console.log(`🕐 ${new Date().toLocaleString("fr-FR")}`);

  await testAPIEndpoints();
  await testWebsitePages();
  await showSummary();

  console.log("\n🔗 LIENS UTILES:");
  console.log(`   🌐 Site web: ${SITE_BASE}`);
  console.log(`   📊 API Airtable: ${API_BASE}/airtable`);
  console.log(`   📖 Guide: GUIDE_REMPLISSAGE_AIRTABLE.md`);
  console.log("=".repeat(50));
}

// Exécution du script
main().catch(console.error);
