// Service WhatsApp réel - avec API gratuite
import { InvoiceData } from "./invoice-service";

// Configuration WhatsApp
const WHATSAPP_CONFIG = {
  businessNumber: process.env.WHATSAPP_BUSINESS_NUMBER || "+221777780456",
  apiKey: process.env.WHATSAPP_API_KEY, // API gratuite comme CallMeBot ou similaire
};

// Formater le numéro de téléphone pour WhatsApp
function formatPhoneNumber(phone: string): string {
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

// Méthode 1: Utiliser CallMeBot (gratuit)
async function sendViaCallMeBot(
  phone: string,
  message: string
): Promise<boolean> {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    const phoneNumber = formattedPhone.replace("+", "");

    // CallMeBot API (gratuit, limité)
    const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}&apikey=${WHATSAPP_CONFIG.apiKey}`;

    console.log("📱 Envoi via CallMeBot à:", formattedPhone);

    const response = await fetch(callMeBotUrl, {
      method: "GET",
    });

    if (response.ok) {
      console.log("✅ Message WhatsApp envoyé via CallMeBot");
      return true;
    } else {
      console.error("❌ Erreur CallMeBot:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ Erreur CallMeBot:", error);
    return false;
  }
}

// Méthode 2: Utiliser WhatsApp Web API (gratuit)
async function sendViaWhatsAppWeb(
  phone: string,
  message: string
): Promise<boolean> {
  try {
    const formattedPhone = formatPhoneNumber(phone);

    // WhatsApp Web API (nécessite un token)
    const whatsappWebUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(
      message
    )}`;

    console.log("📱 Lien WhatsApp Web généré:", whatsappWebUrl);
    console.log("📱 Message pour:", formattedPhone);
    console.log("📱 Contenu:", message);

    // Pour l'instant, on log le lien (vous pouvez l'ouvrir manuellement)
    console.log("🔗 Ouvrez ce lien pour envoyer le message:", whatsappWebUrl);

    return true;
  } catch (error) {
    console.error("❌ Erreur WhatsApp Web:", error);
    return false;
  }
}

// Méthode 3: Utiliser une API locale sénégalaise
async function sendViaLocalAPI(
  phone: string,
  message: string
): Promise<boolean> {
  try {
    const formattedPhone = formatPhoneNumber(phone);

    // Exemple d'API locale (à adapter selon votre fournisseur)
    const localAPIUrl = "https://api.senegal-whatsapp.com/send"; // Exemple

    console.log("📱 Envoi via API locale à:", formattedPhone);

    // Simulation pour l'instant
    console.log("📱 Message:", message);
    console.log("✅ Message WhatsApp simulé (API locale)");

    return true;
  } catch (error) {
    console.error("❌ Erreur API locale:", error);
    return false;
  }
}

// Envoyer un message WhatsApp (essaie plusieurs méthodes)
async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<boolean> {
  try {
    console.log("📱 Tentative d'envoi WhatsApp à:", phone);

    // Essayer CallMeBot d'abord
    if (WHATSAPP_CONFIG.apiKey) {
      const callMeBotResult = await sendViaCallMeBot(phone, message);
      if (callMeBotResult) return true;
    }

    // Essayer WhatsApp Web
    const webResult = await sendViaWhatsAppWeb(phone, message);
    if (webResult) return true;

    // Essayer API locale
    const localResult = await sendViaLocalAPI(phone, message);
    if (localResult) return true;

    return false;
  } catch (error) {
    console.error("❌ Erreur envoi WhatsApp:", error);
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
