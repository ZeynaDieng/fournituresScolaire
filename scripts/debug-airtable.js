#!/usr/bin/env node

/**
 * Script pour débugger les problèmes Airtable et notifications
 */

const BASE_URL = "https://fournitures-scolaire.vercel.app";

console.log("🐛 DEBUG AIRTABLE & NOTIFICATIONS");
console.log("=".repeat(60));

async function debugAirtableConnection() {
  try {
    console.log("\n1. Test de connexion Airtable...");

    const airtableTestResponse = await fetch(
      `${BASE_URL}/api/airtable/test-connection`
    );
    const airtableTestResult = await airtableTestResponse.json();
    console.log("🗄️  Test Airtable:", airtableTestResult);

    console.log("\n2. Test de récupération des tables existantes...");

    // Test de chaque table
    const tables = [
      { name: "Products", endpoint: "/api/airtable/products" },
      { name: "Orders", endpoint: "/api/airtable/orders" },
      { name: "Promotions", endpoint: "/api/airtable/promotions" },
      { name: "Testimonials", endpoint: "/api/airtable/testimonials" },
    ];

    for (const table of tables) {
      try {
        const response = await fetch(`${BASE_URL}${table.endpoint}`);
        const result = await response.json();

        if (response.ok && result.records) {
          console.log(
            `   ✅ ${table.name}: ${result.records.length} enregistrements`
          );
        } else {
          console.log(
            `   ❌ ${table.name}: Erreur - ${JSON.stringify(result)}`
          );
        }
      } catch (error) {
        console.log(`   ❌ ${table.name}: Exception - ${error.message}`);
      }
    }

    console.log("\n3. Test spécifique de la table Contacts...");

    // Test direct avec les vraies clés d'API
    const testContactData = {
      name: "Debug Test User",
      email: "zeynash1@gmail.com",
      phone: "221777780456",
      subject: "Test debug Airtable",
      message: "Ce test vérifie si l'erreur Airtable est résolue.",
    };

    console.log("📧 Envoi test contact...");
    const contactResponse = await fetch(`${BASE_URL}/api/contact/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testContactData),
    });

    const contactResult = await contactResponse.json();
    console.log("📧 Résultat contact:", contactResult);

    // Si c'est toujours en fallback, testons directement l'API Airtable
    if (contactResult.fallback) {
      console.log("\n4. Test direct de l'API Airtable (contournement)...");

      // Test avec curl pour voir l'erreur exacte
      console.log("🔧 Analyse de l'erreur Airtable...");

      const directAirtableTest = {
        records: [
          {
            fields: {
              Name: testContactData.name,
              Email: testContactData.email,
              Phone: testContactData.phone,
              Subject: testContactData.subject,
              Message: testContactData.message,
              Status: "New",
            },
          },
        ],
      };

      console.log(
        "📝 Données à envoyer:",
        JSON.stringify(directAirtableTest, null, 2)
      );

      // Test avec les variables d'environnement simulées
      console.log("🔧 Variables d'environnement utilisées:");
      console.log(
        "   AIRTABLE_BASE_ID:",
        process.env.AIRTABLE_BASE_ID || "appOtYkVavA4MMMnN"
      );
      console.log(
        "   AIRTABLE_CONTACTS_TABLE:",
        process.env.AIRTABLE_CONTACTS_TABLE || "tblX73JCops5jKevo"
      );
    }
  } catch (error) {
    console.error("❌ Erreur lors du debug:", error);
  }
}

// Simulation des variables d'environnement pour les tests locaux
process.env.AIRTABLE_BASE_ID = "appOtYkVavA4MMMnN";
process.env.AIRTABLE_CONTACTS_TABLE = "tblX73JCops5jKevo";
process.env.AIRTABLE_API_KEY =
  "patrR71W7giuFrjP0.fadb29458ae74396bce8c0ffb8f2033c35164715f4546198bb8bbafb593ad83a";

console.log("🔑 Variables Airtable configurées pour le debug");
console.log("🚀 Démarrage du debug...");

debugAirtableConnection()
  .then(() => {
    console.log("\n" + "=".repeat(60));
    console.log("✅ Debug terminé!");
    console.log("📧 Vérifiez vos emails dans les prochaines minutes");
    console.log("🔧 Si le problème persiste:");
    console.log("   1. Vérifiez les permissions Airtable");
    console.log("   2. Vérifiez la structure de la table Contacts");
    console.log("   3. Vérifiez les noms des champs dans Airtable");
  })
  .catch(console.error);
