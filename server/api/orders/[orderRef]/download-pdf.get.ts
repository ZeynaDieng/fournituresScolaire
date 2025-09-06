/**
 * API endpoint pour télécharger une facture PDF
 * GET /api/airtable/orders/[orderRef]/download-pdf
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

    console.log("📄 Téléchargement PDF pour commande:", orderRef);

    // Récupérer les détails de la commande depuis Airtable
    const orderDetails = await getOrderDetailsFromAirtable(orderRef);

    if (!orderDetails) {
      throw createError({
        statusCode: 404,
        statusMessage: "Commande non trouvée",
      });
    }

    // Générer un PDF simple avec du texte brut
    const pdfContent = generateSimplePDF(orderDetails);

    // Configurer les headers pour le téléchargement PDF
    setHeader(event, "Content-Type", "application/pdf");
    setHeader(
      event,
      "Content-Disposition",
      `attachment; filename="facture-${orderRef}.pdf"`
    );
    setHeader(event, "Content-Length", pdfContent.length);
    setHeader(event, "Cache-Control", "no-cache");

    return pdfContent;
  } catch (error: any) {
    console.error("❌ Erreur téléchargement PDF:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur génération PDF",
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
 * Générer un PDF simple avec du contenu basique
 * (Version simplifiée pour Vercel sans bibliothèques externes)
 */
function generateSimplePDF(orderDetails: any): Buffer {
  // Créer un PDF minimal avec du contenu texte
  // Ceci est un PDF très basique, pour une solution complète il faudrait une vraie lib PDF
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Resources <<
  /Font <<
    /F1 4 0 R
  >>
>>
/Contents 5 0 R
>>
endobj

4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

5 0 obj
<<
/Length 6 0 R
>>
stream
BT
/F1 16 Tf
50 750 Td
(FACTURE - ${orderDetails.orderRef}) Tj
0 -30 Td
/F1 12 Tf
(Date: ${new Date(orderDetails.createdAt).toLocaleDateString("fr-FR")}) Tj
0 -20 Td
(Client: ${orderDetails.customerName}) Tj
0 -20 Td
(Email: ${orderDetails.customerEmail}) Tj
0 -20 Td
(Telephone: ${orderDetails.customerPhone}) Tj
0 -40 Td
/F1 14 Tf
(Montant Total: ${parseFloat(orderDetails.amount || 0).toLocaleString(
    "fr-FR"
  )} F CFA) Tj
0 -30 Td
/F1 12 Tf
(Methode de paiement: ${orderDetails.paymentMethod}) Tj
0 -20 Td
(Statut: ${orderDetails.status}) Tj
0 -40 Td
(Merci pour votre commande !) Tj
ET
endstream
endobj

6 0 obj
${orderDetails.orderRef.length + orderDetails.customerName.length + 200}
endobj

xref
0 7
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000110 00000 n 
0000000290 00000 n 
0000000364 00000 n 
0000000900 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
920
%%EOF`;

  return Buffer.from(pdfContent, "utf8");
}
