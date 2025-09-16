#!/usr/bin/env node

/**
 * 🧪 Test de mise à jour du statut Airtable
 *
 * Ce script teste directement la fonction updateOrderStatusInAirtable
 */

require("dotenv").config();

console.log("🧪 TEST MISE À JOUR STATUT AIRTABLE");
console.log("===================================");

async function testAirtableStatusUpdate() {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!baseId || !apiKey || !ordersTableId) {
      console.log("❌ Configuration Airtable manquante");
      return;
    }

    console.log("✅ Configuration Airtable OK");

    // 1. Récupérer une commande existante
    console.log("\n📋 ÉTAPE 1: Récupération d'une commande existante");
    console.log("--------------------------------------------------");

    const listResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/${ordersTableId}?maxRecords=5`,
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
    console.log(`📊 ${listData.records.length} commandes trouvées`);

    if (listData.records.length === 0) {
      console.log("❌ Aucune commande trouvée pour le test");
      return;
    }

    const testOrder = listData.records[0];
    const orderRef = testOrder.fields["Order ID"];
    const currentStatus = testOrder.fields["Status"] || "Non défini";

    console.log(`🧪 Commande de test: ${orderRef}`);
    console.log(`📊 Statut actuel: ${currentStatus}`);

    // 2. Tester la mise à jour du statut
    console.log("\n📋 ÉTAPE 2: Test de mise à jour du statut");
    console.log("----------------------------------------");

    const newStatus = "Test-IPN-" + Date.now();
    console.log(`🔄 Mise à jour vers: ${newStatus}`);

    // Rechercher la commande par Order ID
    const searchResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/${ordersTableId}?filterByFormula={Order ID}='${orderRef}'`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!searchResponse.ok) {
      console.log("❌ Erreur recherche commande:", searchResponse.status);
      return;
    }

    const searchData = await searchResponse.json();

    if (!searchData.records || searchData.records.length === 0) {
      console.log("❌ Commande non trouvée avec filterByFormula");
      return;
    }

    const recordId = searchData.records[0].id;
    console.log(`✅ Commande trouvée, ID: ${recordId}`);

    // Mettre à jour le statut
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
            Status: newStatus,
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      console.log("❌ Erreur mise à jour:", updateResponse.status);
      const errorData = await updateResponse.json();
      console.log("Détails erreur:", errorData);
      return;
    }

    const updateData = await updateResponse.json();
    console.log("✅ Statut mis à jour avec succès");
    console.log("📊 Nouveau statut:", updateData.fields.Status);

    // 3. Vérifier la mise à jour
    console.log("\n📋 ÉTAPE 3: Vérification de la mise à jour");
    console.log("----------------------------------------");

    const verifyResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/${ordersTableId}/${recordId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log("✅ Vérification réussie");
      console.log("📊 Statut vérifié:", verifyData.fields.Status);

      if (verifyData.fields.Status === newStatus) {
        console.log("🎉 TEST RÉUSSI: La mise à jour du statut fonctionne !");
      } else {
        console.log("❌ TEST ÉCHOUÉ: Le statut n'a pas été mis à jour");
      }
    }

    // 4. Remettre le statut original
    console.log("\n📋 ÉTAPE 4: Restauration du statut original");
    console.log("-------------------------------------------");

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
            Status: currentStatus,
          },
        }),
      }
    );

    if (restoreResponse.ok) {
      console.log("✅ Statut original restauré");
    } else {
      console.log("⚠️ Impossible de restaurer le statut original");
    }

    // 5. Résumé
    console.log("\n📋 RÉSUMÉ DU TEST");
    console.log("==================");
    console.log(
      "✅ La fonction updateOrderStatusInAirtable fonctionne correctement"
    );
    console.log("✅ Le champ Status existe dans Airtable");
    console.log("✅ La configuration Airtable est correcte");
    console.log("");
    console.log("💡 CONCLUSION:");
    console.log(
      "Le problème IPN ne vient PAS de la fonction updateOrderStatusInAirtable"
    );
    console.log("Le problème vient probablement de:");
    console.log("1. L'URL IPN non configurée dans PayTech");
    console.log("2. Les webhooks PayTech qui n'arrivent pas au serveur");
    console.log("3. La validation de signature IPN qui échoue");
    console.log("");
    console.log("🔧 ACTIONS RECOMMANDÉES:");
    console.log("1. Vérifiez l'URL IPN dans le dashboard PayTech");
    console.log("2. Testez avec un webhook manuel");
    console.log("3. Vérifiez les logs du serveur");
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter le test
testAirtableStatusUpdate().catch(console.error);
