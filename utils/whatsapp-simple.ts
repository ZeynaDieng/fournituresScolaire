// Service WhatsApp simple - sans API Meta
import { InvoiceData } from "./invoice-service";

// Configuration WhatsApp simple
const WHATSAPP_CONFIG = {
  businessNumber: process.env.WHATSAPP_BUSINESS_NUMBER || "+221777780456",
};

// Formater le numéro de téléphone pour WhatsApp
function formatPhoneNumber(phone: string): string {
  // Supprimer tous les caractères non numériques
  let cleanPhone = phone.replace(/\D/g, "");

  // Ajouter l'indicatif du Sénégal si nécessaire
  if (cleanPhone.startsWith("221")) {
    cleanPhone = "+" + cleanPhone;
  } else if (
    cleanPhone.startsWith("77") ||
    cleanPhone.startsWith("78") ||
    cleanPhone.startsWith("76")
  ) {
    cleanPhone = "+221" + cleanPhone;
  } else if (!cleanPhone.startsWith("+")) {
    cleanPhone = "+221" + cleanPhone;
  }

  return cleanPhone;
}

// Générer le message WhatsApp pour la facture
function generateWhatsAppInvoiceMessage(invoiceData: InvoiceData): string {
  const subtotal =
    invoiceData.subtotal ||
    invoiceData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  const total = invoiceData.amount;
  const shipping = invoiceData.shipping || 0;
  const discount = invoiceData.discount || 0;

  let message = `🧾 *FACTURE DE COMMANDE*\n\n`;
  message += `📋 *Numéro:* ${invoiceData.orderRef}\n`;
  message += `📅 *Date:* ${new Date().toLocaleDateString("fr-FR")}\n`;
  message += `👤 *Client:* ${invoiceData.customerName}\n`;
  message += `📱 *Téléphone:* ${invoiceData.customerPhone}\n\n`;

  message += `🛍️ *Articles commandés:*\n`;
  invoiceData.items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    message += `${index + 1}. ${item.name}\n`;
    message += `   Quantité: ${item.quantity}\n`;
    message += `   Prix unitaire: ${item.price.toLocaleString()} FCFA\n`;
    message += `   Total: ${itemTotal.toLocaleString()} FCFA\n\n`;
  });

  message += `💰 *RÉCAPITULATIF:*\n`;
  message += `Sous-total: ${subtotal.toLocaleString()} FCFA\n`;
  if (shipping > 0) {
    message += `Livraison: ${shipping.toLocaleString()} FCFA\n`;
  }
  if (discount > 0) {
    message += `Remise: -${discount.toLocaleString()} FCFA\n`;
  }
  message += `*TOTAL: ${total.toLocaleString()} FCFA*\n\n`;

  message += `💳 *Paiement:* ${invoiceData.paymentMethod}\n`;
  message += `✅ *Statut:* PAYÉ\n\n`;

  message += `📦 *Livraison:*\n`;
  message += `• Votre commande est en cours de préparation\n`;
  message += `• Livraison prévue sous 24-48h à Dakar\n`;
  message += `• Vous recevrez un SMS pour la livraison\n\n`;

  message += `📞 *Contact:*\n`;
  message += `WhatsApp: ${WHATSAPP_CONFIG.businessNumber}\n`;
  message += `Email: contact@edushop.sn\n\n`;

  message += `Merci pour votre confiance ! 🙏\n`;
  message += `*Fournitures Scolaires*`;

  return message;
}

// Envoyer un message WhatsApp simple (simulation)
async function sendSimpleWhatsAppMessage(
  to: string,
  message: string
): Promise<boolean> {
  try {
    const formattedPhone = formatPhoneNumber(to);

    console.log("📱 Envoi WhatsApp à:", formattedPhone);
    console.log("📱 Message:", message);

    // Simulation d'envoi WhatsApp
    // Dans un vrai projet, vous intégreriez avec une API WhatsApp
    console.log("✅ Message WhatsApp simulé envoyé avec succès");

    // Log pour le suivi
    console.log("📋 Log WhatsApp:", {
      to: formattedPhone,
      timestamp: new Date().toISOString(),
      messageLength: message.length,
      businessNumber: WHATSAPP_CONFIG.businessNumber,
    });

    return true;
  } catch (error) {
    console.error("❌ Erreur envoi WhatsApp simple:", error);
    return false;
  }
}

// Envoyer la facture par WhatsApp au client
export async function sendInvoiceToWhatsApp(
  invoiceData: InvoiceData
): Promise<boolean> {
  try {
    if (!invoiceData.customerPhone) {
      console.warn("⚠️ Numéro de téléphone client manquant");
      return false;
    }

    const message = generateWhatsAppInvoiceMessage(invoiceData);
    console.log(
      "📱 Envoi de la facture par WhatsApp à:",
      invoiceData.customerPhone
    );

    return await sendSimpleWhatsAppMessage(invoiceData.customerPhone, message);
  } catch (error) {
    console.error("❌ Erreur envoi facture WhatsApp:", error);
    return false;
  }
}

// Envoyer notification à l'admin par WhatsApp
export async function sendAdminNotificationToWhatsApp(
  invoiceData: InvoiceData
): Promise<boolean> {
  try {
    if (!WHATSAPP_CONFIG.businessNumber) {
      console.warn("⚠️ Numéro WhatsApp business manquant");
      return false;
    }

    const message =
      `🎒 *NOUVELLE COMMANDE*\n\n` +
      `📋 *Référence:* ${invoiceData.orderRef}\n` +
      `👤 *Client:* ${invoiceData.customerName}\n` +
      `📱 *Téléphone:* ${invoiceData.customerPhone}\n` +
      `📧 *Email:* ${invoiceData.customerEmail}\n` +
      `💰 *Montant:* ${invoiceData.amount.toLocaleString()} FCFA\n` +
      `💳 *Paiement:* ${invoiceData.paymentMethod}\n` +
      `📅 *Date:* ${new Date().toLocaleString("fr-FR")}\n\n` +
      `🛍️ *Articles:*\n` +
      invoiceData.items
        .map(
          (item) =>
            `• ${item.name} x${item.quantity} (${(
              item.price * item.quantity
            ).toLocaleString()} FCFA)`
        )
        .join("\n") +
      "\n\n" +
      `⚡ *Action requise:* Préparer la commande et contacter le client`;

    console.log("📱 Envoi notification admin par WhatsApp");

    return await sendSimpleWhatsAppMessage(
      WHATSAPP_CONFIG.businessNumber,
      message
    );
  } catch (error) {
    console.error("❌ Erreur notification admin WhatsApp:", error);
    return false;
  }
}

// Envoyer facture et notification par WhatsApp
export async function sendWhatsAppNotifications(
  invoiceData: InvoiceData
): Promise<{ client: boolean; admin: boolean }> {
  const results = { client: false, admin: false };

  // Envoyer facture au client
  if (invoiceData.customerPhone) {
    results.client = await sendInvoiceToWhatsApp(invoiceData);
  }

  // Envoyer notification à l'admin
  results.admin = await sendAdminNotificationToWhatsApp(invoiceData);

  return results;
}
