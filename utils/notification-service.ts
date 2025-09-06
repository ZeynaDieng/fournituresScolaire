/**
 * Service de notifications centralisé
 * Gère l'envoi d'emails et de messages WhatsApp
 */

import nodemailer from "nodemailer";

interface NotificationData {
  type: "order" | "contact";
  recipient: {
    name: string;
    email: string;
    phone: string;
  };
  admin: {
    name: string;
    email: string;
    phone: string;
  };
  data: any;
}

export class NotificationService {
  private static transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NOTIFICATION_EMAIL_USER,
      pass: process.env.NOTIFICATION_EMAIL_PASSWORD,
    },
  });

  /**
   * Envoyer une notification complète (Email + WhatsApp)
   */
  static async sendNotification(notificationData: NotificationData) {
    const results = {
      adminEmail: false,
      clientEmail: false,
      adminWhatsApp: false,
      clientWhatsApp: false,
    };

    try {
      // 1. Email à l'admin
      results.adminEmail = await this.sendAdminEmail(notificationData);

      // 2. Email au client
      results.clientEmail = await this.sendClientEmail(notificationData);

      // 3. WhatsApp à l'admin
      results.adminWhatsApp = await this.sendAdminWhatsApp(notificationData);

      // 4. WhatsApp au client
      results.clientWhatsApp = await this.sendClientWhatsApp(notificationData);

      console.log("📧 Résultats des notifications:", results);
      return results;
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi des notifications:", error);
      return results;
    }
  }

  /**
   * Envoyer un email à l'administrateur
   */
  static async sendAdminEmail(data: NotificationData): Promise<boolean> {
    try {
      let subject, html;

      if (data.type === "order") {
        subject = `🛒 Nouvelle commande #${data.data.orderRef}`;
        html = this.getOrderEmailTemplate(data, "admin");
      } else {
        subject = `📩 Nouveau message de contact de ${data.recipient.name}`;
        html = this.getContactEmailTemplate(data, "admin");
      }

      await this.transporter.sendMail({
        from: `"${process.env.FROM_NAME}" <${process.env.NOTIFICATION_EMAIL_USER}>`,
        to: data.admin.email,
        subject,
        html,
      });

      console.log("✅ Email admin envoyé avec succès");
      return true;
    } catch (error) {
      console.error("❌ Erreur email admin:", error);
      return false;
    }
  }

  /**
   * Envoyer un email au client
   */
  static async sendClientEmail(data: NotificationData): Promise<boolean> {
    try {
      let subject, html;

      if (data.type === "order") {
        subject = `✅ Confirmation de votre commande #${data.data.orderRef}`;
        html = this.getOrderEmailTemplate(data, "client");
      } else {
        subject = `📩 Confirmation de réception de votre message`;
        html = this.getContactEmailTemplate(data, "client");
      }

      await this.transporter.sendMail({
        from: `"${process.env.FROM_NAME}" <${process.env.NOTIFICATION_EMAIL_USER}>`,
        to: data.recipient.email,
        subject,
        html,
      });

      console.log("✅ Email client envoyé avec succès");
      return true;
    } catch (error) {
      console.error("❌ Erreur email client:", error);
      return false;
    }
  }

  /**
   * Envoyer un WhatsApp à l'administrateur
   */
  static async sendAdminWhatsApp(data: NotificationData): Promise<boolean> {
    try {
      let message;

      if (data.type === "order") {
        message =
          `🛒 *NOUVELLE COMMANDE*\n\n` +
          `📋 Commande: #${data.data.orderRef}\n` +
          `👤 Client: ${data.recipient.name}\n` +
          `📧 Email: ${data.recipient.email}\n` +
          `📱 Téléphone: ${data.recipient.phone}\n` +
          `💰 Montant: ${data.data.amount} FCFA\n` +
          `💳 Méthode: ${data.data.paymentMethod}\n\n` +
          `⏰ ${new Date().toLocaleString("fr-FR", {
            timeZone: "Africa/Dakar",
          })}`;
      } else {
        message =
          `📩 *NOUVEAU MESSAGE CONTACT*\n\n` +
          `👤 De: ${data.recipient.name}\n` +
          `📧 Email: ${data.recipient.email}\n` +
          `📱 Téléphone: ${data.recipient.phone || "Non fourni"}\n` +
          `📝 Sujet: ${data.data.subject}\n` +
          `💬 Message: ${data.data.message}\n\n` +
          `⏰ ${new Date().toLocaleString("fr-FR", {
            timeZone: "Africa/Dakar",
          })}`;
      }

      return await this.sendWhatsAppMessage(data.admin.phone, message);
    } catch (error) {
      console.error("❌ Erreur WhatsApp admin:", error);
      return false;
    }
  }

  /**
   * Envoyer un WhatsApp au client
   */
  static async sendClientWhatsApp(data: NotificationData): Promise<boolean> {
    try {
      let message;

      if (data.type === "order") {
        message =
          `✅ *COMMANDE CONFIRMÉE*\n\n` +
          `Bonjour ${data.recipient.name},\n\n` +
          `Votre commande #${data.data.orderRef} a été confirmée !\n\n` +
          `💰 Montant: ${data.data.amount} FCFA\n` +
          `💳 Méthode: ${data.data.paymentMethod}\n\n` +
          `📞 Nous vous contacterons bientôt pour la livraison.\n\n` +
          `Merci de votre confiance ! 🙏\n` +
          `*${process.env.FROM_NAME}*`;
      } else {
        message =
          `📩 *MESSAGE REÇU*\n\n` +
          `Bonjour ${data.recipient.name},\n\n` +
          `Nous avons bien reçu votre message concernant: "${data.data.subject}"\n\n` +
          `📞 Notre équipe vous répondra dans les plus brefs délais.\n\n` +
          `Merci de nous avoir contacté ! 🙏\n` +
          `*${process.env.FROM_NAME}*`;
      }

      return await this.sendWhatsAppMessage(data.recipient.phone, message);
    } catch (error) {
      console.error("❌ Erreur WhatsApp client:", error);
      return false;
    }
  }

  /**
   * Envoyer un message WhatsApp (API WhatsApp Business)
   */
  static async sendWhatsAppMessage(
    phone: string,
    message: string
  ): Promise<boolean> {
    try {
      // Pour le moment, on simule l'envoi WhatsApp
      // Dans un vrai projet, vous utiliseriez l'API WhatsApp Business

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone.replace(
        /\D/g,
        ""
      )}&text=${encodeURIComponent(message)}`;

      console.log(
        `📱 WhatsApp simulé pour ${phone}:`,
        message.substring(0, 100) + "..."
      );
      console.log(`🔗 URL WhatsApp: ${whatsappUrl}`);

      // TODO: Remplacer par un vrai appel API WhatsApp Business
      return true;
    } catch (error) {
      console.error("❌ Erreur envoi WhatsApp:", error);
      return false;
    }
  }

  /**
   * Template email pour les commandes
   */
  static getOrderEmailTemplate(
    data: NotificationData,
    recipient: "admin" | "client"
  ): string {
    const isAdmin = recipient === "admin";
    const title = isAdmin
      ? "Nouvelle commande reçue"
      : "Confirmation de votre commande";

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .highlight { background: #dcfce7; padding: 10px; border-left: 4px solid #16a34a; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isAdmin ? "🛒" : "✅"} ${title}</h1>
        </div>
        <div class="content">
          ${
            isAdmin
              ? `<h3>Une nouvelle commande a été passée !</h3>`
              : `<h3>Bonjour ${data.recipient.name},</h3>
             <p>Votre commande a été confirmée avec succès !</p>`
          }
          
          <div class="highlight">
            <strong>📋 Détails de la commande:</strong><br>
            • Numéro: #${data.data.orderRef}<br>
            • Client: ${data.recipient.name}<br>
            • Email: ${data.recipient.email}<br>
            • Téléphone: ${data.recipient.phone}<br>
            • Montant: ${data.data.amount} FCFA<br>
            • Méthode de paiement: ${data.data.paymentMethod}<br>
            • Date: ${new Date().toLocaleString("fr-FR", {
              timeZone: "Africa/Dakar",
            })}
          </div>

          ${
            isAdmin
              ? `<p><strong>Action requise:</strong> Contactez le client pour organiser la livraison.</p>`
              : `<p><strong>Prochaines étapes:</strong> Notre équipe vous contactera pour organiser la livraison.</p>
             <p>Merci de votre confiance ! 🙏</p>`
          }
        </div>
        <div class="footer">
          <p>${process.env.FROM_NAME} - Fournitures Scolaires</p>
          <p>📧 ${process.env.ADMIN_EMAIL} | 📱 ${
      process.env.WHATSAPP_BUSINESS_NUMBER
    }</p>
        </div>
      </div>
    </body>
    </html>`;
  }

  /**
   * Template email pour les messages de contact
   */
  static getContactEmailTemplate(
    data: NotificationData,
    recipient: "admin" | "client"
  ): string {
    const isAdmin = recipient === "admin";
    const title = isAdmin
      ? "Nouveau message de contact"
      : "Message reçu avec succès";

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .highlight { background: #dcfce7; padding: 10px; border-left: 4px solid #16a34a; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isAdmin ? "📩" : "✅"} ${title}</h1>
        </div>
        <div class="content">
          ${
            isAdmin
              ? `<h3>Un nouveau message a été reçu !</h3>`
              : `<h3>Bonjour ${data.recipient.name},</h3>
             <p>Nous avons bien reçu votre message !</p>`
          }
          
          <div class="highlight">
            <strong>📝 Détails du message:</strong><br>
            • Nom: ${data.recipient.name}<br>
            • Email: ${data.recipient.email}<br>
            • Téléphone: ${data.recipient.phone || "Non fourni"}<br>
            • Sujet: ${data.data.subject}<br>
            • Date: ${new Date().toLocaleString("fr-FR", {
              timeZone: "Africa/Dakar",
            })}
          </div>

          ${
            isAdmin
              ? `<div style="background: white; padding: 15px; margin: 15px 0; border: 1px solid #ddd;">
               <strong>Message:</strong><br>
               ${data.data.message.replace(/\n/g, "<br>")}
             </div>
             <p><strong>Action requise:</strong> Répondez au client dans les plus brefs délais.</p>`
              : `<p><strong>Votre message:</strong></p>
             <div style="background: white; padding: 15px; margin: 15px 0; border: 1px solid #ddd;">
               ${data.data.message.replace(/\n/g, "<br>")}
             </div>
             <p>Notre équipe vous répondra dans les plus brefs délais. Merci de nous avoir contacté ! 🙏</p>`
          }
        </div>
        <div class="footer">
          <p>${process.env.FROM_NAME} - Fournitures Scolaires</p>
          <p>📧 ${process.env.ADMIN_EMAIL} | 📱 ${
      process.env.WHATSAPP_BUSINESS_NUMBER
    }</p>
        </div>
      </div>
    </body>
    </html>`;
  }
}
