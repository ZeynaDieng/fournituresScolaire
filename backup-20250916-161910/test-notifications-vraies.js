/**
 * Test des notifications email/WhatsApp avec les vraies configurations
 */

// Charger les variables d'environnement
import dotenv from "dotenv";
dotenv.config();

console.log("🧪 TEST NOTIFICATIONS RÉELLES");
console.log("==============================");
console.log("");

// Vérifier les variables d'environnement
console.log("🔐 Variables d'environnement:");
const requiredVars = {
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS ? "***masked***" : undefined,
  FROM_EMAIL: process.env.FROM_EMAIL,
  FROM_NAME: process.env.FROM_NAME,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  WHATSAPP_BUSINESS_NUMBER: process.env.WHATSAPP_BUSINESS_NUMBER,
};

for (const [key, value] of Object.entries(requiredVars)) {
  console.log(`• ${key}: ${value || "❌ MANQUANTE"}`);
}
console.log("");

// Test 1: Notification de commande
console.log("1️⃣ Test notification de commande...");
const orderNotificationData = {
  type: "order",
  recipient: {
    name: "Test Client",
    email: "test.client@example.com",
    phone: "221782911844", // Votre numéro pour le test
  },
  admin: {
    name: process.env.FROM_NAME || "Admin",
    email: process.env.ADMIN_EMAIL || "",
    phone: process.env.WHATSAPP_BUSINESS_NUMBER || "",
  },
  data: {
    orderRef: `TEST-${Date.now()}`,
    amount: 15000,
    paymentMethod: "PayTech",
    items: "Cahier Spiral x2, Stylo x5",
  },
};

console.log(
  "📋 Données de test:",
  JSON.stringify(orderNotificationData, null, 2)
);

// Test 2: Notification de contact
console.log("");
console.log("2️⃣ Test notification de contact...");
const contactNotificationData = {
  type: "contact",
  recipient: {
    name: "Test Contact",
    email: "test.contact@example.com",
    phone: "221782911844", // Votre numéro pour le test
  },
  admin: {
    name: process.env.FROM_NAME || "Admin",
    email: process.env.ADMIN_EMAIL || "",
    phone: process.env.WHATSAPP_BUSINESS_NUMBER || "",
  },
  data: {
    subject: "Test de contact depuis le site",
    message:
      "Bonjour, ceci est un message de test depuis le système de contact automatisé.",
  },
};

console.log(
  "📋 Données de test:",
  JSON.stringify(contactNotificationData, null, 2)
);

// Test 3: Test API de production
console.log("");
console.log("3️⃣ Test API de contact en production...");

async function testProductionContactAPI() {
  try {
    const response = await fetch(
      "https://fournitures-scolaire.vercel.app/api/contact/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test API",
          email: process.env.ADMIN_EMAIL, // Votre email pour recevoir le test
          phone: process.env.WHATSAPP_BUSINESS_NUMBER,
          subject: "Test API Contact - Notifications",
          message:
            "Test automatisé des notifications email/WhatsApp depuis l'API de production.",
        }),
      }
    );

    const result = await response.json();

    console.log(
      `📡 Réponse API (${response.status}):`,
      JSON.stringify(result, null, 2)
    );

    if (response.ok) {
      console.log("✅ Test API de contact réussi");
    } else {
      console.log("❌ Test API de contact échoué");
    }
  } catch (error) {
    console.error("❌ Erreur test API:", error.message);
  }
}

// Test 4: Test création de commande avec notifications
console.log("");
console.log("4️⃣ Test API de création de commande...");

async function testProductionOrderAPI() {
  try {
    const response = await fetch(
      "https://fournitures-scolaire.vercel.app/api/airtable/orders/create-direct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Client API",
          email: process.env.ADMIN_EMAIL, // Votre email pour recevoir le test
          phone: process.env.WHATSAPP_BUSINESS_NUMBER,
          address: "123 Rue Test, Dakar",
          city: "Dakar",
          ref: `API-TEST-${Date.now()}`,
          items: [
            { name: "Cahier Test", quantity: 2, price: 1000 },
            { name: "Stylo Test", quantity: 5, price: 500 },
          ],
          total: 4500,
          subtotal: 4500,
          paymentMethod: "Test",
        }),
      }
    );

    const result = await response.json();

    console.log(
      `📡 Réponse API (${response.status}):`,
      JSON.stringify(result, null, 2)
    );

    if (response.ok) {
      console.log("✅ Test API de commande réussi");
    } else {
      console.log("❌ Test API de commande échoué");
    }
  } catch (error) {
    console.error("❌ Erreur test API commande:", error.message);
  }
}

// Exécuter tous les tests
async function runAllTests() {
  try {
    console.log("🚀 Démarrage des tests...");
    console.log("");

    await testProductionContactAPI();
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Attendre 2 secondes

    await testProductionOrderAPI();

    console.log("");
    console.log("✅ Tests terminés !");
    console.log("");
    console.log("💡 Vérifiez:");
    console.log("- Votre boîte email:", process.env.ADMIN_EMAIL);
    console.log("- Votre WhatsApp:", process.env.WHATSAPP_BUSINESS_NUMBER);
    console.log("- Les logs Vercel pour les détails");
  } catch (error) {
    console.error("❌ Erreur lors des tests:", error);
  }
}

// Lancer les tests
runAllTests();
