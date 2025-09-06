/**
 * API endpoint pour récupérer les commandes d'un client par email
 * GET /api/airtable/orders/by-email?email=client@example.com
 */

import { defineEventHandler, createError, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const email = query.email as string;

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email manquant",
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Format email invalide",
      });
    }

    console.log("🔍 Recherche commandes pour email:", email);

    // Récupérer les commandes depuis Airtable
    const orders = await getOrdersByEmailFromAirtable(email);

    return {
      success: true,
      email: email,
      orders: orders || [],
      count: orders ? orders.length : 0,
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
 * Récupérer toutes les commandes d'un client depuis Airtable
 */
async function getOrdersByEmailFromAirtable(email: string) {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?filterByFormula={Customer Email}="${email}"&sort[0][field]=Created At&sort[0][direction]=desc`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Erreur récupération commandes Airtable:", response.status);
      return [];
    }

    const data = await response.json();

    if (data.records && data.records.length > 0) {
      return data.records.map((record: any) => {
        const order = record.fields;
        return {
          id: record.id,
          orderRef: order["Order Ref"],
          customerName: order["Customer Name"] || order.Name,
          customerEmail: order["Customer Email"] || order.Email,
          customerPhone: order["Customer Phone"] || order.Phone,
          amount: order.Amount,
          items: order.Items ? JSON.parse(order.Items) : [],
          status: order.Status,
          paymentMethod: order["Payment Method"] || "PayTech",
          createdAt: order["Created At"] || order.Date,
          updatedAt: order["Updated At"],
        };
      });
    }

    return [];
  } catch (error) {
    console.error("Erreur récupération commandes:", error);
    return [];
  }
}
