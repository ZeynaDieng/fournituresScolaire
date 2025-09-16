#!/usr/bin/env node
// scripts/test-store-promotions.js
// Test pour comparer les données du store

console.log("🧪 TEST DES DONNÉES DU STORE AIRTABLE");
console.log("=".repeat(50));

async function testStoreData() {
  try {
    // Test de l'endpoint direct
    const response = await fetch(
      "http://localhost:3000/api/airtable/promotions"
    );
    const apiData = await response.json();

    console.log("📡 DONNÉES DE L'ENDPOINT:");
    console.log(`   Total: ${apiData.total}`);
    console.log(`   Fallback: ${apiData.fallback ? "OUI" : "NON"}`);

    if (apiData.data && apiData.data.length > 0) {
      // Analyser les dates pour activePromotions
      const now = new Date();
      const active = apiData.data.filter((promo) => {
        if (!promo.isActive) return false;
        if (!promo.endDate) return true;
        return new Date(promo.endDate) > now;
      });

      console.log(`   Active (après filtrage date): ${active.length}`);

      console.log("\n📅 DÉTAIL DES DATES:");
      apiData.data.slice(0, 3).forEach((promo, i) => {
        const endDate = promo.endDate ? new Date(promo.endDate) : null;
        const isActive = promo.isActive;
        const isFuture = endDate ? endDate > now : true;
        const willShow = isActive && isFuture;

        console.log(`   ${i + 1}. ${promo.title}`);
        console.log(`      - isActive: ${isActive}`);
        console.log(
          `      - endDate: ${
            endDate ? endDate.toLocaleDateString("fr") : "N/A"
          }`
        );
        console.log(`      - Future: ${isFuture}`);
        console.log(`      - Sera affiché: ${willShow ? "✅" : "❌"}`);
      });
    }

    return apiData;
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    return null;
  }
}

testStoreData().then((data) => {
  console.log("\n🎯 ANALYSE:");
  console.log("=".repeat(20));

  if (data && data.data) {
    const now = new Date();
    const allPromos = data.data;
    const activePromos = allPromos.filter((p) => {
      if (!p.isActive) return false;
      if (!p.endDate) return true;
      return new Date(p.endDate) > now;
    });

    console.log(`🔢 Total promotions dans Airtable: ${allPromos.length}`);
    console.log(`✅ Promotions actives (affichées): ${activePromos.length}`);
    console.log(
      `❌ Promotions expirées/inactives: ${
        allPromos.length - activePromos.length
      }`
    );

    if (activePromos.length !== allPromos.length) {
      console.log("\n⚠️  CERTAINES PROMOTIONS NE S'AFFICHENT PAS:");
      const hidden = allPromos.filter((p) => {
        if (!p.isActive) return true;
        if (!p.endDate) return false;
        return new Date(p.endDate) <= now;
      });

      hidden.forEach((promo) => {
        const reason = !promo.isActive ? "Inactive" : "Expirée";
        console.log(`   - ${promo.title} (${reason})`);
      });
    } else {
      console.log("\n✅ Toutes les promotions sont actives et s'affichent");
    }
  }

  console.log("\n🔗 LIENS DE TEST:");
  console.log("   Page d'accueil: http://localhost:3000");
  console.log("   Page promotions: http://localhost:3000/promotions");
});
