// /server/api/orders/create-pending.post.ts
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Générer une référence unique pour la commande
    const orderRef = `WA-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Log des informations pour le développement
    const customerData = {
      name: body.customer.name,
      email: body.customer.email,
      phone: body.customer.phone,
      address: `${body.shipping.address}, ${body.shipping.city}`,
    };

    console.log("📱 Commande WhatsApp reçue:", {
      ref: orderRef,
      customer: customerData,
      total: body.amounts.total,
      items: body.items.length + " articles",
      timestamp: new Date().toLocaleString("fr-FR"),
    });

    // Essayer de sauvegarder dans la base si elle est disponible
    let savedOrder;
    try {
      const { prisma } = await import("../../prismaClient");

      const orderData = {
        ref: orderRef,
        items: JSON.stringify(body.items),
        total: Math.round(body.amounts.total),
        status: "pending_whatsapp",
      };

      savedOrder = await prisma.order.create({
        data: orderData,
      });

      console.log(
        "✅ Commande sauvegardée dans la base de données:",
        savedOrder.id
      );
    } catch (dbError) {
      console.warn(
        "⚠️ Base de données non disponible, commande traitée en mode local:",
        dbError.message
      );

      // Créer un objet de commande simulé pour la réponse
      savedOrder = {
        id: Date.now(),
        ref: orderRef,
        total: Math.round(body.amounts.total),
        status: "pending_whatsapp",
      };
    }

    return {
      success: true,
      order: {
        id: savedOrder.id,
        ref: savedOrder.ref,
        total: savedOrder.total,
        status: savedOrder.status,
      },
      message: "Commande WhatsApp créée avec succès",
    };
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création de la commande WhatsApp:",
      error
    );

    return createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la création de la commande",
    });
  }
});
