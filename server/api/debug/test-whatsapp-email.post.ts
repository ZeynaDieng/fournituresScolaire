import { sendOrderNotification } from "../../../utils/email-notifications";

export default defineEventHandler(async (event) => {
  try {
    console.log("🧪 Test d'envoi d'email WhatsApp en production...");

    // Données de test
    const testOrderData = {
      ref: "DEBUG-WHATSAPP-001",
      customer: {
        name: "Test Debug WhatsApp",
        email: "zeynash1@gmail.com",
        phone: "+221777780456",
      },
      shipping: {
        address: "Test Vercel Production",
        city: "Dakar",
        method: "Standard",
        cost: 500,
      },
      items: [{ name: "Test Item WhatsApp", price: 1000, quantity: 1 }],
      amounts: {
        subtotal: 1000,
        shipping: 500,
        discount: 0,
        total: 1500,
      },
      source: "whatsapp" as const,
      createdAt: new Date().toISOString(),
    };

    console.log("🧪 Variables d'environnement email:");
    console.log(
      "- EMAIL_USER:",
      process.env.NOTIFICATION_EMAIL_USER ? "✅ Configuré" : "❌ Manquant"
    );
    console.log(
      "- EMAIL_PASSWORD:",
      process.env.NOTIFICATION_EMAIL_PASSWORD ? "✅ Configuré" : "❌ Manquant"
    );
    console.log(
      "- ADMIN_EMAIL:",
      process.env.ADMIN_EMAIL ? "✅ Configuré" : "❌ Manquant"
    );

    // Test d'envoi d'email
    const emailSent = await sendOrderNotification(testOrderData);

    return {
      success: true,
      emailSent,
      message: emailSent
        ? "Email de test WhatsApp envoyé avec succès"
        : "Échec envoi email",
      testData: testOrderData,
      environment: {
        emailUser: process.env.NOTIFICATION_EMAIL_USER
          ? "Configuré"
          : "Manquant",
        emailPassword: process.env.NOTIFICATION_EMAIL_PASSWORD
          ? "Configuré"
          : "Manquant",
        adminEmail: process.env.ADMIN_EMAIL ? "Configuré" : "Manquant",
      },
    };
  } catch (error) {
    console.error("❌ Erreur test email WhatsApp:", error);

    return {
      success: false,
      error: error.message,
      stack: error.stack,
      environment: {
        emailUser: process.env.NOTIFICATION_EMAIL_USER
          ? "Configuré"
          : "Manquant",
        emailPassword: process.env.NOTIFICATION_EMAIL_PASSWORD
          ? "Configuré"
          : "Manquant",
        adminEmail: process.env.ADMIN_EMAIL ? "Configuré" : "Manquant",
      },
    };
  }
});
