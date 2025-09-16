import {
  sendCustomerConfirmationEmail,
  sendAdminNotificationEmail,
} from "./email-service";

// Interface pour les données de facture
interface InvoiceData {
  orderRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  paymentMethod: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal?: number;
  tax?: number;
  discount?: number;
  shipping?: number;
}

// Générer une facture HTML complète
export function generateInvoiceHTML(invoiceData: InvoiceData): string {
  const subtotal =
    invoiceData.subtotal ||
    invoiceData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  const tax = invoiceData.tax || 0;
  const discount = invoiceData.discount || 0;
  const shipping = invoiceData.shipping || 0;
  const total = subtotal + tax + shipping - discount;

  const itemsHTML = invoiceData.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${
        item.name
      }</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toLocaleString()} FCFA</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">${(
        item.price * item.quantity
      ).toLocaleString()} FCFA</td>
    </tr>
  `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
      
      <!-- En-tête de la facture -->
      <div style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
          <div>
            <h1 style="color: #16a34a; margin: 0; font-size: 28px;">FACTURE</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Fournitures Scolaires</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 18px; font-weight: bold;">#${
              invoiceData.orderRef
            }</p>
            <p style="margin: 5px 0 0 0; color: #666;">${new Date().toLocaleDateString(
              "fr-FR"
            )}</p>
            <p style="margin: 5px 0 0 0; color: #16a34a; font-weight: bold;">✅ PAYÉ</p>
          </div>
        </div>

        <!-- Informations client -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Facturé à :</h3>
          <p style="margin: 5px 0;"><strong>${
            invoiceData.customerName
          }</strong></p>
          <p style="margin: 5px 0;">${invoiceData.customerEmail}</p>
          <p style="margin: 5px 0;">${invoiceData.customerPhone}</p>
        </div>
      </div>

      <!-- Détail des articles -->
      <div style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="color: #333; margin-top: 0;">Articles commandés</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 15px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: bold;">Article</th>
              <th style="padding: 15px; text-align: center; border-bottom: 2px solid #e5e7eb; font-weight: bold;">Quantité</th>
              <th style="padding: 15px; text-align: right; border-bottom: 2px solid #e5e7eb; font-weight: bold;">Prix unitaire</th>
              <th style="padding: 15px; text-align: right; border-bottom: 2px solid #e5e7eb; font-weight: bold;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr style="background: #f8f9fa;">
              <td colspan="3" style="padding: 15px; text-align: right; border-top: 2px solid #e5e7eb; font-weight: bold;">Sous-total :</td>
              <td style="padding: 15px; text-align: right; border-top: 2px solid #e5e7eb; font-weight: bold;">${subtotal.toLocaleString()} FCFA</td>
            </tr>
            ${
              shipping > 0
                ? `
            <tr>
              <td colspan="3" style="padding: 15px; text-align: right; border-bottom: 1px solid #e5e7eb;">Livraison :</td>
              <td style="padding: 15px; text-align: right; border-bottom: 1px solid #e5e7eb;">${shipping.toLocaleString()} FCFA</td>
            </tr>
            `
                : ""
            }
            ${
              discount > 0
                ? `
            <tr>
              <td colspan="3" style="padding: 15px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #16a34a;">Remise :</td>
              <td style="padding: 15px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #16a34a;">-${discount.toLocaleString()} FCFA</td>
            </tr>
            `
                : ""
            }
            <tr style="background: #dcfce7; font-weight: bold;">
              <td colspan="3" style="padding: 15px; text-align: right; border-top: 2px solid #16a34a; font-size: 18px;">TOTAL :</td>
              <td style="padding: 15px; text-align: right; border-top: 2px solid #16a34a; color: #16a34a; font-size: 18px;">${total.toLocaleString()} FCFA</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Informations de paiement -->
      <div style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="color: #333; margin-top: 0;">Informations de paiement</h3>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
          <div>
            <p><strong>Méthode de paiement :</strong> ${
              invoiceData.paymentMethod
            }</p>
            <p><strong>Date de paiement :</strong> ${new Date().toLocaleString(
              "fr-FR"
            )}</p>
            <p><strong>Statut :</strong> <span style="color: #16a34a; font-weight: bold;">✅ Payé</span></p>
          </div>
          <div style="text-align: right;">
            <p><strong>Montant payé :</strong></p>
            <p style="font-size: 24px; font-weight: bold; color: #16a34a; margin: 10px 0;">${total.toLocaleString()} FCFA</p>
          </div>
        </div>
      </div>

      <!-- Informations de livraison -->
      <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #16a34a; margin-top: 0;">📦 Informations de livraison</h3>
        <ul style="color: #333; margin: 0; padding-left: 20px;">
          <li>Votre commande est en cours de préparation</li>
          <li>Vous recevrez un SMS/WhatsApp pour la livraison</li>
          <li>Livraison prévue sous 24-48h à Dakar</li>
          <li>Contact : +221 78 291 18 44</li>
        </ul>
      </div>

      <!-- Pied de page -->
      <div style="text-align: center; color: #666; font-size: 14px; padding: 20px;">
        <p>Merci pour votre confiance !</p>
        <p><strong>Fournitures Scolaires</strong> - Ouakam Cité Avion, Dakar, Sénégal</p>
        <p>Email : contact@edushop.sn | Tél : +221 78 291 18 44</p>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">
          Cette facture a été générée automatiquement le ${new Date().toLocaleString(
            "fr-FR"
          )}
        </p>
      </div>
    </div>
  `;
}

// Envoyer la facture par email au client
export async function sendInvoiceToCustomer(
  invoiceData: InvoiceData
): Promise<boolean> {
  try {
    const html = generateInvoiceHTML(invoiceData);

    // Utiliser le service email existant mais avec le HTML de facture
    const orderData = {
      orderRef: invoiceData.orderRef,
      customerName: invoiceData.customerName,
      customerEmail: invoiceData.customerEmail,
      customerPhone: invoiceData.customerPhone,
      amount: invoiceData.amount,
      paymentMethod: invoiceData.paymentMethod,
      items: invoiceData.items,
    };

    // Envoyer l'email avec la facture
    return await sendCustomerConfirmationEmail(orderData);
  } catch (error) {
    console.error("❌ Erreur envoi facture client:", error);
    return false;
  }
}

// Envoyer la facture par email à l'admin
export async function sendInvoiceToAdmin(
  invoiceData: InvoiceData
): Promise<boolean> {
  try {
    const orderData = {
      orderRef: invoiceData.orderRef,
      customerName: invoiceData.customerName,
      customerEmail: invoiceData.customerEmail,
      customerPhone: invoiceData.customerPhone,
      amount: invoiceData.amount,
      paymentMethod: invoiceData.paymentMethod,
      items: invoiceData.items,
    };

    return await sendAdminNotificationEmail(orderData);
  } catch (error) {
    console.error("❌ Erreur envoi facture admin:", error);
    return false;
  }
}

// Envoyer les factures (client + admin)
export async function sendInvoices(
  invoiceData: InvoiceData
): Promise<{ client: boolean; admin: boolean }> {
  const results = { client: false, admin: false };

  // Envoyer facture au client
  if (invoiceData.customerEmail) {
    results.client = await sendInvoiceToCustomer(invoiceData);
  }

  // Envoyer facture à l'admin
  results.admin = await sendInvoiceToAdmin(invoiceData);

  return results;
}
