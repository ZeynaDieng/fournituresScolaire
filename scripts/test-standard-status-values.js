#!/usr/bin/env node

/**
 * 🧪 Test des valeurs de statut standard
 *
 * Ce script teste les valeurs de statut standard pour PayTech
 */

require("dotenv").config();

console.log("🧪 TEST VALEURS STATUT STANDARD");
console.log("===============================");

async function testStandardStatusValues() {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!baseId || !apiKey || !ordersTableId) {
      console.log("❌ Configuration Airtable manquante");
      return;
    }

    // Récupérer une commande de test
    const listResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/${ordersTableId}?maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!listResponse.ok) {
      console.log("❌ Erreur récupération commandes:", listResponse.status);
      return;
    }

    const listData = await listResponse.json();

    if (listData.records.length === 0) {
      console.log("❌ Aucune commande trouvée pour le test");
      return;
    }

    const testOrder = listData.records[0];
    const orderRef = testOrder.fields["Order ID"];
    const recordId = testOrder.id;
    const originalStatus = testOrder.fields["Status"] || "Pending";

    console.log(`🧪 Commande de test: ${orderRef}`);
    console.log(`📊 Statut original: ${originalStatus}`);

    // Valeurs de statut à tester
    const statusValues = [
      "Pending",
      "Paid",
      "Cancelled",
      "Failed",
      "Processing",
      "Completed",
    ];

    console.log("\n📋 Test des valeurs de statut standard...");
    console.log("==========================================");

    let workingStatuses = [];
    let failedStatuses = [];

    for (const status of statusValues) {
      console.log(`\n🔄 Test: ${status}`);

      try {
        const updateResponse = await fetch(
          `https://api.airtable.com/v0/${baseId}/${ordersTableId}/${recordId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fields: {
                Status: status,
              },
            }),
          }
        );

        if (updateResponse.ok) {
          console.log(`✅ ${status} - OK`);
          workingStatuses.push(status);
        } else {
          const errorData = await updateResponse.json();
          console.log(
            `❌ ${status} - Échec:`,
            errorData.error?.message || "Erreur inconnue"
          );
          failedStatuses.push(status);
        }
      } catch (error) {
        console.log(`❌ ${status} - Erreur:`, error.message);
        failedStatuses.push(status);
      }
    }

    // Restaurer le statut original
    console.log(`\n🔄 Restauration du statut original: ${originalStatus}`);
    try {
      const restoreResponse = await fetch(
        `https://api.airtable.com/v0/${baseId}/${ordersTableId}/${recordId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              Status: originalStatus,
            },
          }),
        }
      );

      if (restoreResponse.ok) {
        console.log("✅ Statut original restauré");
      } else {
        console.log("⚠️ Impossible de restaurer le statut original");
      }
    } catch (error) {
      console.log("⚠️ Erreur restauration:", error.message);
    }

    // Résumé
    console.log("\n📋 RÉSUMÉ DES TESTS");
    console.log("===================");
    console.log("✅ Valeurs de statut qui fonctionnent:");
    workingStatuses.forEach((status) => {
      console.log(`   - ${status}`);
    });

    if (failedStatuses.length > 0) {
      console.log("\n❌ Valeurs de statut qui ne fonctionnent pas:");
      failedStatuses.forEach((status) => {
        console.log(`   - ${status}`);
      });
    }

    // Recommandations pour PayTech
    console.log("\n💡 RECOMMANDATIONS POUR PAYTECH:");
    console.log("=================================");

    if (workingStatuses.includes("Paid")) {
      console.log('✅ Utilisez "Paid" pour les paiements réussis');
    } else {
      console.log('❌ "Paid" ne fonctionne pas - trouvez une alternative');
    }

    if (workingStatuses.includes("Cancelled")) {
      console.log('✅ Utilisez "Cancelled" pour les paiements annulés');
    } else {
      console.log('❌ "Cancelled" ne fonctionne pas - trouvez une alternative');
    }

    if (workingStatuses.includes("Pending")) {
      console.log('✅ Utilisez "Pending" pour les paiements en attente');
    } else {
      console.log('❌ "Pending" ne fonctionne pas - trouvez une alternative');
    }

    // Mise à jour du webhook
    console.log("\n🔧 MISE À JOUR DU WEBHOOK:");
    console.log("==========================");
    console.log(
      "Modifiez le fichier server/api/paytech/webhook-simple.post.ts:"
    );
    console.log("");

    if (workingStatuses.includes("Paid")) {
      console.log('✅ await updateOrderStatusInAirtable(ref_command, "Paid");');
    } else {
      console.log('❌ Remplacez "Paid" par une valeur qui fonctionne');
    }

    if (workingStatuses.includes("Cancelled")) {
      console.log(
        '✅ await updateOrderStatusInAirtable(ref_command, "Cancelled");'
      );
    } else {
      console.log('❌ Remplacez "Cancelled" par une valeur qui fonctionne');
    }

    if (workingStatuses.includes("Pending")) {
      console.log(
        '✅ await updateOrderStatusInAirtable(ref_command, "Pending");'
      );
    } else {
      console.log('❌ Remplacez "Pending" par une valeur qui fonctionne');
    }
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testStandardStatusValues().catch(console.error);
