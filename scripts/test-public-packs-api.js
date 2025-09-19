#!/usr/bin/env node

/**
 * Script pour tester l'API publique des packs avec vraies données Airtable
 */

const fetch = require("node-fetch");

console.log("🌐 TEST DE L'API PUBLIQUE PACKS");
console.log("===============================");
console.log("");

async function testPublicPacksAPI() {
  try {
    console.log("🚀 Test de l'API publique des packs...");
    console.log("📡 URL: http://localhost:3000/api/airtable/packs");
    console.log("");

    const response = await fetch("http://localhost:3000/api/airtable/packs");

    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ Erreur:");
      console.log(errorText);
      return;
    }

    const data = await response.json();

    console.log("✅ API PUBLIQUE FONCTIONNE !");
    console.log(`📦 ${data.data ? data.data.length : 0} pack(s) récupéré(s)`);
    console.log(`🔍 Source des données: ${data.source || "non spécifiée"}`);

    if (data.warning) {
      console.log(`⚠️ Avertissement: ${data.warning}`);
    }

    console.log("");

    if (data.success && data.data && data.data.length > 0) {
      console.log("🎉 APERÇU DE VOS PACKS:");
      console.log("======================");

      data.data.slice(0, 3).forEach((pack, index) => {
        console.log(`\n${index + 1}. ${pack.name}`);
        console.log(`   Niveau: ${pack.level}`);
        console.log(`   Prix: ${pack.price.toLocaleString("fr-FR")} FCFA`);
        if (pack.originalPrice) {
          const discount = Math.round(
            ((pack.originalPrice - pack.price) / pack.originalPrice) * 100
          );
          console.log(
            `   Prix original: ${pack.originalPrice.toLocaleString(
              "fr-FR"
            )} FCFA (-${discount}%)`
          );
        }
        console.log(`   En stock: ${pack.inStock ? "✅" : "❌"}`);
        console.log(`   Populaire: ${pack.isPopular ? "⭐" : "➖"}`);
        console.log(`   Promotion: ${pack.isPromotion ? "🏷️" : "➖"}`);

        if (pack.contents && pack.contents.length > 0) {
          console.log(`   Contenu: ${pack.contents.length} éléments`);
        }
      });

      if (data.data.length > 3) {
        console.log(`\n... et ${data.data.length - 3} autre(s) pack(s)`);
      }

      console.log("\n📊 ANALYSE:");
      console.log("===========");

      const levels = [...new Set(data.data.map((pack) => pack.level))];
      console.log(`Niveaux: ${levels.join(", ")}`);

      const popular = data.data.filter((pack) => pack.isPopular).length;
      console.log(`Packs populaires: ${popular}/${data.data.length}`);

      const inStock = data.data.filter((pack) => pack.inStock).length;
      console.log(`Packs en stock: ${inStock}/${data.data.length}`);

      const promotions = data.data.filter((pack) => pack.isPromotion).length;
      console.log(`Packs en promotion: ${promotions}/${data.data.length}`);

      const prices = data.data.map((pack) => pack.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = Math.round(
        prices.reduce((a, b) => a + b, 0) / prices.length
      );

      console.log(
        `Prix: ${minPrice.toLocaleString("fr-FR")} - ${maxPrice.toLocaleString(
          "fr-FR"
        )} FCFA (moyenne: ${avgPrice.toLocaleString("fr-FR")})`
      );

      if (data.source === "airtable") {
        console.log(
          "\n🎯 PARFAIT ! Vos vraies données Airtable sont utilisées !"
        );
        console.log(
          "✅ VOTRE PAGE /PACKS AFFICHE MAINTENANT VOS DONNÉES RÉELLES !"
        );
      } else {
        console.log("\n⚠️ Données de fallback utilisées");
        console.log("💡 Vérifiez votre configuration Airtable dans le .env");
      }
    } else {
      console.log("⚠️ Aucun pack trouvé ou erreur dans la réponse");
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

console.log("📋 Cette API publique utilise le token Airtable côté serveur");
console.log(
  "🔒 Aucune dépendance token côté client - parfait pour une page publique"
);
console.log(
  "💡 Assurez-vous que votre .env contient les bonnes variables Airtable"
);
console.log("");

testPublicPacksAPI()
  .then(() => {
    console.log("\n🏁 Test terminé !");
  })
  .catch((error) => {
    console.error("\n💥 Erreur:", error.message);
  });
