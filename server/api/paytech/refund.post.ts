// server/api/paytech/refund.post.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  try {
    // Vérification des permissions (à adapter selon votre système d'auth)
    // if (!isAdmin(event)) {
    //   throw createError({
    //     statusCode: 403,
    //     statusMessage: "Accès refusé"
    //   });
    // }

    // Validation des données
    if (!body.ref_command) {
      throw createError({
        statusCode: 400,
        statusMessage: "La référence de commande est requise",
      });
    }

    // Vérification que la commande existe et est payée
    const order = await prisma.order.findUnique({
      where: { ref: body.ref_command },
      include: { payment: true },
    });

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: "Commande non trouvée",
      });
    }

    if (order.status !== "paid") {
      throw createError({
        statusCode: 400,
        statusMessage: "Seules les commandes payées peuvent être remboursées",
      });
    }

    // Appel à l'API de remboursement Paytech
    const refundResponse = await fetch(
      "https://paytech.sn/api/payment/refund-payment",
      {
        method: "POST",
        headers: {
          API_KEY: config.paytech.apiKey,
          API_SECRET: config.paytech.secretKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          ref_command: body.ref_command,
        }),
      }
    );

    const result = await refundResponse.json();

    if (result.success === 1) {
      // Mise à jour du statut en base en attendant le webhook
      await prisma.order.update({
        where: { ref: body.ref_command },
        data: { status: "refund_pending" },
      });

      if (order.payment) {
        await prisma.payment.update({
          where: { id: order.payment.id },
          data: { status: "refund_pending" },
        });
      }

      return {
        success: true,
        message:
          result.message || "Demande de remboursement initiée avec succès",
        ref_command: body.ref_command,
      };
    } else {
      throw createError({
        statusCode: 400,
        statusMessage:
          result.message || "Erreur lors de la demande de remboursement",
      });
    }
  } catch (error: any) {
    console.error("Erreur remboursement Paytech:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Erreur interne du serveur",
    });
  }
});
