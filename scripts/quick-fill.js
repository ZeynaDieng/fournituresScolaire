#!/usr/bin/env node
// scripts/quick-fill.js
// Script rapide pour remplir juste avec les champs qui existent

const AIRTABLE_API_KEY =
  "patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a";
const AIRTABLE_BASE_ID = "appOtYkVavA4MMMnN";

async function quickFill() {
  console.log("⚡ REMPLISSAGE RAPIDE DES PROMOTIONS");
  console.log("(Les champs promotions sont déjà prêts)");

  // Données pour promotions
  const promotions = [
    {
      fields: {
        Title: "Pack Rentrée CP - Offre Spéciale",
        Description:
          "Profitez de -25% sur tous les packs CP pour bien commencer l'année scolaire.",
        Discount: 25,
        Type: "percentage",
        "End Date": "2025-10-15",
        Category: "Packs Scolaires",
        Trending: true,
        Featured: true,
        Icon: "🎒",
        Rating: 5,
        Features: "Livraison gratuite\nQualité premium\nPack complet",
        "Original Price": 20000,
        "Current Price": 15000,
        "Is Active": true,
      },
    },
    {
      fields: {
        Title: "Fournitures Collège - Super Promo",
        Description:
          "Réduction exceptionnelle de 30% sur tous les articles pour collégiens.",
        Discount: 30,
        Type: "percentage",
        "End Date": "2025-09-30",
        Category: "Fournitures",
        Trending: false,
        Featured: true,
        Icon: "📚",
        Rating: 4,
        Features: "Calculatrice incluse\nKit géométrie\nCahiers premium",
        "Original Price": 35000,
        "Current Price": 24500,
        "Is Active": true,
      },
    },
  ];

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/tblrUYgl2PgYIEMY5`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: promotions }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ ${result.records.length} promotions ajoutées !`);
      console.log("\n🎯 TESTER MAINTENANT:");
      console.log("curl http://localhost:3000/api/airtable/promotions");
      console.log("\n🌐 Visitez: http://localhost:3000");
    } else {
      const error = await response.json();
      console.error("❌ Erreur:", error);
    }
  } catch (err) {
    console.error("❌ Erreur:", err.message);
  }
}

quickFill();
