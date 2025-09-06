/**
 * Redirection vers l'endpoint Airtable pour les commandes
 * GET /api/orders -> /api/airtable/orders
 */

import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // Rediriger vers l'endpoint airtable existant
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!airtableApiKey || !airtableBaseId || !ordersTableId) {
      throw new Error("Configuration Airtable manquante");
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?sort[0][field]=Created&sort[0][direction]=desc`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();

    const formattedOrders = data.records.map((record: any) => ({
      id: record.id,
      orderRef: record.fields["Order Ref"] || "",
      customerName: record.fields["Customer Name"] || "",
      customerEmail: record.fields["Customer Email"] || "",
      customerPhone: record.fields["Customer Phone"] || "",
      amount: record.fields["Amount"] || 0,
      status: record.fields["Status"] || "pending",
      paymentMethod: record.fields["Payment Method"] || "",
      created: record.fields["Created"] || record.createdTime,
      items: record.fields["Items"] || "[]",
    }));

    return {
      success: true,
      orders: formattedOrders,
    };
  } catch (error: any) {
    console.error("❌ Erreur récupération commandes:", error);
    return {
      success: false,
      error: "Erreur récupération commandes",
      message: error.message,
    };
  }
});
