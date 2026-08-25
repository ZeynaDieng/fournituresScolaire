// Service WhatsApp unifié et intelligent
import { InvoiceData } from "./invoice-service";

const WHATSAPP_CONFIG = {
  apiUrl: "https://graph.facebook.com/v18.0",
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  businessNumber: process.env.WHATSAPP_BUSINESS_NUMBER || "+221771133926",
  apiKey: process.env.WHATSAPP_API_KEY, // CallMeBot ou autre
};

// Formater le numéro de téléphone pour WhatsApp (Sénégal +221)
export function formatPhoneNumber(phone: string): string {
  let cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.startsWith("221")) {
    cleanPhone = "+" + cleanPhone;
  } else if (
    cleanPhone.startsWith("77") ||
    cleanPhone.startsWith("78") ||
    cleanPhone.startsWith("76") ||
    cleanPhone.startsWith("70") ||
    cleanPhone.startsWith("75")
  ) {
    cleanPhone = "+221" + cleanPhone;
  } else if (!cleanPhone.startsWith("+")) {
    cleanPhone = "+221" + cleanPhone;
  }

  return cleanPhone;
}

// Générer le message WhatsApp pour la facture
export function generateWhatsAppInvoiceMessage(invoiceData: InvoiceData): string {
  const subtotal =
    invoiceData.subtotal ||
    invoiceData.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
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
  invoiceData.items.forEach((item: any, index: number) => {
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
  message += `• Livraison prévue sous 24-48h à Dakar/Régions\n`;
  message += `• Vous recevrez un appel pour la livraison\n\n`;

  message += `📞 *Contact:*\n`;
  message += `WhatsApp: ${WHATSAPP_CONFIG.businessNumber}\n`;
  message += `Email: contact@e-du.shop\n\n`;

  message += `Merci pour votre confiance ! 🙏\n`;
  message += `*Fournitures Scolaires*`;

  return message;
}

// Envoyer un message WhatsApp (Meta Cloud API, CallMeBot, ou Simulation)
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<boolean> {
  const formattedPhone = formatPhoneNumber(to);

  // 1. Meta WhatsApp Business API
  if (WHATSAPP_CONFIG.accessToken && WHATSAPP_CONFIG.phoneNumberId) {
    try {
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
            text: { body: message },
          }),
        }
      );
      if (response.ok) {
        console.log("✅ Message WhatsApp envoyé via Meta API à:", formattedPhone);
        return true;
      }
    } catch (e) {
      console.error("❌ Échec Meta WhatsApp API:", e);
    }
  }

  // 2. CallMeBot API (si clé présente)
  if (WHATSAPP_CONFIG.apiKey) {
    try {
      const cleanNum = formattedPhone.replace("+", "");
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanNum}&text=${encodeURIComponent(message)}&apikey=${WHATSAPP_CONFIG.apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        console.log("✅ Message WhatsApp envoyé via CallMeBot à:", formattedPhone);
        return true;
      }
    } catch (e) {
      console.error("❌ Échec CallMeBot:", e);
    }
  }

  // 3. Fallback Web / Simulation
  const waUrl = `https://wa.me/${formattedPhone.replace("+", "")}?text=${encodeURIComponent(message)}`;
  console.log(`📱 [WhatsApp Simulation/Fallback] Lien généré pour ${formattedPhone}: ${waUrl}`);
  return true;
}

// Envoyer la facture au client par WhatsApp
export async function sendInvoiceToWhatsApp(invoiceData: InvoiceData): Promise<boolean> {
  if (!invoiceData.customerPhone) {
    console.warn("⚠️ Numéro de téléphone client manquant pour l'envoi WhatsApp");
    return false;
  }
  const message = generateWhatsAppInvoiceMessage(invoiceData);
  return await sendWhatsAppMessage(invoiceData.customerPhone, message);
}

// Envoyer la notification de commande à l'administrateur
export async function sendAdminNotificationToWhatsApp(invoiceData: InvoiceData): Promise<boolean> {
  if (!WHATSAPP_CONFIG.businessNumber) {
    console.warn("⚠️ Numéro WhatsApp business manquant");
    return false;
  }

  const message =
    `🎒 *NOUVELLE COMMANDE REÇUE*\n\n` +
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
        (item: any) =>
          `• ${item.name} (x${item.quantity}) - ${(
            item.price * item.quantity
          ).toLocaleString()} FCFA`
      )
      .join("\n") +
    "\n\n" +
    `⚡ *Action requise:* Préparer la commande et contacter le client`;

  return await sendWhatsAppMessage(WHATSAPP_CONFIG.businessNumber, message);
}

// Envoyer à la fois au client et à l'admin
export async function sendWhatsAppNotifications(
  invoiceData: InvoiceData
): Promise<{ client: boolean; admin: boolean }> {
  const [client, admin] = await Promise.all([
    sendInvoiceToWhatsApp(invoiceData),
    sendAdminNotificationToWhatsApp(invoiceData),
  ]);
  return { client, admin };
}

// Envoyer une notification WhatsApp de confirmation pour une demande de liste scolaire (SchoolListRequest)
export async function sendSchoolListConfirmationWhatsApp(
  request: { id: string; customerName?: string; customerPhone?: string; availableTotal: number; exactMatchesCount: number; equivalentMatchesCount: number; sourcingItemsCount: number }
): Promise<boolean> {
  const phone = request.customerPhone || WHATSAPP_CONFIG.businessNumber;
  const name = request.customerName || "Parent d'élève";

  const message =
    `*ASSISTANT IA EDUSHOP - LISTE SCOLAIRE REÇUE*\n\n` +
    `Bonjour ${name},\n\n` +
    `Nous avons bien reçu l'analyse de votre liste scolaire !\n` +
    `📋 *Référence :* ${request.id}\n\n` +
    `✅ *Articles disponibles immédiatement :* ${request.exactMatchesCount + request.equivalentMatchesCount} article(s)\n` +
    `🔍 *Articles en cours de recherche fournisseur :* ${request.sourcingItemsCount} article(s)\n` +
    `💰 *Montant des articles disponibles :* ${request.availableTotal.toLocaleString()} FCFA\n\n` +
    `✅ Les articles disponibles sont prêts à être commandés immédiatement.\n` +
    `🔍 Les autres articles sont déjà en cours de recherche auprès de nos fournisseurs.\n\n` +
    `Merci de faire confiance à EduShop ! 📚`;

  return await sendWhatsAppMessage(phone, message);
}

// Alias pour compatibilité
export const sendInvoiceService = sendInvoiceToWhatsApp;
export const sendInvoiceReal = sendInvoiceToWhatsApp;
export const sendInvoiceSimple = sendInvoiceToWhatsApp;

export const sendAdminNotificationService = sendAdminNotificationToWhatsApp;
export const sendAdminNotificationReal = sendAdminNotificationToWhatsApp;
export const sendAdminNotificationSimple = sendAdminNotificationToWhatsApp;

export const sendWhatsAppNotificationsService = sendWhatsAppNotifications;
export const sendWhatsAppNotificationsReal = sendWhatsAppNotifications;
export const sendWhatsAppNotificationsSimple = sendWhatsAppNotifications;
