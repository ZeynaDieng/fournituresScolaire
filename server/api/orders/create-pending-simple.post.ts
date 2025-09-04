export default defineEventHandler(async (event) => {
  try {
    console.log("📱 API create-pending-simple appelée");

    const body = await readBody(event);
    console.log("📱 Données reçues:", JSON.stringify(body, null, 2));

    // Validation des données essentielles
    if (!body.customer) {
      throw new Error("Informations client manquantes");
    }

    if (!body.customer.name || !body.customer.phone) {
      throw new Error("Nom et téléphone du client requis");
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      throw new Error("Articles de commande manquants");
    }

    if (
      !body.amounts ||
      typeof body.amounts.total !== "number" ||
      body.amounts.total <= 0
    ) {
      throw new Error("Total de commande invalide");
    }

    // Générer une référence unique pour la commande
    const orderRef = `WA-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    console.log("📱 Commande WhatsApp reçue:", {
      ref: orderRef,
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        phone: body.customer.phone,
        address: body.shipping?.address,
      },
      total: body.amounts.total,
      items: body.items.length + " articles",
      timestamp: new Date().toLocaleString("fr-FR", {
        timeZone: "Africa/Dakar",
      }),
    });

    console.log("📧 Email skipped for testing - order processed successfully");

    // Créer un objet de commande simulé pour la réponse
    const savedOrder = {
      id: Date.now(),
      ref: orderRef,
      total: Math.round(body.amounts.total),
      status: "pending_whatsapp",
    };

    console.log("✅ Commande WhatsApp traitée:", savedOrder.id);

    return {
      success: true,
      order: {
        id: savedOrder.id,
        ref: savedOrder.ref,
        total: savedOrder.total,
        status: savedOrder.status,
      },
      message:
        "Commande WhatsApp créée avec succès (email désactivé pour test)",
    };
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création de la commande WhatsApp:",
      error
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      statusCode: 500,
      statusMessage: "Erreur lors de la création de la commande",
    };
  }
});
