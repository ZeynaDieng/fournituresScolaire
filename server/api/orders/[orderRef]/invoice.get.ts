/**
 * API endpoint pour générer et télécharger une facture
 * GET /api/orders/[orderRef]/invoice
 */

import { defineEventHandler, createError, setHeader, getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const orderRef = getRouterParam(event, "orderRef");

    if (!orderRef) {
      throw createError({
        statusCode: 400,
        statusMessage: "Référence de commande manquante",
      });
    }

    console.log("📄 Génération facture pour commande:", orderRef);

    // Récupérer les détails de la commande depuis Airtable
    const orderDetails = await getOrderDetailsFromAirtable(orderRef);

    if (!orderDetails) {
      throw createError({
        statusCode: 404,
        statusMessage: "Commande non trouvée",
      });
    }

    // Générer le PDF de la facture
    const invoicePDF = await generateInvoicePDF(orderDetails);

    // Configurer les headers pour le téléchargement
    setHeader(event, "Content-Type", "application/pdf");
    setHeader(
      event,
      "Content-Disposition",
      `attachment; filename="facture-${orderRef}.pdf"`
    );
    setHeader(event, "Cache-Control", "no-cache");

    return invoicePDF;
  } catch (error: any) {
    console.error("❌ Erreur génération facture:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur génération facture",
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

    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?filterByFormula={Order Ref}="${orderRef}"`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Erreur récupération commande Airtable:", response.status);
      return null;
    }

    const data = await response.json();

    if (data.records && data.records.length > 0) {
      const order = data.records[0].fields;
      return {
        orderRef: orderRef,
        customerName: order["Customer Name"] || order.Name,
        customerEmail: order["Customer Email"] || order.Email,
        customerPhone: order["Customer Phone"] || order.Phone,
        customerAddress: order["Customer Address"] || order.Address,
        amount: order.Amount,
        items: order.Items ? JSON.parse(order.Items) : [],
        status: order.Status,
        createdAt: order["Created At"] || order.Date,
        paymentMethod: order["Payment Method"] || "PayTech",
      };
    }

    return null;
  } catch (error) {
    console.error("Erreur récupération détails commande:", error);
    return null;
  }
}

/**
 * Générer le PDF de la facture
 */
async function generateInvoicePDF(orderDetails: any) {
  try {
    // Pour l'instant, générons un HTML simple qui sera converti en PDF
    // Dans une vraie application, vous utiliseriez une librairie comme puppeteer ou jsPDF

    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Facture ${orderDetails.orderRef}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #16a34a; padding-bottom: 20px; }
        .company-info { text-align: center; margin-bottom: 30px; }
        .invoice-info { margin-bottom: 30px; }
        .customer-info { margin-bottom: 30px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .items-table th { background-color: #f8f9fa; font-weight: bold; }
        .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="color: #16a34a; margin: 0;">Fournitures Scolaires</h1>
        <p style="margin: 5px 0;">Votre partenaire pour la réussite scolaire</p>
    </div>

    <div class="company-info">
        <p><strong>Fournitures Scolaires SARL</strong><br>
        Adresse: Dakar, Sénégal<br>
        Téléphone: +221 77 778 04 56<br>
        Email: contact@fournitures-scolaire.com</p>
    </div>

    <div class="invoice-info">
        <h2>FACTURE N° ${orderDetails.orderRef}</h2>
        <p><strong>Date:</strong> ${new Date(
          orderDetails.createdAt
        ).toLocaleDateString("fr-FR")}</p>
        <p><strong>Méthode de paiement:</strong> ${
          orderDetails.paymentMethod
        }</p>
    </div>

    <div class="customer-info">
        <h3>Facturé à:</h3>
        <p><strong>${orderDetails.customerName}</strong><br>
        Email: ${orderDetails.customerEmail}<br>
        Téléphone: ${orderDetails.customerPhone}<br>
        ${
          orderDetails.customerAddress
            ? `Adresse: ${orderDetails.customerAddress}`
            : ""
        }</p>
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th>Article</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${orderDetails.items
              .map(
                (item: any) => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toLocaleString("fr-FR")} F CFA</td>
                    <td>${(item.price * item.quantity).toLocaleString(
                      "fr-FR"
                    )} F CFA</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
    </table>

    <div class="total">
        <p>TOTAL: ${orderDetails.amount.toLocaleString("fr-FR")} F CFA</p>
    </div>

    <div class="footer">
        <p>Merci pour votre confiance ! Cette facture a été générée automatiquement.</p>
        <p>Pour toute question, contactez-nous à contact@fournitures-scolaire.com</p>
    </div>
</body>
</html>
    `;

    // Pour l'instant, retournons le HTML (dans une vraie app, convertir en PDF)
    // Vous devrez installer une librairie comme puppeteer pour la conversion PDF
    return Buffer.from(invoiceHTML, "utf-8");
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    throw error;
  }
}
