#!/usr/bin/env node

/**
 * Script pour tester l'API publique des détails de pack
 */

const fetch = require("node-fetch");

console.log("🔍 TEST DE L'API DÉTAILS PACK");
console.log("=============================");
console.log("");

async function testPackDetailsAPI() {
  try {
    // D'abord, récupérer la liste des packs pour avoir un ID valide
    console.log("1️⃣ Récupération de la liste des packs...");

    const packsResponse = await fetch(
      "http://localhost:3000/api/airtable/packs"
    );

    if (!packsResponse.ok) {
      console.log("❌ Impossible de récupérer la liste des packs");
      return;
    }

    const packsData = await packsResponse.json();

    if (!packsData.success || !packsData.data || packsData.data.length === 0) {
      console.log("❌ Aucun pack disponible pour tester");
      return;
    }

    const firstPack = packsData.data[0];
    console.log(
      `✅ Pack de test trouvé: ${firstPack.name} (ID: ${firstPack.id})`
    );
    console.log("");

    // Tester l'API des détails avec cet ID
    console.log("2️⃣ Test de l'API des détails...");
    console.log(
      `📡 URL: http://localhost:3000/api/airtable/packs/${firstPack.id}`
    );

    const detailResponse = await fetch(
      `http://localhost:3000/api/airtable/packs/${firstPack.id}`
    );

    console.log(
      `📊 Status: ${detailResponse.status} ${detailResponse.statusText}`
    );

    if (!detailResponse.ok) {
      const errorText = await detailResponse.text();
      console.log("❌ Erreur:");
      console.log(errorText);
      return;
    }

    const detailData = await detailResponse.json();

    console.log("✅ API DÉTAILS FONCTIONNE !");
    console.log(
      `🔍 Source des données: ${detailData.source || "non spécifiée"}`
    );

    if (detailData.warning) {
      console.log(`⚠️ Avertissement: ${detailData.warning}`);
    }

    console.log("");

    if (detailData.success && detailData.data) {
      console.log("🎉 DÉTAILS DU PACK:");
      console.log("==================");

      const pack = detailData.data;
      console.log(`📦 Nom: ${pack.name}`);
      console.log(`🎯 ID: ${pack.id}`);
      console.log(`📚 Niveau: ${pack.level}`);
      console.log(`💰 Prix: ${pack.price?.toLocaleString("fr-FR")} FCFA`);

      if (pack.originalPrice) {
        const discount = Math.round(
          ((pack.originalPrice - pack.price) / pack.originalPrice) * 100
        );
        console.log(
          `💸 Prix original: ${pack.originalPrice.toLocaleString(
            "fr-FR"
          )} FCFA (-${discount}%)`
        );
      }

      console.log(`📝 Description: ${pack.description}`);
      console.log(`🖼️ Image: ${pack.image}`);
      console.log(`⭐ Populaire: ${pack.isPopular ? "Oui" : "Non"}`);
      console.log(`📦 En stock: ${pack.inStock ? "Oui" : "Non"}`);
      console.log(`🏷️ Promotion: ${pack.isPromotion ? "Oui" : "Non"}`);

      if (pack.promotionEndDate) {
        console.log(
          `⏰ Fin promotion: ${new Date(
            pack.promotionEndDate
          ).toLocaleDateString("fr-FR")}`
        );
      }

      if (pack.contents && pack.contents.length > 0) {
        console.log(`📋 Contenu (${pack.contents.length} éléments):`);
        pack.contents.slice(0, 5).forEach((item, i) => {
          console.log(`   ${i + 1}. ${item}`);
        });
        if (pack.contents.length > 5) {
          console.log(`   ... et ${pack.contents.length - 5} autres éléments`);
        }
      }

      console.log("");

      if (detailData.source === "airtable") {
        console.log(
          "🎯 PARFAIT ! Vos vraies données Airtable sont utilisées !"
        );
        console.log(
          "✅ VOTRE PAGE /PACKS/[ID] AFFICHE MAINTENANT VOS DONNÉES RÉELLES !"
        );
      } else {
        console.log("⚠️ Données de fallback utilisées");
        console.log("💡 Vérifiez votre configuration Airtable dans le .env");
      }
    } else {
      console.log("⚠️ Données du pack non trouvées ou erreur dans la réponse");
    }

    // Test avec un ID inexistant
    console.log("\n3️⃣ Test avec ID inexistant...");

    const invalidResponse = await fetch(
      "http://localhost:3000/api/airtable/packs/pack-inexistant"
    );
    console.log(
      `📊 Status ID inexistant: ${invalidResponse.status} ${invalidResponse.statusText}`
    );

    if (invalidResponse.status === 404) {
      console.log("✅ Gestion d'erreur 404 correcte");
    } else {
      console.log("⚠️ Gestion d'erreur inattendue");
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
console.log("💡 Permet d'afficher les détails complets de chaque pack");
console.log("");

testPackDetailsAPI()
  .then(() => {
    console.log("\n🏁 Test terminé !");
  })
  .catch((error) => {
    console.error("\n💥 Erreur:", error.message);
  });
