// /server/api/orders/create-pending.post.ts
import { addOrderToGoogleSheets } from "../../../utils/google-sheets";
import { sendOrderNotification } from "../../../utils/email-notifications";

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

    // Préparer les données pour Google Sheets
    const orderDataForSheet = {
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        phone: body.customer.phone,
      },
      shipping: {
        address: body.shipping.address,
        city: body.shipping.city,
        method: body.shipping.method,
        cost: body.amounts.shipping,
      },
      items: body.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      amounts: {
        subtotal: body.amounts.subtotal,
        shipping: body.amounts.shipping,
        discount: body.amounts.discount || 0,
        total: body.amounts.total,
      },
    };

    // Essayer d'ajouter à Google Sheets en premier
    let sheetResult;
    try {
      sheetResult = await addOrderToGoogleSheets(orderDataForSheet);
      console.log("✅ Commande ajoutée à Google Sheets:", sheetResult.orderRef);
    } catch (sheetError) {
      console.warn(
        "⚠️ Erreur Google Sheets (la commande continue):",
        sheetError.message
      );
    }

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

    // 📧 Envoyer notification email pour commande WhatsApp
    try {
      const emailData = {
        ref: orderRef,
        customer: {
          name: body.customer.name,
          email: body.customer.email,
          phone: body.customer.phone,
        },
        shipping: {
          address: body.shipping.address,
          city: body.shipping.city,
          method: body.shipping.method,
          cost: body.amounts.shipping,
        },
        items: body.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        amounts: {
          subtotal: body.amounts.subtotal,
          shipping: body.amounts.shipping,
          discount: body.amounts.discount || 0,
          total: body.amounts.total,
        },
        source: "whatsapp" as const,
        createdAt: new Date().toISOString(),
      };

      const emailSent = await sendOrderNotification(emailData);
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
    }

    return {
      success: true,
      order: {
        id: savedOrder.id,
        ref: savedOrder.ref,
        total: savedOrder.total,
        status: savedOrder.status,
      },
      googleSheets: sheetResult
        ? {
            success: true,
            orderRef: sheetResult.orderRef,
          }
        : {
            success: false,
            error: "Google Sheets non configuré ou erreur",
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
