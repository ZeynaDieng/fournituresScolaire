/**
 * Diagnostic des contacts Airtable
 * Vérification de la configuration et des champs manquants
 */

// Charger les variables d'environnement
import dotenv from "dotenv";
dotenv.config();

console.log("🔍 DIAGNOSTIC CONTACTS AIRTABLE");
console.log("================================");
console.log("");

// 1. Vérifier les variables d'environnement
console.log("1️⃣ Vérification des variables d'environnement...");
console.log("");

const requiredVars = {
  AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
  AIRTABLE_CONTACTS_TABLE: process.env.AIRTABLE_CONTACTS_TABLE,
};

let envOk = true;
for (const [key, value] of Object.entries(requiredVars)) {
  const status = value ? "✅" : "❌";
  console.log(`${status} ${key}: ${value || "MANQUANT"}`);
  if (!value) envOk = false;
}

if (!envOk) {
  console.log("");
  console.log(
    "❌ Variables d'environnement manquantes ! Impossible de continuer."
  );
  process.exit(1);
}

// 2. Tester la connexion Airtable
console.log("");
console.log("2️⃣ Test de connexion à Airtable...");

async function testAirtableConnection() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_CONTACTS_TABLE}?maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      console.log("✅ Connexion Airtable réussie");
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      console.log("❌ Erreur connexion Airtable:", response.status);
      console.log("Détail:", JSON.stringify(error, null, 2));
      return null;
    }
  } catch (error) {
    console.log("❌ Erreur réseau Airtable:", error.message);
    return null;
  }
}

// 3. Analyser la structure de la table
async function analyzeTableStructure() {
  console.log("");
  console.log("3️⃣ Analyse de la structure de la table contacts...");

  const data = await testAirtableConnection();
  if (!data) return null;

  console.log(`📊 Records trouvés: ${data.records ? data.records.length : 0}`);

  if (data.records && data.records.length > 0) {
    const firstRecord = data.records[0];
    console.log("");
    console.log("📋 Champs disponibles dans la table:");

    const fields = Object.keys(firstRecord.fields || {});
    if (fields.length > 0) {
      fields.forEach((field) => {
        const value = firstRecord.fields[field];
        const type = typeof value;
        console.log(
          `  • ${field} (${type}): ${JSON.stringify(value).substring(0, 50)}...`
        );
      });
    } else {
      console.log("  ⚠️ Aucun champ trouvé dans les records existants");
    }

    return fields;
  } else {
    console.log("⚠️ Aucun record existant pour analyser la structure");
    return [];
  }
}

// 4. Tester l'insertion d'un contact de test
async function testContactInsertion() {
  console.log("");
  console.log("4️⃣ Test d'insertion d'un contact...");

  const testContact = {
    records: [
      {
        fields: {
          Name: "Test Diagnostic",
          Email: "test@diagnostic.com",
          Phone: "221782911844",
          Subject: "Test de diagnostic",
          Message: "Message de test pour vérifier l'insertion dans Airtable",
        },
      },
    ],
  };

  console.log("📤 Données à insérer:", JSON.stringify(testContact, null, 2));

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_CONTACTS_TABLE}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testContact),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Insertion réussie !");
      console.log("📋 Record créé:", result.records[0].id);
      return true;
    } else {
      const error = await response.json();
      console.log("❌ Erreur insertion:", response.status);
      console.log("📋 Détail erreur:", JSON.stringify(error, null, 2));

      // Analyser les erreurs de champs
      if (error.error && error.error.type === "INVALID_REQUEST_BODY") {
        console.log("");
        console.log("🔍 Analyse des erreurs de champs:");
        if (error.error.message) {
          console.log(`💡 Message: ${error.error.message}`);
        }
      }

      return false;
    }
  } catch (error) {
    console.log("❌ Erreur réseau insertion:", error.message);
    return false;
  }
}

// 5. Tester l'API de contact du site
async function testContactAPI() {
  console.log("");
  console.log("5️⃣ Test de l'API contact du site...");

  const testData = {
    name: "Test API Diagnostic",
    email: "testapi@diagnostic.com",
    phone: "221782911844",
    subject: "Test API Contact",
    message: "Test pour diagnostiquer l'API de contact",
  };

  console.log("📤 Test API avec:", JSON.stringify(testData, null, 2));

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
      `📡 Réponse API (${response.status}):`,
      JSON.stringify(result, null, 2)
    );

    if (response.ok) {
      console.log("✅ API contact fonctionne");

      if (result.fallback) {
        console.log(
          "⚠️ Mode fallback activé - les données ne sont pas enregistrées dans Airtable"
        );
      } else {
        console.log("✅ Données enregistrées dans Airtable");
      }
    } else {
      console.log("❌ API contact en erreur");
    }

    return response.ok;
  } catch (error) {
    console.log("❌ Erreur API contact:", error.message);
    return false;
  }
}

// 6. Suggestions de correction
function provideSuggestions(tableFields, insertionSuccess, apiSuccess) {
  console.log("");
  console.log("6️⃣ SUGGESTIONS DE CORRECTION");
  console.log("============================");

  const expectedFields = ["Name", "Email", "Phone", "Subject", "Message"];

  console.log("📋 Champs requis par l'application:");
  expectedFields.forEach((field) => {
    const exists = tableFields.includes(field);
    console.log(`${exists ? "✅" : "❌"} ${field}`);
  });

  console.log("");

  if (!insertionSuccess) {
    console.log("🔧 ACTIONS REQUISES:");
    console.log("");
    console.log('1. Vérifiez la structure de votre table Airtable "Contacts":');
    console.log("   - Allez sur https://airtable.com");
    console.log('   - Ouvrez votre base "Fournitures Scolaires"');
    console.log('   - Vérifiez que la table "Contacts" existe');
    console.log("   - Ajoutez les champs manquants:");

    expectedFields.forEach((field) => {
      if (!tableFields.includes(field)) {
        console.log(`     • ${field} (Type: Single line text)`);
      }
    });

    console.log("");
    console.log("2. Types de champs recommandés:");
    console.log("   • Name: Single line text");
    console.log("   • Email: Email");
    console.log("   • Phone: Phone number");
    console.log("   • Subject: Single line text");
    console.log("   • Message: Long text");
    console.log("");
    console.log("3. Après avoir ajouté les champs, testez à nouveau.");
  } else {
    console.log("✅ La structure Airtable semble correcte.");

    if (!apiSuccess) {
      console.log("");
      console.log("🔧 Problème avec l'API du site:");
      console.log("- Vérifiez les logs Vercel");
      console.log(
        "- Le problème pourrait être dans le code de l'endpoint /api/contact/send"
      );
    }
  }
}

// Exécution du diagnostic
async function runDiagnostic() {
  console.log("🚀 Démarrage du diagnostic...");
  console.log("");

  try {
    // Analyser la structure
    const tableFields = (await analyzeTableStructure()) || [];

    // Tester l'insertion directe
    const insertionSuccess = await testContactInsertion();

    // Tester l'API du site
    const apiSuccess = await testContactAPI();

    // Fournir des suggestions
    provideSuggestions(tableFields, insertionSuccess, apiSuccess);

    console.log("");
    console.log("✅ Diagnostic terminé !");
  } catch (error) {
    console.error("❌ Erreur lors du diagnostic:", error);
  }
}

// Lancer le diagnostic
runDiagnostic();
