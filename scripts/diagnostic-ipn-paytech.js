#!/usr/bin/env node

/**
 * 🔍 Script de Diagnostic IPN PayTech
 *
 * Ce script diagnostique pourquoi l'IPN PayTech ne met pas à jour le statut dans Airtable
 */

require("dotenv").config();
const { updateOrderStatusInAirtable } = require("../utils/airtable-orders.js");

console.log("🔍 DIAGNOSTIC IPN PAYTECH");
console.log("==========================");

async function diagnosticIPN() {
  try {
    // 1. Vérifier la configuration Airtable
    console.log("\n📋 ÉTAPE 1: Vérification de la configuration Airtable");
    console.log("-----------------------------------------------------");

    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    console.log(
      "AIRTABLE_API_KEY:",
      airtableApiKey ? "✅ Configuré" : "❌ Manquant"
    );
    console.log(
      "AIRTABLE_BASE_ID:",
      airtableBaseId ? "✅ Configuré" : "❌ Manquant"
    );
    console.log(
      "AIRTABLE_ORDERS_TABLE:",
      ordersTableId ? "✅ Configuré" : "❌ Manquant"
    );

    if (!airtableApiKey || !airtableBaseId || !ordersTableId) {
      console.log("\n❌ PROBLÈME: Configuration Airtable incomplète");
      console.log("Vérifiez vos variables d'environnement:");
      console.log("- AIRTABLE_API_KEY");
      console.log("- AIRTABLE_BASE_ID");
      console.log("- AIRTABLE_ORDERS_TABLE");
      return;
    }

    // 2. Tester la connexion à Airtable
    console.log("\n📋 ÉTAPE 2: Test de connexion à Airtable");
    console.log("----------------------------------------");

    try {
      const testResponse = await fetch(
        `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?maxRecords=1`,
        {
          headers: {
            Authorization: `Bearer ${airtableApiKey}`,
          },
        }
      );

      if (testResponse.ok) {
        console.log("✅ Connexion à Airtable réussie");
        const testData = await testResponse.json();
        console.log(
          `📊 Nombre d'enregistrements trouvés: ${
            testData.records?.length || 0
          }`
        );

        if (testData.records && testData.records.length > 0) {
          const firstRecord = testData.records[0];
          console.log(
            "📋 Champs disponibles:",
            Object.keys(firstRecord.fields)
          );

          // Vérifier si le champ Status existe
          if (firstRecord.fields.Status !== undefined) {
            console.log('✅ Champ "Status" trouvé dans Airtable');
          } else {
            console.log('❌ Champ "Status" manquant dans Airtable');
            console.log(
              '💡 SOLUTION: Créez un champ "Status" dans votre table Airtable'
            );
          }
        }
      } else {
        console.log("❌ Erreur de connexion à Airtable:", testResponse.status);
        const errorData = await testResponse.json();
        console.log("Détails:", errorData);
      }
    } catch (error) {
      console.log("❌ Erreur de connexion à Airtable:", error.message);
    }

    // 3. Tester la fonction updateOrderStatusInAirtable
    console.log(
      "\n📋 ÉTAPE 3: Test de la fonction updateOrderStatusInAirtable"
    );
    console.log("----------------------------------------------------------");

    // Récupérer une commande existante pour le test
    try {
      const listResponse = await fetch(
        `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?maxRecords=5`,
        {
          headers: {
            Authorization: `Bearer ${airtableApiKey}`,
          },
        }
      );

      if (listResponse.ok) {
        const listData = await listResponse.json();

        if (listData.records && listData.records.length > 0) {
          const testOrder = listData.records[0];
          const orderRef = testOrder.fields["Order ID"];

          if (orderRef) {
            console.log(`🧪 Test avec la commande: ${orderRef}`);

            try {
              await updateOrderStatusInAirtable(orderRef, "Test");
              console.log("✅ Fonction updateOrderStatusInAirtable fonctionne");

              // Remettre le statut original
              await updateOrderStatusInAirtable(orderRef, "Pending");
              console.log('✅ Statut remis à "Pending"');
            } catch (updateError) {
              console.log(
                "❌ Erreur dans updateOrderStatusInAirtable:",
                updateError.message
              );
            }
          } else {
            console.log("❌ Aucune commande avec Order ID trouvée");
          }
        } else {
          console.log("❌ Aucune commande trouvée dans Airtable");
        }
      }
    } catch (error) {
      console.log("❌ Erreur lors du test:", error.message);
    }

    // 4. Vérifier la configuration PayTech
    console.log("\n📋 ÉTAPE 4: Vérification de la configuration PayTech");
    console.log("---------------------------------------------------");

    const paytechApiKey = process.env.PAYTECH_API_KEY;
    const paytechSecretKey = process.env.PAYTECH_SECRET_KEY;
    const paytechSandbox = process.env.PAYTECH_SANDBOX;

    console.log(
      "PAYTECH_API_KEY:",
      paytechApiKey ? "✅ Configuré" : "❌ Manquant"
    );
    console.log(
      "PAYTECH_SECRET_KEY:",
      paytechSecretKey ? "✅ Configuré" : "❌ Manquant"
    );
    console.log("PAYTECH_SANDBOX:", paytechSandbox || "Non défini");

    // 5. Vérifier les endpoints webhook
    console.log("\n📋 ÉTAPE 5: Vérification des endpoints webhook");
    console.log("----------------------------------------------");

    const webhookEndpoints = [
      "/api/paytech/webhook",
      "/api/paytech/webhook-simple",
      "/api/paytech/webhook-new",
      "/api/paytech/ipn",
    ];

    console.log("Endpoints webhook disponibles:");
    webhookEndpoints.forEach((endpoint) => {
      console.log(`  - ${endpoint}`);
    });

    console.log("\n💡 RECOMMANDATION:");
    console.log("Utilisez /api/paytech/webhook-simple pour les tests");
    console.log("Configurez cette URL dans votre dashboard PayTech");

    // 6. Résumé et recommandations
    console.log("\n📋 ÉTAPE 6: Résumé et recommandations");
    console.log("-------------------------------------");

    console.log("\n🎯 ACTIONS RECOMMANDÉES:");
    console.log(
      '1. Vérifiez que le champ "Status" existe dans votre table Airtable'
    );
    console.log("2. Configurez l'URL IPN dans le dashboard PayTech:");
    console.log(
      "   - URL: https://votre-domaine.com/api/paytech/webhook-simple"
    );
    console.log("   - Méthode: POST");
    console.log("3. Testez avec une vraie commande PayTech");
    console.log("4. Vérifiez les logs du serveur pour voir les webhooks reçus");

    console.log("\n🔧 COMMANDES DE TEST:");
    console.log("Pour tester manuellement:");
    console.log(
      'curl -X POST "http://localhost:3000/api/paytech/webhook-simple" \\'
    );
    console.log('  -H "Content-Type: application/json" \\');
    console.log(
      '  -d \'{"type_event": "sale_complete", "ref_command": "CMD_TEST_123", "item_price": 50000}\''
    );
  } catch (error) {
    console.error("❌ Erreur lors du diagnostic:", error);
  }
}

// Exécuter le diagnostic
diagnosticIPN().catch(console.error);
