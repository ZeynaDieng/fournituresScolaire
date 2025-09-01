// server/api/paytech/refund-webhook.post.ts
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  try {
    console.log("PayTech Refund Webhook received:", body);

    // Vérification de la sécurité
    const isValid = verifyPaytechIPN(
      body,
      config.paytech.apiKey,
      config.paytech.secretKey
    );

    if (!isValid) {
      throw createError({
        statusCode: 403,
        statusMessage: "Webhook signature invalide",
      });
    }

    if (body.type_event === "refund_complete") {
      const { ref_command, item_price, payment_method } = body;

      console.log(`Remboursement confirmé pour la commande ${ref_command}`);

      // Mise à jour de la commande
      await prisma.order.update({
        where: { ref: ref_command },
        data: { status: "refunded" },
      });

      // Mise à jour du paiement
      const order = await prisma.order.findUnique({
        where: { ref: ref_command },
        include: { payment: true },
      });

      if (order?.payment) {
        await prisma.payment.update({
          where: { id: order.payment.id },
          data: { status: "refunded" },
        });
      }

      console.log(`Commande ${ref_command} marquée comme remboursée`);

      // Ici vous pouvez ajouter:
      // - Envoi d'email de confirmation du remboursement
      // - Notification au client
      // - Mise à jour du stock si nécessaire
      // - etc.
    }

    return { success: true, message: "Webhook de remboursement traité" };
  } catch (error: any) {
    console.error("Erreur webhook remboursement:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Erreur interne",
    });
  }
});

function verifyPaytechIPN(
  body: any,
  apiKey: string,
  apiSecret: string
): boolean {
  try {
    // Vérification HMAC-SHA256
    if (body.hmac_compute) {
      const amount = body.final_item_price || body.item_price;
      const message = `${amount}|${body.ref_command}|${apiKey}`;

      const expectedHmac = crypto
        .createHmac("sha256", apiSecret)
        .update(message)
        .digest("hex");

      return body.hmac_compute === expectedHmac;
    }

    // Vérification SHA256 classique (fallback)
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
    console.error("Erreur vérification IPN remboursement:", error);
    return false;
  }
}
