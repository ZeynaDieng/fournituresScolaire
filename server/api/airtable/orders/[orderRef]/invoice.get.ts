import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const orderRef = event.context?.params?.orderRef;

    if (!orderRef) {
      throw createError({
        statusCode: 400,
        statusMessage: "Référence de commande manquante",
      });
    }

    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const ordersTableId = process.env.AIRTABLE_ORDERS_TABLE;

    if (!airtableApiKey || !airtableBaseId || !ordersTableId) {
      throw createError({
        statusCode: 500,
        statusMessage: "Configuration Airtable manquante",
      });
    }

    // Récupérer tous les records et chercher par Order ID
    const response = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${ordersTableId}?maxRecords=500`,
      {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Erreur Airtable: ${response.status}`,
      });
    }

    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Aucune commande trouvée",
      });
    }

    // Chercher la commande par Order ID
    const targetRecord = data.records.find(
      (record: any) => record.fields["Order ID"] === orderRef
    );

    if (!targetRecord) {
      throw createError({
        statusCode: 404,
        statusMessage: `Commande ${orderRef} non trouvée`,
      });
    }

    // Générer la facture HTML
    const invoiceHtml = generateInvoiceHtml(targetRecord.fields, orderRef);

    // Retourner la facture HTML
    setHeader(event, "Content-Type", "text/html; charset=utf-8");
    return invoiceHtml;
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

function generateInvoiceHtml(orderData: any, orderRef: string): string {
  const currentDate = new Date().toLocaleDateString("fr-FR");
  const totalAmount = orderData["Total Amount"] || 0;

  return `
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
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-info {
            margin-bottom: 20px;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .customer-info, .invoice-info {
            flex: 1;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th, .items-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .items-table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .total-section {
            text-align: right;
            margin-top: 20px;
        }
        .total-amount {
            font-size: 1.2em;
            font-weight: bold;
            color: #2563eb;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>FACTURE</h1>
        <div class="company-info">
            <h2>EduShop - Fournitures Scolaires</h2>
            <p>Ouakam Cité Avion, Dakar, Sénégal</p>
            <p>Email: contact@edushop.sn | Tél: +221 77 778 04 56</p>
        </div>
    </div>

    <div class="invoice-details">
        <div class="customer-info">
            <h3>Facturé à:</h3>
            <p><strong>${orderData["Customer Name"] || "Client"}</strong></p>
            <p>${orderData["Customer Email"] || ""}</p>
            <p>${orderData["Customer Phone"] || ""}</p>
            <p>${orderData["Shipping Address"] || ""}</p>
        </div>
        
        <div class="invoice-info">
            <h3>Détails de la facture:</h3>
            <p><strong>N° Facture:</strong> ${orderRef}</p>
            <p><strong>Date:</strong> ${currentDate}</p>
            <p><strong>Statut:</strong> ${orderData["Status"] || "Pending"}</p>
        </div>
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${
              orderData["Items"]
                ? orderData["Items"]
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
                    <tr>
                        <td>${name}</td>
                        <td>${quantity}</td>
                        <td>${price.toLocaleString()} FCFA</td>
                        <td>${total.toLocaleString()} FCFA</td>
                    </tr>
                  `;
                      }
                      return `
                  <tr>
                      <td>${item}</td>
                      <td>1</td>
                      <td>0 FCFA</td>
                      <td>0 FCFA</td>
                  </tr>
                `;
                    })
                    .join("")
                : '<tr><td colspan="4">Aucun article</td></tr>'
            }
        </tbody>
    </table>

    <div class="total-section">
        <p class="total-amount">Total: ${totalAmount.toLocaleString()} FCFA</p>
    </div>

    <div class="footer">
        <p>Merci pour votre confiance !</p>
        <p>EduShop - Votre partenaire de confiance pour toutes les fournitures scolaires</p>
        <button class="no-print" onclick="window.print()" style="background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;">
            Imprimer la facture
        </button>
    </div>
</body>
</html>
  `;
}
