/**
 * Endpoint pour traiter les commandes WhatsApp
 * POST /api/airtable/orders/whatsapp
 */

import { defineEventHandler, readBody, createError } from "h3";
import { NotificationService } from "../../../utils/notification-service";
import { addOrderToAirtable } from "../../../utils/airtable-orders";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    console.log("📱 Nouvelle commande WhatsApp:", body);

    // Traitement spécifique pour les demandes de listes scolaires
    if (body.type === "school_list_confirmation" && body.schoolListRequest) {
      const slr = body.schoolListRequest;
      const { sendSchoolListConfirmationWhatsApp } = await import("../../../utils/whatsapp");
      const sent = await sendSchoolListConfirmationWhatsApp(slr);
      return { success: true, message: "Notification WhatsApp envoyée pour la liste scolaire", sent, ref: slr.id };
    }

    // Validation des données pour commande standard
    const { customer, items, totalAmount, phoneNumber } = body;

    if (!customer?.name || !customer?.phone || !items || !totalAmount) {
      throw createError({
        statusCode: 400,
        statusMessage: "Données de commande invalides",
      });
    }

    // Générer une référence de commande
    const orderRef = `WA_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 6)}`;

    // Préparer les données pour Airtable (format adapté)
    const orderDataForAirtable = {
      ref: orderRef,
      customer: {
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone,
      },
      shipping: {
        address: customer.address || "À définir (commande WhatsApp)",
        city: customer.city || "",
        method: "À définir",
        cost: 0,
      },
      items: items,
      amounts: {
        total: totalAmount,
        subtotal: totalAmount,
        shipping: 0,
        discount: 0,
      },
      status: "confirmed",
    };

    // 1. Enregistrer la commande dans Airtable
    try {
      const airtableResult = await addOrderToAirtable(orderDataForAirtable);
      console.log("✅ Commande enregistrée dans Airtable:", airtableResult);
    } catch (airtableError) {
      console.error("⚠️  Erreur Airtable:", airtableError);
      // Continuer même si Airtable échoue
    }

    // 2. Envoyer les notifications (Email + WhatsApp) à l'admin ET au client
    try {
      const notificationData = {
        type: "order" as const,
        recipient: {
          name: customer.name,
          email: customer.email || "",
          phone: customer.phone,
        },
        admin: {
          name: process.env.FROM_NAME || "Admin",
          email: process.env.ADMIN_EMAIL || "",
          phone: process.env.WHATSAPP_BUSINESS_NUMBER || "",
        },
        data: {
          orderRef,
          amount: totalAmount,
          paymentMethod: "WhatsApp",
        },
      };

      const notificationResults = await NotificationService.sendNotification(
        notificationData
      );
      console.log("📧📱 Notifications WhatsApp envoyées:", notificationResults);
    } catch (notificationError) {
      console.error("⚠️  Erreur notifications:", notificationError);
      // Ne pas faire échouer la commande si les notifications échouent
    }

    // 3. Générer l'URL WhatsApp pour la commande
    const whatsappMessage = generateWhatsAppOrderMessage({
      orderRef,
      customer,
      items,
      totalAmount,
    });

    const whatsappUrl = `https://wa.me/${process.env.WHATSAPP_BUSINESS_NUMBER?.replace(
      /\D/g,
      ""
    )}?text=${encodeURIComponent(whatsappMessage)}`;

    return {
      success: true,
      message: "Commande WhatsApp traitée avec succès",
      orderRef,
      whatsappUrl,
      notifications: "envoyées",
    };
  } catch (error: any) {
    console.error("❌ Erreur commande WhatsApp:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors du traitement de la commande WhatsApp",
    });
  }
});

/**
 * Générer le message WhatsApp pour une commande
 */
function generateWhatsAppOrderMessage(data: {
  orderRef: string;
  customer: any;
  items: any[];
  totalAmount: number;
}): string {
  let message = `🛒 *NOUVELLE COMMANDE*\n\n`;
  message += `📋 Commande: #${data.orderRef}\n`;
  message += `👤 Client: ${data.customer.name}\n`;
  message += `📱 Téléphone: ${data.customer.phone}\n`;

  if (data.customer.email) {
    message += `📧 Email: ${data.customer.email}\n`;
  }

  message += `\n📦 *ARTICLES:*\n`;

  data.items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   Quantité: ${item.quantity}\n`;
    message += `   Prix: ${item.price} FCFA\n\n`;
  });

  message += `💰 *TOTAL: ${data.totalAmount} FCFA*\n\n`;
  message += `📅 Date: ${new Date().toLocaleString("fr-FR", {
    timeZone: "Africa/Dakar",
  })}\n\n`;
  message += `✅ Cette commande a été confirmée et enregistrée.`;

  return message;
}
