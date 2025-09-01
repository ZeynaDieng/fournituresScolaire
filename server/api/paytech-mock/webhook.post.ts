// server/api/paytech-mock/webhook.post.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  console.log("Mock PayTech Webhook reçu:", body);

  try {
    const {
      token,
      ref_command,
      status,
      payment_method,
      amount,
      transaction_id,
    } = body;

    if (!token || !ref_command || !status) {
      throw createError({
        statusCode: 400,
        statusMessage: "Données webhook manquantes",
      });
    }

    // Mise à jour de la commande en base
    try {
      // Chercher la commande
      const existingOrder = await prisma.order.findFirst({
        where: { ref: ref_command },
      });

      if (existingOrder) {
        // Mettre à jour la commande existante
        await prisma.order.update({
          where: { id: existingOrder.id },
          data: {
            status:
              status === "paid"
                ? "completed"
                : status === "canceled"
                ? "cancelled"
                : "failed",
          },
        });

        // Créer ou mettre à jour l'enregistrement de paiement
        const existingPayment = await prisma.payment.findFirst({
          where: { orderId: existingOrder.id },
        });

        if (existingPayment) {
          await prisma.payment.update({
            where: { id: existingPayment.id },
            data: {
              status: status,
              amount: amount || existingPayment.amount,
              paytechId: transaction_id || existingPayment.paytechId,
            },
          });
        } else {
          await prisma.payment.create({
            data: {
              orderId: existingOrder.id,
              provider: "PayTech-Mock",
              status: status,
              amount: amount || existingOrder.total,
              paytechId: transaction_id || `mock_${Date.now()}`,
            },
          });
        }
      }

      console.log(`Mock Webhook traité: ${ref_command} -> ${status}`);
    } catch (dbError: any) {
      console.warn(
        "Erreur base de données webhook mock (non-bloquante):",
        dbError.message
      );
    }

    // Réponse de succès pour le mock
    return {
      success: true,
      message: "Mock webhook traité avec succès",
      ref_command,
      status,
      mock: true,
    };
  } catch (error: any) {
    console.error("Erreur Mock PayTech Webhook:", error);

    throw createError({
      statusCode: 500,
      statusMessage:
        error.message || "Erreur lors du traitement du webhook mock",
    });
  }
});
