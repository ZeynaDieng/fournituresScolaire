// server/api/paytech/webhook.post.ts
import crypto from "crypto";
import { updateOrderStatusInAirtable } from "../../../utils/airtable-orders";
import { NotificationService } from "../../../utils/notification-service";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  try {
    console.log("PayTech Webhook received:", body);

    // Vérification de la sécurité selon la documentation Paytech
    const isValidIPN = verifyPaytechIPN(
      body,
      config.paytech.apiKey,
      config.paytech.secretKey
    );

    if (!isValidIPN) {
      console.error("IPN invalide - signature non valide");
      throw createError({
        statusCode: 403,
        statusMessage: "IPN signature invalide",
      });
    }

    const {
      type_event,
      custom_field,
      ref_command,
      item_price,
      payment_method,
      client_phone,
      token,
      currency,
      final_item_price,
      initial_item_price,
      promo_enabled,
      promo_value_percent,
    } = body;

    // Traitement selon le type d'événement
    switch (type_event) {
      case "sale_complete":
        await handleSuccessfulPayment({
          ref_command,
          amount: final_item_price || item_price,
          original_amount: initial_item_price || item_price,
          payment_method,
          client_phone,
          token,
          currency: currency || "XOF",
          custom_field,
          promo_applied: promo_enabled,
          promo_discount: promo_value_percent,
        });
        break;

      case "sale_canceled":
        await handleCanceledPayment({
          ref_command,
          amount: item_price,
          payment_method,
          custom_field,
        });
        break;

      case "refund_complete":
        await handleRefundComplete({
          ref_command,
          amount: item_price,
          payment_method,
          custom_field,
        });
        break;

      default:
        console.log(`Événement non géré: ${type_event}`);
    }

    return { success: true, message: "IPN traité avec succès" };
  } catch (error: any) {
    console.error("Erreur lors du traitement du webhook:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Erreur webhook: ${error.message}`,
    });
  }
});

// Fonction de vérification de la sécurité IPN selon la doc Paytech
function verifyPaytechIPN(
  body: any,
  apiKey: string,
  apiSecret: string
): boolean {
  try {
    // Méthode 1: Vérification HMAC-SHA256 (recommandée)
    if (body.hmac_compute) {
      let message: string;

      if (body.type_event?.includes("transfer")) {
        // Pour les transfers: amount|id_transfer|api_key
        message = `${body.amount}|${body.id_transfer}|${apiKey}`;
      } else {
        // Pour les paiements: amount|ref_command|api_key
        const amount = body.final_item_price || body.item_price;
        message = `${amount}|${body.ref_command}|${apiKey}`;
      }

      const expectedHmac = crypto
        .createHmac("sha256", apiSecret)
        .update(message)
        .digest("hex");

      return body.hmac_compute === expectedHmac;
    }

    // Méthode 2: Vérification SHA256 classique (fallback)
    if (body.api_key_sha256 && body.api_secret_sha256) {
      const expectedKeyHash = crypto
        .createHash("sha256")
        .update(apiKey)
        .digest("hex");

      const expectedSecretHash = crypto
        .createHash("sha256")
        .update(apiSecret)
        .digest("hex");

      return (
        body.api_key_sha256 === expectedKeyHash &&
        body.api_secret_sha256 === expectedSecretHash
      );
    }

    return false;
  } catch (error) {
    console.error("Erreur lors de la vérification IPN:", error);
    return false;
  }
}

// Traitement d'un paiement réussi
async function handleSuccessfulPayment(paymentData: any) {
  try {
    console.log(
      `Traitement du paiement réussi pour la commande ${paymentData.ref_command}`
    );

    // Parse des données custom
    let customData = {};
    try {
      customData = JSON.parse(paymentData.custom_field || "{}");
    } catch (e) {
      console.warn("Erreur parsing custom_field:", e);
    }

    // Mise à jour de la commande
    await prisma.order.update({
      where: { ref: paymentData.ref_command },
      data: {
        status: "paid",
      },
    });

    // Création ou mise à jour du paiement
    const order = await prisma.order.findUnique({
      where: { ref: paymentData.ref_command },
    });

    if (order) {
      await prisma.payment.upsert({
        where: { orderId: order.id },
        update: {
          status: "completed",
          paytechId: paymentData.token,
          provider: "paytech",
        },
        create: {
          orderId: order.id,
          provider: "paytech",
          status: "completed",
          amount: paymentData.amount,
          paytechId: paymentData.token,
        },
      });
    }

    console.log(`Commande ${paymentData.ref_command} marquée comme payée`);

    // 📊 Mettre à jour le statut dans Airtable
    try {
      await updateOrderStatusInAirtable(paymentData.ref_command, "Paid");
      console.log(
        `✅ Statut PayTech mis à jour dans Airtable: ${paymentData.ref_command} -> Paid`
      );
    } catch (airtableError) {
      console.warn(
        "⚠️ Erreur mise à jour Airtable pour paiement PayTech:",
        airtableError instanceof Error ? airtableError.message : airtableError
      );
    }

    // Ici vous pouvez ajouter :
    // - Envoi d'email de confirmation
    // - Notification SMS
    // - Webhook vers d'autres services
    // - Mise à jour du stock
    // - etc.
  } catch (error) {
    console.error("Erreur lors du traitement du paiement réussi:", error);
    throw error;
  }
}

// Traitement d'un paiement annulé
async function handleCanceledPayment(paymentData: any) {
  try {
    console.log(
      `Traitement de l'annulation pour la commande ${paymentData.ref_command}`
    );

    // Mise à jour de la commande
    await prisma.order.update({
      where: { ref: paymentData.ref_command },
      data: {
        status: "canceled",
      },
    });

    // Mise à jour du paiement si il existe
    const order = await prisma.order.findUnique({
      where: { ref: paymentData.ref_command },
    });

    if (order) {
      await prisma.payment.updateMany({
        where: { orderId: order.id },
        data: {
          status: "canceled",
        },
      });
    }

    console.log(`Commande ${paymentData.ref_command} marquée comme annulée`);
  } catch (error) {
    console.error("Erreur lors du traitement de l'annulation:", error);
    throw error;
  }
}

// Traitement d'un remboursement
async function handleRefundComplete(refundData: any) {
  try {
    console.log(
      `Traitement du remboursement pour la commande ${refundData.ref_command}`
    );

    // Mise à jour de la commande
    await prisma.order.update({
      where: { ref: refundData.ref_command },
      data: {
        status: "refunded",
      },
    });

    // Mise à jour du paiement
    const order = await prisma.order.findUnique({
      where: { ref: refundData.ref_command },
    });

    if (order) {
      await prisma.payment.updateMany({
        where: { orderId: order.id },
        data: {
          status: "refunded",
        },
      });
    }

    console.log(`Commande ${refundData.ref_command} remboursée`);
  } catch (error) {
    console.error("Erreur lors du traitement du remboursement:", error);
    throw error;
  }
}
