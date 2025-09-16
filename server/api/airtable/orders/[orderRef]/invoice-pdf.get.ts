// /server/api/airtable/orders/[orderRef]/invoice-pdf.get.ts
import { defineEventHandler, createError, setHeader } from "h3";
import { getAirtableBase } from "~/utils/airtable-base";

export default defineEventHandler(async (event) => {
  try {
    const orderRef = event.context?.params?.orderRef;

    if (!orderRef) {
      throw createError({
        statusCode: 400,
        statusMessage: "Référence de commande manquante",
      });
    }

    const base = getAirtableBase();
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE!;

    // Récupérer la commande
    const records = await base(ordersTableId)
      .select({
        maxRecords: 500,
        filterByFormula: `{Order ID} = "${orderRef}"`,
      })
      .firstPage();

    const targetRecord = records.find(
      (record: any) => record.fields["Order ID"] === orderRef
    );

    if (!targetRecord) {
      throw createError({
        statusCode: 404,
        statusMessage: `Commande ${orderRef} non trouvée`,
      });
    }

    const order = targetRecord.fields;

    // Générer le HTML de la facture (version simplifiée)
    const currentDate = new Date().toLocaleDateString("fr-FR");
    const totalAmount = order["Total Amount"] || 0;
    const orderId = order["Order ID"];
    const customerName = order["Customer Name"];
    const customerEmail = order["Customer Email"] || "N/A";
    const customerPhone = order["Customer Phone"] || "N/A";
    const orderStatus = order.Status || "En attente";
    const orderItems = order["Items"];

    const invoiceHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture - ${orderRef}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #15803d;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #15803d;
            margin: 0;
            font-size: 28px;
        }
        .details, .items, .total {
            margin-bottom: 20px;
            border: 1px solid #e5e7eb;
            padding: 15px;
            border-radius: 8px;
        }
        .details div, .items div {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #e5e7eb;
        }
        .details div:last-child, .items div:last-child {
            border-bottom: none;
        }
        .total {
            text-align: right;
            font-size: 1.2em;
            font-weight: bold;
            background: #f0fdf4;
            border: 2px solid #15803d;
        }
        @media print {
          body { margin: 0; padding: 10px; }
          .header { page-break-after: avoid; }
          .items { page-break-inside: avoid; }
          .total { page-break-before: avoid; }
        }
        @page {
          size: A4;
          margin: 20mm;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>FACTURE EDUSHOP</h1>
        <p>Date: ${currentDate}</p>
    </div>

    <div class="details">
        <h2>Détails de la commande</h2>
        <div><span><strong>Référence:</strong></span> <span>${orderId}</span></div>
        <div><span><strong>Client:</strong></span> <span>${customerName}</span></div>
        <div><span><strong>Email:</strong></span> <span>${customerEmail}</span></div>
        <div><span><strong>Téléphone:</strong></span> <span>${customerPhone}</span></div>
        <div><span><strong>Statut:</strong></span> <span>${orderStatus}</span></div>
    </div>

    <div class="items">
        <h2>Articles commandés</h2>
        ${
          orderItems
            ? orderItems
                .split("\n")
                .map((item: string) => {
                  const match = item.match(
                    /^(.+?)\s*\(x(\d+)\)\s*-\s*(\d+)FCFA?$/
                  );
                  if (match) {
                    const name = match[1].trim();
                    const quantity = parseInt(match[2]);
                    const price = parseInt(match[3]);
                    const total = price * quantity;
                    return `
                    <div>
                        <span><strong>${name}</strong> (x${quantity})</span> 
                        <span>${total.toLocaleString()} FCFA</span>
                    </div>
                    `;
                  }
                  return `
                    <div>
                        <span><strong>${item}</span> 
                        <span>N/A</span>
                    </div>
                  `;
                })
                .join("")
            : "<div><span><strong>Aucun article</span> <span>0 FCFA</span></div>"
        }
    </div>

    <div class="total">
        <strong>TOTAL: ${totalAmount.toLocaleString()} FCFA</strong>
    </div>

    <div style="text-align: center; margin-top: 40px; color: #666;">
        <p><strong>Merci pour votre achat !</strong></p>
        <p>EduShop - Votre partenaire de confiance pour toutes les fournitures scolaires.</p>
    </div>
</body>
</html>
    `;

    // Retourner le HTML optimisé pour l'impression PDF
    setHeader(event, "Content-Type", "text/html; charset=utf-8");
    setHeader(
      event,
      "Content-Disposition",
      `inline; filename="facture-${orderRef}.html"`
    );

    return invoiceHtml;
  } catch (error: any) {
    console.error("Erreur génération facture PDF:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Erreur lors de la génération de la facture PDF",
    });
  }
});
