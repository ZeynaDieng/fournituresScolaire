#!/usr/bin/env node

/**
 * 🔍 Vérification des options de statut Airtable
 *
 * Ce script vérifie quelles sont les options disponibles pour le champ Status
 */

require("dotenv").config();

console.log("🔍 VÉRIFICATION OPTIONS STATUT AIRTABLE");
console.log("=======================================");

async function checkAirtableStatusOptions() {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const apiKey = process.env.AIRTABLE_API_KEY;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!baseId || !apiKey || !ordersTableId) {
      console.log("❌ Configuration Airtable manquante");
      return;
    }

    // Récupérer les métadonnées de la table pour voir les options du champ Status
    console.log("\n📋 Récupération des métadonnées de la table...");

    const metadataResponse = await fetch(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!metadataResponse.ok) {
      console.log(
        "❌ Erreur récupération métadonnées:",
        metadataResponse.status
      );
      return;
    }

    const metadata = await metadataResponse.json();
    const ordersTable = metadata.tables.find(
      (table) => table.id === ordersTableId
    );

    if (!ordersTable) {
      console.log("❌ Table Orders non trouvée");
      return;
    }

    console.log("✅ Table Orders trouvée");
    console.log(`📊 Nom de la table: ${ordersTable.name}`);

    // Chercher le champ Status
    const statusField = ordersTable.fields.find(
      (field) => field.name === "Status"
    );

    if (!statusField) {
      console.log("❌ Champ Status non trouvé");
      return;
    }

    console.log("✅ Champ Status trouvé");
    console.log(`📊 Type de champ: ${statusField.type}`);

    if (statusField.type === "singleSelect") {
      console.log("\n📋 OPTIONS DISPONIBLES POUR LE STATUT:");
      console.log("-------------------------------------");

      if (statusField.options && statusField.options.choices) {
        statusField.options.choices.forEach((choice, index) => {
          console.log(`${index + 1}. ${choice.name} (${choice.color})`);
        });
      } else {
        console.log("❌ Aucune option trouvée");
      }
    } else {
      console.log("⚠️ Le champ Status n'est pas un champ de sélection");
    }

    // Tester avec les options existantes
    console.log("\n📋 Test avec les options existantes...");

    const listResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/${ordersTableId}?maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (listResponse.ok) {
      const listData = await listResponse.json();

      if (listData.records.length > 0) {
        const testOrder = listData.records[0];
        const orderRef = testOrder.fields["Order ID"];
        const recordId = testOrder.id;

        console.log(`🧪 Test avec la commande: ${orderRef}`);

        // Tester avec "Paid" (option qui devrait exister)
        const testStatus = "Paid";
        console.log(`🔄 Test mise à jour vers: ${testStatus}`);

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
                Status: testStatus,
              },
            }),
          }
        );

        if (updateResponse.ok) {
          console.log('✅ Mise à jour vers "Paid" réussie');

          // Remettre à "Pending"
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
                  Status: "Pending",
                },
              }),
            }
          );

          if (restoreResponse.ok) {
            console.log('✅ Statut remis à "Pending"');
          }
        } else {
          const errorData = await updateResponse.json();
          console.log("❌ Erreur mise à jour:", errorData);
        }
      }
    }

    // Recommandations
    console.log("\n📋 RECOMMANDATIONS:");
    console.log("===================");
    console.log(
      "1. Vérifiez que les options suivantes existent dans Airtable:"
    );
    console.log("   - Pending");
    console.log("   - Paid");
    console.log("   - Cancelled");
    console.log("   - Failed");
    console.log("");
    console.log("2. Si ces options n'existent pas, ajoutez-les dans Airtable");
    console.log(
      "3. Assurez-vous que le webhook PayTech utilise ces valeurs exactes"
    );
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
  }
}

// Exécuter la vérification
checkAirtableStatusOptions().catch(console.error);
