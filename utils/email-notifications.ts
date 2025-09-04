// /utils/email-notifications.ts
import nodemailer from "nodemailer";
import { getMasterExcelPath } from "./excel-master";
import { promises as fs } from "fs";

interface OrderEmailData {
  ref: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    method: string;
    cost: number;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  amounts: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
  source: "web" | "whatsapp";
  createdAt: string;
}

// Configuration email (à mettre dans .env)
const EMAIL_CONFIG = {
  service: "gmail", // ou 'outlook', 'yahoo', etc.
  user: process.env.NOTIFICATION_EMAIL_USER || "votre-email@gmail.com",
  password: process.env.NOTIFICATION_EMAIL_PASSWORD || "votre-mot-de-passe-app",
  adminEmail: process.env.ADMIN_EMAIL || "admin@fourniturescolaire.com",
  fromName: process.env.FROM_NAME || "Fournitures Scolaires",
};

// Créer le transporteur email
function createEmailTransporter() {
  return nodemailer.createTransport({
    service: EMAIL_CONFIG.service,
    auth: {
      user: EMAIL_CONFIG.user,
      pass: EMAIL_CONFIG.password,
    },
  });
}

// Formater le message de commande
function formatOrderEmailHTML(orderData: OrderEmailData): string {
  const itemsHTML = orderData.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()} CFA</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(
        item.quantity * item.price
      ).toLocaleString()} CFA</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouvelle Commande - ${orderData.ref}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; text-align: center;">🎒 Nouvelle Commande Reçue</h1>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #1e40af;">📋 Détails de la commande</h2>
          <p><strong>Référence:</strong> ${orderData.ref}</p>
          <p><strong>Source:</strong> ${
            orderData.source === "whatsapp" ? "📱 WhatsApp" : "🌐 Site Web"
          }</p>
          <p><strong>Date:</strong> ${new Date(
            orderData.createdAt
          ).toLocaleString("fr-FR", {
            timeZone: "Africa/Dakar",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}</p>
        </div>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #1e40af;">👤 Informations Client</h2>
          <p><strong>Nom:</strong> ${orderData.customer.name}</p>
          <p><strong>Email:</strong> ${orderData.customer.email}</p>
          <p><strong>Téléphone:</strong> ${orderData.customer.phone}</p>
        </div>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #1e40af;">📦 Livraison</h2>
          <p><strong>Adresse:</strong> ${orderData.shipping.address}</p>
          <p><strong>Ville:</strong> ${orderData.shipping.city}</p>
          <p><strong>Méthode:</strong> ${orderData.shipping.method}</p>
          <p><strong>Frais:</strong> ${orderData.shipping.cost.toLocaleString()} CFA</p>
        </div>

        <div style="margin: 20px 0;">
          <h2 style="color: #1e40af;">🛒 Articles commandés</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
            <thead>
              <tr style="background: #e5e7eb;">
                <th style="padding: 12px; border: 1px solid #d1d5db; text-align: left;">Article</th>
                <th style="padding: 12px; border: 1px solid #d1d5db; text-align: center;">Qté</th>
                <th style="padding: 12px; border: 1px solid #d1d5db; text-align: right;">Prix Unit.</th>
                <th style="padding: 12px; border: 1px solid #d1d5db; text-align: right;">Sous-total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #1e40af;">💰 Résumé des montants</h2>
          <div style="display: flex; justify-content: space-between; padding: 5px 0;">
            <span>Sous-total:</span>
            <strong>${orderData.amounts.subtotal.toLocaleString()} CFA</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 5px 0;">
            <span>Frais de livraison:</span>
            <strong>${orderData.amounts.shipping.toLocaleString()} CFA</strong>
          </div>
          ${
            orderData.amounts.discount > 0
              ? `
          <div style="display: flex; justify-content: space-between; padding: 5px 0; color: #dc2626;">
            <span>Réduction:</span>
            <strong>-${orderData.amounts.discount.toLocaleString()} CFA</strong>
          </div>
          `
              : ""
          }
          <hr style="margin: 10px 0; border: none; border-top: 2px solid #d1d5db;">
          <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 1.2em;">
            <span><strong>TOTAL:</strong></span>
            <strong style="color: #dc2626; font-size: 1.3em;">${orderData.amounts.total.toLocaleString()} CFA</strong>
          </div>
        </div>

        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #dc2626;">⚡ Actions à effectuer</h3>
          <ul>
            <li><strong>Confirmer la commande</strong> avec le client</li>
            <li><strong>Préparer les articles</strong> listés ci-dessus</li>
            <li><strong>Contacter le client</strong> pour finaliser la livraison</li>
            <li><strong>Traiter le paiement</strong> selon la méthode choisie</li>
          </ul>
        </div>

        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #059669;">📎 Fichier joint</h3>
          <p style="margin: 0;">
            Le fichier Excel maître <strong>"commandes-master.xlsx"</strong> contenant toutes les commandes 
            est joint à cet email pour votre suivi et vos analyses.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
          <p style="margin: 0; color: #6b7280; font-size: 0.9em;">
            Cette notification a été envoyée automatiquement.<br>
            Commande reçue le ${new Date().toLocaleString("fr-FR", {
              timeZone: "Africa/Dakar",
            })}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Envoyer la notification email pour une nouvelle commande
export async function sendOrderNotification(
  orderData: OrderEmailData
): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();

    const subject = `🎒 Nouvelle commande: ${
      orderData.ref
    } (${orderData.amounts.total.toLocaleString()} CFA)`;
    const html = formatOrderEmailHTML(orderData);

    // Préparer les pièces jointes
    const attachments: any[] = [];

    // Ajouter le fichier Excel maître en pièce jointe
    try {
      const excelPath = getMasterExcelPath();

      // Vérifier que le fichier existe avant de l'attacher
      await fs.access(excelPath);

      attachments.push({
        filename: "commandes-master.xlsx",
        path: excelPath,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      console.log("📎 Fichier Excel maître ajouté en pièce jointe");
    } catch (error) {
      console.warn("⚠️ Impossible d'attacher le fichier Excel:", error.message);
    }

    // Email à l'admin
    await transporter.sendMail({
      from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.user}>`,
      to: EMAIL_CONFIG.adminEmail,
      subject: subject,
      html: html,
      attachments: attachments, // Ajouter les pièces jointes
    });

    console.log("✅ Email de notification envoyé à:", EMAIL_CONFIG.adminEmail);

    // Email de confirmation au client (optionnel)
    if (orderData.customer.email) {
      const customerSubject = `Confirmation de votre commande ${orderData.ref}`;
      const customerHTML = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #2563eb;">Merci pour votre commande !</h1>
          <p>Bonjour ${orderData.customer.name},</p>
          <p>Votre commande <strong>${
            orderData.ref
          }</strong> d'un montant de <strong>${orderData.amounts.total.toLocaleString()} CFA</strong> a bien été reçue.</p>
          <p>Nous vous contacterons très prochainement pour confirmer votre commande et organiser la livraison.</p>
          <p>Cordialement,<br>L'équipe Fournitures Scolaires</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.user}>`,
        to: orderData.customer.email,
        subject: customerSubject,
        html: customerHTML,
      });

      console.log(
        "✅ Email de confirmation envoyé au client:",
        orderData.customer.email
      );
    }

    return true;
  } catch (error) {
    console.error("❌ Erreur envoi email notification:", error);
    return false;
  }
}

