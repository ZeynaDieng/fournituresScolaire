/**
 * Test post-déploiement pour vérifier l'enregistrement des contacts dans Airtable
 */

import dotenv from "dotenv";
dotenv.config();

console.log("🔄 TEST POST-DÉPLOIEMENT - CONTACTS AIRTABLE");
console.log("==============================================");
console.log("");

async function testContactAPI() {
  const testData = {
    name: `Test Post-Déploiement ${Date.now()}`,
    email: `test-${Date.now()}@postdeploy.com`,
    phone: "221782911844",
    subject: "Test après déploiement",
    message:
      "Test pour vérifier que les contacts s'enregistrent maintenant directement dans Airtable sans fallback",
  };

  console.log("📤 Envoi de données test:", JSON.stringify(testData, null, 2));
  console.log("");

  try {
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

    const result = await response.json();

    console.log(
      `📡 Réponse (${response.status}):`,
      JSON.stringify(result, null, 2)
    );
    console.log("");

    if (result.fallback === true) {
      console.log("❌ PROBLÈME: L'API fonctionne encore en mode fallback");
      console.log("   Les contacts ne sont pas enregistrés dans Airtable");
      return false;
    } else if (result.fallback === false || result.fallback === undefined) {
      if (result.success === true) {
        console.log(
          "✅ SUCCÈS: Les contacts sont maintenant enregistrés directement dans Airtable !"
        );
        return true;
      }
    }

    if (response.status !== 200) {
      console.log("❌ ERREUR: L'API a retourné une erreur");
      return false;
    }

    console.log("⚠️ RÉSULTAT INCERTAIN: Vérifier manuellement dans Airtable");
    return null;
  } catch (error) {
    console.error("❌ Erreur lors du test:", error.message);
    return false;
  }
}

async function verifyAirtable() {
  console.log("🔍 Vérification directe dans Airtable...");

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_CONTACTS_TABLE}?maxRecords=5&sort[0][field]=Created&sort[0][direction]=desc`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    console.log("📊 Derniers contacts dans Airtable:");
    if (data.records && data.records.length > 0) {
      data.records.forEach((record, index) => {
        const fields = record.fields;
        console.log(
          `  ${index + 1}. ${fields.Name || "Sans nom"} - ${
            fields.Email || "Sans email"
          } (${fields.Subject || "Sans sujet"})`
        );
      });
    } else {
      console.log("  Aucun contact trouvé");
    }

    return data.records || [];
  } catch (error) {
    console.error("❌ Erreur vérification Airtable:", error.message);
    return [];
  }
}

async function runTest() {
  console.log("🚀 Démarrage du test...");
  console.log("");

  // Compter les contacts avant
  const contactsBefore = await verifyAirtable();
  console.log(`📊 Contacts avant test: ${contactsBefore.length}`);
  console.log("");

  // Attendre un peu (pour s'assurer que le déploiement est terminé)
  console.log(
    "⏳ Attente de 10 secondes pour s'assurer que le déploiement est terminé..."
  );
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Tester l'API
  const apiResult = await testContactAPI();

  // Attendre un peu avant de vérifier
  console.log("⏳ Attente de 5 secondes avant vérification...");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Compter les contacts après
  const contactsAfter = await verifyAirtable();
  console.log("");
  console.log(`📊 Contacts après test: ${contactsAfter.length}`);

  // Analyse des résultats
  console.log("");
  console.log("📋 RÉSULTATS FINAUX");
  console.log("===================");

  if (apiResult === true) {
    console.log("✅ API: Fonctionne correctement (pas de fallback)");
  } else if (apiResult === false) {
    console.log("❌ API: Fonctionne en mode fallback ou erreur");
  } else {
    console.log("⚠️ API: Résultat incertain");
  }

  if (contactsAfter.length > contactsBefore.length) {
    console.log("✅ AIRTABLE: Nouveau contact ajouté !");
    console.log("🎉 LES CONTACTS S'ENREGISTRENT MAINTENANT DANS AIRTABLE !");
  } else {
    console.log("❌ AIRTABLE: Aucun nouveau contact détecté");
    console.log("⚠️ Le problème persiste, vérification manuelle requise");
  }
}

runTest();
