// /server/api/debug/test-email.post.ts
import { sendOrderNotification } from "../../../utils/email-notifications";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Données de test complètes
    const testOrderData = {
      ref: `DEBUG-${Date.now()}`,
      customer: {
        name: body.customerName || "Test Debug Client",
        email: body.customerEmail || "test@debug.com",
        phone: body.customerPhone || "777123456",
      },
      shipping: {
        address: body.address || "Test Address Debug",
        city: body.city || "Dakar",
        method: "Standard",
        cost: 500,
      },
      items: [
        {
          name: "Article Debug Test",
          quantity: 1,
          price: 1000,
        },
      ],
      amounts: {
        subtotal: 1000,
        shipping: 500,
        discount: 0,
        total: 1500,
      },
      source: "web" as const,
      createdAt: new Date().toISOString(),
    };

    console.log(
      "🧪 Test email avec données:",
      JSON.stringify(testOrderData, null, 2)
    );

    // Tester l'envoi d'email
    const emailSent = await sendOrderNotification(testOrderData);

    return {
      success: true,
      emailSent,
      testData: testOrderData,
      message: emailSent
        ? "✅ Email de test envoyé avec succès"
        : "❌ Échec envoi email de test",
    };
  } catch (error) {
    console.error("❌ Erreur test email:", error);

    return {
      success: false,
      error: error.message,
      stack: error.stack,
      message: "Erreur lors du test d'email",
    };
  }
});
