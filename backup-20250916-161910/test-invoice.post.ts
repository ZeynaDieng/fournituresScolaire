import { defineEventHandler, readBody } from "h3";
import { sendInvoices } from "~/utils/invoice-service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Données de test pour la facture
    const testInvoiceData = {
      orderRef: "FACT-" + Date.now(),
      customerName: body.customerName || "Test Client",
      customerEmail: body.customerEmail || "zeynash1@gmail.com",
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

    console.log(
      "🧪 Test d'envoi de factures avec les données:",
      testInvoiceData
    );

    // Envoyer les factures
    const results = await sendInvoices(testInvoiceData);

    return {
      success: true,
      results: {
        clientInvoice: results.client,
        adminInvoice: results.admin,
        invoiceData: testInvoiceData,
      },
      message:
        "Test de facturation terminé. Vérifiez vos boîtes mail et les logs du serveur.",
    };
  } catch (error) {
    console.error("❌ Erreur lors du test de facturation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Échec du test de facturation. Vérifiez la configuration.",
    };
  }
});
