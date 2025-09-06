/**
 * API endpoint pour télécharger une facture
 * GET /api/orders/[ref]/invoice
 */

import { defineEventHandler, getRouterParam, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const orderRef = getRouterParam(event, "ref");

    if (!orderRef) {
      throw createError({
        statusCode: 400,
        statusMessage: "Référence de commande requise",
      });
    }

    // Récupérer les détails de la commande depuis Airtable
    const orderDetails = await getOrderFromAirtable(orderRef);

    if (!orderDetails) {
      throw createError({
        statusCode: 404,
        statusMessage: "Commande non trouvée",
      });
    }

    // Vérifier que la commande est payée
    if (orderDetails.status !== "paid" && orderDetails.status !== "completed") {
      throw createError({
        statusCode: 400,
        statusMessage:
          "La facture n'est disponible que pour les commandes payées",
      });
    }

    // Générer la facture PDF (simulation pour l'instant)
    const invoiceData = generateInvoicePDF(orderDetails);

    // Retourner les données de la facture
    return {
      success: true,
      invoice: {
        orderRef: orderRef,
        customerName: orderDetails.customerName,
        amount: orderDetails.amount,
        date: orderDetails.createdAt,
        status: orderDetails.status,
        items: orderDetails.items,
        downloadUrl: `${process.env.NUXT_PUBLIC_BASE_URL}/api/orders/${orderRef}/invoice/download`,
      },
    };
  } catch (error: any) {
    console.error("Erreur génération facture:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la génération de la facture",
    });
  }
});

async function getOrderFromAirtable(orderRef: string) {
  try {
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?filterByFormula={Order Ref}="${orderRef}"`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Erreur récupération commande:", response.status);
      return null;
    }

    const data = await response.json();

    if (data.records && data.records.length > 0) {
      const order = data.records[0].fields;
      return {
        customerName: order["Customer Name"] || order.Name,
        customerEmail: order["Customer Email"] || order.Email,
        customerPhone: order["Customer Phone"] || order.Phone,
        amount: order.Amount,
        items: JSON.parse(order.Items || "[]"),
        status: order.Status,
        createdAt: order["Created At"] || order["Created"],
      };
    }

    return null;
  } catch (error) {
    console.error("Erreur récupération commande:", error);
    return null;
  }
}

function generateInvoicePDF(orderDetails: any) {
  // Simulation de génération de PDF
  // Dans un vrai projet, utilisez une librairie comme jsPDF ou PDFKit
  return {
    type: "pdf",
    content: "Facture générée",
    filename: `facture_${orderDetails.orderRef}.pdf`,
  };
}