// Envoyer un résumé quotidien
export async function sendDailySummary(orders: any[]): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.amounts.total,
      0
    );

    const ordersListHTML = orders
      .map(
        (order) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${
          order.ref
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${
          order.customer.name
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${order.amounts.total.toLocaleString()} CFA</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${
          order.source === "whatsapp" ? "📱 WhatsApp" : "🌐 Web"
        }</td>
      </tr>
    `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">📊 Résumé quotidien des commandes</h1>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>📈 Statistiques du jour</h2>
            <p><strong>Nombre de commandes:</strong> ${totalOrders}</p>
            <p><strong>Chiffre d'affaires:</strong> ${totalRevenue.toLocaleString()} CFA</p>
            <p><strong>Panier moyen:</strong> ${
              totalOrders > 0
                ? Math.round(totalRevenue / totalOrders).toLocaleString()
                : 0
            } CFA</p>
          </div>

          ${
            totalOrders > 0
              ? `
          <div style="margin: 20px 0;">
            <h2>📋 Liste des commandes</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #e5e7eb;">
                  <th style="padding: 12px; border: 1px solid #d1d5db; text-align: left;">Référence</th>
                  <th style="padding: 12px; border: 1px solid #d1d5db; text-align: left;">Client</th>
                  <th style="padding: 12px; border: 1px solid #d1d5db; text-align: right;">Montant</th>
                  <th style="padding: 12px; border: 1px solid #d1d5db; text-align: center;">Source</th>
                </tr>
              </thead>
              <tbody>
                ${ordersListHTML}
              </tbody>
            </table>
          </div>
          `
              : `
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Aucune commande reçue aujourd'hui.</p>
          </div>
          `
          }
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.user}>`,
      to: EMAIL_CONFIG.adminEmail,
      subject: `📊 Résumé quotidien - ${totalOrders} commandes (${totalRevenue.toLocaleString()} CFA)`,
      html: html,
    });

    console.log("✅ Résumé quotidien envoyé");
    return true;
  } catch (error) {
    console.error("❌ Erreur envoi résumé quotidien:", error);
    return false;
  }
}
