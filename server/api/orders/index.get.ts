/**
 * API endpoint pour récupérer toutes les commandes
 * GET /api/orders
 */

import { defineEventHandler, createError, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const limit = parseInt(query.limit as string) || 50;
    const offset = (query.offset as string) || "";

    console.log("📋 Récupération des commandes, limite:", limit);

    // Récupérer les commandes depuis Airtable
    const orders = await getOrdersFromAirtable(limit, offset);

    return {
      success: true,
      orders: orders || [],
      count: orders?.length || 0,
    };
  } catch (error: any) {
    console.error("❌ Erreur récupération commandes:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur récupération commandes",
    });
  }
});

/**
 * Récupérer les commandes depuis Airtable
 */
async function getOrdersFromAirtable(limit: number, offset?: string) {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!airtableApiKey || !airtableBaseId || !ordersTableId) {
      console.error("❌ Configuration Airtable manquante");
      return [];
    }

    let url = `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?maxRecords=${limit}&sort[0][field]=Created At&sort[0][direction]=desc`;

    if (offset) {
      url += `&offset=${offset}`;
    }

    console.log("🔍 Récupération commandes Airtable:", url);

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
      return [];
    }

    const data = await response.json();
    console.log("📊 Commandes récupérées:", data.records?.length || 0);

    if (data.records && data.records.length > 0) {
      return data.records.map((record: any) => {
        const order = record.fields;
        return {
          id: record.id,
          orderRef: order["Order Ref"] || "",
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
      });
    }

    return [];
  } catch (error) {
    console.error("❌ Erreur récupération commandes:", error);
    return [];
  }
}
