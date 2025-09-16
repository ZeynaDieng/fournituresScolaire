import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Simuler une notification PayTech pour la commande existante
    const paytechNotification = {
      ref_command: body.orderRef || "CMD_1757985940663_uuub964np",
      amount: body.amount || 100,
      payment_method: body.paymentMethod || "card",
      client_phone: body.clientPhone || "+221777780456",
      custom_field:
        body.customField ||
        "eyJpdGVtcyI6W3sibmFtZSI6IlN0eWxvIEJpbGxlIFJvdWdlIiwicXVhbnRpdHkiOjEsInByaWNlIjoxMDB9XSwiY3VzdG9tZXIiOnsibmFtZSI6IlNleW5hYm91IERpZW5nIiwiZW1haWwiOiJ6ZXluYXNoMUBnbWFpbC5jb20iLCJwaG9uZSI6IisyMjE3Nzc3ODA0NTYifX0=",
      status: body.status || "sale_complete",
      token: body.token || "test_token_123",
      currency: "XOF",
    };

    console.log("🧪 Test de notification PayTech avec:", paytechNotification);

    // Appeler le webhook PayTech
    const webhookUrl = `${
      process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/paytech/webhook-simple`;

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paytechNotification),
    });

    const result = await response.json();

    return {
      success: true,
      message: "Notification PayTech simulée avec succès",
      paytechNotification,
      webhookResult: result,
      webhookUrl,
    };
  } catch (error) {
    console.error("❌ Erreur lors du test de notification PayTech:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Échec du test de notification PayTech.",
    };
  }
});
