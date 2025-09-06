/**
 * API endpoint pour récupérer les commandes d'un client
 * GET /api/airtable/orders/customer?email=email@example.com
 */

import { defineEventHandler, getQuery, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const email = query.email as string;

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email client requis",
      });
    }

    console.log("📋 Récupération commandes pour client:", email);

    // 1. Récupérer les commandes du client depuis Airtable
    const customerOrders = await getCustomerOrdersFromAirtable(email);

    if (!customerOrders || customerOrders.length === 0) {
      return {
        success: true,
        orders: [],
        message: "Aucune commande trouvée pour cet email",
      };
    }

    // 2. Formater les commandes pour l'affichage
    const formattedOrders = customerOrders.map((order) => ({
      id: order.id,
      orderRef: order.fields["Order Ref"],
      amount: order.fields.Amount,
      status: order.fields.Status,
      createdAt: order.fields["Created At"],
      paymentMethod: order.fields["Payment Method"] || "PayTech",
      items: order.fields.Items ? JSON.parse(order.fields.Items) : [],
      customerName: order.fields["Customer Name"],
      customerEmail: order.fields["Customer Email"],
      customerPhone: order.fields["Customer Phone"],
    }));

    return {
      success: true,
      orders: formattedOrders,
      total: formattedOrders.length,
      message: `${formattedOrders.length} commande(s) trouvée(s)`,
    };
  } catch (error: any) {
    console.error("❌ Erreur récupération commandes client:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération des commandes",
    });
  }
});

/**
 * Récupérer les commandes d'un client depuis Airtable
 */
async function getCustomerOrdersFromAirtable(email: string) {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    // Encoder l'email pour l'utiliser dans l'URL
    const encodedEmail = encodeURIComponent(email);

    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?filterByFormula=LOWER({Customer Email})="${email.toLowerCase()}"&sort%5B0%5D%5Bfield%5D=Created%20At&sort%5B0%5D%5Bdirection%5D=desc`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Erreur récupération commandes Airtable:", response.status);
      return null;
    }

    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.error("Erreur récupération commandes client:", error);
    return null;
  }
}
