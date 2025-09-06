/**
 * Webhook PayTech entièrement refactorisé - utilise Airtable + Notifications
 * POST /api/paytech/webhook-new
 */

import { defineEventHandler, readBody, createError } from "h3";
import { updateOrderStatusInAirtable } from "../../../utils/airtable-orders";
import { NotificationService } from "../../../utils/notification-service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("🔔 PayTech Webhook reçu:", JSON.stringify(body, null, 2));

    // En mode développement/test, on accepte tous les webhooks
    const isValidIPN =
      process.env.NODE_ENV === "development" ||
      process.env.PAYTECH_SANDBOX === "true" ||
      verifyPaytechIPN(
        body,
        process.env.PAYTECH_API_KEY || "",
        process.env.PAYTECH_SECRET_KEY || ""
      );

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
      `📋 Événement PayTech: ${type_event} pour commande ${ref_command}`
    );

    // Traitement selon le type d'événement
    switch (type_event) {
      case "sale_complete":
        await handleSuccessfulPayment({
          ref_command,
          amount: final_item_price || item_price,
          payment_method,
          client_phone,
          custom_field,
        });
        break;

      case "sale_cancel":
        await handleCancelledPayment({
          ref_command,
          amount: final_item_price || item_price,
        });
        break;

      case "sale_pending":
        await handlePendingPayment({
          ref_command,
          amount: final_item_price || item_price,
          payment_method,
        });
        break;

      default:
        console.log(`ℹ️  Événement PayTech non traité: ${type_event}`);
        break;
    }

    return { success: true, message: "Webhook traité avec succès" };
  } catch (error: any) {
    console.error("❌ Erreur PayTech Webhook:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur webhook PayTech",
    });
  }
});

/**
 * Traiter un paiement réussi
 */
async function handleSuccessfulPayment(data: {
  ref_command: string;
  amount: number;
  payment_method: string;
  client_phone: string;
  custom_field?: any;
}) {
  try {
    console.log("✅ Paiement réussi pour:", data.ref_command);

    // 1. Mettre à jour le statut dans Airtable
    await updateOrderStatusInAirtable(data.ref_command, "paid");

    // 2. Récupérer les détails de la commande depuis Airtable pour les notifications
    const orderDetails = await getOrderDetailsFromAirtable(data.ref_command);

    if (orderDetails) {
      // 3. Envoyer les notifications (Email + WhatsApp) à l'admin ET au client
      const notificationData = {
        type: "order" as const,
        recipient: {
          name: orderDetails.customerName || "Client",
          email: orderDetails.customerEmail || "",
          phone: orderDetails.customerPhone || data.client_phone || "",
        },
        admin: {
          name: process.env.FROM_NAME || "Admin",
          email: process.env.ADMIN_EMAIL || "",
        },
        data: {
          orderRef: data.ref_command,
          amount: data.amount,
          paymentMethod: data.payment_method,
        },
      };

      const notificationResults = await NotificationService.sendNotification(
        notificationData
      );
      console.log(
        "📧📱 Notifications envoyées pour commande",
        data.ref_command,
        ":",
        notificationResults
      );
    } else {
      console.warn(
        `⚠️  Impossible de trouver les détails de la commande ${data.ref_command}`
      );
    }

    console.log("🎉 Paiement traité avec succès:", data.ref_command);
  } catch (error) {
    console.error("❌ Erreur lors du traitement du paiement:", error);
    throw error;
  }
}

/**
 * Traiter un paiement annulé
 */
async function handleCancelledPayment(data: {
  ref_command: string;
  amount: number;
}) {
  try {
    console.log("❌ Paiement annulé pour:", data.ref_command);
    await updateOrderStatusInAirtable(data.ref_command, "cancelled");
  } catch (error) {
    console.error("Erreur annulation:", error);
  }
}

/**
 * Traiter un paiement en attente
 */
async function handlePendingPayment(data: {
  ref_command: string;
  amount: number;
  payment_method: string;
}) {
  try {
    console.log("⏳ Paiement en attente pour:", data.ref_command);
    await updateOrderStatusInAirtable(data.ref_command, "pending");
  } catch (error) {
    console.error("Erreur pending:", error);
  }
}

/**
 * Récupérer les détails d'une commande depuis Airtable
 */
async function getOrderDetailsFromAirtable(orderRef: string) {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?filterByFormula={Order Ref}="${orderRef}"`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Erreur récupération commande Airtable:", response.status);
      return null;
    }

    const data = await response.json();

    if (data.records && data.records.length > 0) {
      const order = data.records[0].fields;
      return {
        customerName: order["Customer Name"] || order.Name,
        customerEmail: order["Customer Email"] || order.Email,
        customerPhone: order["Customer Phone"] || order.Phone,
        amount: order.Amount,
        items: order.Items,
        status: order.Status,
      };
    }

    return null;
  } catch (error) {
    console.error("Erreur récupération détails commande:", error);
    return null;
  }
}

/**
 * Vérifier la signature PayTech IPN
 */
function verifyPaytechIPN(
  data: any,
  apiKey: string,
  secretKey: string
): boolean {
  try {
    // Logique de vérification selon la documentation PayTech
    // Pour l'instant, on accepte tous les webhooks (développement)
    if (
      process.env.NODE_ENV === "development" ||
      process.env.PAYTECH_SANDBOX === "true"
    ) {
      return true;
    }

    // En production, implémentez la vérification de signature selon PayTech
    // const expectedSignature = generatePaytechSignature(data, apiKey, secretKey);
    // return expectedSignature === data.signature;

    return true; // À remplacer par la vraie vérification
  } catch (error) {
    console.error("Erreur vérification signature:", error);
    return false;
  }
}
