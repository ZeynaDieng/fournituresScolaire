// /server/api/airtable/orders/create-pending.post.ts
import { readBody, defineEventHandler } from "h3";
import { sendOrderNotification } from "../../../utils/email-notifications";
import { addOrderToAirtable } from "../../../utils/airtable-orders";

export default defineEventHandler(async (event) => {
  try {
    console.log("📱 API create-pending appelée");

    // Log request info for debugging
    console.log(
      "📱 Headers:",
      Object.fromEntries(Object.entries(event.node.req.headers))
    );
    console.log("📱 Method:", event.node.req.method);
    console.log("📱 URL:", event.node.req.url);

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

    // Préparer les données pour l'email (compatible Vercel)
    const emailOrderData = {
      ref: orderRef,
      customer: {
        name: body.customer.name,
        email: body.customer.email || "",
        phone: body.customer.phone,
      },
      shipping: {
        address: body.shipping?.address || "",
        city: body.shipping?.city || "",
        method: body.shipping?.method || "Standard",
        cost: body.amounts.shipping || 0,
      },
      items: body.items.map((item) => ({
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price || 0,
      })),
      amounts: {
        subtotal: body.amounts.subtotal || body.amounts.total,
        shipping: body.amounts.shipping || 0,
        discount: body.amounts.discount || 0,
        total: body.amounts.total,
      },
      status: "pending", // Ajouter le statut par défaut
      source: "whatsapp" as const,
      createdAt: new Date().toISOString(),
    };

    console.log("📧 Préparation envoi email...", emailOrderData.ref);

    // � Enregistrer dans Airtable (prioritaire)
    try {
      await addOrderToAirtable(emailOrderData);
      console.log(
        "✅ Commande WhatsApp enregistrée dans Airtable:",
        emailOrderData.ref
      );
    } catch (airtableError) {
      console.warn(
        "⚠️ Erreur Airtable pour commande WhatsApp (commande créée):",
        airtableError instanceof Error ? airtableError.message : airtableError
      );
    }

    // �📧 Envoyer notification email pour commande WhatsApp
    try {
      const emailSent = await sendOrderNotification(emailOrderData);
      console.log(
        emailSent
          ? "✅ Email de notification WhatsApp envoyé"
          : "❌ Échec envoi email WhatsApp"
      );
    } catch (emailError) {
      console.warn(
        "⚠️ Erreur envoi email WhatsApp (commande créée):",
        emailError instanceof Error ? emailError.message : emailError
      );
      // Continue processing even if email fails
    }

    // Créer un objet de commande simulé pour la réponse (compatible Vercel)
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
      message: "Commande WhatsApp créée avec succès",
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
