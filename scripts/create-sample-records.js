#!/usr/bin/env node
// scripts/create-sample-records.js
// Script pour créer des enregistrements d'exemple qui établiront les champs dans Airtable

const AIRTABLE_API_KEY =
  "patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a";
const AIRTABLE_BASE_ID = "appOtYkVavA4MMMnN";

// IDs des tables
const TABLES = {
  PROMOTIONS: "tblrUYgl2PgYIEMY5",
  TESTIMONIALS: "tblYjfi1FFk1CCH46",
};

async function createSampleRecords() {
  console.log("🚀 CRÉATION D'ENREGISTREMENTS D'EXEMPLE");
  console.log("=".repeat(50));

  try {
    // 1. Créer un enregistrement d'exemple pour promotions
    console.log("\n📣 Création d'un échantillon de promotion...");

    const promotionSample = {
      records: [
        {
          fields: {
            Title: "Échantillon - Pack Rentrée",
            Description:
              "Exemple de promotion pour créer les champs automatiquement",
            Discount: 25,
            Type: "percentage",
            Category: "Packs",
            Icon: "🎒",
          },
        },
      ],
    };

    const promoResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLES.PROMOTIONS}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promotionSample),
      }
    );

    if (promoResponse.ok) {
      const promoResult = await promoResponse.json();
      console.log(
        "✅ Échantillon de promotion créé:",
        promoResult.records[0].id
      );
    } else {
      const promoError = await promoResponse.json();
      console.error("❌ Erreur promotion:", promoError);
    }

    // 2. Créer un enregistrement d'exemple pour testimonials
    console.log("\n💬 Création d'un échantillon de témoignage...");

    const testimonialSample = {
      records: [
        {
          fields: {
            Name: "Test User",
            Role: "Testeur",
            Text: "Exemple de témoignage pour créer les champs automatiquement",
            Rating: 5,
            Location: "Test City",
          },
        },
      ],
    };

    const testResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLES.TESTIMONIALS}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testimonialSample),
      }
    );

    if (testResponse.ok) {
      const testResult = await testResponse.json();
      console.log(
        "✅ Échantillon de témoignage créé:",
        testResult.records[0].id
      );
    } else {
      const testError = await testResponse.json();
      console.error("❌ Erreur témoignage:", testError);
    }

    console.log("\n🎯 ÉTAPES SUIVANTES:");
    console.log("1. Vérifiez dans Airtable que les champs ont été créés");
    console.log("2. Ajoutez manuellement les champs manquants si nécessaire");
    console.log("3. Exécutez: node scripts/fill-airtable-data.js");
    console.log("4. Vérifiez: node scripts/inspect-airtable-structure.js");
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

createSampleRecords();
