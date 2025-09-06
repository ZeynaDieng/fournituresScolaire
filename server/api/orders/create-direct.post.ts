import { defineEventHandler, readBody, createError } from "h3";
import { NotificationService } from "../../../utils/notification-service";

interface OrderRequestBody {
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  shippingMethod?: string;
  shippingCost?: number;
  ref: string;
  items: any[];
  total: number;
  subtotal?: number;
  discount?: number;
}

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as Partial<OrderRequestBody>;

    // Validation des champs obligatoires
    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "ref",
      "items",
      "total",
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof OrderRequestBody]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Champ obligatoire manquant: ${field}`,
        });
      }
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email!)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Format email invalide",
      });
    }

    // Générer une référence unique si nécessaire
    const orderRef =
      body.ref ||
      `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Configuration Airtable
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!airtableApiKey || !airtableBaseId || !ordersTableId) {
      throw createError({
        statusCode: 500,
        statusMessage: "Configuration Airtable manquante",
      });
    }

    // Préparer les données pour Airtable
    const orderData = {
      records: [
        {
          fields: {
            "Order Ref": orderRef,
            "Customer Name": body.name!,
            "Customer Email": body.email!,
            "Customer Phone": body.phone!,
            Amount: body.total!,
            Status: "pending",
            "Payment Method": "En attente",
            Items: JSON.stringify(body.items),
            "Shipping Address": `${body.address}${
              body.city ? ", " + body.city : ""
            }`,
            Created: new Date().toISOString(),
            Source: "Web",
          },
        },
      ],
    };

    // Enregistrer dans Airtable (OBLIGATOIRE - pas de fallback)
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.json();
      console.error("❌ Erreur Airtable:", errorData);

      throw createError({
        statusCode: 500,
        statusMessage: "Impossible d'enregistrer la commande",
        data: {
          error: "Erreur base de données",
          details: errorData,
        },
      });
    }

    const airtableResult = await airtableResponse.json();
    console.log("✅ Commande enregistrée dans Airtable:", orderRef);

    // Envoyer les notifications (non bloquant)
    try {
      const notificationData = {
        type: "order" as const,
        recipient: {
          name: body.name!,
          email: body.email!,
          phone: body.phone!,
        },
        admin: {
          name: process.env.FROM_NAME || "Admin",
          email: process.env.ADMIN_EMAIL || "",
          phone: process.env.WHATSAPP_BUSINESS_NUMBER || "",
        },
        data: {
          orderRef,
          amount: body.total!,
          paymentMethod: "En attente",
          items: body.items,
          shippingAddress: `${body.address}${
            body.city ? ", " + body.city : ""
          }`,
        },
      };

      // Envoi asynchrone pour ne pas bloquer la réponse
      NotificationService.sendNotification(notificationData)
        .then((results) => {
          console.log(
            "✅ Notifications envoyées pour commande:",
            orderRef,
            results
          );
        })
        .catch((error) => {
          console.error("⚠️ Erreur notifications (non bloquante):", error);
        });
    } catch (notifError) {
      console.error("⚠️ Erreur préparation notifications:", notifError);
    }

    return {
      success: true,
      orderRef,
      message: "Commande créée avec succès",
      data: {
        airtableId: airtableResult.records[0].id,
        orderRef,
        total: body.total,
        status: "pending",
      },
    };
  } catch (error: any) {
    console.error("❌ Erreur création commande:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la création de la commande",
    });
  }
});
