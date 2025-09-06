/**
 * API endpoint pour générer et télécharger une facture
 * GET /api/airtable/orders/[orderRef]/invoice
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

    // Générer le HTML de la facture pour affichage/impression
    const invoiceHTML = await generateInvoiceHTML(orderDetails);

    // Configurer les headers pour affichage HTML (impression navigateur)
    setHeader(event, "Content-Type", "text/html; charset=utf-8");
    setHeader(event, "Cache-Control", "no-cache");

    return invoiceHTML;
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
 * Générer le HTML de la facture (optimisé pour impression)
 */
async function generateInvoiceHTML(orderDetails: any) {
  try {
    // Générons un HTML propre qui peut être imprimé comme PDF par le navigateur
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Facture ${orderDetails.orderRef}</title>
    <style>
        @media print { .no-print { display: none; } }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #16a34a; padding-bottom: 20px; }
        .header h1 { color: #16a34a; margin: 0; font-size: 28px; }
        .header p { margin: 5px 0; color: #666; }
        .company-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .invoice-info, .customer-info { flex: 1; padding: 20px; }
        .invoice-info { background: #16a34a; color: white; border-radius: 8px; margin-right: 20px; }
        .customer-info { background: #f8f9fa; border-radius: 8px; }
        .invoice-info h2 { margin-top: 0; font-size: 24px; }
        .customer-info h3 { margin-top: 0; color: #16a34a; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .items-table th { background: #16a34a; color: white; padding: 15px; text-align: left; font-weight: bold; }
        .items-table td { padding: 12px 15px; border-bottom: 1px solid #eee; }
        .items-table tr:hover { background: #f8f9fa; }
        .total-section { background: #16a34a; color: white; padding: 20px; border-radius: 8px; text-align: right; }
        .total-amount { font-size: 24px; font-weight: bold; margin: 10px 0; }
        .footer { margin-top: 40px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
        .thank-you { background: #dcfce7; border: 1px solid #16a34a; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; color: #16a34a; }
        .no-print { margin-top: 30px; text-align: center; }
        .print-btn { background: #16a34a; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; }
        .print-btn:hover { background: #15803d; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎒 Fournitures Scolaires</h1>
        <p>Votre partenaire pour la réussite scolaire</p>
    </div>

    <div class="company-info">
        <strong>Fournitures Scolaires SARL</strong><br>
        📍 Dakar, Sénégal<br>
        📞 +221 77 778 04 56<br>
        ✉️ contact@fournitures-scolaire.com
    </div>

    <div class="invoice-details">
        <div class="invoice-info">
            <h2>FACTURE</h2>
            <p><strong>N° ${orderDetails.orderRef}</strong></p>
            <p>📅 ${new Date(orderDetails.createdAt).toLocaleDateString(
              "fr-FR",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}</p>
            <p>💳 ${orderDetails.paymentMethod}</p>
            <p>✅ Statut: ${orderDetails.status}</p>
        </div>

        <div class="customer-info">
            <h3>👤 Facturé à</h3>
            <p><strong>${orderDetails.customerName}</strong></p>
            <p>✉️ ${orderDetails.customerEmail}</p>
            <p>📞 ${orderDetails.customerPhone}</p>
            ${
              orderDetails.customerAddress
                ? `<p>📍 ${orderDetails.customerAddress}</p>`
                : ""
            }
        </div>
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th>📦 Article</th>
                <th>🔢 Quantité</th>
                <th>💰 Prix unitaire</th>
                <th>💸 Total</th>
            </tr>
        </thead>
        <tbody>
            ${
              Array.isArray(orderDetails.items)
                ? orderDetails.items
                    .map(
                      (item) => `
                <tr>
                    <td><strong>${item.name}</strong></td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">${item.price.toLocaleString(
                      "fr-FR"
                    )} F</td>
                    <td style="text-align: right;"><strong>${(
                      item.price * item.quantity
                    ).toLocaleString("fr-FR")} F</strong></td>
                </tr>
              `
                    )
                    .join("")
                : `<tr><td colspan="4" style="text-align: center; color: #666;">Détails des articles non disponibles</td></tr>`
            }
        </tbody>
    </table>

    <div class="total-section">
        <p style="margin: 0;">MONTANT TOTAL</p>
        <div class="total-amount">${parseFloat(
          orderDetails.amount || 0
        ).toLocaleString("fr-FR")} F CFA</div>
    </div>

    <div class="thank-you">
        <strong>🎉 Merci pour votre confiance !</strong><br>
        Cette facture a été générée automatiquement le ${new Date().toLocaleString(
          "fr-FR"
        )}
    </div>

    <div class="footer">
        <p><strong>Questions ?</strong> Contactez-nous à contact@fournitures-scolaire.com</p>
        <p>Fournitures Scolaires SARL - Tous droits réservés ${new Date().getFullYear()}</p>
    </div>

    <div class="no-print">
        <div style="text-align: center; margin-bottom: 20px;">
            <button class="print-btn" onclick="window.print()" style="margin-right: 10px;">🖨️ Imprimer / Sauvegarder en PDF</button>
            <button class="print-btn" onclick="downloadPDF()" style="background: #1f2937;">💾 Télécharger PDF</button>
        </div>
    </div>

    <script>
        // Auto-print si demandé via URL
        if (window.location.search.includes('autoprint=true')) {
            setTimeout(() => window.print(), 1000);
        }
        
        // Fonction pour télécharger en PDF (utilise l'API du navigateur)
        async function downloadPDF() {
            try {
                // Utiliser l'endpoint de téléchargement PDF
                const orderRef = window.location.pathname.split('/').pop().split('.')[0];
                const downloadUrl = \`/api/airtable/orders/\${orderRef}/download-pdf\`;
                
                // Créer un lien de téléchargement
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = \`facture-\${orderRef}.pdf\`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Erreur téléchargement:', error);
                alert('Erreur lors du téléchargement. Utilisez Imprimer > Sauvegarder en PDF');
            }
        }
        
        // Optimiser pour mobile
        if (window.innerWidth < 768) {
            document.body.style.padding = '10px';
            const tables = document.querySelectorAll('table');
            tables.forEach(table => {
                table.style.fontSize = '12px';
            });
        }
    </script>
</body>
</html>`;

    // Retourner le HTML avec le bon content-type
    return invoiceHTML;
  } catch (error) {
    console.error("Erreur génération facture HTML:", error);
    throw error;
  }
}
