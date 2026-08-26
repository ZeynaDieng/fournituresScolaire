import nodemailer from "nodemailer";

// Configuration email
const EMAIL_CONFIG = {
  service: "gmail",
  user: "zeynash1@gmail.com",
  password: "roaeavueygugiwpt",
  adminEmail: "zeynash1@gmail.com",
  fromName: "Fournitures Scolaires EduShop",
};

// Créer le transporteur email
function createEmailTransporter() {
  if (!EMAIL_CONFIG.user || !EMAIL_CONFIG.password) {
    console.warn("⚠️ Configuration email manquante");
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: EMAIL_CONFIG.user.replace(/\s+/g, ""),
      pass: EMAIL_CONFIG.password.replace(/\s+/g, ""),
    },
    tls: {
      rejectUnauthorized: false,
      ciphers: "SSLv3",
    },
  });
}

// Interface pour les données de commande
interface OrderData {
  orderRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  paymentMethod: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

// Envoyer email de confirmation au client
export async function sendCustomerConfirmationEmail(
  orderData: OrderData
): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    if (!transporter) {
      console.warn("⚠️ Transporteur email non disponible");
      return false;
    }

    const html = generateCustomerEmailHTML(orderData);

    await transporter.sendMail({
      from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.user}>`,
      to: orderData.customerEmail,
      subject: `✅ Confirmation de commande - ${orderData.orderRef}`,
      html: html,
    });

    console.log(
      "✅ Email de confirmation envoyé au client:",
      orderData.customerEmail
    );
    return true;
  } catch (error) {
    console.error("❌ Erreur envoi email client:", error);
    return false;
  }
}

// Envoyer notification à l'admin
export async function sendAdminNotificationEmail(
  orderData: OrderData
): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    if (!transporter || !EMAIL_CONFIG.adminEmail) {
      console.warn("⚠️ Configuration admin email manquante");
      return false;
    }

    const html = generateAdminEmailHTML(orderData);

    await transporter.sendMail({
      from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.user}>`,
      to: EMAIL_CONFIG.adminEmail,
      subject: `🎒 Nouvelle commande - ${
        orderData.orderRef
      } (${orderData.amount.toLocaleString()} FCFA)`,
      html: html,
    });

    console.log(
      "✅ Email de notification envoyé à l'admin:",
      EMAIL_CONFIG.adminEmail
    );
    return true;
  } catch (error) {
    console.error("❌ Erreur envoi email admin:", error);
    return false;
  }
}

// Envoyer les deux emails (client + admin)
export async function sendOrderEmails(
  orderData: OrderData
): Promise<{ client: boolean; admin: boolean }> {
  const results = { client: false, admin: false };

  // Email au client
  if (orderData.customerEmail) {
    results.client = await sendCustomerConfirmationEmail(orderData);
  }

  // Email à l'admin
  results.admin = await sendAdminNotificationEmail(orderData);

  return results;
}

// Générer le HTML pour l'email client
function generateCustomerEmailHTML(orderData: OrderData): string {
  const itemsHTML =
    orderData.items
      ?.map(
        (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()} FCFA</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${(
        item.price * item.quantity
      ).toLocaleString()} FCFA</td>
    </tr>
  `
      )
      .join("") || "";

  // Calculer le total
  const subtotal =
    orderData.items?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) || orderData.amount;
  const total = orderData.amount;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #16a34a; margin: 0;">✅ Commande Confirmée</h1>
        <p style="color: #666; margin: 10px 0 0 0;">Merci pour votre confiance !</p>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0;">Bonjour ${
          orderData.customerName
        },</h2>
        <p>Nous confirmons que votre commande a été reçue et sera traitée dans les plus brefs délais.</p>
      </div>

      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">📋 Facture de votre commande</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <p><strong>Numéro de facture:</strong> ${orderData.orderRef}</p>
            <p><strong>Date de facturation:</strong> ${new Date().toLocaleString(
              "fr-FR"
            )}</p>
            <p><strong>Méthode de paiement:</strong> ${
              orderData.paymentMethod
            }</p>
          </div>
          <div style="text-align: right;">
            <p><strong>Statut:</strong> <span style="color: #16a34a;">✅ Payé</span></p>
            <p><strong>Montant total:</strong> <span style="font-size: 18px; font-weight: bold; color: #16a34a;">${orderData.amount.toLocaleString()} FCFA</span></p>
          </div>
        </div>
      </div>

      ${
        orderData.items && orderData.items.length > 0
          ? `
      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">🛍️ Articles commandés</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Article</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Quantité</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>
      `
          : ""
      }

      <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #16a34a; margin-top: 0;">📦 Prochaines étapes</h3>
        <ul style="color: #333; margin: 0; padding-left: 20px;">
          <li>Votre commande est en cours de préparation</li>
          <li>Vous recevrez un SMS/WhatsApp pour la livraison</li>
          <li>Livraison prévue sous 24-48h à Dakar</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #666; margin: 0;">Merci pour votre confiance !</p>
        <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">L'équipe Fournitures Scolaires</p>
      </div>
    </div>
  `;
}

// Générer le HTML pour l'email admin
function generateAdminEmailHTML(orderData: OrderData): string {
  const itemsHTML =
    orderData.items
      ?.map(
        (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()} FCFA</td>
    </tr>
  `
      )
      .join("") || "";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #dc2626; margin: 0;">🎒 Nouvelle Commande</h1>
        <p style="color: #666; margin: 10px 0 0 0;">Action requise</p>
      </div>

      <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #dc2626;">
        <h2 style="color: #dc2626; margin-top: 0;">Commande ${
          orderData.orderRef
        }</h2>
        <p style="margin: 0; color: #333;">Montant: <strong>${orderData.amount.toLocaleString()} FCFA</strong></p>
      </div>

      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">👤 Informations client</h3>
        <p><strong>Nom:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> ${orderData.customerEmail}</p>
        <p><strong>Téléphone:</strong> ${orderData.customerPhone}</p>
        <p><strong>Méthode de paiement:</strong> ${orderData.paymentMethod}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString("fr-FR")}</p>
      </div>

      ${
        orderData.items && orderData.items.length > 0
          ? `
      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">🛍️ Articles commandés</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Article</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Quantité</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>
      `
          : ""
      }

      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #d97706; margin-top: 0;">⚡ Actions requises</h3>
        <ul style="color: #333; margin: 0; padding-left: 20px;">
          <li>Préparer la commande</li>
          <li>Contacter le client pour la livraison</li>
          <li>Mettre à jour le statut dans Airtable</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #666; margin: 0; font-size: 14px;">Notification automatique - Système de commandes</p>
      </div>
    </div>
  `;
}
