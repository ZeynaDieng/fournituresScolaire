#!/usr/bin/env node

/**
 * Script de debug pour comparer les promotions affichées entre :
 * - AppPromotionCard sur la page d'accueil
 * - Page /promotions
 */

const http = require("http");

// Configuration
const BASE_URL = "http://localhost:3000";
const API_ENDPOINT = `${BASE_URL}/api/airtable/promotions`;

// Fonction helper pour faire des requêtes HTTP
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error("Erreur parsing JSON: " + error.message));
        }
      });
    });

    request.on("error", (error) => {
      reject(error);
    });

    request.setTimeout(5000, () => {
      request.destroy();
      reject(new Error("Timeout de la requête"));
    });
  });
}

async function debugPromotionComparison() {
  console.log("🔍 Analyse comparative des promotions...\n");

  try {
    // 1. Récupérer les données depuis l'API Airtable
    console.log("📡 Récupération des données depuis l'API...");
    const response = await fetchData(API_ENDPOINT);
    const allPromotions = response.data || [];

    console.log(`✅ ${allPromotions.length} promotions trouvées dans l'API\n`);

    // 2. Analyser les promotions actives (comme dans le store activePromotions)
    const activePromotions = allPromotions.filter((promo) => {
      if (!promo.isActive) return false;
      if (!promo.endDate) return true;
      return new Date(promo.endDate) > new Date();
    });

    console.log("🎯 PROMOTIONS ACTIVES (AppPromotionCard) :");
    console.log(`Nombre: ${activePromotions.length}`);
    activePromotions.forEach((promo) => {
      console.log(
        `- ${promo.title} | Discount: ${promo.discount}% | Featured: ${
          promo.featured || false
        }`
      );
      console.log(
        `  EndDate: ${
          promo.endDate
            ? new Date(promo.endDate).toLocaleDateString()
            : "Aucune"
        }`
      );
      console.log(`  IsActive: ${promo.isActive}`);
      console.log(
        `  Features: ${promo.features ? promo.features.length : 0} éléments`
      );
      console.log("");
    });

    // 3. Analyser TOUTES les promotions (comme sur la page /promotions)
    console.log("📄 TOUTES LES PROMOTIONS (Page /promotions) :");
    console.log(`Nombre: ${allPromotions.length}`);
    allPromotions.forEach((promo) => {
      console.log(
        `- ${promo.title} | Discount: ${promo.discount}% | Featured: ${
          promo.featured || false
        }`
      );
      console.log(
        `  EndDate: ${
          promo.endDate
            ? new Date(promo.endDate).toLocaleDateString()
            : "Aucune"
        }`
      );
      console.log(`  IsActive: ${promo.isActive}`);
      console.log(
        `  Features: ${promo.features ? promo.features.length : 0} éléments`
      );
      console.log("");
    });

    // 4. Comparer les différences
    const inactivePromotions = allPromotions.filter((promo) => !promo.isActive);
    const expiredPromotions = allPromotions.filter((promo) => {
      if (!promo.endDate) return false;
      return new Date(promo.endDate) <= new Date();
    });

    console.log("⚠️  DIFFÉRENCES DÉTECTÉES :");
    console.log(`- Promotions inactives: ${inactivePromotions.length}`);
    console.log(`- Promotions expirées: ${expiredPromotions.length}`);
    console.log(
      `- Différence de nombre: ${
        allPromotions.length - activePromotions.length
      }`
    );

    if (inactivePromotions.length > 0) {
      console.log("\n❌ Promotions inactives :");
      inactivePromotions.forEach((promo) => {
        console.log(`- ${promo.title} (IsActive: ${promo.isActive})`);
      });
    }

    if (expiredPromotions.length > 0) {
      console.log("\n⏰ Promotions expirées :");
      expiredPromotions.forEach((promo) => {
        console.log(
          `- ${promo.title} (Fin: ${new Date(
            promo.endDate
          ).toLocaleDateString()})`
        );
      });
    }

    // 5. Vérifier les features
    console.log("\n🔧 VÉRIFICATION DES FEATURES :");
    allPromotions.forEach((promo) => {
      if (promo.features) {
        console.log(
          `${promo.title}: ${
            Array.isArray(promo.features) ? "Array" : typeof promo.features
          } - ${promo.features.length || 0} éléments`
        );
        if (Array.isArray(promo.features)) {
          promo.features.forEach((feature) => console.log(`  • ${feature}`));
        } else {
          console.log(`  Contenu: ${JSON.stringify(promo.features)}`);
        }
      } else {
        console.log(`${promo.title}: Aucune feature`);
      }
      console.log("");
    });

    console.log("\n📊 RÉSUMÉ :");
    console.log(`- Total promotions API: ${allPromotions.length}`);
    console.log(
      `- Promotions actives (AppPromotionCard): ${activePromotions.length}`
    );
    console.log(
      `- Promotions page /promotions: ${allPromotions.length} (toutes)`
    );
    console.log(
      "\n✨ La différence est normale : AppPromotionCard ne montre que les promotions actives et non expirées."
    );
  } catch (error) {
    console.error("❌ Erreur lors de l'analyse:", error.message);
  }
}

// Exécuter le script
debugPromotionComparison().catch(console.error);
