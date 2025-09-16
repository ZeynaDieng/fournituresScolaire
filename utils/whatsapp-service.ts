// Service WhatsApp pour envoyer les factures
import { InvoiceData } from "./invoice-service";

// Configuration WhatsApp
const WHATSAPP_CONFIG = {
  apiUrl: "https://graph.facebook.com/v18.0",
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
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

// Envoyer un message WhatsApp via l'API Meta
async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<boolean> {
  try {
    if (!WHATSAPP_CONFIG.accessToken || !WHATSAPP_CONFIG.phoneNumberId) {
      console.warn("⚠️ Configuration WhatsApp manquante");
      return false;
    }

    const formattedPhone = formatPhoneNumber(to);

    const response = await fetch(
      `${WHATSAPP_CONFIG.apiUrl}/${WHATSAPP_CONFIG.phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_CONFIG.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: formattedPhone,
          type: "text",
          text: {
            body: message,
          },
        }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Message WhatsApp envoyé:", result);
      return true;
    } else {
      const error = await response.text();
      console.error("❌ Erreur envoi WhatsApp:", error);
      return false;
    }
  } catch (error) {
    console.error("❌ Erreur WhatsApp:", error);
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

    return await sendWhatsAppMessage(invoiceData.customerPhone, message);
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

    return await sendWhatsAppMessage(WHATSAPP_CONFIG.businessNumber, message);
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

// Méthode alternative : Envoyer via WhatsApp Business API simple (sans Meta)
export async function sendSimpleWhatsAppMessage(
  phone: string,
  message: string
): Promise<boolean> {
  try {
    // Cette méthode utilise une API WhatsApp tierce ou un service de messagerie
    // Vous pouvez intégrer avec des services comme Twilio, MessageBird, etc.

    console.log("📱 Envoi WhatsApp simple à:", phone);
    console.log("📱 Message:", message);

    // Pour l'instant, on simule l'envoi
    // Remplacez par votre service WhatsApp préféré
    console.log("✅ Message WhatsApp simulé envoyé");
    return true;
  } catch (error) {
    console.error("❌ Erreur envoi WhatsApp simple:", error);
    return false;
  }
}
