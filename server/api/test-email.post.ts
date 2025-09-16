import { defineEventHandler, readBody } from "h3";
import { sendCustomerConfirmationEmail, sendAdminNotificationEmail } from "~/utils/email-service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Données de test
    const testOrderData = {
      orderRef: "TEST-" + Date.now(),
      customerName: body.customerName || "Test Client",
      customerEmail: body.customerEmail || "test@example.com",
      customerPhone: body.customerPhone || "+221XXXXXXXXX",
      amount: body.amount || 50000,
      paymentMethod: body.paymentMethod || "PayTech",
      items: [
        {
          name: "Pack Scolaire Primaire",
          quantity: 1,
          price: 50000
        }
      ]
    };

    console.log("🧪 Test d'envoi d'emails avec les données:", testOrderData);

    // Test email client
    const clientEmailResult = await sendCustomerConfirmationEmail(testOrderData);
    
    // Test email admin
    const adminEmailResult = await sendAdminNotificationEmail(testOrderData);

    return {
      success: true,
      results: {
        clientEmail: clientEmailResult,
        adminEmail: adminEmailResult,
        testData: testOrderData
      },
      message: "Test d'emails terminé. Vérifiez vos boîtes mail et les logs du serveur."
    };

  } catch (error) {
    console.error("❌ Erreur lors du test email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Échec du test d'emails. Vérifiez la configuration."
    };
  }
});
