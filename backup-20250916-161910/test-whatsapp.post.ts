import { defineEventHandler, readBody } from "h3";
import { sendWhatsAppNotifications } from "~/utils/whatsapp-service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Données de test pour WhatsApp
    const testInvoiceData = {
      orderRef: "WHATSAPP-TEST-" + Date.now(),
      customerName: body.customerName || "Test Client",
      customerEmail: body.customerEmail || "test@example.com",
      customerPhone: body.customerPhone || "+221777780456",
      amount: body.amount || 50000,
      paymentMethod: body.paymentMethod || "PayTech",
      items: body.items || [
        {
          name: "Pack Scolaire Primaire",
          quantity: 1,
          price: 45000,
        },
        {
          name: "Cahier 200 pages",
          quantity: 2,
          price: 600,
        },
        {
          name: "Stylo Bille Bleu",
          quantity: 5,
          price: 100,
        },
      ],
      subtotal: body.subtotal || 47000,
      shipping: body.shipping || 3000,
      discount: body.discount || 0,
    };

    console.log("🧪 Test d'envoi WhatsApp avec les données:", testInvoiceData);

    // Envoyer les notifications WhatsApp
    const results = await sendWhatsAppNotifications(testInvoiceData);

    return {
      success: true,
      results: {
        clientWhatsApp: results.client,
        adminWhatsApp: results.admin,
        invoiceData: testInvoiceData,
      },
      message:
        "Test WhatsApp terminé. Vérifiez les messages WhatsApp et les logs du serveur.",
    };
  } catch (error) {
    console.error("❌ Erreur lors du test WhatsApp:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Échec du test WhatsApp. Vérifiez la configuration.",
    };
  }
});
