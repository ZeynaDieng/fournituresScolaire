import { sendOrderNotificat      amounts: {
        subtotal: 25.99,
        shipping: 0,
        discount: 0,
        total: 25.99
      },
      source: 'whatsapp' as const,
      createdAt: new Date().toISOString()
    }om "../../../utils/email-notifications";

export default defineEventHandler(async (event) => {
  try {
    console.log("[TEST EMAIL] Starting email test...");

    // Données de test simulant une commande WhatsApp
    const testOrderData = {
      ref: "TEST-" + Date.now(),
      customer: {
        name: "Test Client",
        email: "client-test@example.com",
        phone: "+33123456789",
      },
      shipping: {
        address: "123 Rue de Test, 75001 Paris",
        city: "Paris",
        method: "whatsapp",
        cost: 0,
      },
      items: [
        {
          name: "Pack CE2 - Test",
          quantity: 1,
          price: 25.99,
        },
      ],
      amounts: {
        subtotal: 25.99,
        shipping: 0,
        discount: 0,
        total: 25.99,
      },
      source: "whatsapp" as const,
    };

    // Test d'envoi d'email
    const emailResult = await sendOrderNotification(testOrderData);

    console.log("[TEST EMAIL] Email result:", emailResult);

    return {
      success: true,
      message: "Test email envoyé avec succès",
      orderData: testOrderData,
      emailResult,
    };
  } catch (error) {
    console.error("[TEST EMAIL] Erreur:", error);

    return {
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
});
