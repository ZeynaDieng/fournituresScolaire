/**
 * Script de diagnostic des variables d'environnement PayTech
 */

// Charger les variables d'environnement depuis .env
require("dotenv").config();

console.log("🔍 DIAGNOSTIC VARIABLES PAYTECH");
console.log("================================");

// Variables PayTech
console.log(
  "PAYTECH_API_KEY:",
  process.env.PAYTECH_API_KEY ? "✅ Configuré" : "❌ Manquant"
);
console.log(
  "PAYTECH_SECRET_KEY:",
  process.env.PAYTECH_SECRET_KEY ? "✅ Configuré" : "❌ Manquant"
);
console.log("PAYTECH_SANDBOX:", process.env.PAYTECH_SANDBOX || "❌ Manquant");
console.log("PAYTECH_MODE:", process.env.PAYTECH_MODE || "❌ Manquant");

// Variables Airtable
console.log("\n📊 VARIABLES AIRTABLE:");
console.log(
  "AIRTABLE_API_KEY:",
  process.env.AIRTABLE_API_KEY ? "✅ Configuré" : "❌ Manquant"
);
console.log(
  "AIRTABLE_BASE_ID:",
  process.env.AIRTABLE_BASE_ID ? "✅ Configuré" : "❌ Manquant"
);
console.log(
  "AIRTABLE_ORDERS_TABLE:",
  process.env.AIRTABLE_ORDERS_TABLE ? "✅ Configuré" : "❌ Manquant"
);

// Variables Email
console.log("\n📧 VARIABLES EMAIL:");
console.log("EMAIL_HOST:", process.env.EMAIL_HOST || "❌ Manquant");
console.log("EMAIL_PORT:", process.env.EMAIL_PORT || "❌ Manquant");
console.log(
  "EMAIL_USER:",
  process.env.EMAIL_USER ? "✅ Configuré" : "❌ Manquant"
);
console.log(
  "EMAIL_PASS:",
  process.env.EMAIL_PASS ? "✅ Configuré" : "❌ Manquant"
);
console.log(
  "FROM_EMAIL:",
  process.env.FROM_EMAIL ? "✅ Configuré" : "❌ Manquant"
);
console.log("FROM_NAME:", process.env.FROM_NAME || "❌ Manquant");
console.log(
  "ADMIN_EMAIL:",
  process.env.ADMIN_EMAIL ? "✅ Configuré" : "❌ Manquant"
);

// Variables WhatsApp
console.log("\n📱 VARIABLES WHATSAPP:");
console.log(
  "WHATSAPP_BUSINESS_NUMBER:",
  process.env.WHATSAPP_BUSINESS_NUMBER ? "✅ Configuré" : "❌ Manquant"
);
console.log("WHATSAPP_API_URL:", process.env.WHATSAPP_API_URL || "❌ Manquant");

// Node ENV
console.log("\n🔧 ENVIRONNEMENT:");
console.log("NODE_ENV:", process.env.NODE_ENV || "❌ Manquant");
console.log(
  "NUXT_PUBLIC_SITE_URL:",
  process.env.NUXT_PUBLIC_SITE_URL || "❌ Manquant"
);

// Test d'accès à l'API Airtable
console.log("\n🧪 TEST AIRTABLE:");
if (
  process.env.AIRTABLE_API_KEY &&
  process.env.AIRTABLE_BASE_ID &&
  process.env.AIRTABLE_ORDERS_TABLE
) {
  try {
    const testUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_ORDERS_TABLE}?maxRecords=1`;
    console.log("URL de test:", testUrl);

    fetch(testUrl, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    })
      .then((response) => {
        console.log("Réponse Airtable:", response.status, response.statusText);
        if (response.ok) {
          console.log("✅ Connexion Airtable OK");
        } else {
          console.log("❌ Erreur connexion Airtable");
        }
      })
      .catch((error) => {
        console.error("❌ Erreur test Airtable:", error.message);
      });
  } catch (error) {
    console.error("❌ Erreur configuration Airtable:", error.message);
  }
} else {
  console.log("❌ Variables Airtable incomplètes");
}
