import { defineEventHandler, readBody } from "h3";
import { addOrderToAirtable } from "~/utils/airtable-orders";
import { sendInvoices } from "~/utils/invoice-service";
import { sendWhatsAppNotifications } from "~/utils/whatsapp-real";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Générer une référence de commande
    const orderRef = `CMD_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Données de test pour la commande
    const testOrderData = {
      ref: orderRef,
      customer: {
        name: body.customerName || "Test Client",
        email: body.customerEmail || "zeynash1@gmail.com",
        phone: body.customerPhone || "+221777780456",
      },
      shipping: {
        address: body.shippingAddress || "Test Address, Dakar",
        city: "Dakar",
        method: "Standard",
        cost: 3000,
      },
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
      amounts: {
        subtotal: body.subtotal || 47000,
        shipping: 3000,
        discount: 0,
        total: body.total || 50000,
      },
      status: "Pending",
    };

    console.log("🧪 Test du flux de commande complet avec:", testOrderData);

    // 1. Créer la commande dans Airtable
    console.log("📊 Étape 1: Création de la commande dans Airtable...");
    const airtableResult = await addOrderToAirtable(testOrderData);
    console.log("✅ Commande créée dans Airtable:", airtableResult);

    // 2. Simuler un paiement réussi
    console.log("💰 Étape 2: Simulation d'un paiement réussi...");

    // 3. Envoyer les factures par email
    console.log("📧 Étape 3: Envoi des factures par email...");
    const emailResults = await sendInvoices({
      orderRef: orderRef,
      customerName: testOrderData.customer.name,
      customerEmail: testOrderData.customer.email,
      customerPhone: testOrderData.customer.phone,
      amount: testOrderData.amounts.total,
      paymentMethod: "PayTech",
      items: testOrderData.items,
      subtotal: testOrderData.amounts.subtotal,
      shipping: testOrderData.amounts.shipping,
      discount: testOrderData.amounts.discount,
    });

    // 4. Envoyer les factures par WhatsApp
    console.log("📱 Étape 4: Envoi des factures par WhatsApp...");
    const whatsappResults = await sendWhatsAppNotifications({
      orderRef: orderRef,
      customerName: testOrderData.customer.name,
      customerEmail: testOrderData.customer.email,
      customerPhone: testOrderData.customer.phone,
      amount: testOrderData.amounts.total,
      paymentMethod: "PayTech",
      items: testOrderData.items,
      subtotal: testOrderData.amounts.subtotal,
      shipping: testOrderData.amounts.shipping,
      discount: testOrderData.amounts.discount,
    });

    return {
      success: true,
      orderRef: orderRef,
      results: {
        airtable: airtableResult,
        email: {
          client: emailResults.client,
          admin: emailResults.admin,
        },
        whatsapp: {
          client: whatsappResults.client,
          admin: whatsappResults.admin,
        },
      },
      message: "Test du flux de commande complet terminé avec succès !",
    };
  } catch (error) {
    console.error("❌ Erreur lors du test du flux de commande:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      message: "Échec du test du flux de commande.",
    };
  }
});
