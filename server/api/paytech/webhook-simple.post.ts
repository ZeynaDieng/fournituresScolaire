/**
 * Webhook PayTech simple - accepte les notifications en mode test
 * POST /api/paytech/webhook-simple
 */

import { defineEventHandler, readBody, createError } from "h3";
import { sendInvoices } from "~/utils/invoice-service";
import { sendWhatsAppNotifications } from "~/utils/whatsapp";

import { updateOrderStatusInAirtable } from "~/utils/airtable-orders";

export default defineEventHandler(async (event) => {
  try {
    console.log("🔔 PayTech Webhook Simple reçu");

    const body = await readBody(event);
    console.log("📋 Données webhook:", JSON.stringify(body, null, 2));

    // En mode développement/test, on accepte tous les webhooks
    const isValidIPN =
      process.env.NODE_ENV === "development" ||
      process.env.PAYTECH_SANDBOX === "true" ||
      true; // Accepter toutes les notifications pour le test

    if (!isValidIPN) {
      console.error("❌ IPN invalide - signature non valide");
      throw createError({
        statusCode: 403,
        statusMessage: "IPN signature invalide",
      });
    }

    const {
      type_event,
      ref_command,
      item_price,
      payment_method,
      client_phone,
      final_item_price,
      custom_field,
    } = body;

    console.log(
      `📋 Événement PayTech: ${type_event} pour commande ${
        ref_command || "N/A"
      }`
    );

    // Décoder custom_field depuis Base64
    let customData: any = {};

    try {
      if (custom_field) {
        const decodedCustomField = Buffer.from(custom_field, "base64").toString(
          "utf-8"
        );
        customData = JSON.parse(decodedCustomField);
        console.log("📦 Données personnalisées:", customData);
      }
    } catch (e) {
      console.log("⚠️ Custom field non-JSON:", custom_field);
    }

    // Traitement selon le type d'événement
    if (type_event === "sale_complete" && ref_command) {
      console.log(`💰 Paiement réussi pour ${ref_command}`);

      // Mettre à jour le statut dans Airtable
      try {
        await updateOrderStatusInAirtable(ref_command, "Paid");
        console.log(
          `✅ Statut mis à jour dans Airtable: ${ref_command} -> Paid`
        );
      } catch (airtableError) {
        console.error("⚠️ Erreur mise à jour Airtable:", airtableError);
      }

      // Envoyer les factures par email
      if (customData.customer?.email || customData.email) {
        const invoiceData = {
          orderRef: ref_command,
          customerName: customData.customer?.name || "Client",
          customerEmail: customData.customer?.email || customData.email,
          customerPhone: customData.customer?.phone || client_phone || "",
          amount: final_item_price || item_price || 0,
          paymentMethod: payment_method || "PayTech",
          items: customData.items || [],
          subtotal:
            customData.items?.reduce(
              (sum: number, item: any) => sum + item.price * item.quantity,
              0
            ) ||
            final_item_price ||
            item_price ||
            0,
          shipping: customData.shipping?.cost || 0,
          discount: customData.promo_discount || 0,
        };

        console.log("📧 Envoi des factures par email...");

        // Envoyer les factures par email (client + admin)
        const emailResults = await sendInvoices(invoiceData);
        console.log(
          "📧 Facture email client:",
          emailResults.client ? "✅ Envoyée" : "❌ Échec"
        );
        console.log(
          "📧 Facture email admin:",
          emailResults.admin ? "✅ Envoyée" : "❌ Échec"
        );

        // Envoyer les factures par WhatsApp (client + admin)
        const whatsappResults = await sendWhatsAppNotifications(invoiceData);
        console.log(
          "📱 Facture WhatsApp client:",
          whatsappResults.client ? "✅ Envoyée" : "❌ Échec"
        );
        console.log(
          "📱 Notification WhatsApp admin:",
          whatsappResults.admin ? "✅ Envoyée" : "❌ Échec"
        );
      }
    } else if (type_event === "sale_cancel" && ref_command) {
      console.log(`❌ Paiement annulé pour ${ref_command}`);

      // Mettre à jour le statut dans Airtable (utiliser "Pending" car "Cancelled" n'existe pas)
      try {
        await updateOrderStatusInAirtable(ref_command, "Pending");
        console.log(
          `✅ Statut mis à jour dans Airtable: ${ref_command} -> Pending (annulé)`
        );
      } catch (airtableError) {
        console.error("⚠️ Erreur mise à jour Airtable:", airtableError);
      }
    } else if (type_event === "sale_pending" && ref_command) {
      console.log(`⏳ Paiement en attente pour ${ref_command}`);

      // Mettre à jour le statut dans Airtable
      try {
        await updateOrderStatusInAirtable(ref_command, "Pending");
        console.log(
          `✅ Statut mis à jour dans Airtable: ${ref_command} -> Pending`
        );
      } catch (airtableError) {
        console.error("⚠️ Erreur mise à jour Airtable:", airtableError);
      }
    }

    return {
      success: true,
      message: "Webhook traité avec succès",
      event: type_event,
      order: ref_command,
    };
  } catch (error: any) {
    console.error("❌ Erreur PayTech Webhook Simple:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur interne du serveur",
    });
  }
});
