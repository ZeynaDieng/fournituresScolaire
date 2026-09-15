/**
 * Endpoint de récupération des commandes - PostgreSQL en priorité avec fallback Airtable
 * GET /api/orders
 */

import { defineEventHandler } from "h3";
import { prisma } from "../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const dbOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (dbOrders && dbOrders.length > 0) {
      const formattedOrders = dbOrders.map((o) => ({
        id: String(o.id),
        orderRef: o.ref,
        customerName: o.source || "Client",
        customerEmail: "",
        customerPhone: "",
        amount: o.total,
        status: o.status,
        paymentMethod: o.paymentStatus || "COD",
        created: o.createdAt.toISOString(),
        items: o.items,
      }));

      return {
        success: true,
        orders: formattedOrders,
        source: "postgresql",
      };
    }
  } catch (err) {
    console.warn("⚠️ Erreur Prisma PostgreSQL orders, fallback Airtable:", err);
  }

  // Fallback Airtable si aucune commande dans PostgreSQL
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE || "tblWx8YvNm2KqR5Ht";

    if (!airtableApiKey || !airtableBaseId) {
      return { success: true, orders: [] };
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
      return { success: true, orders: [] };
    }

    const data = await response.json();

    const formattedOrders = (data.records || []).map((record: any) => ({
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
