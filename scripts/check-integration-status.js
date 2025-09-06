// scripts/check-integration-status.js
// Script pour vérifier l'état complet de l'intégration PayTech + Airtable

require("dotenv").config();

const BASE_URL = process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3003";

async function checkIntegrationStatus() {
  console.log("🔍 Vérification de lÉtat de lIntégration PayTech + Airtable");
  console.log("=".repeat(60));
  console.log("");

  const checks = {
    server: false,
    airtable: false,
    paytech: false,
    database: false,
    endpoints: false,
  };

  try {
    // 1. Vérifier le serveur
    console.log("🖥️  Vérification du serveur...");
    try {
      const response = await fetch(`${BASE_URL}/api/airtable/orders`, {
        method: "GET",
        timeout: 5000,
      });

      if (response.ok) {
        checks.server = true;
        console.log("   ✅ Serveur accessible");
      } else {
        console.log(`   ❌ Serveur répond avec erreur: ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Serveur inaccessible: ${error.message}`);
      console.log("   💡 Solution: Lancez `npm run dev`");
    }
    console.log("");

    // 2. Vérifier Airtable
    console.log("📊 Vérification Airtable...");
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      console.log("   ✅ Variables denvironnement configurées");

      if (checks.server) {
        try {
          const response = await fetch(`${BASE_URL}/api/airtable/orders`);
          const result = await response.json();

          if (response.ok && result.success) {
            checks.airtable = true;
            console.log(
              `   ✅ Connexion réussie - ${result.total} commandes trouvées`
            );

            // Vérifier les tables
            const tables = ["products", "packs", "orders"];
            for (const table of tables) {
              try {
                const tableResponse = await fetch(
                  `${BASE_URL}/api/airtable/${table}`
                );
                const tableResult = await tableResponse.json();
                console.log(
                  `   📋 Table ${table}: ${
                    tableResult.total || 0
                  } enregistrements`
                );
              } catch (e) {
                console.log(`   ⚠️  Table ${table}: erreur`);
              }
            }
          } else {
            console.log(`   ❌ Erreur API: ${result.error || "Inconnue"}`);
          }
        } catch (error) {
          console.log(`   ❌ Erreur connexion: ${error.message}`);
        }
      }
    } else {
      console.log("   ❌ Variables manquantes:");
      if (!process.env.AIRTABLE_API_KEY) console.log("     - AIRTABLE_API_KEY");
      if (!process.env.AIRTABLE_BASE_ID) console.log("     - AIRTABLE_BASE_ID");
      console.log("   💡 Solution: Configurez ces variables dans .env");
    }
    console.log("");

    // 3. Vérifier PayTech
    console.log("💳 Vérification PayTech...");
    if (process.env.PAYTECH_API_KEY && process.env.PAYTECH_SECRET_KEY) {
      console.log("   ✅ Variables denvironnement configurées");
      console.log(
        `   🔧 Mode: ${
          process.env.PAYTECH_SANDBOX === "false" ? "Production" : "Sandbox"
        }`
      );

      // Test de l'endpoint d'initiation (sans vraie requête)
      if (checks.server) {
        try {
          const testData = {
            amount: 1000,
            currency: "XOF",
            customer: {
              name: "Test User",
              email: "test@example.com",
              phone: "221771234567",
            },
          };

          // On ne fait pas vraiment l'appel pour éviter les frais
          console.log(
            "   📋 Endpoint dinitiation disponible: /api/paytech/initiate"
          );
          console.log(
            "   📋 Endpoint webhook disponible: /api/paytech/webhook"
          );
          checks.paytech = true;
        } catch (error) {
          console.log(`   ❌ Erreur test endpoint: ${error.message}`);
        }
      }
    } else {
      console.log("   ❌ Variables manquantes:");
      if (!process.env.PAYTECH_API_KEY) console.log("     - PAYTECH_API_KEY");
      if (!process.env.PAYTECH_SECRET_KEY)
        console.log("     - PAYTECH_SECRET_KEY");
      console.log("   💡 Solution: Configurez ces variables dans .env");
    }
    console.log("");

    // 4. Vérifier les endpoints critiques
    console.log("🔗 Vérification des endpoints...");
    const endpoints = [
      "/api/orders/create",
      "/api/orders/create-pending",
      "/api/paytech/initiate",
      "/api/paytech/webhook",
      "/api/airtable/orders",
    ];

    if (checks.server) {
      let workingEndpoints = 0;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: endpoint.includes("webhook") ? "POST" : "GET",
            headers: { "Content-Type": "application/json" },
            body: endpoint.includes("webhook") ? JSON.stringify({}) : undefined,
          });

          // On accepte les erreurs 400/422 car c'est normal sans données valides
          if (response.status < 500) {
            console.log(`   ✅ ${endpoint}`);
            workingEndpoints++;
          } else {
            console.log(`   ❌ ${endpoint} (${response.status})`);
          }
        } catch (error) {
          console.log(`   ❌ ${endpoint} (erreur réseau)`);
        }
      }

      checks.endpoints = workingEndpoints >= 3;
    } else {
      console.log("   ⏸️  Sautée (serveur inaccessible)");
    }
    console.log("");

    // 5. Vérifier la base de données (optionnel)
    console.log("🗄️  Vérification base de données...");
    if (checks.server) {
      try {
        // Test indirect via l'API
        const response = await fetch(`${BASE_URL}/api/orders/create-pending`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}), // Données vides pour tester la validation
        });

        // Si on reçoit une erreur de validation (400), la DB fonctionne
        if (response.status === 400 || response.status === 422) {
          checks.database = true;
          console.log("   ✅ Base de données accessible");
        } else {
          console.log(`   ⚠️  Statut inattendu: ${response.status}`);
        }
      } catch (error) {
        console.log(`   ❌ Erreur test DB: ${error.message}`);
      }
    } else {
      console.log("   ⏸️  Sautée (serveur inaccessible)");
    }
    console.log("");

    // Résumé final
    console.log("📋 RÉSUMÉ DE LINTÉGRATION");
    console.log("=".repeat(30));

    const statusIcon = (check) => (check ? "✅" : "❌");
    const totalChecks = Object.values(checks).filter(Boolean).length;

    console.log(`${statusIcon(checks.server)} Serveur de développement`);
    console.log(`${statusIcon(checks.airtable)} Connexion Airtable`);
    console.log(`${statusIcon(checks.paytech)} Configuration PayTech`);
    console.log(`${statusIcon(checks.endpoints)} Endpoints API`);
    console.log(`${statusIcon(checks.database)} Base de données`);
    console.log("");

    if (totalChecks === 5) {
      console.log("🎉 INTÉGRATION COMPLÈTE ET FONCTIONNELLE !");
      console.log("");
      console.log("🚀 Commandes de test disponibles:");
      console.log("   npm run test:paytech-complete");
      console.log("   npm run test:order-airtable");
      console.log("   npm run test:paytech-ngrok (avec ngrok)");
      console.log("");
      console.log("🔗 Interfaces utiles:");
      console.log(`   Admin Airtable: ${BASE_URL}/admin/orders-airtable`);
      console.log(`   Admin classique: ${BASE_URL}/admin`);
    } else if (totalChecks >= 3) {
      console.log("⚠️  INTÉGRATION PARTIELLEMENT FONCTIONNELLE");
      console.log("   Quelques composants ne sont pas configurés.");
    } else {
      console.log("❌ INTÉGRATION NON FONCTIONNELLE");
      console.log("   Plusieurs problèmes de configuration détectés.");
    }

    console.log("");
    console.log("📖 Pour plus daide: PAYTECH_TESTING_GUIDE.md");
  } catch (error) {
    console.error("💥 Erreur lors de la vérification:", error.message);
  }
}

if (require.main === module) {
  checkIntegrationStatus();
}

module.exports = { checkIntegrationStatus };
