/**
 * Test de l'API contact en production
 * Vérifie les détails de la réponse et analyse les logs
 */

import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

console.log("🔍 TEST API CONTACT EN PRODUCTION");
console.log("==================================");
console.log("");

async function testContactAPI() {
  const testData = {
    name: "Test Production Debug",
    email: "test.production@debug.com",
    phone: "221777780456",
    subject: "Test Production Debug",
    message: "Test détaillé pour diagnostiquer le problème de production",
  };

  console.log("📤 Envoi des données:", JSON.stringify(testData, null, 2));
  console.log(
    "🌐 URL:",
    "https://fournitures-scolaire.vercel.app/api/contact/send"
  );
  console.log("");

  try {
    const response = await fetch(
      "https://fournitures-scolaire.vercel.app/api/contact/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Test-Script/1.0",
        },
        body: JSON.stringify(testData),
      }
    );

    const responseText = await response.text();
    console.log(`📡 Status: ${response.status}`);
    console.log(`📡 Headers:`, JSON.stringify([...response.headers], null, 2));
    console.log(`📡 Body raw:`, responseText);
    console.log("");

    try {
      const result = JSON.parse(responseText);
      console.log(`📋 Réponse parsée:`, JSON.stringify(result, null, 2));

      if (result.fallback) {
        console.log("⚠️  MODE FALLBACK DÉTECTÉ !");
        console.log("⚠️  Les données ne sont PAS enregistrées dans Airtable");
        console.log("");
        console.log("🔍 Causes possibles:");
        console.log("   1. Variables d'environnement manquantes sur Vercel");
        console.log("   2. Code non déployé (version locale vs production)");
        console.log("   3. Erreur dans l'API Airtable");
        console.log("   4. Problème de noms de champs");
      } else {
        console.log("✅ Enregistrement direct dans Airtable");
        if (result.recordId) {
          console.log(`📋 Record ID: ${result.recordId}`);
        }
      }
    } catch (parseError) {
      console.log("❌ Erreur parsing JSON:", parseError.message);
      console.log("📄 Contenu brut:", responseText);
    }
  } catch (error) {
    console.log("❌ Erreur réseau:", error.message);
  }
}

async function checkDeploymentStatus() {
  console.log("🚀 Vérification du statut de déploiement...");
  console.log("");

  try {
    // Test d'un endpoint simple pour vérifier que le déploiement fonctionne
    const response = await fetch(
      "https://fournitures-scolaire.vercel.app/api/products",
      {
        method: "GET",
        headers: {
          "User-Agent": "Test-Script/1.0",
        },
      }
    );

    console.log(`📡 Status produits: ${response.status}`);

    if (response.ok) {
      console.log("✅ API en ligne et fonctionnelle");
    } else {
      console.log("⚠️  API en ligne mais réponse non-ok");
    }
  } catch (error) {
    console.log("❌ Erreur connexion:", error.message);
  }
  console.log("");
}

// Test avec Airtable direct pour comparaison
async function testDirectAirtable() {
  console.log("🎯 TEST AIRTABLE DIRECT (pour comparaison)");
  console.log("==========================================");
  console.log("");

  const contactData = {
    records: [
      {
        fields: {
          Name: "Test Direct Airtable",
          Email: "test.direct@airtable.com",
          Phone: "221777780456",
          Subject: "Test Direct Airtable",
          Message: "Test pour comparer avec l'API du site",
        },
      },
    ],
  };

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_CONTACTS_TABLE}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Insertion directe Airtable réussie");
      console.log(`📋 Record ID: ${result.records[0].id}`);
    } else {
      const error = await response.json();
      console.log(
        "❌ Erreur insertion directe:",
        JSON.stringify(error, null, 2)
      );
    }
  } catch (error) {
    console.log("❌ Erreur test direct:", error.message);
  }
  console.log("");
}

// Exécution du test
async function runTest() {
  await checkDeploymentStatus();
  await testContactAPI();
  await testDirectAirtable();

  console.log("✅ Test terminé !");
}

runTest();
