/**
 * API endpoint pour télécharger la facture d'une commande
 * GET /api/orders/invoice/[orderRef]
 */

import { defineEventHandler, getRouterParam, createError } from "h3";

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

    // 1. Récupérer les détails de la commande depuis Airtable
    const orderDetails = await getOrderDetailsFromAirtable(orderRef);

    if (!orderDetails) {
      throw createError({
        statusCode: 404,
        statusMessage: "Commande non trouvée",
      });
    }

    // 2. Vérifier que la commande est payée
    if (orderDetails.status !== "paid" && orderDetails.status !== "completed") {
      throw createError({
        statusCode: 400,
        statusMessage: "La commande n'est pas encore payée",
      });
    }

    // 3. Générer le PDF de facture
    const invoicePDF = await generateInvoicePDF(orderDetails);

    // 4. Retourner le PDF
    const headers = {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="facture-${orderRef}.pdf"`,
      "Cache-Control": "no-cache",
    };

    // Définir les headers
    Object.entries(headers).forEach(([key, value]) => {
      event.node.res.setHeader(key, value);
    });

    return invoicePDF;
  } catch (error: any) {
    console.error("❌ Erreur génération facture:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la génération de la facture",
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
        orderRef: order["Order Ref"],
        customerName: order["Customer Name"] || order.Name,
        customerEmail: order["Customer Email"] || order.Email,
        customerPhone: order["Customer Phone"] || order.Phone,
        customerAddress: order["Customer Address"] || "",
        amount: order.Amount,
        items: order.Items ? JSON.parse(order.Items) : [],
        status: order.Status,
        createdAt: order["Created At"] || new Date().toISOString(),
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
 * Générer le PDF de facture
 */
async function generateInvoicePDF(orderDetails: any): Promise<Buffer> {
  // Pour l'instant, générer un HTML simple qui sera converti en PDF
  // Dans une vraie application, utilisez une librairie comme puppeteer ou jsPDF
  
  const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Facture ${orderDetails.orderRef}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px;
      color: #333;
    }
    .header { 
      text-align: center; 
      border-bottom: 2px solid #16a34a; 
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .company-info { 
      background: #f8f9fa; 
      padding: 20px; 
      border-radius: 8px; 
      margin-bottom: 20px;
    }
    .customer-info { 
      background: #e7f3ff; 
      padding: 20px; 
      border-radius: 8px; 
      margin-bottom: 20px;
    }
    .invoice-details { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 30px;
    }
    .items-table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-bottom: 20px;
    }
    .items-table th, .items-table td { 
      border: 1px solid #ddd; 
      padding: 10px; 
      text-align: left;
    }
    .items-table th { 
      background: #16a34a; 
      color: white;
    }
    .total { 
      text-align: right; 
      font-size: 18px; 
      font-weight: bold; 
      color: #16a34a;
    }
    .footer { 
      margin-top: 40px; 
      text-align: center; 
      font-size: 12px; 
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>FACTURE</h1>
    <h2>Fournitures Scolaires</h2>
    <p>📧 ${process.env.ADMIN_EMAIL} | 📱 ${process.env.WHATSAPP_BUSINESS_NUMBER}</p>
  </div>

  <div class="company-info">
    <h3>Informations de l'entreprise</h3>
    <p><strong>Fournitures Scolaires</strong></p>
    <p>Spécialiste en fournitures scolaires et packs étudiants</p>
    <p>Email: ${process.env.ADMIN_EMAIL}</p>
    <p>WhatsApp: ${process.env.WHATSAPP_BUSINESS_NUMBER}</p>
  </div>

  <div class="customer-info">
    <h3>Facturé à</h3>
    <p><strong>${orderDetails.customerName}</strong></p>
    <p>Email: ${orderDetails.customerEmail}</p>
    <p>Téléphone: ${orderDetails.customerPhone}</p>
    ${orderDetails.customerAddress ? `<p>Adresse: ${orderDetails.customerAddress}</p>` : ''}
  </div>

  <div class="invoice-details">
    <div>
      <p><strong>Numéro de facture:</strong> INV-${orderDetails.orderRef}</p>
      <p><strong>Référence commande:</strong> ${orderDetails.orderRef}</p>
    </div>
    <div>
      <p><strong>Date de création:</strong> ${new Date(orderDetails.createdAt).toLocaleDateString('fr-FR')}</p>
      <p><strong>Méthode de paiement:</strong> ${orderDetails.paymentMethod}</p>
    </div>
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
      ${orderDetails.items.map((item: any) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.price.toLocaleString('fr-FR')} FCFA</td>
          <td>${(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="total">
    <p>Total: ${orderDetails.amount.toLocaleString('fr-FR')} FCFA</p>
  </div>

  <div class="footer">
    <p>Merci pour votre commande !</p>
    <p>Cette facture a été générée automatiquement le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
    <p>Pour toute question, contactez-nous à ${process.env.ADMIN_EMAIL}</p>
  </div>
</body>
</html>`;

  // Pour l'instant, retourner le HTML (en production, convertir en PDF)
  // Vous pouvez utiliser puppeteer pour générer un vrai PDF
  return Buffer.from(invoiceHTML, 'utf-8');
}
