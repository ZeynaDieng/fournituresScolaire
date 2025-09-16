#!/usr/bin/env node

/**
 * Script de diagnostic pour l'endpoint PayTech qui génère des erreurs 500
 */

const fetch = require("node-fetch");

async function testPaytechEndpoint() {
  const BASE_URL =
    "https://fournitures-scolaire-7rk0j6im6-pa-assanes-projects.vercel.app";

  console.log("🔍 DIAGNOSTIC PAYTECH ENDPOINT");
  console.log("=".repeat(50));

  // Données de test
  const testData = {
    amount: 1000,
    currency: "XOF",
    target_payment: "Wave",
    customer: {
      name: "Test User",
      email: "test@example.com",
      phone: "777777777",
    },
    items: [
      {
        name: "Produit Test",
        quantity: 1,
        price: 1000,
      },
    ],
  };

  try {
    console.log("📤 Envoi de la requête PayTech...");
    console.log("URL:", `${BASE_URL}/api/paytech/initiate`);
    console.log("Données:", JSON.stringify(testData, null, 2));

    const response = await fetch(`${BASE_URL}/api/paytech/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(testData),
    });

    console.log("📥 Réponse reçue:");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);

    const responseText = await response.text();
    console.log("Body:", responseText);

    if (response.status === 500) {
      console.log("🚨 ERREUR 500 DÉTECTÉE");

      // Essayons de parser l'erreur
      try {
        const errorData = JSON.parse(responseText);
        console.log("Détails de l'erreur:", errorData);
      } catch (e) {
        console.log("Erreur brute (non JSON):", responseText);
      }

      console.log("\n🔍 CAUSES POSSIBLES:");
      console.log("1. Variables d'environnement PayTech manquantes");
      console.log("2. Base de données Prisma non configurée");
      console.log("3. Erreur dans la logique de l'endpoint");
      console.log("4. Problème avec les imports/dépendances");

      // Tester les endpoints plus simples
      console.log("\n🧪 Test de l'endpoint de test simple...");
      try {
        const testResponse = await fetch(`${BASE_URL}/api/test`);
        const testResult = await testResponse.text();
        console.log("Test API Status:", testResponse.status);
        console.log("Test API Response:", testResult);
      } catch (testError) {
        console.log("Test API Error:", testError.message);
      }
    }
  } catch (error) {
    console.log("❌ Erreur lors du test:", error.message);
  }
}

testPaytechEndpoint();
