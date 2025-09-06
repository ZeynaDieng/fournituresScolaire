/**
 * API endpoint pour récupérer les détails d'une commande spécifique
 * GET /api/orders/[orderRef]
 */

import { defineEventHandler, createError, getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const orderRef = getRouterParam(event, "orderRef");

    if (!orderRef) {
      throw createError({
        statusCode: 400,
        statusMessage: "Référence de commande manquante",
      });
    }

    console.log("🔍 Recherche commande:", orderRef);

    // Récupérer les détails de la commande depuis Airtable
    const orderDetails = await getOrderDetailsFromAirtable(orderRef);

    if (!orderDetails) {
      throw createError({
        statusCode: 404,
        statusMessage: "Commande non trouvée",
      });
    }

    return {
      success: true,
      order: orderDetails,
    };
  } catch (error: any) {
    console.error("❌ Erreur récupération commande:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur récupération commande",
    });
  }
});

/**
 * Récupérer les détails d'une commande depuis Airtable
 */
async function getOrderDetailsFromAirtable(orderRef: string) {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!airtableApiKey || !airtableBaseId || !ordersTableId) {
      console.error("❌ Configuration Airtable manquante");
      return null;
    }

    const url = `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?filterByFormula={Order Ref}="${orderRef}"`;

    console.log("🔍 Recherche dans Airtable:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${airtableApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "❌ Erreur API Airtable:",
        response.status,
        response.statusText
      );
      return null;
    }

    const data = await response.json();
    console.log("📊 Résultats Airtable:", data);

    if (data.records && data.records.length > 0) {
      const order = data.records[0].fields;

      // Formatter les données de la commande
      return {
        id: data.records[0].id,
        orderRef: order["Order Ref"] || orderRef,
        customerName: order["Customer Name"] || order.Name || "Client",
        customerEmail: order["Customer Email"] || order.Email || "",
        customerPhone: order["Customer Phone"] || order.Phone || "",
        amount: parseFloat(order.Amount || "0"),
        items: order.Items || "Commande",
        status: order.Status || "pending",
        paymentMethod: order["Payment Method"] || "PayTech",
        createdAt:
          order["Created At"] || order.Date || new Date().toISOString(),
        updatedAt: order["Updated At"] || new Date().toISOString(),
      };
    }

    console.log("❌ Commande non trouvée:", orderRef);
    return null;
  } catch (error) {
    console.error("❌ Erreur récupération détails commande:", error);
    return null;
  }
}
