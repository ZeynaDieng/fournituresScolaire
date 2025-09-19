#!/usr/bin/env node

/**
 * Script pour afficher les données de la table Packs
 * Usage: node scripts/show-packs-data.js
 */

const fetch = require("node-fetch");

// Configuration
const BASE_URL = process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_ENDPOINT = "/api/airtable/packs";

console.log("🔍 INSPECTION DES DONNÉES PACKS");
console.log("================================");
console.log(`📡 URL de base: ${BASE_URL}`);
console.log(`🎯 Endpoint: ${API_ENDPOINT}`);
console.log("");

async function showPacksData() {
  try {
    console.log("📋 Récupération des données...");

    const response = await fetch(`${BASE_URL}${API_ENDPOINT}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("✅ Réponse reçue avec succès !");
    console.log("");

    // Afficher les informations générales
    console.log("📊 INFORMATIONS GÉNÉRALES");
    console.log("========================");
    console.log(`Status: ${data.success ? "✅ Succès" : "❌ Échec"}`);
    console.log(`Nombre de packs: ${data.data ? data.data.length : 0}`);
    console.log("");

    if (data.success && data.data && data.data.length > 0) {
      console.log("📦 DÉTAILS DES PACKS");
      console.log("===================");

      data.data.forEach((pack, index) => {
        console.log(`\n${index + 1}. ${pack.name}`);
        console.log(`   ID: ${pack.id}`);
        console.log(`   Niveau: ${pack.level}`);
        console.log(`   Prix: ${pack.price} FCFA`);
        if (pack.originalPrice) {
          console.log(`   Prix original: ${pack.originalPrice} FCFA`);
          const discount = Math.round(
            ((pack.originalPrice - pack.price) / pack.originalPrice) * 100
          );
          console.log(`   Réduction: ${discount}%`);
        }
        console.log(`   Image: ${pack.image}`);
        console.log(`   Description: ${pack.description}`);
        console.log(`   Populaire: ${pack.isPopular ? "⭐ Oui" : "Non"}`);
        console.log(`   En stock: ${pack.inStock ? "✅ Oui" : "❌ Non"}`);
        console.log(`   Promotion: ${pack.isPromotion ? "🏷️ Oui" : "Non"}`);

        if (pack.contents && pack.contents.length > 0) {
          console.log(`   Contenu (${pack.contents.length} éléments):`);
          pack.contents.forEach((item, i) => {
            console.log(`     ${i + 1}. ${item}`);
          });
        }

        if (pack.promotionEndDate) {
          console.log(
            `   Fin de promotion: ${new Date(
              pack.promotionEndDate
            ).toLocaleDateString("fr-FR")}`
          );
        }

        console.log("   " + "─".repeat(50));
      });

      // Statistiques
      console.log("\n📈 STATISTIQUES");
      console.log("===============");

      const levels = [...new Set(data.data.map((pack) => pack.level))];
      console.log(`Niveaux disponibles: ${levels.join(", ")}`);

      const popularPacks = data.data.filter((pack) => pack.isPopular).length;
      console.log(`Packs populaires: ${popularPacks}/${data.data.length}`);

      const promotions = data.data.filter((pack) => pack.isPromotion).length;
      console.log(`Packs en promotion: ${promotions}/${data.data.length}`);

      const inStock = data.data.filter((pack) => pack.inStock).length;
      console.log(`Packs en stock: ${inStock}/${data.data.length}`);

      const prices = data.data.map((pack) => pack.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = Math.round(
        prices.reduce((a, b) => a + b, 0) / prices.length
      );

      console.log(`Prix minimum: ${minPrice} FCFA`);
      console.log(`Prix maximum: ${maxPrice} FCFA`);
      console.log(`Prix moyen: ${avgPrice} FCFA`);
    } else {
      console.log("⚠️ Aucune donnée de pack trouvée");
      if (data.error) {
        console.log(`Erreur: ${data.error}`);
      }
    }
  } catch (error) {
    console.error("❌ ERREUR lors de la récupération des données:");
    console.error(`   ${error.message}`);

    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 SUGGESTIONS:");
      console.log(
        "   1. Vérifiez que le serveur Nuxt est démarré (npm run dev)"
      );
      console.log(
        "   2. Vérifiez l'URL de base dans les variables d'environnement"
      );
    }
  }
}

// Exécuter le script
showPacksData();
