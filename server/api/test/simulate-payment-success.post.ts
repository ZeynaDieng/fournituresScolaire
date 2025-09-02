// server/api/test/simulate-payment-success.post.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event: any) => {
  const body = await readBody(event);

  try {
    const {
      ref_command,
      amount = 1000,
      payment_method = "Orange Money",
    } = body;

    if (!ref_command) {
      throw createError({
        statusCode: 400,
        statusMessage: "ref_command est requis",
      });
    }

    // Vérifier que la commande existe
    const order = await prisma.order.findUnique({
      where: { ref: ref_command },
    });

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: "Commande non trouvée",
      });
    }

    // Mettre à jour la commande
    await prisma.order.update({
      where: { ref: ref_command },
      data: { status: "paid" },
    });

    // Créer le paiement
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "paytech",
        status: "completed",
        amount: amount,
        paytechId: `TEST_${Date.now()}`,
      },
    });

    console.log(`✅ Paiement simulé pour la commande ${ref_command}`);

    return {
      success: true,
      message: `Paiement simulé avec succès pour ${ref_command}`,
      order_status: "paid",
      payment_created: true,
    };
  } catch (error: any) {
    console.error("Erreur simulation paiement:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Erreur lors de la simulation",
    });
  }
});
