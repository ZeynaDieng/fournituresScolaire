#!/usr/bin/env node

/**
 * Script pour tester l'API admin des packs avec les vraies données
 */

const fetch = require("node-fetch");

console.log("🧪 TEST DE L'API ADMIN PACKS");
console.log("============================");
console.log("");

async function testAdminPacksAPI() {
  try {
    console.log("🚀 Test de l'API admin des packs...");

    // Tester l'API admin en local
    const response = await fetch("http://localhost:3000/api/admin/packs");

    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ Erreur:");
      console.log(errorText);
      return;
    }

    const data = await response.json();

    console.log("✅ API ADMIN FONCTIONNE !");
    console.log(`📦 ${data.length} pack(s) récupéré(s)`);
    console.log("");

    if (data.length > 0) {
      console.log("🎉 APERÇU DE VOS PACKS:");
      console.log("======================");

      data.slice(0, 3).forEach((pack, index) => {
        console.log(`\n${index + 1}. ${pack.Name || pack.name}`);
        console.log(`   Niveau: ${pack.Level || pack.level}`);
        console.log(`   Prix: ${pack.Price || pack.price} FCFA`);
        console.log(`   En stock: ${pack["In Stock"] !== false ? "✅" : "❌"}`);
        console.log(`   Populaire: ${pack["Is Popular"] ? "⭐" : "➖"}`);
      });

      if (data.length > 3) {
        console.log(`\n... et ${data.length - 3} autre(s) pack(s)`);
      }

      console.log("\n📊 ANALYSE:");
      console.log("===========");

      const levels = [...new Set(data.map((pack) => pack.Level || pack.level))];
      console.log(`Niveaux: ${levels.join(", ")}`);

      const popular = data.filter((pack) => pack["Is Popular"]).length;
      console.log(`Packs populaires: ${popular}/${data.length}`);

      const inStock = data.filter((pack) => pack["In Stock"] !== false).length;
      console.log(`Packs en stock: ${inStock}/${data.length}`);

      console.log(
        "\n✅ VOTRE PAGE /PACKS VA MAINTENANT AFFICHER CES DONNÉES !"
      );
    } else {
      console.log("⚠️ Aucun pack trouvé");
    }
  } catch (error) {
    console.log("❌ ERREUR lors du test:");
    console.log(`   ${error.message}`);

    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 SOLUTION:");
      console.log("   Démarrez votre serveur Nuxt avec: npm run dev");
    }
  }
}

console.log(
  "📋 Ce script teste l'API que votre page /packs utilise maintenant"
);
console.log("💡 Assurez-vous que votre .env contient:");
console.log("   AIRTABLE_API_KEY=votre_token_airtable");
console.log("   AIRTABLE_BASE_ID=appOtYkVavA4MMMnN");
console.log("   AIRTABLE_PACKS_TABLE=tbl4JVykOdi6YFvfd");
console.log("");

testAdminPacksAPI()
  .then(() => {
    console.log("\n🏁 Test terminé !");
  })
  .catch((error) => {
    console.error("\n💥 Erreur:", error.message);
  });
