#!/usr/bin/env node

/**
 * Test direct du service de notifications pour débugger
 */

// Simulation des variables d'environnement
process.env.NOTIFICATION_EMAIL_USER = "zeynash1@gmail.com";
process.env.NOTIFICATION_EMAIL_PASSWORD = "zmruomypjxrjxfto";
process.env.ADMIN_EMAIL = "zeynash1@gmail.com";
process.env.FROM_NAME = "Fournitures Scolaires";
process.env.WHATSAPP_BUSINESS_NUMBER = "221777780456";

const BASE_URL = "https://fournitures-scolaire.vercel.app";

console.log("🔧 TEST DIRECT DU SERVICE DE NOTIFICATIONS");
console.log("=".repeat(60));

async function testNotificationService() {
  try {
    console.log("\n1. Test direct de l'endpoint de notification...");

    // Appel direct au service de notification via l'API
    const testData = {
      type: "contact",
      recipient: {
        name: "Test Client Direct",
        email: "zeynash1@gmail.com",
        phone: "221777780456",
      },
      admin: {
        name: "Admin Test",
        email: "zeynash1@gmail.com",
        phone: "221777780456",
      },
      data: {
        subject: "Test direct des notifications",
        message:
          "Ce message teste directement le service de notifications pour vérifier s'il fonctionne correctement.",
      },
    };

    console.log("📧 Données de test:", JSON.stringify(testData, null, 2));

    // Test 1: Appel API contact avec debug
    console.log("\n2. Test via l'API contact avec debug activé...");
    const contactResponse = await fetch(
      `${BASE_URL}/api/contact/send?debug=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: testData.recipient.name,
          email: testData.recipient.email,
          phone: testData.recipient.phone,
          subject: testData.data.subject,
          message: testData.data.message + "\n\n[TEST DIRECT AVEC DEBUG]",
        }),
      }
    );

    const contactResult = await contactResponse.json();
    console.log("📧 Résultat contact avec debug:", contactResult);

    // Test 2: Vérification des variables d'environnement
    console.log(
      "\n3. Vérification des variables d'environnement sur Vercel..."
    );
    const envTestResponse = await fetch(`${BASE_URL}/api/test`);
    const envTestResult = await envTestResponse.json();
    console.log("⚙️  Variables env:", envTestResult);

    console.log("\n4. Test de l'endpoint de santé...");
    const healthResponse = await fetch(`${BASE_URL}/api/ping`);
    const healthResult = await healthResponse.json();
    console.log("❤️  Santé API:", healthResult);
  } catch (error) {
    console.error("❌ Erreur lors du test direct:", error.message);
    console.error("🔍 Stack trace:", error.stack);
  }
}

console.log("\n🚀 Démarrage du test direct...");
testNotificationService()
  .then(() => {
    console.log("\n" + "=".repeat(60));
    console.log("✅ Test terminé!");
    console.log("📧 Si vous ne recevez pas d'email dans les 2 minutes:");
    console.log("   1. Vérifiez les logs Vercel");
    console.log("   2. Vérifiez vos spams");
    console.log("   3. Vérifiez la config email");
  })
  .catch(console.error);
