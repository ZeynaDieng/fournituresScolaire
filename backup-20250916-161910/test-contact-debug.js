/**
 * Test détaillé de l'API contact pour identifier le problème exact
 */

// Charger les variables d'environnement
import dotenv from "dotenv";
dotenv.config();

console.log("🔍 TEST DÉTAILLÉ API CONTACT");
console.log("============================");
console.log("");

// Test avec logs détaillés
async function testContactWithLogs() {
  console.log("📤 Envoi d'un message de contact réel...");

  const testData = {
    name: "Test Debug Contact",
    email: process.env.ADMIN_EMAIL, // Utiliser votre vraie adresse
    phone: process.env.WHATSAPP_BUSINESS_NUMBER,
    subject: "Debug - Test enregistrement Airtable",
    message:
      "Message de test pour déboguer l'enregistrement dans Airtable. Si vous recevez ceci, cela signifie que les notifications fonctionnent mais l'enregistrement Airtable pourrait avoir un problème.",
  };

  console.log("📋 Données envoyées:", JSON.stringify(testData, null, 2));
  console.log("");

  try {
    console.log("🌐 Appel API...");
    const response = await fetch(
      "https://fournitures-scolaire.vercel.app/api/contact/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      }
    );

    console.log(`📡 Statut: ${response.status} ${response.statusText}`);

    const result = await response.json();
    console.log("📋 Réponse complète:", JSON.stringify(result, null, 2));

    console.log("");
    console.log("🔍 ANALYSE DE LA RÉPONSE:");

    if (response.ok) {
      console.log("✅ API répond correctement (200)");

      if (result.success) {
        console.log("✅ API indique un succès");

        if (result.fallback) {
          console.log("⚠️ MODE FALLBACK ACTIF - Raisons possibles:");
          console.log("   1. Variables d'environnement Airtable manquantes");
          console.log("   2. Erreur lors de l'appel Airtable");
          console.log("   3. Mode fallback forcé dans le code");

          // Vérifier si l'enregistrement est quand même dans Airtable
          console.log("");
          console.log("🔍 Vérification Airtable...");
          await checkIfRecordExists(testData.email);
        } else if (result.recordId) {
          console.log(
            `✅ Enregistrement Airtable réussi ! ID: ${result.recordId}`
          );
        } else {
          console.log("⚠️ Pas d'indication d'enregistrement Airtable");
        }
      } else {
        console.log("❌ API indique un échec");
      }
    } else {
      console.log("❌ API en erreur");
      if (result.error) {
        console.log("💡 Erreur:", result.error);
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors du test:", error.message);
  }
}

// Vérifier si le record existe dans Airtable
async function checkIfRecordExists(email) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_CONTACTS_TABLE}?filterByFormula=SEARCH("${email}",{Email})`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const records = data.records || [];

      console.log(
        `📊 Records trouvés avec l'email "${email}": ${records.length}`
      );

      if (records.length > 0) {
        console.log("✅ Le contact a bien été enregistré dans Airtable !");
        console.log("📋 Derniers records:");
        records.slice(0, 3).forEach((record, index) => {
          console.log(`   ${index + 1}. ID: ${record.id}`);
          console.log(`      Nom: ${record.fields.Name}`);
          console.log(`      Sujet: ${record.fields.Subject}`);
          console.log(`      Date: ${record.createdTime}`);
        });
      } else {
        console.log("❌ Aucun contact trouvé - l'enregistrement a échoué");
      }
    } else {
      console.log("❌ Erreur lors de la vérification Airtable");
    }
  } catch (error) {
    console.log("❌ Erreur vérification:", error.message);
  }
}

// Test de l'endpoint local pour comparaison
async function testLocalEndpoint() {
  console.log("");
  console.log("🔍 COMPARAISON AVEC TEST LOCAL");
  console.log("==============================");

  // Tester directement l'insertion Airtable
  console.log("📤 Test insertion directe Airtable...");

  const contactData = {
    records: [
      {
        fields: {
          Name: "Test Local Direct",
          Email: "test.local@debug.com",
          Phone: "221782911844",
          Subject: "Test insertion directe",
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
      console.log("✅ Insertion directe réussie");
      console.log(`📋 ID créé: ${result.records[0].id}`);

      console.log("");
      console.log("💡 CONCLUSION:");
      console.log("✅ Airtable fonctionne parfaitement");
      console.log("⚠️ Le problème est dans l'API /api/contact/send");
      console.log(
        "🔧 Action: Vérifier les logs Vercel ou le code de l'endpoint"
      );
    } else {
      const error = await response.json();
      console.log("❌ Insertion directe échouée");
      console.log("💡 Erreur:", JSON.stringify(error, null, 2));
    }
  } catch (error) {
    console.log("❌ Erreur insertion directe:", error.message);
  }
}

// Exécution complète
async function runFullTest() {
  try {
    await testContactWithLogs();
    await testLocalEndpoint();

    console.log("");
    console.log("🎯 ACTIONS RECOMMANDÉES:");
    console.log(
      "1. Vérifiez vos emails pour voir si les notifications arrivent"
    );
    console.log(
      "2. Vérifiez https://airtable.com pour voir si les contacts sont enregistrés"
    );
    console.log(
      "3. Si les contacts n'apparaissent pas, le problème est dans l'endpoint /api/contact/send"
    );
    console.log(
      "4. Consultez les logs Vercel pour voir les erreurs détaillées"
    );
  } catch (error) {
    console.error("❌ Erreur lors du test complet:", error);
  }
}

// Lancer le test
runFullTest();
